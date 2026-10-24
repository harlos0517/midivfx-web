import { useContext } from 'react'

import MidiFileContext from '@/context/MidiFileContext'
import { type Config } from '@/utils/config'

type PlaybackConfig = Config['playback']

const usePlaybackConfig = <T extends keyof PlaybackConfig>(key: T) => {
  const { config, setConfig } = useContext(MidiFileContext)

  const value: PlaybackConfig[T] = config.playback[key]

  const updateValue = (newValue: PlaybackConfig[T]) => {
    setConfig({
      ...config,
      playback: { ...config.playback, [key]: newValue },
    })
  }

  return [value, updateValue] as const
}

export default usePlaybackConfig
