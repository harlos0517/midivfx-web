import { createContext } from 'react'

import { exampleConfig, type Config } from '@/utils/config'
import type { MidiData } from '@/utils/midi'
import Playback from '@/utils/Playback'

interface MidiFileContextProps {
  midiData: MidiData | null
  setMidiData: (data: MidiData | null) => void
  playback: Playback | null
  config: Config
  setConfig: (config: Config) => void
}

const MidiFileContext = createContext<MidiFileContextProps>({
  midiData: null,
  setMidiData: () => {},
  playback: null,
  config: exampleConfig,
  setConfig: () => {},
})

export default MidiFileContext
