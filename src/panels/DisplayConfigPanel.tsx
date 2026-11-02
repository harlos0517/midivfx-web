
import { Switch } from '@mantine/core'
import {
  AngleIcon,
  ArrowsOutLineVerticalIcon,
  LightningIcon,
  MetronomeIcon,
  SunIcon,
} from '@phosphor-icons/react'

import ConfigOptionNumberInputRow from '@/components/ConfigOptionNumberInputRow'
import ConfigOptionRow from '@/components/ConfigOptionRow'
import PanelWrapper from '@/components/PanelWrapper'
import useDisplayConfig from '@/hooks/useDisplayConfig'
import { getNumberInputProps } from '@/utils/input'
import { roundTo } from '@/utils/round'

import HeightIcon from '@/assets/icons/height.svg?react'
import SpeedIcon from '@/assets/icons/speed.svg?react'
import WidthIcon from '@/assets/icons/width.svg?react'

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
    <ConfigOptionNumberInputRow
      label={<WidthIcon />}
      value={width}
      {...getNumberInputProps(640, 3840, 20, [1280, 1920, 2560], true)}
      onChange={setWidth}
    />
    <ConfigOptionNumberInputRow
      label={<HeightIcon />}
      value={height}
      {...getNumberInputProps(360, 2160, 20, [720, 1080, 1440], true)}
      onChange={setHeight}
    />
    <ConfigOptionNumberInputRow
      label={<SpeedIcon />}
      value={roundTo(unitsPerSecond, 2)}
      min={2} max={1024} step={1}
      onChange={v => setUnitsPerSecond(roundTo(v, 2))}
      sliderProps={{
        value: Math.log2(unitsPerSecond),
        onChange: v => setUnitsPerSecond(roundTo(2 ** v, 2)),
        min: 1, max: 10, step: 0.1,
        marks: [
          { value: 1, label: '2' },
          { value: 10, label: '1024' },
        ],
        label: v => `${roundTo(v, 2)}`,
        scale: v => roundTo(2 ** v, 2),
      }}
    />
    <ConfigOptionRow label={<MetronomeIcon />}>
      <Switch checked={beat}  onChange={e => setBeat(e.currentTarget.checked)} />
    </ConfigOptionRow>
    <ConfigOptionRow label={<SunIcon />}>
      <Switch checked={bloom} onChange={e => setBloom(e.currentTarget.checked)} />
    </ConfigOptionRow>
    {bloom && <>
      <ConfigOptionNumberInputRow
        label={<><SunIcon /><LightningIcon /></>}
        value={bloomIntensity}
        {...getNumberInputProps(0, 5, 0.1)}
        onChange={setBloomIntensity}
      />
      <ConfigOptionNumberInputRow
        label={<><SunIcon /><ArrowsOutLineVerticalIcon /></>}
        value={bloomThreshold}
        {...getNumberInputProps(0, 1, 0.01)}
        onChange={setBloomThreshold}
      />
      <ConfigOptionNumberInputRow
        label={<><SunIcon /><AngleIcon /></>}
        value={bloomRadius}
        {...getNumberInputProps(0, 1, 0.01)}
        onChange={setBloomRadius}
      />
    </>}
  </PanelWrapper>
}

export default DisplayConfigPanel
