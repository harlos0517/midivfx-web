import { BlendFunction, Effect } from 'postprocessing'
import { useContext, useEffect, useLayoutEffect, useMemo } from 'react'
import {
  Color,
  NoBlending,
  ShaderMaterial,
  Uniform,
  Vector2,
  type Texture,
} from 'three'

import MidiFileContext, { type BackgroundImage } from '@/context/MidiFileContext'
import useConfigStore from '@/store/configStore'
import { fixColorHex } from '@/utils/colors'
import { defaultConfig, type BackgroundSize } from '@/utils/config'

// Below the beat lines, which sit below every note
const RENDER_ORDER = -2000

/** Scales the frame's UVs so the image covers exactly the region `size` gives it. */
const getImageScale = (
  size: BackgroundSize,
  canvasAspect: number,
  imageAspect: number,
): [number, number] => {
  if (size === 'stretch') return [1, 1]
  const ratio = canvasAspect / imageAspect
  const wider = ratio > 1
  if (size === 'cover') return wider ? [1, 1 / ratio] : [ratio, 1]
  return wider ? [ratio, 1] : [1, 1 / ratio]
}

// Returns premultiplied color, the form the notes leave in the buffer, so both composite the same
const backgroundGlsl = /* glsl */`
  uniform vec3 uBgColor;
  uniform float uBgColorAlpha;
  uniform sampler2D uBgImage;
  uniform float uBgImageAlpha;
  uniform vec2 uBgScale;

  vec4 getBackground(vec2 uv) {
    vec4 bg = vec4(uBgColor * uBgColorAlpha, uBgColorAlpha);
    vec2 imageUv = (uv - 0.5) * uBgScale + 0.5;
    vec2 clamped = clamp(imageUv, 0.0, 1.0);
    if (uBgImageAlpha > 0.0 && imageUv == clamped) {
      vec4 image = texture2D(uBgImage, imageUv);
      float a = image.a * uBgImageAlpha;
      bg = vec4(image.rgb * a, a) + bg * (1.0 - a);
    }
    return bg;
  }
`

interface BackgroundValues {
  color: string
  size: BackgroundSize
  opacity: number
  alpha: boolean
  canvasAspect: number
  image: BackgroundImage | null
}

// Uniforms are updated in place, so a change does not rebuild the material or the effect pass
const createUniforms = () => {
  const uniforms = {
    uBgColor: new Uniform(new Color()),
    uBgColorAlpha: new Uniform(1),
    uBgImage: new Uniform<Texture | null>(null),
    uBgImageAlpha: new Uniform(0),
    uBgScale: new Uniform(new Vector2(1, 1)),
  }
  const update = ({ color, size, opacity, alpha, canvasAspect, image }: BackgroundValues) => {
    uniforms.uBgColor.value.set(fixColorHex(color, defaultConfig.display.backgroundColor))
    // A transparent export keeps only the image, so its opacity shows through
    uniforms.uBgColorAlpha.value = alpha ? 0 : 1
    uniforms.uBgImage.value = image?.texture ?? null
    uniforms.uBgImageAlpha.value = image ? opacity : 0
    if (image)
      uniforms.uBgScale.value.set(...getImageScale(size, canvasAspect, image.width / image.height))
  }
  return { uniforms, update }
}

type BackgroundUniforms = ReturnType<typeof createUniforms>['uniforms']

const useBackgroundUniforms = () => {
  const { backgroundImage: image } = useContext(MidiFileContext)
  const color = useConfigStore(s => s.config.display.backgroundColor)
  const size = useConfigStore(s => s.config.display.backgroundSize)
  const opacity = useConfigStore(s => s.config.display.backgroundOpacity)
  const alpha = useConfigStore(s => s.config.export.alpha)
  const width = useConfigStore(s => s.config.export.width)
  const height = useConfigStore(s => s.config.export.height)

  const { uniforms, update } = useMemo(() => createUniforms(), [])

  useLayoutEffect(() => {
    update({ color, size, opacity, alpha, canvasAspect: width / height, image })
  }, [update, image, color, size, opacity, alpha, width, height])

  return uniforms
}

const vertexShader = /* glsl */`
  varying vec2 vUv;

  void main() {
    vUv = uv;
    // Already in clip space: the background ignores the camera
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragmentShader = /* glsl */`
  varying vec2 vUv;
  ${backgroundGlsl}

  void main() {
    vec4 bg = getBackground(vUv);
    gl_FragColor = vec4(bg.a > 0.0 ? bg.rgb / bg.a : vec3(0.0), bg.a);
    #include <colorspace_fragment>
    // The canvas expects premultiplied alpha; NoBlending writes this as is
    gl_FragColor.rgb *= gl_FragColor.a;
  }
`

/** Drawn as the first thing in the scene when there is no post-processing. */
export const BackgroundQuad = () => {
  const uniforms = useBackgroundUniforms()
  const material = useMemo(() => new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    blending: NoBlending,
    depthTest: false,
    depthWrite: false,
  }), [uniforms])

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
  ${backgroundGlsl}

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Coverage from the scene as rendered, before bloom: glow is light added over the background,
    // so it must not hide it
    float sceneAlpha = texture2D(inputBuffer, uv).a;
    vec4 bg = getBackground(uv);
    outputColor = vec4(
      inputColor.rgb + bg.rgb * (1.0 - sceneAlpha),
      min(1.0, inputColor.a + bg.a * (1.0 - sceneAlpha))
    );
  }
`

class BackgroundEffectImpl extends Effect {
  constructor(uniforms: BackgroundUniforms) {
    super('BackgroundEffect', effectShader, {
      blendFunction: BlendFunction.SRC,
      uniforms: new Map<string, Uniform>(Object.entries(uniforms)),
    })
  }
}

/**
 * Composited under the scene after the other effects, so the image is never tone mapped or bloomed.
 * Must come last in the `EffectComposer`.
 */
export const BackgroundEffect = () => {
  const uniforms = useBackgroundUniforms()
  const effect = useMemo(() => new BackgroundEffectImpl(uniforms), [uniforms])

  useEffect(() => () => effect.dispose(), [effect])

  return <primitive object={effect} />
}
