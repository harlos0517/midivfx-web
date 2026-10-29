import useConfigStore from '@/store/configStore'
import type { MidiData } from '@/utils/midi'
import type Playback from '@/utils/Playback'

/** Blank time added before and after the song when files are loaded (ms). */
export const DEFAULT_PADDING = 3000

/** End of the last MIDI event (ms). */
export const getMidiDuration = (midiData: MidiData | null) => {
  // A loop: spreading every event into Math.max overflows the call stack on large files
  let end = 0
  for (const track of midiData?.tracks ?? []) {
    for (const channel of track.channels)
      for (const e of channel) end = Math.max(end, e.endEvent?.time ?? e.time)
  }
  return end
}

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
