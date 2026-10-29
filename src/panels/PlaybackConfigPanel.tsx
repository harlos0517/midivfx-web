import { NumberInput } from '@mantine/core'
import { useContext } from 'react'

import PanelWrapper from '@/components/PanelWrapper'
import MidiFileContext from '@/context/MidiFileContext'
import usePlaybackConfig from '@/hooks/usePlaybackConfig'
import { getLength } from '@/utils/timeline'

const PlaybackConfigPanel = () => {
  const { midiData, playback } = useContext(MidiFileContext)
  const length = getLength(midiData, playback)

  const [audioOffset, setAudioOffset] = usePlaybackConfig('audioOffset')
  const [startTime, setStartTime] = usePlaybackConfig('startTime')
  const [endTime, setEndTime] = usePlaybackConfig('endTime')

  return <PanelWrapper>
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
      value={endTime ?? length}
      onChange={v => {
        const isValid = v !== '' && !isNaN(Number(v))
        setEndTime(isValid ? Number(v) : length)
      }}
    />
  </PanelWrapper>

}

export default PlaybackConfigPanel
