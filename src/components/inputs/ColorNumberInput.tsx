import { ColorInput, type ColorInputProps } from '@mantine/core'
import type { ReactNode } from 'react'

import { input, inputWithPrepend } from '@/components/inputs/inputBoxStyle'

type StyledColorInputProps = ColorInputProps & {
  prepend?: ReactNode
}

const StyledColorInput = (props: StyledColorInputProps) => {
  const { prepend = false, ...inputProps } = props

  return <ColorInput
    {...inputProps}
    variant="filled"
    size="xs"
    withEyeDropper={false}
    styles={{
      input: {
        ...(prepend ? inputWithPrepend : input),
        padding: '0 0.5rem 0 1.75rem',
      },
    }}
  />
}

export default StyledColorInput
