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
      if (saved) {
        // Merge each section so options added since the config was saved get their defaults
        const parsed = JSON.parse(saved) as Partial<Config>
        return {
          ...defaultConfig,
          ...parsed,
          playback: { ...defaultConfig.playback, ...parsed.playback },
          export: { ...defaultConfig.export, ...parsed.export },
          camera: { ...defaultConfig.camera, ...parsed.camera },
          display: { ...defaultConfig.display, ...parsed.display },
        }
      }
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
