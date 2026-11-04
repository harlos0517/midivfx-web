
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
import { useMessages } from '@/store/localeStore'
import { getNumberInputProps } from '@/utils/input'
import { roundTo } from '@/utils/round'

import SpeedIcon from '@/assets/icons/speed.svg?react'

const DisplayConfigPanel = () => {
  const m = useMessages()
  const [unitsPerSecond, setUnitsPerSecond] = useDisplayConfig('unitsPerSecond')
  const [beat, setBeat] = useDisplayConfig('beat')
  const [bloom, setBloom] = useDisplayConfig('bloom')
  const [bloomIntensity, setBloomIntensity] = useDisplayConfig('bloomIntensity')
  const [bloomThreshold, setBloomThreshold] = useDisplayConfig('bloomThreshold')
  const [bloomRadius, setBloomRadius] = useDisplayConfig('bloomRadius')

  return <PanelWrapper>
    <ConfigOptionNumberInputRow
      label={<SpeedIcon />}
      tooltip={m.display.speed}
      value={roundTo(unitsPerSecond, 2)}
      min={2} max={1024} step={1}
      onChange={v => setUnitsPerSecond(roundTo(v, 2))}
      rightSection="units/s"
      rightSectionWidth={80}
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
    <ConfigOptionRow label={<MetronomeIcon />} tooltip={m.display.beat}>
      <Switch
        aria-label={m.display.beat.name}
        checked={beat}
        onChange={e => setBeat(e.currentTarget.checked)}
      />
    </ConfigOptionRow>
    <ConfigOptionRow label={<SunIcon />} tooltip={m.display.bloom}>
      <Switch
        aria-label={m.display.bloom.name}
        checked={bloom}
        onChange={e => setBloom(e.currentTarget.checked)}
      />
    </ConfigOptionRow>
    {bloom && <>
      <ConfigOptionNumberInputRow
        label={<><SunIcon /><LightningIcon /></>}
        tooltip={m.display.bloomIntensity}
        value={bloomIntensity}
        {...getNumberInputProps(0, 5, 0.1)}
        onChange={setBloomIntensity}
      />
      <ConfigOptionNumberInputRow
        label={<><SunIcon /><ArrowsOutLineVerticalIcon /></>}
        tooltip={m.display.bloomThreshold}
        value={bloomThreshold}
        {...getNumberInputProps(0, 1, 0.01)}
        onChange={setBloomThreshold}
      />
      <ConfigOptionNumberInputRow
        label={<><SunIcon /><AngleIcon /></>}
        tooltip={m.display.bloomRadius}
        value={bloomRadius}
        {...getNumberInputProps(0, 1, 0.01)}
        onChange={setBloomRadius}
      />
    </>}
  </PanelWrapper>
}

export default DisplayConfigPanel
