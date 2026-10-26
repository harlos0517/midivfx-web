import useConfigStore from '@/store/configStore'
import { type Config } from '@/utils/config'

type PlaybackConfig = Config['playback']

const usePlaybackConfig = <T extends keyof PlaybackConfig>(key: T) => {
  const value = useConfigStore(s => s.config.playback[key])
  const setConfig = useConfigStore(s => s.setConfig)

  const updateValue = (newValue: PlaybackConfig[T]) => {
    setConfig(c => ({
      ...c,
      playback: { ...c.playback, [key]: newValue },
    }))
  }

  return [value, updateValue] as const
}

export default usePlaybackConfig
