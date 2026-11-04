import { createContext } from 'react'
import type { Texture } from 'three'

import type { AudioPeaks } from '@/utils/audio'
import type { MidiData } from '@/utils/midi'
import Playback from '@/utils/Playback'

export interface BackgroundImage {
  file: File
  texture: Texture
  width: number
  height: number
}

interface MidiFileContextProps {
  midiData: MidiData | null
  setMidiData: (data: MidiData | null) => void
  audioPeaks: AudioPeaks | null
  setAudioPeaks: (peaks: AudioPeaks | null) => void
  playback: Playback | null
  /** Not persisted, like the MIDI and audio: an image would overflow `localStorage`. */
  backgroundImage: BackgroundImage | null
  setBackgroundImage: (image: BackgroundImage | null) => void
}

const MidiFileContext = createContext<MidiFileContextProps>({
  midiData: null,
  setMidiData: () => {},
  audioPeaks: null,
  setAudioPeaks: () => {},
  playback: null,
  backgroundImage: null,
  setBackgroundImage: () => {},
})

export default MidiFileContext
