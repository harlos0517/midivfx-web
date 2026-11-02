import ConfigOptionRow from '@/components/ConfigOptionRow'
import OptionTooltip from '@/components/OptionTooltip'
import type { Tip } from '@/i18n/en'
import { useMessages } from '@/store/localeStore'
import {
  ActionIcon,
  Box,
  NumberInput,
  Slider,
  type NumberInputProps,
  type SliderProps,
} from '@mantine/core'
import { useState, type ReactNode } from 'react'

interface ConfigOptionNumberInputProps extends Omit<NumberInputProps, 'onChange'> {
  label?: ReactNode
  tooltip: Tip
  withSlider?: boolean
  sliderProps?: SliderProps
  onChange?: (value: number) => void
  emptyValue?: number
}

const ConfigOptionNumberInput = (props: ConfigOptionNumberInputProps) => {
  const {
    label,
    tooltip,
    sliderProps,
    withSlider = true,
    onChange = ((() => {}) as (value: number) => void),
    emptyValue = 0,
    ...inputProps
  } = props

  const m = useMessages()
  const [showSlider, setShowSlider] = useState(false)

  const rowLabel = withSlider ? <ActionIcon
    w="auto"
    variant="subtle"
    aria-label={tooltip.name}
    onClick={() => setShowSlider(!showSlider)}
  >
    {label}
  </ActionIcon> : <Box m="3px">{label}</Box>

  return <ConfigOptionRow
    label={<OptionTooltip tip={tooltip} hint={withSlider ? m.hints.toggleSlider : undefined}>
      {rowLabel}
    </OptionTooltip>}
  >
    {withSlider && showSlider
      ? <Slider flex={1}
        value={Number(inputProps.value)}
        onChange={onChange}
        thumbLabel={tooltip.name}
        {...sliderProps}
      />
      : <NumberInput flex={1} {...inputProps}
        aria-label={tooltip.name}
        onChange={v => onChange?.(v === '' ? emptyValue : Number(v))}
      />
    }
  </ConfigOptionRow>
}

export default ConfigOptionNumberInput
