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
import { useEffect, useRef } from 'react'

import OptionTooltip from '@/components/OptionTooltip'
import styleIcons, { type OverridableStyleKey } from '@/components/styleIcons'
import useStyleConfig from '@/hooks/useStyleConfig'
import { useMessages } from '@/store/localeStore'
import { defaultStyleRuntime } from '@/utils/config'
import { DIMMED } from '@/utils/const'

import classes from './OverridableInput.module.sass'

interface CommonProps {
  wrapperProps?: MantineStyleProps
  id: string
  styleKey: OverridableStyleKey
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
    wrapperProps = {},
    id,
    styleKey,
  } = props

  const m = useMessages()
  const tip = m.style.options[styleKey]
  const defaultValue = defaultStyleRuntime[styleKey]
  const [value, setValue, clearValue] = useStyleConfig(id, styleKey, true)
  const overrideValue = useRef<string | number | boolean>(value ?? defaultValue)
  const isOverride = value !== undefined || id === 'default'
  const withBox = ['number', 'color', 'segmented'].includes(props.inputType)
  const icon = styleIcons[styleKey]

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
    'aria-label': tip.name,
  }

  return <Group
    className={withBox ? classes['joined'] : undefined}
    gap={withBox ? '0' : 'xs'}
    {...wrapperProps}
  >
    <OptionTooltip tip={tip} hint={id === 'default' ? undefined : m.hints.toggleOverride}>
      <ActionIcon
        onClick={triggerOverride}
        variant={isOverride ? 'filled' : 'default'}
        c={isOverride ? 'white' : DIMMED}
        aria-label={tip.name}
        aria-pressed={isOverride}
      >
        {icon}
      </ActionIcon>
    </OptionTooltip>
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
      thumbLabel={tip.name}
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
