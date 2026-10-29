import { Overlay, Stack } from '@mantine/core'
import type { ReactNode } from 'react'

import { useIsExporting } from '@/store/exportStore'

interface PanelWrapperProps { children: ReactNode, isExportPanel?: boolean }

const PanelWrapper = ({ children, isExportPanel = false }: PanelWrapperProps) => {
  const exporting = useIsExporting()

  return <Stack p="md" h="100%" pos="relative" style={{ overflowY: 'auto' }} gap="xs">
    {children}
    {!isExportPanel && exporting && <Overlay color="#222" backgroundOpacity={0.75} />}
  </Stack>
}

export default PanelWrapper
