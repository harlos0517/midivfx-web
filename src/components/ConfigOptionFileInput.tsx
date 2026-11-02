import {
  FileInput,
  Group,
  Tooltip,
  type FileInputProps,
} from '@mantine/core'
import { type ReactNode } from 'react'

import { input } from '@/components/inputs/inputBoxStyle'

interface ConfigOptionFileInputProps extends FileInputProps {
  label?: ReactNode
  tooltip?: ReactNode
}

const ConfigOptionFileInput = (props: ConfigOptionFileInputProps) => {
  const { label, tooltip, ...inputProps } = props

  return <Group wrap="nowrap" gap="xs">
    {tooltip ? <Tooltip label={tooltip}>{label}</Tooltip> : label}
    <FileInput flex={1} {...inputProps}
      variant="filled"
      size="xs" maw="calc(100% - 24px - .5rem)"
      styles={{ input }}
    />
  </Group>
}

export default ConfigOptionFileInput
