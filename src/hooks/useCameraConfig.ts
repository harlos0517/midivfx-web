import { useContext } from 'react'

import MidiFileContext from '@/context/MidiFileContext'
import { type Config } from '@/utils/config'

type CameraConfig = Config['camera']

const useCameraConfig = <T extends keyof CameraConfig>(key: T) => {
  const { config, setConfig } = useContext(MidiFileContext)

  const value: CameraConfig[T] = config.camera[key]

  const updateValue = (newValue: CameraConfig[T]) => {
    setConfig({
      ...config,
      camera: { ...config.camera, [key]: newValue },
    })
  }

  return [value, updateValue] as const
}

export default useCameraConfig
