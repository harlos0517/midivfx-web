import { createContext } from 'react'

import type { MidiData } from '@/utils/midi'
import Playback from '@/utils/Playback'

interface MidiFileContextProps {
  midiData: MidiData | null
  setMidiData: (data: MidiData | null) => void
  playback: Playback | null
}

const MidiFileContext = createContext<MidiFileContextProps>({
  midiData: null,
  setMidiData: () => {},
  playback: null,
})

export default MidiFileContext
