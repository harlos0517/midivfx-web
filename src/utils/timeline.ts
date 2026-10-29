import useConfigStore from '@/store/configStore'
import type { MidiData } from '@/utils/midi'
import type Playback from '@/utils/Playback'

/** Blank time added before and after the song when files are loaded (ms). */
export const DEFAULT_PADDING = 3000

export const getMidiDuration = (midiData: MidiData | null) =>
  Math.max(
    0,
    ...(midiData?.tracks ?? []).flatMap(
      track => track.channels.flatMap(
        ch => ch.map(e => e.endEvent?.time ?? e.time),
      ),
    ),
  )

/** End of whichever is longer: the last MIDI note or the (offset) audio (ms). */
export const getLength = (midiData: MidiData | null, playback: Playback | null) =>
  Math.max(
    getMidiDuration(midiData),
    playback?.audioDuration ? playback.audioDuration + playback.audioOffset : 0,
  )

/** Resets the playback window to the loaded files plus the default padding. */
export const resetPlaybackRange = (midiData: MidiData | null, playback: Playback | null) => {
  const startTime = -DEFAULT_PADDING
  const endTime = getLength(midiData, playback) + DEFAULT_PADDING
  useConfigStore.getState().setConfig(c => ({
    ...c,
    playback: { ...c.playback, startTime, endTime },
  }))
  playback?.pause()
  playback?.seek(startTime)
}
