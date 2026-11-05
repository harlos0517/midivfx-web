import { useFrame } from '@react-three/fiber'
import { useContext, useEffect, useMemo } from 'react'
import {
  DoubleSide,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Color as ThreeColor,
} from 'three'

import MidiFileContext from '@/context/MidiFileContext'
import { fixColorHex } from '@/utils/colors'
import { defaultStyleRuntime, type StyleRuntime } from '@/utils/config'
import { getControllerTrack } from '@/utils/controllers'
import type { MidiChannelEventData } from '@/utils/midi'
import {
  ccTexture, ccValueGlsl, DECAY_MS, pitchBand, remapMatcher, secondaryWriter,
} from '@/utils/noteShading'

/** Above every note, whatever its layer; ripples under circles. Fade draws over all of it. */
const RIPPLE_RENDER_ORDER = 1000
const CIRCLE_RENDER_ORDER = 2000
/** Quad margin around the circle, so its anti-aliased edge isn't clipped. */
const PAD = 1.1
/** Black shadow around circles and rings: width in pitch units, and opacity at the shape. */
const SHADOW_SIZE = 0.25
const SHADOW_OPACITY = 0.25
/** How far ripple rings are blended from the note color toward white. */
const RIPPLE_BRIGHTNESS = 0.25

// Every size and opacity is derived from uTime, so seeking and export need no per-note state.
const vertexShader = /* glsl */ `
  attribute float aY;
  attribute float aOn;
  attribute float aOff;
  attribute float aVelocity;
  attribute vec3 aColor;
  attribute vec4 aSecondary;
  uniform float uTime;
  uniform float uSize;
  uniform float uPeak;
  uniform float uAttack;
  uniform float uSettle;
  uniform float uRelease;
  uniform float uRippleScale;
  uniform float uRippleDuration;
  uniform bool uVelocity;
  uniform bool uFollowSize;
  uniform float uDecayBase;
  uniform bool uUseCC;
  varying vec2 vUv;
  varying float vDiameter;
  varying float vExtent;
  varying float vShadow;
  varying float vAlpha;
  varying vec3 vColor;
  varying vec4 vSecondary;
  varying float vFollow;

  ${ccValueGlsl}

  float easeOut(float x) {
    return 1.0 - pow(1.0 - x, 3.0);
  }

  void main() {
    float t = uTime - aOn;
    float scale = 0.0;
    float alpha = 1.0;
  #ifdef RIPPLE
    float p = t / max(uRippleDuration, 1e-3);
    if (t >= 0.0 && p < 1.0) {
      scale = uRippleScale * easeOut(p);
      alpha = 1.0 - p;
    }
  #else
    if (t >= 0.0) {
      float attack = clamp(t / max(uAttack, 1e-3), 0.0, 1.0);
      float settle = clamp((t - uAttack) / max(uSettle, 1e-3), 0.0, 1.0);
      scale = mix(uPeak * easeOut(attack), 1.0, smoothstep(0.0, 1.0, settle));
      // A release that starts mid-attack shrinks from wherever the circle got to
      float release = clamp((uTime - aOff) / max(uRelease, 1e-3), 0.0, 1.0);
      if (uTime >= aOff) scale *= 1.0 - smoothstep(0.0, 1.0, release);
    }
  #endif
    // Velocity and the fill mode show as either size or opacity. Ripples fade on their own
    // timeline, so only velocity reaches them.
    float follow = uVelocity ? aVelocity : 1.0;
  #ifndef RIPPLE
    // Same fade a note has at the cursor, which is t ms into it
    follow *= pow(uDecayBase, max(t, 0.0) / ${DECAY_MS.toFixed(1)});
    if (uUseCC) follow *= ccValue(uTime);
  #endif
    // The color blends toward the secondary color either way; its alpha only when following
    // opacity, since size already carries the fade
    if (uFollowSize) scale *= follow;
    vFollow = follow;
    vSecondary = uFollowSize ? vec4(aSecondary.rgb, 1.0) : aSecondary;

    vUv = uv;
    vDiameter = uSize * scale;
    // Shadow grows in with the circle and shrinks out with it, so a vanishing circle doesn't
    // leave a dark smudge behind
    vShadow = ${SHADOW_SIZE.toFixed(2)} * min(scale, 1.0);
    // Inactive notes collapse to a point and draw nothing
    vExtent = vDiameter > 0.0 ? vDiameter * ${PAD} + 2.0 * vShadow : 0.0;
    vAlpha = alpha;
    vColor = aColor;
    vec3 pos = vec3(position.xy * vExtent, 0.0) + vec3(0.0, aY, 0.0);
    vec4 world = modelMatrix * vec4(pos, 1.0);
    // Pinned to the cursor line in world space instead of undoing the group's scroll: the scroll
    // reads the clock separately, so cancelling it with uTime would jitter by the difference
    world.x = pos.x;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uRippleWidth;
  varying vec2 vUv;
  varying float vDiameter;
  varying float vExtent;
  varying float vShadow;
  varying float vAlpha;
  varying vec3 vColor;
  varying vec4 vSecondary;
  varying float vFollow;

  void main() {
    float radius = vDiameter * 0.5;
    float r = length(vUv - 0.5) * vExtent;
  #ifdef RIPPLE
    // Ring whose outer edge is the diameter; below the line width it is a filled disc
    float w = min(uRippleWidth, radius);
    float d = abs(r - (radius - w * 0.5)) - w * 0.5;
  #else
    float d = r - radius;
  #endif
    float edge = clamp(0.5 - d / fwidth(d), 0.0, 1.0);

    float falloff = 1.0 - clamp(max(d, 0.0) / max(vShadow, 1e-4), 0.0, 1.0);
    float shadow = ${SHADOW_OPACITY.toFixed(2)} * falloff * falloff;
    vec4 faded = mix(vSecondary, vec4(vColor, 1.0), vFollow);
  #ifdef RIPPLE
    vec3 color = mix(faded.rgb, vec3(1.0), ${RIPPLE_BRIGHTNESS.toFixed(2)});
  #else
    vec3 color = faded.rgb;
  #endif
    // Shape over a black shadow: black adds coverage but no color
    float coverage = edge + shadow * (1.0 - edge);
    color *= edge / max(coverage, 1e-4);

    gl_FragColor = vec4(color, vAlpha * faded.a * coverage);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

type NoteOn = Extract<MidiChannelEventData, { type: 'noteOn' }>

interface NoteIndicatorsProps {
  style: StyleRuntime
  notes: MidiChannelEventData[]
  /** Events whose `cc` sets the opacity of the indicators. */
  ccEvents: MidiChannelEventData[]
  visible?: boolean
}

/** Circles on the cursor line while notes sound, and a ripple from each note on. */
const NoteIndicators = (props: NoteIndicatorsProps) => {
  const { notes, ccEvents, style, visible = true } = props
  const {
    mode, cc, velocity, color, secondaryColor, z, decayRate, remaps, indicator, indicatorSize,
    indicatorPeak, indicatorAttack, indicatorSettle, indicatorRelease, indicatorFollow, ripple,
    rippleScale, rippleDuration, rippleWidth,
  } = style
  const { playback } = useContext(MidiFileContext)

  // Note data shared by both meshes; built only when one of them is shown
  const geometry = useMemo(() => {
    if (!indicator && !ripple) return null
    const noteOns = notes.filter((note): note is NoteOn => note.type === 'noteOn')
    const findRemap = remapMatcher(remaps)
    const toColor = (c: string) => new ThreeColor(fixColorHex(c, defaultStyleRuntime.color))
    const baseColor = toColor(color)
    const writeSecondary = secondaryWriter(secondaryColor)

    const ys = new Float32Array(noteOns.length)
    const ons = new Float32Array(noteOns.length)
    const offs = new Float32Array(noteOns.length)
    const velocities = new Float32Array(noteOns.length)
    const colors = new Float32Array(noteOns.length * 3)
    const secondaries = new Float32Array(noteOns.length * 4)
    noteOns.forEach((note, i) => {
      const remap = findRemap(note.noteNumber)
      const { bottom, top } = pitchBand(note.noteNumber, remap)
      ys[i] = (bottom + top) / 2
      ons[i] = note.time
      offs[i] = note.endEvent?.time ?? note.time
      velocities[i] = note.velocity / 127
      const noteColor = remap ? toColor(remap.color) : baseColor
      noteColor.toArray(colors, i * 3)
      writeSecondary(noteColor, secondaries, i)
    })

    const quad = new PlaneGeometry(1, 1)
    const geometry = new InstancedBufferGeometry()
    geometry.setIndex(quad.index)
    geometry.setAttribute('position', quad.getAttribute('position'))
    geometry.setAttribute('uv', quad.getAttribute('uv'))
    geometry.instanceCount = noteOns.length
    geometry.setAttribute('aY', new InstancedBufferAttribute(ys, 1))
    geometry.setAttribute('aOn', new InstancedBufferAttribute(ons, 1))
    geometry.setAttribute('aOff', new InstancedBufferAttribute(offs, 1))
    geometry.setAttribute('aVelocity', new InstancedBufferAttribute(velocities, 1))
    geometry.setAttribute('aColor', new InstancedBufferAttribute(colors, 3))
    geometry.setAttribute('aSecondary', new InstancedBufferAttribute(secondaries, 4))
    return geometry
  }, [notes, remaps, color, secondaryColor, indicator, ripple])

  const ccMap = useMemo(() => {
    const track = getControllerTrack(mode === 'CC' ? ccEvents : [], cc)
    return { texture: ccTexture(track), count: track.times.length }
  }, [ccEvents, mode, cc])

  const meshes = useMemo(() => {
    if (!geometry) return null
    const make = (isRipple: boolean) => {
      const material = new ShaderMaterial({
        vertexShader,
        fragmentShader,
        defines: isRipple ? { RIPPLE: '' } : {},
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: indicatorSize },
          uPeak: { value: indicatorPeak },
          uAttack: { value: indicatorAttack },
          uSettle: { value: indicatorSettle },
          uRelease: { value: indicatorRelease },
          uRippleScale: { value: rippleScale },
          uRippleDuration: { value: rippleDuration },
          uRippleWidth: { value: rippleWidth },
          uVelocity: { value: velocity },
          uFollowSize: { value: indicatorFollow === 'size' },
          // A rate of 1 would be pow(0, 0) at the note on, which GLSL leaves undefined
          uDecayBase: { value: mode === 'decay' && !isRipple ? Math.max(1 - decayRate, 1e-6) : 1 },
          uUseCC: { value: mode === 'CC' },
          uCC: { value: ccMap.texture },
          uCCCount: { value: ccMap.count },
        },
        side: DoubleSide,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      })
      const mesh = new Mesh(geometry, material)
      // Vertices are placed in the shader, so the geometry's bounds mean nothing
      mesh.frustumCulled = false
      return mesh
    }
    return { circle: indicator ? make(false) : null, ripple: ripple ? make(true) : null }
  }, [
    geometry, ccMap, indicator, ripple, indicatorSize, indicatorPeak, indicatorAttack,
    indicatorSettle, indicatorRelease, rippleScale, rippleDuration, rippleWidth, velocity,
    indicatorFollow, mode, decayRate,
  ])

  useEffect(() => () => { geometry?.dispose() }, [geometry])
  useEffect(() => () => { ccMap.texture.dispose() }, [ccMap])
  useEffect(() => () => {
    ;(meshes?.circle?.material as ShaderMaterial | undefined)?.dispose()
    ;(meshes?.ripple?.material as ShaderMaterial | undefined)?.dispose()
  }, [meshes])

  useFrame(() => {
    if (!playback || !meshes) return
    for (const mesh of [meshes.circle, meshes.ripple])
      if (mesh) (mesh.material as ShaderMaterial).uniforms.uTime!.value = playback.currentTime
  })

  if (!meshes) return null
  return <>
    {meshes.ripple && <primitive
      object={meshes.ripple} position-z={z} renderOrder={RIPPLE_RENDER_ORDER + z} visible={visible}
    />}
    {meshes.circle && <primitive
      object={meshes.circle} position-z={z} renderOrder={CIRCLE_RENDER_ORDER + z} visible={visible}
    />}
  </>
}

export default NoteIndicators
