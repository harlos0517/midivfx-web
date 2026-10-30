import {
  parseMidi,
  type MidiChannelAftertouchEvent,
  type MidiChannelPrefixEvent,
  type MidiControllerEvent,
  type MidiCopyrightNoticeEvent,
  type MidiCuePointEvent,
  type MidiEndOfTrackEvent,
  type MidiEvent,
  type MidiHeader,
  type MidiInstrumentNameEvent,
  type MidiKeySignatureEvent,
  type MidiLyricsEvent,
  type MidiMarkerEvent,
  type MidiNoteAftertouchEvent,
  type MidiNoteOffEvent,
  type MidiNoteOnEvent,
  type MidiPitchBendEvent,
  type MidiPortPrefixEvent,
  type MidiProgramChangeEvent,
  type MidiSequenceNumberEvent,
  type MidiSequencerSpecificEvent,
  type MidiSetTempoEvent,
  type MidiSmpteOffsetEvent,
  type MidiSysExEvent,
  type MidiTextEvent,
  type MidiTimeSignatureEvent,
  type MidiTrackNameEvent,
  type MidiUnknownEvent,
} from 'midi-file'

export type Timed<T> =  T & {
  tick: number
  time: number
}

export type WithLength<T> =  Timed<T> & {
  endEvent: Timed<MidiChannelEvent> | null
}

export type MidiMetaEvent =
  | MidiSequenceNumberEvent
  | MidiTextEvent
  | MidiCopyrightNoticeEvent
  | MidiTrackNameEvent
  | MidiInstrumentNameEvent
  | MidiLyricsEvent
  | MidiMarkerEvent
  | MidiCuePointEvent
  | MidiChannelPrefixEvent
  | MidiPortPrefixEvent
  | MidiEndOfTrackEvent
  | MidiSetTempoEvent
  | MidiSmpteOffsetEvent
  | MidiTimeSignatureEvent
  | MidiKeySignatureEvent
  | MidiSequencerSpecificEvent
  | MidiUnknownEvent
  | MidiSysExEvent
  | MidiSysExEvent


export type MidiMetaEventData = Timed<MidiMetaEvent>

export type MidiChannelEvent =
  | MidiNoteOnEvent
  | MidiNoteOffEvent
  | MidiNoteAftertouchEvent
  | MidiControllerEvent
  | MidiProgramChangeEvent
  | MidiChannelAftertouchEvent
  | MidiPitchBendEvent


export type MidiChannelEventData = WithLength<MidiChannelEvent>

export type TrackData = {
  name?: string | undefined
  channels: MidiChannelEventData[][]
}

/** Tempo in effect from `tick` on; `time` is that tick's time (ms). */
export interface TempoChange {
  tick: number
  time: number
  msPerTick: number
}

export interface MidiData {
  header: MidiHeader
  /** Sorted by tick, one per tick, and always starting at tick 0. */
  tempoMap: TempoChange[]
  metaEvents: MidiMetaEventData[]
  tracks: TrackData[]
}


export const parseMidiFile = (fileBuffer: Uint8Array): MidiData => {
  const midi = parseMidi(fileBuffer)

  const tpq = midi.header.ticksPerBeat || 480
  const tracksWithTicks = midi.tracks.map(setTicks)
  const tempoMap = getTempoMap(tracksWithTicks, tpq)
  const tracksWithTimings = tracksWithTicks.map(track => calcTimings(track, tempoMap))
  const tracks = tracksWithTimings.map(track => ({
    name: track.find(event => event.type === 'trackName')?.text,
    channels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(channel => {
      const channelEvents = track.filter(
        event => 'channel' in event && event.channel === channel,
      ) as Timed<MidiChannelEvent>[]
      return calcLength(channelEvents)
    }),
  }))
  const metaEvents = tracksWithTimings.flatMap(
    track => track.filter(
      event => 'type' in event && !('channel' in event),
    ) as MidiMetaEventData[],
  )

  return {
    header: midi.header,
    tempoMap,
    tracks,
    metaEvents,
  }
}

const setTicks = (events: MidiEvent[]): (MidiEvent & { tick: number })[] => {
  let tick = 0
  return events.map(event => {
    tick += event.deltaTime
    return { ...event, tick }
  })
}

const DEFAULT_BPM = 120

/** Tempo changes from every track; the last one wins when several share a tick. */
const getTempoMap = (
  tracks: (MidiEvent & { tick: number })[][],
  tpq: number,
): TempoChange[] => {
  const changes = tracks.flat()
    .filter((event): event is MidiSetTempoEvent & { tick: number } => event.type === 'setTempo')
    .sort((a, b) => a.tick - b.tick)

  const tempoMap: TempoChange[] = [{ tick: 0, time: 0, msPerTick: 60000 / DEFAULT_BPM / tpq }]
  for (const change of changes) {
    const prev = tempoMap.at(-1)!
    const msPerTick = change.microsecondsPerBeat / tpq / 1000
    if (change.tick === prev.tick) prev.msPerTick = msPerTick
    else tempoMap.push({ tick: change.tick, time: tickToTime(tempoMap, change.tick), msPerTick })
  }
  return tempoMap
}

/** Time (ms) of any tick, including ticks with no event on them. */
export const tickToTime = (tempoMap: TempoChange[], tick: number) => {
  // Binary search for the last tempo change at or before the tick
  let lo = 0
  let hi = tempoMap.length - 1
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2)
    if (tempoMap[mid]!.tick <= tick) lo = mid
    else hi = mid - 1
  }
  const tempo = tempoMap[lo]!
  return tempo.time + (tick - tempo.tick) * tempo.msPerTick
}

const calcTimings = (
  events: (MidiEvent & { tick: number })[],
  tempoMap: TempoChange[],
): Timed<MidiEvent>[] => events.map(event => ({ ...event, time: tickToTime(tempoMap, event.tick) }))

const calcLength = (events: Timed<MidiChannelEvent>[]): MidiChannelEventData[] =>
  events.map((e, i, events) => {
    if (e.type === 'noteOn') {
      let j = i + 1
      let endEvent: Timed<MidiNoteOnEvent | MidiNoteOffEvent> | null = null
      while (j < events.length) {
        const ev = events[j]!
        if (
          (ev.type === 'noteOff' || (ev.type === 'noteOn' && ev.velocity === 0)) &&
          ev.channel === e.channel && ev.noteNumber === e.noteNumber
        ) {
          endEvent = ev
          break
        }
        j++
      }
      return { ...e, endEvent }
    } else if (e.type !== 'noteOff') {
      let j = i + 1
      let endEvent: Timed<MidiChannelEvent> | null = null
      while (j < events.length) {
        const ev = events[j]!
        if (ev.type === e.type && ev.channel === e.channel) {
          endEvent = ev
          break
        }
        j++
      }
      return { ...e, endEvent }
    } else return { ...e, endEvent: null }
  })
