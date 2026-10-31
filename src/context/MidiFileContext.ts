import { createContext } from 'react'

import type { AudioPeaks } from '@/utils/audio'
import type { MidiData } from '@/utils/midi'
import Playback from '@/utils/Playback'

interface MidiFileContextProps {
  midiData: MidiData | null
  setMidiData: (data: MidiData | null) => void
  audioPeaks: AudioPeaks | null
  setAudioPeaks: (peaks: AudioPeaks | null) => void
  playback: Playback | null
}

const MidiFileContext = createContext<MidiFileContextProps>({
  midiData: null,
  setMidiData: () => {},
  audioPeaks: null,
  setAudioPeaks: () => {},
  playback: null,
})

export default MidiFileContext
