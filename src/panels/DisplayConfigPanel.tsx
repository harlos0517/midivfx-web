import { ColorInput, Select, Switch } from '@mantine/core'
import {
  AngleIcon,
  ArrowsOutLineVerticalIcon,
  DropHalfIcon,
  FrameCornersIcon,
  LightningIcon,
  MetronomeIcon,
  PaintBucketIcon,
  SunIcon,
} from '@phosphor-icons/react'
import { useContext } from 'react'

import ConfigOptionNumberInputRow from '@/components/ConfigOptionNumberInputRow'
import ConfigOptionRow from '@/components/ConfigOptionRow'
import PanelWrapper from '@/components/PanelWrapper'
import MidiFileContext from '@/context/MidiFileContext'
import useDisplayConfig from '@/hooks/useDisplayConfig'
import useConfigStore from '@/store/configStore'
import { useMessages } from '@/store/localeStore'
import type { BackgroundSize } from '@/utils/config'
import { getNumberInputProps } from '@/utils/input'
import { roundTo } from '@/utils/round'

import SpeedIcon from '@/assets/icons/speed.svg?react'

const backgroundSizes: BackgroundSize[] = ['contain', 'cover', 'stretch']
const opacityInputProps = getNumberInputProps(0, 1, 0.01)

const DisplayConfigPanel = () => {
  const m = useMessages()
  const [unitsPerSecond, setUnitsPerSecond] = useDisplayConfig('unitsPerSecond')
  const [beat, setBeat] = useDisplayConfig('beat')
  const [bloom, setBloom] = useDisplayConfig('bloom')
  const [bloomIntensity, setBloomIntensity] = useDisplayConfig('bloomIntensity')
  const [bloomThreshold, setBloomThreshold] = useDisplayConfig('bloomThreshold')
  const [bloomRadius, setBloomRadius] = useDisplayConfig('bloomRadius')
  const [backgroundColor, setBackgroundColor] = useDisplayConfig('backgroundColor')
  const [backgroundSize, setBackgroundSize] = useDisplayConfig('backgroundSize')
  const [backgroundOpacity, setBackgroundOpacity] = useDisplayConfig('backgroundOpacity')
  const alpha = useConfigStore(s => s.config.export.alpha)

  // The image is chosen in Import, since it is not saved; how it fits is part of the look
  const hasImage = useContext(MidiFileContext).backgroundImage !== null

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
    <ConfigOptionRow label={<PaintBucketIcon />} tooltip={m.display.backgroundColor}>
      <ColorInput
        flex="1"
        aria-label={m.display.backgroundColor.name}
        value={backgroundColor}
        onChange={setBackgroundColor}
        disabled={alpha}
      />
    </ConfigOptionRow>
    <ConfigOptionRow label={<FrameCornersIcon />} tooltip={m.display.backgroundSize}>
      <Select
        flex="1"
        aria-label={m.display.backgroundSize.name}
        value={backgroundSize}
        onChange={v => setBackgroundSize(v as BackgroundSize)}
        data={backgroundSizes.map(value => ({
          value, label: m.display.backgroundSizes[value],
        }))}
        allowDeselect={false}
        disabled={!hasImage}
      />
    </ConfigOptionRow>
    <ConfigOptionNumberInputRow
      label={<DropHalfIcon />}
      tooltip={m.display.backgroundOpacity}
      value={backgroundOpacity}
      {...opacityInputProps}
      sliderProps={{ ...opacityInputProps.sliderProps, disabled: !hasImage }}
      onChange={setBackgroundOpacity}
      disabled={!hasImage}
    />
  </PanelWrapper>
}

export default DisplayConfigPanel
