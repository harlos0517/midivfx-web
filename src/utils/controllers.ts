import type { MidiChannelEventData } from '@/utils/midi'

export interface ControllerTrack {
  /** Event times (ms), ascending. */
  times: number[]
  /** Controller values (0-127), parallel to `times`. */
  values: number[]
}

export const getControllerTrack = (events: MidiChannelEventData[], cc: number) => {
  const track: ControllerTrack = { times: [], values: [] }
  for (const e of events) {
    if (e.type !== 'controller' || e.controllerType !== cc) continue
    track.times.push(e.time)
    track.values.push(e.value)
  }
  return track
}

/** Number of leading times that are <= `t` (or < `t` when `exclusive`). */
const countBefore = (times: number[], t: number, exclusive = false) => {
  let lo = 0
  let hi = times.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (exclusive ? times[mid]! < t : times[mid]! <= t) lo = mid + 1
    else hi = mid
  }
  return lo
}

/** Index of the last time <= `t`, or -1 if every time is later. */
export const lastIndexAtOrBefore = (times: number[], t: number) => countBefore(times, t) - 1

const SUSTAIN_CC = 64
const SUSTAIN_THRESHOLD = 64

/**
 * Returns when a note released at a given time stops sounding under the sustain pedal (CC64):
 * at the next pedal release, or earlier if the same pitch is struck again.
 */
export const sustainEnd = (events: MidiChannelEventData[]) => {
  const pedal = getControllerTrack(events, SUSTAIN_CC)
  const lastTime = events.length ? events[events.length - 1]!.time : 0

  // nextRelease[i]: time of the first release at or after pedal event i
  const nextRelease = new Array<number>(pedal.times.length)
  let release = lastTime
  for (let i = pedal.times.length - 1; i >= 0; i--) {
    if (pedal.values[i]! < SUSTAIN_THRESHOLD) release = pedal.times[i]!
    nextRelease[i] = release
  }

  const strikes = new Map<number, number[]>()
  for (const e of events) {
    if (e.type !== 'noteOn' || e.velocity === 0) continue
    const times = strikes.get(e.noteNumber) ?? []
    times.push(e.time)
    strikes.set(e.noteNumber, times)
  }

  return (pitch: number, offTime: number) => {
    const i = lastIndexAtOrBefore(pedal.times, offTime)
    if (i < 0 || pedal.values[i]! < SUSTAIN_THRESHOLD) return offTime
    const times = strikes.get(pitch) ?? []
    const restrike = times[countBefore(times, offTime, true)] ?? Infinity
    return Math.max(offTime, Math.min(nextRelease[i]!, restrike))
  }
}
