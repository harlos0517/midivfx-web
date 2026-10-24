import { useContext } from 'react'

import MidiFileContext from '@/context/MidiFileContext'
import { type Config } from '@/utils/config'

type DisplayConfig = Config['display']

const useDisplayConfig = <T extends keyof DisplayConfig>(key: T) => {
  const { config, setConfig } = useContext(MidiFileContext)

  const value: DisplayConfig[T] = config.display[key]

  const updateValue = (newValue: DisplayConfig[T]) => {
    setConfig({
      ...config,
      display: { ...config.display, [key]: newValue },
    })
  }

  return [value, updateValue] as const
}

export default useDisplayConfig
