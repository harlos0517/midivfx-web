import useConfigStore from '@/store/configStore'
import { type Config } from '@/utils/config'

type DisplayConfig = Config['display']

const useDisplayConfig = <T extends keyof DisplayConfig>(key: T) => {
  const value = useConfigStore(s => s.config.display[key])
  const setConfig = useConfigStore(s => s.setConfig)

  const updateValue = (newValue: DisplayConfig[T]) => {
    setConfig(c => ({
      ...c,
      display: { ...c.display, [key]: newValue },
    }))
  }

  return [value, updateValue] as const
}

export default useDisplayConfig
