import {
  ActionIcon,
  ColorInput,
  Group,
  NumberInput,
  SegmentedControl,
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

import useStyleConfig from '@/hooks/useStyleConfig'
import { defaultStyleRuntime, type StyleConfig } from '@/utils/config'

import classes from './OverridableInput.module.sass'

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
  }

  const actionIcon = <ActionIcon
    onClick={triggerOverride}
    variant={isOverride ? 'filled' : 'default'}
    c={isOverride ? 'white' : '#666666'}
  >
    {icon}
  </ActionIcon>

  return <Group
    className={classes['joined']}
    gap={withBox ? '0' : 'xs'}
    wrap="nowrap"
    {...wrapperProps}
  >
    {tooltip ? <Tooltip label={tooltip}>{actionIcon}</Tooltip> : actionIcon}
    {props.inputType === 'number' && <NumberInput
      {...commonProps}
      {...props.inputProps}
      value={value as number}
      onChange={v => setValue(typeof v === 'string' ? (parseFloat(v) || 0) : v)}
    />}
    {props.inputType === 'color' && <ColorInput
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
    />}
    {props.inputType === 'switch' && <Switch
      {...commonProps}
      {...props.inputProps}
      checked={value as boolean}
      onChange={e => setValue(e.currentTarget.checked)}
    />}
    {props.inputType === 'segmented' && <SegmentedControl
      {...commonProps}
      {...props.inputProps}
      data={props.data}
      value={value as string}
      onChange={setValue}
    />}
  </Group>
}

export default OverridableInput
