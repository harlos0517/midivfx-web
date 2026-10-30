import Color from 'color'
import { useEffect, useMemo } from 'react'
import {
  DoubleSide,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  PlaneGeometry,
  ShaderMaterial,
  Color as ThreeColor,
} from 'three'

import useTimeScale from '@/hooks/useTimeScale'
import type { Remap, StyleRuntime } from '@/utils/config'
import { sustainEnd } from '@/utils/controllers'
import type { MidiChannelEventData } from '@/utils/midi'
import { parseRange } from '@/utils/range'

/** `decayRate` is the fraction of opacity lost per this many ms, whatever `unitsPerSecond` is. */
const DECAY_MS = 25

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

  void main() {
    vUv = uv;
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
  uniform float uRadius;
  varying vec2 vUv;
  varying vec2 vSize;
  varying float vAlpha;
  varying vec3 vColor;
  varying float vSplit;

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

    gl_FragColor = vec4(color, vAlpha * decay * edge);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

type NoteOn = Extract<MidiChannelEventData, { type: 'noteOn' }>

/**
 * Last remap whose `originalPitch` matches, so later remaps override earlier ones like styles do.
 * An empty `originalPitch` matches every pitch.
 */
const remapMatcher = (remaps: Remap[]) => {
  const matchers = remaps.map(remap => ({
    remap,
    pitches: remap.originalPitch?.trim() ? new Set(parseRange(remap.originalPitch, 0, 127)) : null,
  }))
  return (pitch: number) => matchers.findLast(m => !m.pitches || m.pitches.has(pitch))?.remap
}

interface NotesProps {
  style: StyleRuntime
  notes: MidiChannelEventData[]
}

const Notes = ({ notes, style }: NotesProps) => {
  const {
    mode, velocity, color, z, decayRate, gap, radius, remaps, showPedal, pedalColor,
  } = style
  const timeScale = useTimeScale()

  const mesh = useMemo(() => {
    const noteOns = notes.filter((note): note is NoteOn => note.type === 'noteOn')
    const findRemap = remapMatcher(remaps)
    const toColor = (c: string) => new ThreeColor(new Color(c).hex())
    const baseColor = toColor(color)
    const heldUntil = showPedal ? sustainEnd(notes) : null

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uDecayPerUnit: {
          value: mode === 'decay' ? Math.pow(1 - decayRate, 1 / (DECAY_MS * timeScale)) : 1,
        },
        uRadius: { value: radius },
        uPedalColor: { value: toColor(pedalColor) },
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
      const endTime = heldUntil ? heldUntil(note.noteNumber, offTime) : offTime
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
    notes, mode, velocity, color, decayRate, gap, radius, remaps, showPedal, pedalColor, timeScale,
  ])

  useEffect(() => () => {
    mesh.geometry.dispose()
    ;(mesh.material as ShaderMaterial).dispose()
    mesh.dispose()
  }, [mesh])

  // Depth testing is off, so draw order decides what covers what; derive it from z so the
  // layering matches the position
  return <primitive object={mesh} position-z={z} renderOrder={z} />
}

export default Notes
