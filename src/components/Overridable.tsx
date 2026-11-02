import { Box } from '@mantine/core'

import styleIcons, { type OverridableStyleKey } from '@/components/styleIcons'
import useStyleConfig from '@/hooks/useStyleConfig'
import { DIMMED } from '@/utils/const'

interface OverridableProps {
  id: string
  styleKey: OverridableStyleKey
}

const Overridable = (props: OverridableProps) => {
  const { id, styleKey } = props

  const [value] = useStyleConfig(id, styleKey, true)
  const isOverride = value !== undefined
  const icon = styleIcons[styleKey]

  return <Box c={isOverride ? 'white' : DIMMED}>{icon}</Box>
}

export default Overridable
