import { NumberInput, Stack } from '@mantine/core'
import { useContext } from 'react'

import MidiFileContext from '@/context/MidiFileContext'
import useConfig from '@/hooks/useConfig'

const PlaybackConfigPanel = () => {
  const { playback } = useContext(MidiFileContext)
  const duration = playback?.duration ?? 0

  const [startPaddingValue, setStartPaddingValue] = useConfig(
    c => c.playback.startPadding,
    (c, v) => { c.playback.startPadding = v },
  )
  const [endPaddingValue, setEndPaddingValue] = useConfig(
    c => c.playback.endPadding,
    (c, v) => { c.playback.endPadding = v },
  )
  const [audioOffsetValue, setAudioOffsetValue] = useConfig(
    c => c.playback.audioOffset,
    (c, v) => { c.playback.audioOffset = v },
  )
  const [startTimeValue, setStartTimeValue] = useConfig(
    c => c.playback.startTime,
    (c, v) => { c.playback.startTime = v },
  )
  const [endTimeValue, setEndTimeValue] = useConfig(
    c => c.playback.endTime || duration,
    (c, v) => { c.playback.endTime = v ?? duration },
  )

  return <Stack p="md" h="100%" style={{ overflowY: 'auto' }}>
    <NumberInput
      label="Start Padding"
      value={startPaddingValue}
      onChange={v => setStartPaddingValue(Number(v))}
    />
    <NumberInput
      label="End Padding"
      value={endPaddingValue}
      onChange={v => setEndPaddingValue(Number(v))}
    />
    <NumberInput
      label="Audio Offset"
      value={audioOffsetValue}
      onChange={v => setAudioOffsetValue(Number(v))}
    />
    <NumberInput
      label="Start Time"
      value={startTimeValue}
      onChange={v => setStartTimeValue(Number(v))}
    />
    <NumberInput
      label="End Time"
      value={endTimeValue}
      onChange={v => setEndTimeValue(Number(v))}
    />
  </Stack>

}

export default PlaybackConfigPanel
