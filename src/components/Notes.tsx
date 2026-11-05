import { useEffect, useMemo } from 'react'
import {
  type DataTexture,
  DoubleSide,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  PlaneGeometry,
  ShaderMaterial,
  Color as ThreeColor,
} from 'three'

import useTimeScale from '@/hooks/useTimeScale'
import { fixColorHex } from '@/utils/colors'
import { defaultStyleRuntime, type StyleRuntime } from '@/utils/config'
import { getControllerTrack, sustainEnd } from '@/utils/controllers'
import type { MidiChannelEventData } from '@/utils/midi'
import {
  ccTexture, ccValueGlsl, DECAY_MS, pitchBand, remapMatcher, secondaryWriter,
} from '@/utils/noteShading'

// Unit quad stretched per instance via instanceMatrix; corners and decay are drawn in the shader
// so every note of a channel shares one draw call
const vertexShader = /* glsl */ `
  attribute float aAlpha;
  attribute vec3 aColor;
  attribute vec4 aSecondary;
  attribute float aSplit;
  varying vec2 vUv;
  varying vec2 vSize;
  varying float vAlpha;
  varying vec3 vColor;
  varying vec4 vSecondary;
  varying float vSplit;
  varying float vX;

  void main() {
    vUv = uv;
    vX = (instanceMatrix * vec4(position, 1.0)).x;
    vAlpha = aAlpha;
    vColor = aColor;
    vSecondary = aSecondary;
    vSplit = aSplit;
    vSize = vec2(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz));
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uDecayPerUnit;
  uniform vec3 uPedalColor;
  uniform bool uUseCC;
  uniform float uTimeScale;
  uniform float uRadius;
  varying vec2 vUv;
  varying vec2 vSize;
  varying float vAlpha;
  varying vec3 vColor;
  varying vec4 vSecondary;
  varying float vSplit;
  varying float vX;

  ${ccValueGlsl}

  // Signed distance (world units) to a rounded rectangle centered at the origin
  float roundedRect(vec2 p, vec2 halfSize) {
    float r = min(uRadius, min(halfSize.x, halfSize.y));
    vec2 q = abs(p) - halfSize + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    vec2 halfSize = vSize * 0.5;
    vec2 p = (vUv - 0.5) * vSize;
    float d = roundedRect(p, halfSize);
    float edge = clamp(0.5 - d / fwidth(d), 0.0, 1.0);

    float decay = pow(uDecayPerUnit, vUv.x * vSize.x);

    // The played part is its own rounded rectangle up to the split, drawn over the pedal-held
    // band, so its end is rounded too
    vec2 bodyHalf = vec2(halfSize.x * vSplit, halfSize.y);
    float db = roundedRect(p - vec2(bodyHalf.x - halfSize.x, 0.0), bodyHalf);
    float body = clamp(0.5 - db / fwidth(db), 0.0, 1.0);
    // Relative to the outer coverage, so where both outlines coincide (every edge of a note with
    // no held part) the anti-aliased edge stays the note color
    vec3 color = mix(uPedalColor, vColor, clamp(body / max(edge, 1e-4), 0.0, 1.0));

    float cc = uUseCC ? ccValue(vX / uTimeScale) : 1.0;

    // Straight (not premultiplied) blend, so a transparent secondary color still tints the fade
    vec4 faded = mix(vSecondary, vec4(color, 1.0), vAlpha * decay * cc);
    gl_FragColor = vec4(faded.rgb, faded.a * edge);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

type NoteOn = Extract<MidiChannelEventData, { type: 'noteOn' }>

interface NotesProps {
  style: StyleRuntime
  notes: MidiChannelEventData[]
  /** Events whose sustain pedal holds `notes`. */
  pedalEvents: MidiChannelEventData[]
  /** Events whose `cc` sets the opacity of `notes`. */
  ccEvents: MidiChannelEventData[]
  /** End of the song (ms), where a pedal that is never released stops holding notes. */
  songEnd: number
  /** Hidden rather than unmounted, so showing it again doesn't rebuild the mesh. */
  visible?: boolean
}

const Notes = (props: NotesProps) => {
  const { notes, pedalEvents, ccEvents, style, songEnd, visible = true } = props
  const {
    mode, cc, velocity, color, secondaryColor, z, decayRate, thickness, radius, remaps, showPedal,
    pedalColor,
  } = style
  const timeScale = useTimeScale()

  const mesh = useMemo(() => {
    const noteOns = notes.filter((note): note is NoteOn => note.type === 'noteOn')
    const findRemap = remapMatcher(remaps)
    const toColor = (c: string, fallback = defaultStyleRuntime.color) =>
      new ThreeColor(fixColorHex(c, fallback))
    const baseColor = toColor(color)
    const writeSecondary = secondaryWriter(secondaryColor)
    // Twice the radius: the held part's rounded end then sits where the restruck note is already
    // full height, so no notch shows between them
    const heldUntil = showPedal
      ? sustainEnd(notes, pedalEvents, songEnd, 2 * radius / timeScale)
      : null
    const ccTrack = getControllerTrack(mode === 'CC' ? ccEvents : [], cc)

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uDecayPerUnit: {
          value: mode === 'decay' ? Math.pow(1 - decayRate, 1 / (DECAY_MS * timeScale)) : 1,
        },
        uRadius: { value: radius },
        uPedalColor: { value: toColor(pedalColor, defaultStyleRuntime.pedalColor) },
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
    const secondaries = new Float32Array(noteOns.length * 4)
    const splits = new Float32Array(noteOns.length)
    const mesh = new InstancedMesh(geometry, material, noteOns.length)
    const matrix = new Matrix4()
    noteOns.forEach((note, i) => {
      // A remapped note covers the whole mapped pitch range as one band
      const remap = findRemap(note.noteNumber)
      const { bottom, top } = pitchBand(note.noteNumber, remap)
      // `thickness` is the filled part of one pitch, so 1 leaves no space between adjacent pitches
      const h = Math.max(0, top - bottom - (1 - thickness))

      const offTime = note.endEvent?.time ?? note.time
      const endTime = heldUntil ? heldUntil(note.noteNumber, note.time, offTime) : offTime
      const x = note.time * timeScale
      const w = (endTime - note.time) * timeScale
      splits[i] = endTime > note.time ? (offTime - note.time) / (endTime - note.time) : 1
      matrix.makeScale(w, h, 1).setPosition(x + w / 2, (bottom + top) / 2, 0)
      mesh.setMatrixAt(i, matrix)
      alphas[i] = velocity ? note.velocity / 127 : 1
      const noteColor = remap ? toColor(remap.color) : baseColor
      noteColor.toArray(colors, i * 3)
      writeSecondary(noteColor, secondaries, i)
    })
    geometry.setAttribute('aAlpha', new InstancedBufferAttribute(alphas, 1))
    geometry.setAttribute('aColor', new InstancedBufferAttribute(colors, 3))
    geometry.setAttribute('aSecondary', new InstancedBufferAttribute(secondaries, 4))
    geometry.setAttribute('aSplit', new InstancedBufferAttribute(splits, 1))
    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
    return mesh
  }, [
    notes, pedalEvents, ccEvents, mode, cc, velocity, color, secondaryColor, decayRate, thickness,
    radius, remaps, showPedal, pedalColor, timeScale, songEnd,
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
  return <primitive object={mesh} position-z={z} renderOrder={z} visible={visible} />
}

export default Notes
