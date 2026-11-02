import type { CSSProperties } from '@mantine/core'

export const input: CSSProperties = {
  padding: '0 4px',
  lineHeight: '1rem',
  height: '2rem',
  borderTopLeftRadius: '4px',
  borderBottomLeftRadius: '4px',
  borderTopRightRadius: '4px',
  borderBottomRightRadius: '4px',
  fontSize: '1rem',
}

export const inputWithPrepend: CSSProperties = {
  ...input,
  borderTopLeftRadius: '0',
  borderBottomLeftRadius: '0',
  borderLeft: 'none',
}

export const control: CSSProperties = {
  '--ni-chevron-size': '1rem',
}
