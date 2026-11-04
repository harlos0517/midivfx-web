import { ActionIcon, Button, Center, Collapse, Group, Stack, Text } from '@mantine/core'
import { useDisclosure, useElementSize } from '@mantine/hooks'
import { CaretDownIcon, CaretUpIcon } from '@phosphor-icons/react'
import { useContext } from 'react'

import OptionTooltip from '@/components/OptionTooltip'
import PanelWrapper from '@/components/PanelWrapper'
import MidiFileContext from '@/context/MidiFileContext'
import useStyle from '@/hooks/useStyle'
import { useMessages } from '@/store/localeStore'
import useVisibilityStore, { useIsTrackHidden } from '@/store/visibilityStore'
import { getTextColor } from '@/utils/colors'

import classes from './TracksPanel.module.sass'

interface ChannelBoxProps {
  trackName: string
  i: number
  channel: number
}

const ChannelBox = ({ trackName, i, channel }: ChannelBoxProps) => {
  const m = useMessages()
  const style = useStyle(trackName, i, channel)
  const channelHidden = useVisibilityStore(s => s.hiddenChannels.has(`${i}:${channel}`))
  const toggleChannel = useVisibilityStore(s => s.toggleChannel)
  const c = getTextColor(style.color)

  return <OptionTooltip tip={m.tracks.channel}>
    <Button variant="subtle"
      c={c} w="2rem" bd={`solid 1px ${c}`}
      opacity={channelHidden ? 0.25 : 1}
      bg={style.color}
      className={classes['channel']}
      onClick={() => toggleChannel(i, channel)}
      aria-label={`${m.tracks.channel.name} ${channel}`}
      aria-pressed={!channelHidden}
    >{channel}</Button>
  </OptionTooltip>
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
  const hidden = useIsTrackHidden(i)
  const toggleTrack = useVisibilityStore(s => s.toggleTrack)
  const c = hidden ? 'white' : getTextColor(style.color)

  return <Stack ref={ref} gap={0} bdrs={4} c={c}
    bg={hidden ? 'transparent' : style.color}
    opacity={hidden ? 0.25 : 1}
  >
    <Group p={8}>
      <Center>
        <OptionTooltip tip={m.tracks.track}>
          <Button
            variant="subtle" c={c} w="2rem"
            bd={`solid 1px ${c}`}
            className={`${classes['track-number']} ${hidden ? classes['hidden'] : ''}`}
            onClick={() => toggleTrack(i)}
            aria-label={`${m.tracks.track.name} ${i}`}
            aria-pressed={!hidden}
          >{i}</Button>
        </OptionTooltip>
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
