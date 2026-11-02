import {
  Box,
  Group,
  Slider,
  Tooltip,
  type NumberInputProps,
  type SliderProps,
} from '@mantine/core'
import { useState, type ReactNode } from 'react'

import StyledActionIcon from '@/components/inputs/StyledActionIcon'
import StyledNumberInput from '@/components/inputs/StyledNumberInput'

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
    {withSlider ? <StyledActionIcon
      w="auto"
      variant="subtle"
      onClick={() => setShowSlider(!showSlider)}
    >
      {withTooltip}
    </StyledActionIcon> : <Box m="3px">{withTooltip}</Box>}
    {withSlider && showSlider
      ? <Slider flex={1}
        value={Number(inputProps.value)}
        onChange={value => inputProps.onChange?.(value.toString())}
        {...sliderProps}
      />
      : <StyledNumberInput flex={1} {...inputProps} />
    }
  </Group>
}

export default ConfigOptionNumberInput
