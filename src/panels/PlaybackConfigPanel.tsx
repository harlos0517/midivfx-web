import { ArrowLineLeftIcon, ArrowLineRightIcon, TimerIcon } from '@phosphor-icons/react'
import { useContext } from 'react'

import ConfigOptionNumberInput from '@/components/ConfigOptionNumberInput'
import PanelWrapper from '@/components/PanelWrapper'
import MidiFileContext from '@/context/MidiFileContext'
import usePlaybackConfig from '@/hooks/usePlaybackConfig'
import { ICON_SIZE } from '@/utils/const'
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
    <ConfigOptionNumberInput
      label={<TimerIcon size={ICON_SIZE} />}
      value={audioOffset / 1000}
      onChange={v => setAudioOffset(Number(v) * 1000)}
      step={0.01}
      sliderProps={{
        min: -3, max: 3, step: 0.01,
        marks: generateSliderMarks(-3, 3),
      }}
    />
    <ConfigOptionNumberInput
      label={<ArrowLineLeftIcon size={ICON_SIZE} />}
      value={startTime / 1000}
      onChange={v => setStartTime(Number(v) * 1000)}
      rightSection="s"
      withSlider={false}
      step={0.1}
    />
    <ConfigOptionNumberInput
      label={<ArrowLineRightIcon size={ICON_SIZE} />}
      value={(endTime ?? length) / 1000}
      onChange={v => {
        const isValid = v !== '' && !isNaN(Number(v))
        setEndTime((isValid ? roundTo(Number(v) * 1000, 0) : length))
      }}
      rightSection="s"
      withSlider={false}
      step={0.1}
    />
  </PanelWrapper>

}

export default PlaybackConfigPanel
