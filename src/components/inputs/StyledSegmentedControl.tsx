import { SegmentedControl, type SegmentedControlProps } from '@mantine/core'
import type { ReactNode } from 'react'

import { input, inputWithPrepend } from '@/components/inputs/inputBoxStyle'

type StyledSegmentedControlProps = SegmentedControlProps & {
  prepend?: ReactNode
}

const StyledSegmentedControl = (props: StyledSegmentedControlProps) => {
  const { prepend = false, ...inputProps } = props

  return <SegmentedControl
    {...inputProps}
    variant="filled"
    size="xs"
    styles={{
      label: { padding: '3px 4px' },
    }}
    style={{
      ...(prepend ? inputWithPrepend : input),
      padding: '0',
    }}
  />
}

export default StyledSegmentedControl
