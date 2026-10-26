import { Box } from '@mantine/core'
import { useShallow } from 'zustand/react/shallow'

import StyleConfigBox from '@/components/StyleConfigBox'
import useConfigStore from '@/store/configStore'

const StylesConfigPanel = () => {
  const ids = useConfigStore(useShallow(s => s.config.styles.map(style => style.id)))

  return <Box p="md" h="100%" style={{ overflowY: 'auto' }}>
    {ids.map(id => <StyleConfigBox key={id} id={id} />)}
  </Box>
}

export default StylesConfigPanel
