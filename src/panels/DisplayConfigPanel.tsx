import { NumberInput, Switch } from '@mantine/core'

import PanelWrapper from '@/components/PanelWrapper'
import useDisplayConfig from '@/hooks/useDisplayConfig'

const DisplayConfigPanel = () => {
  const [width, setWidth] = useDisplayConfig('width')
  const [height, setHeight] = useDisplayConfig('height')
  const [unitsPerSecond, setUnitsPerSecond] = useDisplayConfig('unitsPerSecond')
  const [beat, setBeat] = useDisplayConfig('beat')

  return <PanelWrapper>
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
      label="Speed (units/s)"
      description="1 unit = height of one pitch"
      value={unitsPerSecond}
      min={0.1}
      onChange={v => setUnitsPerSecond(Number(v))}
    />
    <Switch
      label="Beat"
      checked={beat}
      onChange={e => setBeat(e.currentTarget.checked)}
    />
  </PanelWrapper>
}

export default DisplayConfigPanel
