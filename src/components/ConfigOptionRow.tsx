import { Box, Group } from '@mantine/core'
import { type ReactNode } from 'react'

import OptionTooltip from '@/components/OptionTooltip'
import type { Tip } from '@/i18n/en'

interface ConfigOptionRowProps {
  label?: ReactNode
  tooltip?: Tip
  children?: ReactNode
}

const ConfigOptionRow = (props: ConfigOptionRowProps) => {
  const { label, tooltip, children } = props

  return <Group>
    {tooltip ? <OptionTooltip tip={tooltip}>
      <Box component="span" display="flex">{label}</Box>
    </OptionTooltip> : label}
    {children}
  </Group>
}

export default ConfigOptionRow
