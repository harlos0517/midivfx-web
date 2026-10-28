import {
  ActionIcon,
  ColorInput,
  Group,
  NumberInput,
  SegmentedControl,
  Slider,
  Switch,
  type ColorInputProps,
  type MantineStyleProps,
  type NumberInputProps,
  type SegmentedControlItem,
  type SegmentedControlProps,
  type SliderProps,
  type SwitchProps,
} from '@mantine/core'
import { useEffect, useRef, type ReactNode } from 'react'

import useStyleConfig from '@/hooks/useStyleConfig'
import { defaultStyleRuntime, type StyleConfig } from '@/utils/config'

interface CommonProps {
  label?: ReactNode
  wrapperProps?: MantineStyleProps
  id: string
  styleKey: Exclude<keyof StyleConfig, 'id' | 'order' | 'track' | 'channel' | 'isRegex' | 'remaps'>
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
  } = props

  const defaultValue = defaultStyleRuntime[styleKey]
  const [value, setValue, clearValue] = useStyleConfig(id, styleKey, true)
  const overrideValue = useRef<string | number | boolean>(value ?? defaultValue)
  const isOverride = value !== undefined

  useEffect(() => {
    if (value !== undefined) overrideValue.current = value
  }, [value])

  const triggerOverride = () => {
    if (isOverride) clearValue()
    else setValue(overrideValue.current)
  }

  return <Group gap="xs" wrap="nowrap" {...wrapperProps}>
    <ActionIcon
      onClick={triggerOverride}
      variant={isOverride ? 'filled' : 'subtle'}
      c={isOverride ? 'white' : '#666666'}
      size="lg"
    >
      {icon}
    </ActionIcon>
    {props.inputType === 'number' && <NumberInput
      flex={1}
      {...props.inputProps}
      disabled={!isOverride}
      value={value as number}
      onChange={v => setValue(typeof v === 'string' ? (parseFloat(v) || 0) : v)}
    />}
    {props.inputType === 'color' && <ColorInput
      flex={1}
      {...props.inputProps}
      disabled={!isOverride}
      value={value as string}
      onChange={setValue}
    />}
    {props.inputType === 'slider' && <Slider
      flex={1}
      {...props.inputProps}
      disabled={!isOverride}
      value={value as number}
      onChange={setValue}
    />}
    {props.inputType === 'switch' && <Switch
      flex={1}
      {...props.inputProps}
      disabled={!isOverride}
      checked={value as boolean}
      onChange={e => setValue(e.currentTarget.checked)}
    />}
    {props.inputType === 'segmented' && <SegmentedControl
      flex={1}
      {...props.inputProps}
      data={props.data}
      disabled={!isOverride}
      value={value as string}
      onChange={setValue}
    />}
  </Group>
}

export default OverridableInput
