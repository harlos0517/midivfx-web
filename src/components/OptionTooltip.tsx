import { Text, Tooltip } from '@mantine/core'
import type { ReactElement } from 'react'

import type { Tip } from '@/i18n/en'

interface OptionTooltipProps {
  tip: Tip
  /** How to use the control, shown apart from what the option means. */
  hint?: string | undefined
  disabled?: boolean
  children: ReactElement
}

const OptionTooltip = ({ tip, hint, disabled = false, children }: OptionTooltipProps) =>
  <Tooltip
    disabled={disabled}
    label={<>
      <Text size="xs" fw={700}>{tip.name}</Text>
      <Text size="xs">{tip.desc}</Text>
      {hint && <Text size="xs" mt={4} opacity={0.7}>{hint}</Text>}
    </>}
  >
    {children}
  </Tooltip>

export default OptionTooltip
