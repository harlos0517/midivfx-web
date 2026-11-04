import { useFrame } from '@react-three/fiber'
import { BlendFunction, Effect } from 'postprocessing'
import { useContext, useEffect, useMemo } from 'react'
import {
  CustomBlending,
  ShaderMaterial,
  SrcAlphaFactor,
  Uniform,
  ZeroFactor,
} from 'three'

import MidiFileContext from '@/context/MidiFileContext'

// Above every note
const RENDER_ORDER = 1e9

// Shared by both render paths; only one is mounted at a time
const uGain = new Uniform(1)

/** Updates the gain from the playback clock every frame, so exports get it frame by frame too. */
const useFadeGain = () => {
  const { playback } = useContext(MidiFileContext)
  useFrame(() => {
    uGain.value = playback ? playback.fadeGain(playback.currentTime) : 1
  })
}

const vertexShader = /* glsl */`
  void main() {
    // Already in clip space: the fade ignores the camera
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragmentShader = /* glsl */`
  uniform float uGain;

  void main() {
    gl_FragColor = vec4(0.0, 0.0, 0.0, uGain);
  }
`

/**
 * Drawn last when there is no post-processing. The blending scales everything already drawn,
 * alpha included, by the gain: the buffer is premultiplied, so this fades to black on opaque
 * exports and to transparent on transparent ones.
 */
export const FadeQuad = () => {
  useFadeGain()
  const material = useMemo(() => new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: { uGain },
    // Transparent so it sorts with the notes, which three draws after opaque objects
    transparent: true,
    blending: CustomBlending,
    blendSrc: ZeroFactor,
    blendDst: SrcAlphaFactor,
    depthTest: false,
    depthWrite: false,
  }), [])

  useEffect(() => () => material.dispose(), [material])

  return <mesh
    material={material}
    frustumCulled={false}
    renderOrder={RENDER_ORDER}
    raycast={() => null}
  >
    <planeGeometry args={[2, 2]} />
  </mesh>
}

const effectShader = /* glsl */`
  uniform float uGain;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    outputColor = inputColor * uGain;
  }
`

class FadeEffectImpl extends Effect {
  constructor() {
    super('FadeEffect', effectShader, {
      blendFunction: BlendFunction.SRC,
      uniforms: new Map<string, Uniform>([['uGain', uGain]]),
    })
  }
}

/** Fades the composited frame, glow and background included. Must be the last effect. */
export const FadeEffect = () => {
  useFadeGain()
  const effect = useMemo(() => new FadeEffectImpl(), [])

  useEffect(() => () => effect.dispose(), [effect])

  return <primitive object={effect} />
}
