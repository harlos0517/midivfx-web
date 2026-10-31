import { Overlay, Stack } from '@mantine/core'
import type { ReactNode } from 'react'

import { useIsExporting } from '@/store/exportStore'

interface PanelWrapperProps {
  children: ReactNode
  isExportPanel?: boolean
  withPadding?: boolean
}

const PanelWrapper = ({
  children,
  isExportPanel = false,
  withPadding = true,
}: PanelWrapperProps) => {
  const exporting = useIsExporting()

  return <Stack
    p={withPadding ? 'md' : 0} h="100%"
    pos="relative" style={{ overflowY: 'auto' }} gap="xs"
  >
    {children}
    {!isExportPanel && exporting && <Overlay color="#222" backgroundOpacity={0.75} />}
  </Stack>
}

export default PanelWrapper
