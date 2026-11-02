import {
  Group,
  Switch,
  Tooltip,
  type SwitchProps,
} from '@mantine/core'
import { type ReactNode } from 'react'

interface ConfigOptionSwitchProps extends SwitchProps {
  label?: ReactNode
  tooltip?: ReactNode
}

const ConfigOptionSwitch = (props: ConfigOptionSwitchProps) => {
  const { label, tooltip, ...inputProps } = props

  return <Group wrap="nowrap" gap="xs">
    {tooltip ? <Tooltip label={tooltip}>{label}</Tooltip> : label}
    <Switch flex={1} {...inputProps} />
  </Group>
}

export default ConfigOptionSwitch
