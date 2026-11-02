import { Box } from '@mantine/core'

import styleIcons, { type OverridableKey } from '@/components/styleIcons'
import useStyleConfig from '@/hooks/useStyleConfig'

interface OverridableProps {
  id: string
  styleKey: OverridableKey
}

const Overridable = (props: OverridableProps) => {
  const { id, styleKey } = props

  const [value] = useStyleConfig(id, styleKey, true)
  const isOverride = value !== undefined
  const icon = styleIcons[styleKey]

  return <Box c={isOverride ? 'white' : '#666666'}>{icon}</Box>
}

export default Overridable
