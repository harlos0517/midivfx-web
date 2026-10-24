import { NumberInput, Stack } from '@mantine/core'

import useConfig from '@/hooks/useConfig'

const PlaybackConfigPanel: React.FC = () => {
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
  </Stack>

}

export default PlaybackConfigPanel
