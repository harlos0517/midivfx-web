import { Select, type SelectProps } from '@mantine/core'
import type { ReactNode } from 'react'

import { input, inputWithPrepend } from '@/components/inputs/inputBoxStyle'

type StyledSelectProps = SelectProps & {
  prepend?: ReactNode
}

const StyledSelect = (props: StyledSelectProps) => {
  const { prepend = false, ...inputProps } = props

  return <Select
    {...inputProps}
    variant="filled"
    size="xs"
    styles={{ input: prepend ? inputWithPrepend : input }}
  />
}

export default StyledSelect
