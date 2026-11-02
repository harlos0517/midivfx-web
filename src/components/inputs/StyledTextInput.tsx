import { TextInput, type TextInputProps } from '@mantine/core'
import type { ReactNode } from 'react'

import { input, inputWithPrepend } from '@/components/inputs/inputBoxStyle'

type StyledTextInputProps = TextInputProps & {
  prepend?: ReactNode
}

const StyledTextInput = (props: StyledTextInputProps) => {
  const { prepend = false, ...inputProps } = props

  return <TextInput
    {...inputProps}
    variant="filled"
    size="xs"
    styles={{ input: prepend ? inputWithPrepend : input }}
  />
}

export default StyledTextInput
