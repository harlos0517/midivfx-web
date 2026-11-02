import {
  Group,
  Slider,
  Switch,
  Tooltip,
  type ColorInputProps,
  type MantineStyleProps,
  type NumberInputProps,
  type SegmentedControlItem,
  type SegmentedControlProps,
  type SliderProps,
  type SwitchProps,
} from '@mantine/core'
import { useEffect, useRef, type ReactNode } from 'react'

import StyledColorInput from '@/components/inputs/ColorNumberInput'
import StyledActionIcon from '@/components/inputs/StyledActionIcon'
import StyledNumberInput from '@/components/inputs/StyledNumberInput'
import StyledSegmentedControl from '@/components/inputs/StyledSegmentedControl'
import useStyleConfig from '@/hooks/useStyleConfig'
import { defaultStyleRuntime, type StyleConfig } from '@/utils/config'

interface CommonProps {
  label?: ReactNode
  wrapperProps?: MantineStyleProps
  id: string
  styleKey: Exclude<keyof StyleConfig, 'id' | 'order' | 'track' | 'channel' | 'isRegex' | 'remaps'>
  tooltip?: ReactNode
}

type OverridableInputProps = CommonProps & (
  | { inputType: 'number', inputProps?: NumberInputProps }
  | { inputType: 'color', inputProps?: ColorInputProps }
  | { inputType: 'slider', inputProps?: SliderProps }
  | { inputType: 'switch', inputProps?: SwitchProps }
  | {
    inputType: 'segmented'
    inputProps?: Omit<SegmentedControlProps, 'data'>
    data: SegmentedControlItem<string>[]
  }
)

const OverridableInput = (props: OverridableInputProps) => {
  const {
    label: icon,
    wrapperProps = {},
    id,
    styleKey,
    tooltip,
  } = props

  const defaultValue = defaultStyleRuntime[styleKey]
  const [value, setValue, clearValue] = useStyleConfig(id, styleKey, true)
  const overrideValue = useRef<string | number | boolean>(value ?? defaultValue)
  const isOverride = value !== undefined || id === 'default'
  const withBox = ['number', 'color', 'segmented'].includes(props.inputType)

  useEffect(() => {
    if (value !== undefined) overrideValue.current = value
  }, [value])

  const triggerOverride = () => {
    if (isOverride && id !== 'default') clearValue()
    else setValue(overrideValue.current)
  }

  const commonProps = {
    flex: 1,
    disabled: !isOverride,
    prepend: withBox,
  }

  const actionIcon = <StyledActionIcon
    append={withBox}
    onClick={triggerOverride}
    variant={isOverride ? 'filled' : 'default'}
    c={isOverride ? 'white' : '#666666'}
  >
    {icon}
  </StyledActionIcon>

  return <Group gap={withBox ? '0' : 'xs'} wrap="nowrap" {...wrapperProps}>
    {tooltip ? <Tooltip label={tooltip}>{actionIcon}</Tooltip> : actionIcon}
    {props.inputType === 'number' && <StyledNumberInput
      {...commonProps}
      {...props.inputProps}
      value={value as number}
      onChange={v => setValue(typeof v === 'string' ? (parseFloat(v) || 0) : v)}
    />}
    {props.inputType === 'color' && <StyledColorInput
      {...commonProps}
      {...props.inputProps}
      value={value as string}
      onChange={setValue}
    />}
    {props.inputType === 'slider' && <Slider
      {...commonProps}
      {...props.inputProps}
      value={value as number}
      onChange={setValue}
      styles={{ markLabel: { fontSize: '8px' } }}
    />}
    {props.inputType === 'switch' && <Switch
      {...commonProps}
      {...props.inputProps}
      checked={value as boolean}
      onChange={e => setValue(e.currentTarget.checked)}
    />}
    {props.inputType === 'segmented' && <StyledSegmentedControl
      {...commonProps}
      {...props.inputProps}
      data={props.data}
      value={value as string}
      onChange={setValue}
    />}
  </Group>
}

export default OverridableInput
