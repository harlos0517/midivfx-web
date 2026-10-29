import Color from 'color'
import { useEffect, useMemo } from 'react'
import {
  DoubleSide,
  InstancedMesh,
  Matrix4,
  PlaneGeometry,
  ShaderMaterial,
  Color as ThreeColor,
} from 'three'

import useTimeScale from '@/hooks/useTimeScale'
import type { StyleRuntime } from '@/utils/config'
import type { MidiChannelEventData } from '@/utils/midi'

/** `decayRate` is the fraction of opacity lost per this many ms, independent of the speed. */
const DECAY_MS = 25

// Unit quad stretched per instance via instanceMatrix; corners and decay are drawn in the shader
// so every note of a channel shares one draw call
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vSize;

  void main() {
    vUv = uv;
    vSize = vec2(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz));
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uDecayPerUnit;
  uniform float uRadius;
  varying vec2 vUv;
  varying vec2 vSize;

  void main() {
    // Rounded-rectangle distance in world units, centered on the note
    vec2 halfSize = vSize * 0.5;
    vec2 p = (vUv - 0.5) * vSize;
    float r = min(uRadius, min(halfSize.x, halfSize.y));
    vec2 q = abs(p) - halfSize + r;
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
    float edge = clamp(0.5 - d / fwidth(d), 0.0, 1.0);

    float decay = pow(uDecayPerUnit, vUv.x * vSize.x);

    gl_FragColor = vec4(uColor, decay * edge);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

interface NotesProps {
  style: StyleRuntime
  notes: MidiChannelEventData[]
}

const DecayNotes = ({ notes, style }: NotesProps) => {
  const { color, z, decayRate, gap, radius } = style
  const timeScale = useTimeScale()

  const mesh = useMemo(() => {
    const noteOns = notes.filter(note => note.type === 'noteOn')

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { value: new ThreeColor(new Color(color).hex()) },
        uDecayPerUnit: { value: Math.pow(1 - decayRate, 1 / (DECAY_MS * timeScale)) },
        uRadius: { value: radius },
      },
      side: DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    })

    const mesh = new InstancedMesh(new PlaneGeometry(1, 1), material, noteOns.length)
    const matrix = new Matrix4()
    // `gap` is the empty space between adjacent pitches, in pitch units
    const h = Math.max(0, 1 - gap)
    noteOns.forEach((note, i) => {
      const time = note.endEvent ? note.endEvent.time - note.time : 0
      const x = note.time * timeScale
      const y = note.type === 'noteOn' ? note.noteNumber : 0
      const w = time * timeScale
      matrix.makeScale(w, h, 1).setPosition(x + w / 2, y + 0.5, 0)
      mesh.setMatrixAt(i, matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
    return mesh
  }, [notes, color, decayRate, gap, radius, timeScale])

  useEffect(() => () => {
    mesh.geometry.dispose()
    ;(mesh.material as ShaderMaterial).dispose()
    mesh.dispose()
  }, [mesh])

  // Depth testing is off, so draw order decides what covers what; derive it from z so the
  // layering matches the position
  return <primitive object={mesh} position-z={z} renderOrder={z} />
}

export default DecayNotes
