import { type MidiData, tickToTime } from '@/utils/midi'
import { getMidiDuration } from '@/utils/timeline'

export interface Beat {
  /** ms */
  time: number
  /** First beat of a measure. */
  isMeasure: boolean
}

/** Guards against files whose tempo never lets time reach the end (e.g. a zero tempo). */
const MAX_BEATS = 100_000

/** Keeps the last event per tick, sorted by tick. */
const uniqueByTick = <T extends { tick: number }>(events: T[]) =>
  [...new Map(events.map(e => [e.tick, e])).values()].sort((a, b) => a.tick - b.tick)

/** Beat and measure times from the tempo map and time signatures, up to the last note. */
export const getBeats = (midiData: MidiData): Beat[] => {
  const tpq = midiData.header.ticksPerBeat || 480
  const signatures = uniqueByTick(midiData.metaEvents.flatMap(e => e.type === 'timeSignature'
    ? [{ tick: e.tick, numerator: e.numerator, denominator: e.denominator }]
    : []))
  const end = getMidiDuration(midiData)

  const beats: Beat[] = []
  let sigIdx = -1
  let numerator = 4
  let ticksPerBeat = tpq
  let beatInMeasure = 0
  let tick = 0
  for (;;) {
    // A time signature starts a new measure, even if it falls between beats
    while (sigIdx + 1 < signatures.length && signatures[sigIdx + 1]!.tick <= tick) {
      const sig = signatures[++sigIdx]!
      numerator = Math.max(1, sig.numerator)
      ticksPerBeat = tpq * 4 / sig.denominator
      beatInMeasure = 0
    }
    const time = tickToTime(midiData.tempoMap, tick)
    if (time > end || beats.length >= MAX_BEATS) break
    beats.push({ time, isMeasure: beatInMeasure === 0 })

    const nextSig = signatures[sigIdx + 1]
    tick = Math.min(tick + ticksPerBeat, nextSig?.tick ?? Infinity)
    beatInMeasure = (beatInMeasure + 1) % numerator
  }
  return beats
}
