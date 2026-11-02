import { Group, Tooltip } from '@mantine/core'
import { type ReactNode } from 'react'

interface ConfigOptionRowProps {
  label?: ReactNode
  tooltip?: ReactNode
  children?: ReactNode
}

const ConfigOptionRow = (props: ConfigOptionRowProps) => {
  const { label, tooltip, children } = props

  return <Group>
    {tooltip ? <Tooltip label={tooltip}>{label}</Tooltip> : label}
    {children}
  </Group>
}

export default ConfigOptionRow
