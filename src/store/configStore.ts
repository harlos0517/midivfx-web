import { create } from 'zustand'

import { exampleConfig, type Config } from '@/utils/config'

interface ConfigStore {
  config: Config
  setConfig: (update: Config | ((config: Config) => Config)) => void
}

const useConfigStore = create<ConfigStore>(set => ({
  config: exampleConfig,
  setConfig: update => set(state => ({
    config: typeof update === 'function' ? update(state.config) : update,
  })),
}))

export default useConfigStore
