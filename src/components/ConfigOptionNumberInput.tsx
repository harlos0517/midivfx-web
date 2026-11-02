import {
  ActionIcon,
  Box,
  Group,
  NumberInput,
  Slider,
  Tooltip,
  type NumberInputProps,
  type SliderProps,
} from '@mantine/core'
import { useState, type ReactNode } from 'react'

interface ConfigOptionNumberInputProps extends NumberInputProps {
  label?: ReactNode
  tooltip?: ReactNode
  withSlider?: boolean
  sliderProps?: SliderProps
}

const ConfigOptionNumberInput = (props: ConfigOptionNumberInputProps) => {
  const { label, tooltip, sliderProps, withSlider = true, ...inputProps } = props

  const [showSlider, setShowSlider] = useState(false)

  const withTooltip = tooltip ? <Tooltip label={tooltip}>{label}</Tooltip> : label

  return <Group wrap="nowrap" gap="xs">
    {withSlider ? <ActionIcon
      w="auto"
      variant="subtle"
      onClick={() => setShowSlider(!showSlider)}
    >
      {withTooltip}
    </ActionIcon> : <Box m="3px">{withTooltip}</Box>}
    {withSlider && showSlider
      ? <Slider flex={1}
        value={Number(inputProps.value)}
        onChange={value => inputProps.onChange?.(value.toString())}
        {...sliderProps}
      />
      : <NumberInput flex={1} {...inputProps} />
    }
  </Group>
}

export default ConfigOptionNumberInput
