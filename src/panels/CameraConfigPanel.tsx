import useCameraConfig from '@/hooks/useCameraConfig'
import { NumberInput, Stack } from '@mantine/core'

const CameraConfigPanel = () => {
  const [x, setX] = useCameraConfig('x')
  const [y, setY] = useCameraConfig('y')
  const [z, setZ] = useCameraConfig('z')
  const [targetX, setTargetX] = useCameraConfig('targetX')
  const [targetY, setTargetY] = useCameraConfig('targetY')

  return <Stack p="md" h="100%" style={{ overflowY: 'auto' }}>
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
  </Stack>
}

export default CameraConfigPanel
