import useConfigStore from '@/store/configStore'
import { type Config } from '@/utils/config'

type CameraConfig = Config['camera']

const useCameraConfig = <T extends keyof CameraConfig>(key: T) => {
  const value = useConfigStore(s => s.config.camera[key])
  const setConfig = useConfigStore(s => s.setConfig)

  const updateValue = (newValue: CameraConfig[T]) => {
    setConfig(c => ({
      ...c,
      camera: { ...c.camera, [key]: newValue },
    }))
  }

  return [value, updateValue] as const
}

export default useCameraConfig
