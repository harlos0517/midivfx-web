import { ActionIcon, Button, Center, Collapse, Group, Stack, Text } from '@mantine/core'
import { useDisclosure, useElementSize } from '@mantine/hooks'
import { CaretDownIcon, CaretUpIcon } from '@phosphor-icons/react'
import { useContext } from 'react'

import OptionTooltip from '@/components/OptionTooltip'
import PanelWrapper from '@/components/PanelWrapper'
import MidiFileContext from '@/context/MidiFileContext'
import useStyle from '@/hooks/useStyle'
import { useMessages } from '@/store/localeStore'
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
  return <Button
    variant="subtle" c={textColor} w="2rem"
    bg={style.color} bd={`solid 1px ${textColor}`}
    className={classes['channel']}
  >{channel}</Button>
}

interface TrackInfoProps {
  trackName: string
  i: number
}

const TrackInfo = ({ trackName, i }: TrackInfoProps) => {
  const m = useMessages()
  const style = useStyle(trackName, i, 1)
  const { ref, width } = useElementSize()
  const cols = width > 500 ? 16 : width > 250 ? 8 : 4
  const rows = 16 / cols

  const channels = Array.from(Array<number>(rows))
    .map((_, r) => Array.from(Array<number>(cols)).map((_, c) => r * cols + c + 1))

  const [expanded, { toggle }] = useDisclosure(false)
  const c = getTextColor(style.color)

  return <Stack ref={ref} gap={0} bg={style.color} bdrs={4} c={c}>
    <Group p={8}>
      <Center>
        <Button
          variant="subtle" c={c} w="2rem"
          bd={`solid 1px ${c}`}
          className={classes['track-number']}
        >{i}</Button>
      </Center>
      <Text flex={1}>{trackName.replace(/\u00AD/g, '')}</Text>
      <OptionTooltip tip={m.tracks.expand}>
        <ActionIcon
          className={classes['collapse-icon']}
          onClick={toggle}
          style={{ borderColor: c }}
          aria-label={m.tracks.expand.name}
          aria-expanded={expanded}
        >
          {expanded ? <CaretUpIcon color={c} /> : <CaretDownIcon color={c} />}
        </ActionIcon>
      </OptionTooltip>
    </Group>
    <Collapse expanded={expanded} p={8}>
      <Stack>
        {channels.map((row, tr) => <Group key={tr} gap={8} justify="space-between">
          {row.map(ch => <ChannelBox key={ch} trackName={trackName} i={i} channel={ch} />)}
        </Group>)}
      </Stack>
    </Collapse>
  </Stack>
}

const TracksPanel = () => {
  const { midiData } = useContext(MidiFileContext)
  const tracks = midiData?.tracks

  return <PanelWrapper>
    {tracks?.map((t, i) => <TrackInfo key={i} trackName={t.name || ''} i={i + 1} />)}
  </PanelWrapper>
}

export default TracksPanel
