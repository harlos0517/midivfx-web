import { ArrowLineLeftIcon, ArrowLineRightIcon, TimerIcon } from '@phosphor-icons/react'
import { useContext } from 'react'

import ConfigOptionNumberInputRow from '@/components/ConfigOptionNumberInputRow'
import PanelWrapper from '@/components/PanelWrapper'
import MidiFileContext from '@/context/MidiFileContext'
import usePlaybackConfig from '@/hooks/usePlaybackConfig'
import { generateSliderMarks } from '@/utils/input'
import { roundTo } from '@/utils/round'
import { getLength } from '@/utils/timeline'

const PlaybackConfigPanel = () => {
  const { midiData, playback } = useContext(MidiFileContext)
  const length = getLength(midiData, playback)

  const [audioOffset, setAudioOffset] = usePlaybackConfig('audioOffset')
  const [startTime, setStartTime] = usePlaybackConfig('startTime')
  const [endTime, setEndTime] = usePlaybackConfig('endTime')

  return <PanelWrapper>
    <ConfigOptionNumberInputRow
      label={<TimerIcon />}
      value={audioOffset / 1000}
      onChange={v => setAudioOffset(v * 1000)}
      step={0.01}
      sliderProps={{
        min: -3, max: 3, step: 0.01,
        marks: generateSliderMarks(-3, 3),
      }}
    />
    <ConfigOptionNumberInputRow
      label={<ArrowLineLeftIcon />}
      value={startTime / 1000}
      onChange={v => setStartTime(v * 1000)}
      rightSection="s"
      withSlider={false}
      step={0.1}
    />
    <ConfigOptionNumberInputRow
      label={<ArrowLineRightIcon />}
      value={(endTime ?? length) / 1000}
      onChange={v => setEndTime(roundTo(v * 1000, 0) ?? length)}
      rightSection="s"
      withSlider={false}
      step={0.1}
    />
  </PanelWrapper>

}

export default PlaybackConfigPanel
