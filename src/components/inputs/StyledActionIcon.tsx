import { ActionIcon, type ActionIconProps } from '@mantine/core'
import type { ReactNode, Ref } from 'react'

type StyledActionIconProps = ActionIconProps & {
  append?: ReactNode
  onClick?: () => void
  ref?: Ref<HTMLButtonElement>
}

const StyledActionIcon = (props: StyledActionIconProps) => {
  const { append = false, onClick, ref, ...actionIconProps } = props

  return <ActionIcon
    {...actionIconProps}
    ref={ref}
    onClick={onClick}
    size="2rem"
    style={append ? {
      borderTopRightRadius: '0',
      borderBottomRightRadius: '0',
      borderTopLeftRadius: '4px',
      borderBottomLeftRadius: '4px',
    } : { borderRadius: '4px' }}
  />
}

export default StyledActionIcon
