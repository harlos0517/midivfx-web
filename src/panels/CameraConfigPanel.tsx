import { NumberInput } from '@mantine/core'

import PanelWrapper from '@/components/PanelWrapper'
import useCameraConfig from '@/hooks/useCameraConfig'

const CameraConfigPanel = () => {
  const [x, setX] = useCameraConfig('x')
  const [y, setY] = useCameraConfig('y')
  const [z, setZ] = useCameraConfig('z')
  const [targetX, setTargetX] = useCameraConfig('targetX')
  const [targetY, setTargetY] = useCameraConfig('targetY')
  const [targetZ, setTargetZ] = useCameraConfig('targetZ')

  return <PanelWrapper>
    <NumberInput
      label="Camera X"
      value={x}
      onChange={v => setX(Number(v))}
    />
    <NumberInput
      label="Camera Y"
      value={y}
      onChange={v => setY(Number(v))}
    />
    <NumberInput
      label="Camera Z"
      value={z}
      onChange={v => setZ(Number(v))}
    />
    <NumberInput
      label="Camera Target X"
      value={targetX}
      onChange={v => setTargetX(Number(v))}
    />
    <NumberInput
      label="Camera Target Y"
      value={targetY}
      onChange={v => setTargetY(Number(v))}
    />
    <NumberInput
      label="Camera Target Z"
      value={targetZ}
      onChange={v => setTargetZ(Number(v))}
    />
  </PanelWrapper>
}

export default CameraConfigPanel
