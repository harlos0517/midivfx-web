import useDisplayConfig from '@/hooks/useDisplayConfig'
import { NumberInput, Stack, Switch } from '@mantine/core'

const DisplayConfigPanel = () => {
  const [width, setWidth] = useDisplayConfig('width')
  const [height, setHeight] = useDisplayConfig('height')
  const [speed, setSpeed] = useDisplayConfig('speed')
  const [beat, setBeat] = useDisplayConfig('beat')

  return <Stack p="md" h="100%" style={{ overflowY: 'auto' }}>
    <NumberInput
      label="Display Width"
      value={width}
      onChange={v => setWidth(Number(v))}
    />
    <NumberInput
      label="Display Height"
      value={height}
      onChange={v => setHeight(Number(v))}
    />
    <NumberInput
      label="Display Speed"
      value={speed}
      onChange={v => setSpeed(Number(v))}
    />
    <Switch
      label="Beat"
      checked={beat}
      onChange={e => setBeat(e.currentTarget.checked)}
    />
  </Stack>
}

export default DisplayConfigPanel
