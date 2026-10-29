import { create } from 'zustand'

import { defaultConfig, type Config } from '@/utils/config'

interface ConfigStore {
  config: Config
  setConfig: (update: Config | ((config: Config) => Config)) => void
}

const useConfigStore = create<ConfigStore>(set => ({
  config: (() => {
    try {
      const saved = localStorage.getItem('config')
      if (saved) return { ...defaultConfig, ...JSON.parse(saved) }
    } catch {
      // corrupted JSON or storage unavailable: fall back to defaults
    }
    return defaultConfig
  })(),
  setConfig: update => set(state => {
    const newConfig = typeof update === 'function' ? update(state.config) : update
    localStorage.setItem('config', JSON.stringify(newConfig))
    return { config: newConfig }
  }),
}))

export default useConfigStore
