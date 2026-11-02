import ConfigOptionNumberInputRow from '@/components/ConfigOptionNumberInputRow'
import PanelWrapper from '@/components/PanelWrapper'
import useDisplayConfig from '@/hooks/useDisplayConfig'

import HeightIcon from '@/assets/icons/height.svg?react'
import SpeedIcon from '@/assets/icons/speed.svg?react'
import WidthIcon from '@/assets/icons/width.svg?react'
import ConfigOptionRow from '@/components/ConfigOptionRow'
import { roundTo } from '@/utils/round'
import { Switch } from '@mantine/core'
import {
  AngleIcon,
  ArrowsOutLineVerticalIcon,
  LightningIcon,
  MetronomeIcon,
  SunIcon,
} from '@phosphor-icons/react'

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
      max={3840}
      min={640}
      step={20}
      onChange={v => setWidth(Number(v))}
      sliderProps={{ min: 640, max: 3840, step: 20, marks: [
        { value: 640, label: '640' },
        { value: 1280, label: '1280' },
        { value: 1920, label: '1920' },
        { value: 2560, label: '2560' },
        { value: 3840, label: '3840' },
      ], restrictToMarks: true }}
    />
    <ConfigOptionNumberInputRow
      label={<HeightIcon />}
      value={height}
      max={2160}
      min={360}
      step={20}
      onChange={v => setHeight(Number(v))}
      sliderProps={{ min: 360, max: 2160, step: 20, marks: [
        { value: 360, label: '360' },
        { value: 720, label: '720' },
        { value: 1080, label: '1080' },
        { value: 1440, label: '1440' },
        { value: 2160, label: '2160' },
      ], restrictToMarks: true }}
    />
    <ConfigOptionNumberInputRow
      label={<SpeedIcon />}
      value={roundTo(unitsPerSecond, 2)}
      min={2}
      max={1024}
      step={1}
      onChange={v => setUnitsPerSecond(roundTo(Number(v), 2))}
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
        min={0}
        step={0.1}
        onChange={v => setBloomIntensity(Number(v))}
        sliderProps={{ min: 0, max: 5, step: 0.1 }}
      />
      <ConfigOptionNumberInputRow
        label={<><SunIcon /><ArrowsOutLineVerticalIcon /></>}
        value={bloomThreshold}
        min={0}
        max={1}
        step={0.01}
        onChange={v => setBloomThreshold(Number(v))}
        sliderProps={{ min: 0, max: 1, step: 0.01 }}
      />
      <ConfigOptionNumberInputRow
        label={<><SunIcon /><AngleIcon /></>}
        value={bloomRadius}
        min={0}
        max={1}
        step={0.01}
        onChange={v => setBloomRadius(Number(v))}
        sliderProps={{ min: 0, max: 1, step: 0.01 }}
      />
    </>}
  </PanelWrapper>
}

export default DisplayConfigPanel
