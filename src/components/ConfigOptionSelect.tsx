import {
  Group,
  Select,
  Tooltip,
  type SelectProps,
} from '@mantine/core'
import { type ReactNode } from 'react'

interface ConfigOptionSelectProps extends SelectProps {
  label?: ReactNode
  tooltip?: ReactNode
}

const ConfigOptionSelect = (props: ConfigOptionSelectProps) => {
  const { label, tooltip, ...inputProps } = props

  return <Group wrap="nowrap" gap="xs">
    {tooltip ? <Tooltip label={tooltip}>{label}</Tooltip> : label}
    <Select flex={1} {...inputProps} />
  </Group>
}

export default ConfigOptionSelect
