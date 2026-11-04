export interface Fade {
  /** Range the fades sit inside (ms); `end` null = no fade-out. */
  start: number
  end: number | null
  /** Fade durations (ms); 0 = no fade. */
  fadeIn: number
  fadeOut: number
}

const ramp = (from: number, to: number) =>
  Math.min(1, Math.max(0, from / to))

/**
 * Picture and audio gain (0-1) at timeline time `t` (ms). Linear ramps up from `start` and down to
 * `end`. Before `start` a fade-in stays at 0, so seeking outside the range looks like its edge.
 * Overlapping fades take the lower of the two.
 */
export const getFadeGain = (t: number, { start, end, fadeIn, fadeOut }: Fade) => {
  const fadeInGain = fadeIn > 0 ? ramp(t - start, fadeIn) : 1
  const fadeOutGain = end !== null && fadeOut > 0 ? ramp(end - t, fadeOut) : 1
  return Math.min(fadeInGain, fadeOutGain)
}

/**
 * Times where the gain changes slope; between two of them it is linear. The crossing of
 * overlapping fades is included, as is a harmless extra point when they don't overlap.
 */
export const getFadeKnots = ({ start, end, fadeIn, fadeOut }: Fade) => {
  const knots = [start, start + fadeIn]
  if (end !== null) {
    knots.push(end - fadeOut, end)
    if (fadeIn + fadeOut > 0) knots.push((start * fadeOut + end * fadeIn) / (fadeIn + fadeOut))
  }
  return knots.sort((a, b) => a - b)
}
