import useConfigStore from '@/store/configStore'
import { type Config } from '@/utils/config'

type ConfigKeys = 'playback' | 'export' | 'camera' | 'display'

const createSectionHook = <T extends ConfigKeys>(key: T) =>
  <U extends keyof Config[T]>(innerKey: U) => {
    const value = useConfigStore(s => s.config[key][innerKey])
    const setConfig = useConfigStore(s => s.setConfig)

    const updateValue = (newValue: Config[T][U]) => {
      setConfig(c => ({
        ...c,
        [key]: { ...c[key], [innerKey]: newValue },
      }))
    }

    return [value, updateValue] as const
  }

export default createSectionHook
