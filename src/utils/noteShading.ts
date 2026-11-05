import { DataTexture, FloatType, RGFormat, Color as ThreeColor } from 'three'

import { parseColorAlpha } from '@/utils/colors'
import type { Remap } from '@/utils/config'
import type { ControllerTrack } from '@/utils/controllers'
import { parseRange } from '@/utils/range'

/** `decayRate` is the fraction of opacity lost per this many ms, whatever `unitsPerSecond` is. */
export const DECAY_MS = 25
/** Row width of the CC event texture; rows wrap so long songs fit the max texture size. */
const CC_TEXTURE_WIDTH = 1024

/** GLSL for `ccValue(t)`, reading the texture from `ccTexture` in `uCC` with `uCCCount` events. */
export const ccValueGlsl = /* glsl */ `
  uniform sampler2D uCC;
  uniform int uCCCount;

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
`

/** Packs (time, value / 127) pairs into a float texture for lookup in the shader. */
export const ccTexture = ({ times, values }: ControllerTrack) => {
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

/**
 * Last remap whose `originalPitch` matches, so later remaps override earlier ones like styles do.
 * An empty `originalPitch` matches every pitch.
 */
export const remapMatcher = (remaps: Remap[]) => {
  const matchers = remaps.map(remap => ({
    remap,
    pitches: remap.originalPitch?.trim() ? new Set(parseRange(remap.originalPitch, 0, 127)) : null,
  }))
  return (pitch: number) => matchers.findLast(m => !m.pitches || m.pitches.has(pitch))?.remap
}

/** Pitch band a note covers: its own pitch, or the whole mapped range when remapped. */
export const pitchBand = (pitch: number, remap: Remap | undefined) => ({
  bottom: remap ? Math.min(...remap.mappedPitch) : pitch,
  top: (remap ? Math.max(...remap.mappedPitch) : pitch) + 1,
})

/**
 * Writes the RGBA a note fades toward into `out` at instance `i`: `secondaryColor`, or the note's
 * own color at alpha 0 when it is empty (or doesn't parse), which is a plain fade-out.
 */
export const secondaryWriter = (secondaryColor: string) => {
  const parsed = secondaryColor ? parseColorAlpha(secondaryColor) : null
  const color = parsed && new ThreeColor(parsed.hex)
  return (noteColor: ThreeColor, out: Float32Array, i: number) => {
    ;(color ?? noteColor).toArray(out, i * 4)
    out[i * 4 + 3] = parsed?.alpha ?? 0
  }
}
