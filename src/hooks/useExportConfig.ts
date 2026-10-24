import { useContext } from 'react'

import MidiFileContext from '@/context/MidiFileContext'
import { type Config } from '@/utils/config'

type ExportConfig = Config['export']

const useExportConfig = <T extends keyof ExportConfig>(key: T) => {
  const { config, setConfig } = useContext(MidiFileContext)

  const value: ExportConfig[T] = config.export[key]

  const updateValue = (newValue: ExportConfig[T]) => {
    setConfig({
      ...config,
      export: { ...config.export, [key]: newValue },
    })
  }

  return [value, updateValue] as const
}

export default useExportConfig
