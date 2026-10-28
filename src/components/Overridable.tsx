import { Box } from '@mantine/core'
import { useEffect, useRef, type ReactNode } from 'react'

import useStyleConfig from '@/hooks/useStyleConfig'
import { defaultStyleRuntime, type StyleConfig } from '@/utils/config'

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

  const defaultValue = defaultStyleRuntime[styleKey]
  const [value] = useStyleConfig(id, styleKey, true)
  const overrideValue = useRef<string | number | boolean>(value ?? defaultValue)
  const isOverride = value !== undefined

  useEffect(() => {
    if (value !== undefined) overrideValue.current = value
  }, [value])


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
