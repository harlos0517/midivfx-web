import { ArrowLineLeftIcon, ArrowLineRightIcon, TimerIcon } from '@phosphor-icons/react'
import { useContext } from 'react'

import ConfigOptionNumberInputRow from '@/components/ConfigOptionNumberInputRow'
import PanelWrapper from '@/components/PanelWrapper'
import MidiFileContext from '@/context/MidiFileContext'
import usePlaybackConfig from '@/hooks/usePlaybackConfig'
import { useMessages } from '@/store/localeStore'
import { getSliderProps } from '@/utils/input'
import { roundTo } from '@/utils/round'
import { getLength } from '@/utils/timeline'

const PlaybackConfigPanel = () => {
  const m = useMessages()
  const { midiData, playback } = useContext(MidiFileContext)
  const length = getLength(midiData, playback)

  const [audioOffset, setAudioOffset] = usePlaybackConfig('audioOffset')
  const [startTime, setStartTime] = usePlaybackConfig('startTime')
  const [endTime, setEndTime] = usePlaybackConfig('endTime')

  return <PanelWrapper>
    <ConfigOptionNumberInputRow
      label={<TimerIcon />}
      tooltip={m.playback.audioOffset}
      value={audioOffset / 1000}
      onChange={v => setAudioOffset(v * 1000)}
      step={0.01}
      sliderProps={getSliderProps(-3, 3, 0.01, [0])}
    />
    <ConfigOptionNumberInputRow
      label={<ArrowLineLeftIcon />}
      tooltip={m.playback.startTime}
      value={startTime / 1000}
      onChange={v => setStartTime(v * 1000)}
      rightSection="s"
      withSlider={false}
      step={0.1}
    />
    <ConfigOptionNumberInputRow
      label={<ArrowLineRightIcon />}
      tooltip={m.playback.endTime}
      value={(endTime ?? length) / 1000}
      onChange={v => setEndTime(roundTo(v * 1000, 0))}
      rightSection="s"
      withSlider={false}
      step={0.1}
      emptyValue={length / 1000}
    />
  </PanelWrapper>

}

export default PlaybackConfigPanel
