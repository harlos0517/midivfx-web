import { useContext } from 'react'

import MidiFileContext from '@/context/MidiFileContext'
import { defaultConfig, type Config } from '@/utils/config'

const useConfig = <T>(
  get: (config: Config) => T,
  set: (config: Config, value: T) => void,
) => {
  const { config } = useContext(MidiFileContext)

  const value = get(config)

  const updateValue = (newValue: T | undefined) => {
    set(config, newValue || get(defaultConfig))
  }

  return [value, updateValue] as const
}

export default useConfig
