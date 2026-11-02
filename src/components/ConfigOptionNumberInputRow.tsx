import ConfigOptionRow from '@/components/ConfigOptionRow'
import {
  ActionIcon,
  Box,
  NumberInput,
  Slider,
  Tooltip,
  type NumberInputProps,
  type SliderProps,
} from '@mantine/core'
import { useState, type ReactNode } from 'react'

interface ConfigOptionNumberInputProps extends Omit<NumberInputProps, 'onChange'> {
  label?: ReactNode
  tooltip?: ReactNode
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

  const [showSlider, setShowSlider] = useState(false)

  const withTooltip = tooltip ? <Tooltip label={tooltip}>{label}</Tooltip> : label

  return <ConfigOptionRow
    label={withSlider ? <ActionIcon
      w="auto"
      variant="subtle"
      onClick={() => setShowSlider(!showSlider)}
    >
      {withTooltip}
    </ActionIcon> : <Box m="3px">{withTooltip}</Box>}
  >
    {withSlider && showSlider
      ? <Slider flex={1}
        value={Number(inputProps.value)}
        onChange={onChange}
        {...sliderProps}
      />
      : <NumberInput flex={1} {...inputProps}
        onChange={v => onChange?.(v === '' ? emptyValue : Number(v))}
      />
    }
  </ConfigOptionRow>
}

export default ConfigOptionNumberInput
