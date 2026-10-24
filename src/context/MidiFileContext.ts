import { createContext } from 'react'

import { exampleConfig, type Config } from '@/utils/config'
import type { MidiData } from '@/utils/midi'
import Playback from '@/utils/Playback'

interface MidiFileContextProps {
  midiData: MidiData | null
  playback: Playback | null
  config: Config
}

const MidiFileContext = createContext<MidiFileContextProps>({
  midiData: null,
  playback: null,
  config: exampleConfig,
})

export default MidiFileContext
