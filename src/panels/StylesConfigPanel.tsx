import { Box } from '@mantine/core'
import { useContext } from 'react'

import StyleConfigBox from '@/components/StyleConfigBox'
import MidiFileContext from '@/context/MidiFileContext'

const StylesConfigPanel = () => {
  const { config } = useContext(MidiFileContext)
  const { styles } = config

  return <Box p="md" h="100%" style={{ overflowY: 'auto' }}>
    {styles.map(s => <StyleConfigBox key={s.id || ''} id={s.id || ''} />)}
  </Box>
}

export default StylesConfigPanel
