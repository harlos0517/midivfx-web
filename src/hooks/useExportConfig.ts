import useConfigStore from '@/store/configStore'
import { type Config } from '@/utils/config'

type ExportConfig = Config['export']

const useExportConfig = <T extends keyof ExportConfig>(key: T) => {
  const value = useConfigStore(s => s.config.export[key])
  const setConfig = useConfigStore(s => s.setConfig)

  const updateValue = (newValue: ExportConfig[T]) => {
    setConfig(c => ({
      ...c,
      export: { ...c.export, [key]: newValue },
    }))
  }

  return [value, updateValue] as const
}

export default useExportConfig
