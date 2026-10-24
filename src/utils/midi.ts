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

export interface MidiData {
  header: MidiHeader
  metaEvents: MidiMetaEventData[]
  tracks: TrackData[]
}


export const parseMidiFile = (fileBuffer: Uint8Array): MidiData => {
  const midi = parseMidi(fileBuffer)

  const tpq = midi.header.ticksPerBeat || 480
  const tracksWithTicks = midi.tracks.map(setTicks)
  const tempoChanges = getTempoChanges(tracksWithTicks)
  const tracksWithTimings = tracksWithTicks.map(track => calcTimings(track, tempoChanges, tpq))
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

const getTempoChanges = (
  events: Array<(MidiEvent & { tick: number })[]>,
): (MidiSetTempoEvent & { tick: number })[] => {
  const tempoChanges = events.flat()
    .filter((event): event is Timed<MidiSetTempoEvent> => event.type === 'setTempo')
  const sortedTempoChanges = tempoChanges.sort((a, b) => a.tick - b.tick)
  return sortedTempoChanges
}

const calcTimings = (
  events: (MidiEvent & { tick: number })[],
  tempoChanges: (MidiSetTempoEvent & { tick: number })[],
  tpq: number,
): Timed<MidiEvent>[] => {
  const DEFAULT_BPM = 120
  const combined = [...tempoChanges, ...events].sort((a, b) => a.tick - b.tick)
  const result: Timed<MidiEvent>[] = []

  let tick = 0
  let time = 0
  let currentMsPerTick = 60000 / DEFAULT_BPM / tpq

  for (const event of combined) {
    time += (event.tick - tick) * currentMsPerTick
    tick = event.tick
    result.push({ ...event, time })
    if ('microsecondsPerBeat' in event)
      currentMsPerTick = event.microsecondsPerBeat / tpq / 1000
  }

  return result
}

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
