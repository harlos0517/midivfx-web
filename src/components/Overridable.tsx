import { Box } from '@mantine/core'

import OptionTooltip from '@/components/OptionTooltip'
import styleIcons, { type OverridableStyleKey } from '@/components/styleIcons'
import useStyleConfig from '@/hooks/useStyleConfig'
import { useMessages } from '@/store/localeStore'
import { DIMMED } from '@/utils/const'

interface OverridableProps {
  id: string
  styleKey: OverridableStyleKey
}

const Overridable = (props: OverridableProps) => {
  const { id, styleKey } = props

  const m = useMessages()
  const [value] = useStyleConfig(id, styleKey, true)
  const isOverride = value !== undefined
  const icon = styleIcons[styleKey]

  return <OptionTooltip tip={m.style.options[styleKey]}>
    <Box c={isOverride ? 'white' : DIMMED}>{icon}</Box>
  </OptionTooltip>
}

export default Overridable
