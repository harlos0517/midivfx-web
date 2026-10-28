import { ActionIcon, Box, Center, Collapse, Group, Stack, Text } from '@mantine/core'
import { useDisclosure, useElementSize } from '@mantine/hooks'
import { CaretDownIcon, CaretUpIcon } from '@phosphor-icons/react'
import { useContext } from 'react'

import MidiFileContext from '@/context/MidiFileContext'
import useStyle from '@/hooks/useStyle'
import { getTextColor } from '@/utils/colors'

import classes from './TracksPanel.module.sass'

interface ChannelBoxProps {
  trackName: string
  i: number
  channel: number
}

const ChannelBox = ({ trackName, i, channel }: ChannelBoxProps) => {
  const style = useStyle(trackName, i, channel)
  const textColor = getTextColor(style.color)
  return <Center
    w="2rem" h="2rem" bdrs="sm" bd={`solid 1px ${textColor}`}
    bg={style.color}
    c={textColor}
  >{channel}</Center>
}

interface TrackInfoProps {
  trackName: string
  i: number
}

const TrackInfo = ({ trackName, i }: TrackInfoProps) => {
  const style = useStyle(trackName, i, 1)
  const { ref, width } = useElementSize()
  const cols = width > 500 ? 16 : width > 250 ? 8 : 4
  const rows = 16 / cols

  const channels = Array.from(Array<number>(rows))
    .map((_, r) => Array.from(Array<number>(cols)).map((_, c) => r * cols + c + 1))

  const [expanded, { toggle }] = useDisclosure(false)

  return  <Stack ref={ref}
    bg={style.color}
    c={getTextColor(style.color)}
    bdrs="sm" m="sm" p="sm"
  >
    <Group wrap="nowrap">
      <Text>{i}</Text>
      <Text flex={1}>{trackName.replace(/\u00AD/g, '')}</Text>
      <ActionIcon
        className={classes['collapse-icon']}
        onClick={toggle}
        style={{ borderColor: getTextColor(style.color) }}
      >
        {expanded
          ? <CaretUpIcon size={24} color={getTextColor(style.color)} />
          : <CaretDownIcon size={24} color={getTextColor(style.color)} />
        }
      </ActionIcon>
    </Group>
    <Collapse expanded={expanded}>
      <Stack gap={8}>
        {channels.map(row => <Group gap={8} wrap="nowrap" justify="space-between">
          {row.map(ch => <ChannelBox key={ch} trackName={trackName} i={i} channel={ch} />)}
        </Group>)}
      </Stack>
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
