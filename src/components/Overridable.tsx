import { Box } from '@mantine/core'
import { type ReactNode } from 'react'

import useStyleConfig from '@/hooks/useStyleConfig'
import { type StyleConfig } from '@/utils/config'

interface OverridableProps {
  label?: ReactNode
  id: string
  styleKey: Exclude<keyof StyleConfig, 'id' | 'order' | 'track' | 'channel' | 'isRegex' | 'remaps'>
}

const Overridable = (props: OverridableProps) => {
  const {
    label: icon,
    id,
    styleKey,
  } = props

  const [value] = useStyleConfig(id, styleKey, true)
  const isOverride = value !== undefined

  return <Box
    variant="subtle"
    c={isOverride ? 'white' : '#666666'}
    size="lg"
    flex={1}
  >
    {icon}
  </Box>
}

export default Overridable
