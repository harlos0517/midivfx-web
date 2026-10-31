import { NumberInput, Switch } from '@mantine/core'

import PanelWrapper from '@/components/PanelWrapper'
import useDisplayConfig from '@/hooks/useDisplayConfig'

const DisplayConfigPanel = () => {
  const [width, setWidth] = useDisplayConfig('width')
  const [height, setHeight] = useDisplayConfig('height')
  const [unitsPerSecond, setUnitsPerSecond] = useDisplayConfig('unitsPerSecond')
  const [beat, setBeat] = useDisplayConfig('beat')
  const [bloom, setBloom] = useDisplayConfig('bloom')
  const [bloomIntensity, setBloomIntensity] = useDisplayConfig('bloomIntensity')
  const [bloomThreshold, setBloomThreshold] = useDisplayConfig('bloomThreshold')
  const [bloomRadius, setBloomRadius] = useDisplayConfig('bloomRadius')

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
    <Switch
      label="Bloom"
      checked={bloom}
      onChange={e => setBloom(e.currentTarget.checked)}
    />
    {bloom && <>
      <NumberInput
        label="Bloom Intensity"
        value={bloomIntensity}
        min={0}
        step={0.1}
        onChange={v => setBloomIntensity(Number(v))}
      />
      <NumberInput
        label="Bloom Threshold"
        description="Minimum luminance that glows"
        value={bloomThreshold}
        min={0}
        max={1}
        step={0.05}
        onChange={v => setBloomThreshold(Number(v))}
      />
      <NumberInput
        label="Bloom Radius"
        value={bloomRadius}
        min={0}
        max={1}
        step={0.05}
        onChange={v => setBloomRadius(Number(v))}
      />
    </>}
  </PanelWrapper>
}

export default DisplayConfigPanel
