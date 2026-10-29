import Color from 'color'
import { useEffect, useMemo } from 'react'
import {
  DataTexture,
  DoubleSide,
  FloatType,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  PlaneGeometry,
  RGFormat,
  ShaderMaterial,
  Color as ThreeColor,
} from 'three'

import useTimeScale from '@/hooks/useTimeScale'
import type { Remap, StyleRuntime } from '@/utils/config'
import { type ControllerTrack, getControllerTrack, sustainEnd } from '@/utils/controllers'
import type { MidiChannelEventData } from '@/utils/midi'
import { parseRange } from '@/utils/range'

/** `decayRate` is the fraction of opacity lost per this many ms, independent of the speed. */
const DECAY_MS = 25
/** Row width of the CC event texture; rows wrap so long songs fit the max texture size. */
const CC_TEXTURE_WIDTH = 1024

// Unit quad stretched per instance via instanceMatrix; corners and decay are drawn in the shader
// so every note of a channel shares one draw call
const vertexShader = /* glsl */ `
  attribute float aAlpha;
  attribute vec3 aColor;
  attribute float aSplit;
  varying vec2 vUv;
  varying vec2 vSize;
  varying float vAlpha;
  varying vec3 vColor;
  varying float vSplit;
  varying float vX;

  void main() {
    vUv = uv;
    vX = (instanceMatrix * vec4(position, 1.0)).x;
    vAlpha = aAlpha;
    vColor = aColor;
    vSplit = aSplit;
    vSize = vec2(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz));
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uDecayPerUnit;
  uniform vec3 uPedalColor;
  uniform bool uUseCC;
  uniform sampler2D uCC;
  uniform int uCCCount;
  uniform float uTimeScale;
  uniform float uRadius;
  varying vec2 vUv;
  varying vec2 vSize;
  varying float vAlpha;
  varying vec3 vColor;
  varying float vSplit;
  varying float vX;

  vec2 ccEvent(int i) {
    return texelFetch(uCC, ivec2(i % ${CC_TEXTURE_WIDTH}, i / ${CC_TEXTURE_WIDTH}), 0).rg;
  }

  // Value (0-1) of the last CC event at or before time t; full before the first event
  float ccValue(float t) {
    int lo = 0;
    int hi = uCCCount;
    for (int k = 0; k < 24; k++) {
      if (lo >= hi) break;
      int mid = (lo + hi) / 2;
      if (ccEvent(mid).x <= t) lo = mid + 1;
      else hi = mid;
    }
    return lo == 0 ? 1.0 : ccEvent(lo - 1).y;
  }

  void main() {
    // Rounded-rectangle distance in world units, centered on the note
    vec2 halfSize = vSize * 0.5;
    vec2 p = (vUv - 0.5) * vSize;
    float r = min(uRadius, min(halfSize.x, halfSize.y));
    vec2 q = abs(p) - halfSize + r;
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
    float edge = clamp(0.5 - d / fwidth(d), 0.0, 1.0);

    float decay = pow(uDecayPerUnit, vUv.x * vSize.x);

    // Past the split the note is only held by the pedal
    vec3 color = vUv.x > vSplit ? uPedalColor : vColor;

    float cc = uUseCC ? ccValue(vX / uTimeScale) : 1.0;

    gl_FragColor = vec4(color, vAlpha * decay * cc * edge);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

type NoteOn = Extract<MidiChannelEventData, { type: 'noteOn' }>

/** First remap whose `originalPitch` matches; an empty `originalPitch` matches every pitch. */
const remapMatcher = (remaps: Remap[]) => {
  const matchers = remaps.map(remap => ({
    remap,
    pitches: remap.originalPitch?.trim() ? new Set(parseRange(remap.originalPitch, 0, 127)) : null,
  }))
  return (pitch: number) => matchers.find(m => !m.pitches || m.pitches.has(pitch))?.remap
}

/** Packs (time, value / 127) pairs into a float texture for lookup in the shader. */
const ccTexture = ({ times, values }: ControllerTrack) => {
  const width = CC_TEXTURE_WIDTH
  const height = Math.max(1, Math.ceil(times.length / width))
  const data = new Float32Array(width * height * 2)
  times.forEach((t, i) => {
    data[i * 2] = t
    data[i * 2 + 1] = values[i]! / 127
  })
  const texture = new DataTexture(data, width, height, RGFormat, FloatType)
  texture.needsUpdate = true
  return texture
}

interface NotesProps {
  style: StyleRuntime
  notes: MidiChannelEventData[]
  /** End of the song (ms), where a pedal that is never released stops holding notes. */
  songEnd: number
}

const Notes = ({ notes, style, songEnd }: NotesProps) => {
  const {
    mode, cc, velocity, color, z, decayRate, gap, radius, remaps, showPedal, pedalColor,
  } = style
  const timeScale = useTimeScale()

  const mesh = useMemo(() => {
    const noteOns = notes.filter((note): note is NoteOn => note.type === 'noteOn')
    const findRemap = remapMatcher(remaps)
    const toColor = (c: string) => new ThreeColor(new Color(c).hex())
    const baseColor = toColor(color)
    const heldUntil = showPedal ? sustainEnd(notes, songEnd) : null
    const ccTrack = getControllerTrack(mode === 'CC' ? notes : [], cc)

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uDecayPerUnit: {
          value: mode === 'decay' ? Math.pow(1 - decayRate, 1 / (DECAY_MS * timeScale)) : 1,
        },
        uRadius: { value: radius },
        uPedalColor: { value: toColor(pedalColor) },
        uUseCC: { value: mode === 'CC' },
        uCC: { value: ccTexture(ccTrack) },
        uCCCount: { value: ccTrack.times.length },
        uTimeScale: { value: timeScale },
      },
      side: DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    })

    const geometry = new PlaneGeometry(1, 1)
    const alphas = new Float32Array(noteOns.length)
    const colors = new Float32Array(noteOns.length * 3)
    const splits = new Float32Array(noteOns.length)
    const mesh = new InstancedMesh(geometry, material, noteOns.length)
    const matrix = new Matrix4()
    noteOns.forEach((note, i) => {
      // A remapped note covers the whole mapped pitch range as one band
      const remap = findRemap(note.noteNumber)
      const bottom = remap ? Math.min(...remap.mappedPitch) : note.noteNumber
      const top = (remap ? Math.max(...remap.mappedPitch) : note.noteNumber) + 1
      // `gap` is the empty space between adjacent pitches, in pitch units
      const h = Math.max(0, top - bottom - gap)

      const offTime = note.endEvent?.time ?? note.time
      const endTime = heldUntil ? heldUntil(note.noteNumber, note.time, offTime) : offTime
      const x = note.time * timeScale
      const w = (endTime - note.time) * timeScale
      splits[i] = endTime > note.time ? (offTime - note.time) / (endTime - note.time) : 1
      matrix.makeScale(w, h, 1).setPosition(x + w / 2, (bottom + top) / 2, 0)
      mesh.setMatrixAt(i, matrix)
      alphas[i] = velocity ? note.velocity / 127 : 1
      ;(remap ? toColor(remap.color) : baseColor).toArray(colors, i * 3)
    })
    geometry.setAttribute('aAlpha', new InstancedBufferAttribute(alphas, 1))
    geometry.setAttribute('aColor', new InstancedBufferAttribute(colors, 3))
    geometry.setAttribute('aSplit', new InstancedBufferAttribute(splits, 1))
    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
    return mesh
  }, [
    notes, mode, cc, velocity, color, decayRate, gap, radius, remaps, showPedal, pedalColor,
    timeScale, songEnd,
  ])

  useEffect(() => () => {
    const material = mesh.material as ShaderMaterial
    mesh.geometry.dispose()
    ;(material.uniforms.uCC!.value as DataTexture).dispose()
    material.dispose()
    mesh.dispose()
  }, [mesh])

  // Depth testing is off, so draw order decides what covers what; derive it from z so the
  // layering matches the position
  return <primitive object={mesh} position-z={z} renderOrder={z} />
}

export default Notes
