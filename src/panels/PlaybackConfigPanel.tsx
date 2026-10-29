import { NumberInput } from '@mantine/core'
import { useContext } from 'react'

import PanelWrapper from '@/components/PanelWrapper'
import MidiFileContext from '@/context/MidiFileContext'
import usePlaybackConfig from '@/hooks/usePlaybackConfig'

const PlaybackConfigPanel = () => {
  const { playback } = useContext(MidiFileContext)
  const duration = playback?.duration ?? 0

  const [startPadding, setStartPadding] = usePlaybackConfig('startPadding')
  const [endPadding, setEndPadding] = usePlaybackConfig('endPadding')
  const [audioOffset, setAudioOffset] = usePlaybackConfig('audioOffset')
  const [startTime, setStartTime] = usePlaybackConfig('startTime')
  const [endTime, setEndTime] = usePlaybackConfig('endTime')

  return <PanelWrapper>
    <NumberInput
      label="Start Padding"
      value={startPadding}
      onChange={v => setStartPadding(Number(v))}
    />
    <NumberInput
      label="End Padding"
      value={endPadding}
      onChange={v => setEndPadding(Number(v))}
    />
    <NumberInput
      label="Audio Offset"
      value={audioOffset}
      onChange={v => setAudioOffset(Number(v))}
    />
    <NumberInput
      label="Start Time"
      value={startTime}
      onChange={v => setStartTime(Number(v))}
    />
    <NumberInput
      label="End Time"
      value={endTime || duration}
      min={0}
      max={duration}
      onChange={v => {
        const isValid = v !== null && v !== undefined && !isNaN(Number(v))
        const newEndTime =  isValid ? Number(v) : duration
        setEndTime(newEndTime)
      }}
    />
  </PanelWrapper>

}

export default PlaybackConfigPanel
