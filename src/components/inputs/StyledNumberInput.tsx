import { NumberInput, type NumberInputProps } from '@mantine/core'
import type { ReactNode } from 'react'

import { control, input, inputWithPrepend } from '@/components/inputs/inputBoxStyle'

type StyledNumberInputProps = NumberInputProps & {
  prepend?: ReactNode
}

const StyledNumberInput = (props: StyledNumberInputProps) => {
  const { prepend = false, ...inputProps } = props

  return <NumberInput
    {...inputProps}
    variant="filled"
    size="xs"
    styles={{ input: prepend ? inputWithPrepend : input, control }}
  />
}

export default StyledNumberInput
