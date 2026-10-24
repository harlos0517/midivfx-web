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

import type { StyleRuntime } from '@/utils/config'
import type { MidiChannelEventData } from '@/utils/midi'

const SPEED = 0.02
const RADIUS = 0.5
const DECAY_SEG = 100
const DECAY_UNIT = 1
const DECAY_UNITS_PER_SEG = DECAY_SEG * SPEED / DECAY_UNIT

// Unit quad stretched per instance via instanceMatrix; corners and decay are drawn in the shader
// so every note of a channel shares one draw call
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying float vWidth;

  void main() {
    vUv = uv;
    vWidth = length(instanceMatrix[0].xyz);
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uDecayPerUnit;
  uniform float uDecayUnit;
  uniform float uRadius;
  varying vec2 vUv;
  varying float vWidth;

  void main() {
    // Rounded-rectangle distance in world units, centered on the note
    vec2 halfSize = vec2(vWidth, 1.0) * 0.5;
    vec2 p = (vUv - 0.5) * vec2(vWidth, 1.0);
    float r = min(uRadius, min(halfSize.x, halfSize.y));
    vec2 q = abs(p) - halfSize + r;
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
    float edge = clamp(0.5 - d / fwidth(d), 0.0, 1.0);

    float decay = pow(uDecayPerUnit, vUv.x * vWidth / uDecayUnit);

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
  const { color, z, decayRate } = style

  const mesh = useMemo(() => {
    const noteOns = notes.filter(note => note.type === 'noteOn')

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { value: new ThreeColor(new Color(color).hex()) },
        uDecayPerUnit: { value: Math.pow(1 - decayRate, DECAY_UNITS_PER_SEG) },
        uDecayUnit: { value: DECAY_UNIT },
        uRadius: { value: RADIUS },
      },
      side: DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    })

    const mesh = new InstancedMesh(new PlaneGeometry(1, 1), material, noteOns.length)
    const matrix = new Matrix4()
    noteOns.forEach((note, i) => {
      const time = note.endEvent ? note.endEvent.time - note.time : 0
      const x = note.time * SPEED
      const y = note.type === 'noteOn' ? note.noteNumber : 0
      const w = time * SPEED
      matrix.makeScale(w, 1, 1).setPosition(x + w / 2, y + 0.5, 0)
      mesh.setMatrixAt(i, matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
    return mesh
  }, [notes, color, decayRate])

  useEffect(() => () => {
    mesh.geometry.dispose()
    ;(mesh.material as ShaderMaterial).dispose()
    mesh.dispose()
  }, [mesh])

  return <primitive object={mesh} renderOrder={z} />
  // return <primitive object={mesh} />
}

export default DecayNotes
