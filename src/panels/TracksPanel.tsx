import { ActionIcon, Box, Center, Collapse, Group, Stack, Text } from '@mantine/core'
import { useDisclosure, useElementSize } from '@mantine/hooks'
import { CaretDownIcon } from '@phosphor-icons/react'
import { useContext } from 'react'

import MidiFileContext from '@/context/MidiFileContext'
import useStyle from '@/hooks/useStyle'
import { getTextColor } from '@/utils/colors'

interface ChannelBoxProps {
  trackName: string
  i: number
  channel: number
  width: number | string
}

const ChannelBox = ({ trackName, i, channel, width }: ChannelBoxProps) => {
  const style = useStyle(trackName, i, channel)
  const textColor = getTextColor(style.color)
  return <Center w={width}><Center
    w="2rem" h="2rem" bdrs="sm" bd={`solid 1px ${textColor}`}
    bg={style.color}
    c={textColor}
  >{channel}</Center></Center>
}

interface TrackInfoProps {
  trackName: string
  i: number
}

const TrackInfo = ({ trackName, i }: TrackInfoProps) => {
  const style = useStyle(trackName, i, 1)
  const { ref, width } = useElementSize()
  const chWidth =
    width > 260 ? '12.5%' :
      width > 150 ? '25%' :
        width > 100 ? '50%' : '100%'

  const [expanded, { toggle }] = useDisclosure(false)

  return  <Stack ref={ref}
    bg={style.color}
    c={getTextColor(style.color)}
    bdrs="sm" m="sm" p="sm"
  >
    <Group wrap="nowrap">
      <Text>{i}</Text>
      <Text flex={1}>{trackName.replace(/\u00AD/g, '')}</Text>
      <ActionIcon onClick={toggle} variant="subtle"><CaretDownIcon size={24}/></ActionIcon>
    </Group>
    <Collapse expanded={expanded}>
      <Group justify="space-between" gap="8 0" mb="xs">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(ch =>
          <ChannelBox trackName={trackName} i={i} channel={ch} width={chWidth} />,
        )}
      </Group>
    </Collapse>
  </Stack>
}

const TracksPanel = () => {
  const { midiData } = useContext(MidiFileContext)
  const tracks = midiData?.tracks

  return <Box p="md" h="100%" style={{ overflowY: 'auto' }}>
    {tracks?.map((t, i) => <TrackInfo key={i} trackName={t.name || ''} i={i} />)}
  </Box>
}

export default TracksPanel
