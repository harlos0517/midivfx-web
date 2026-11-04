import {
  ArrowLineLeftIcon,
  ArrowLineRightIcon,
  TimerIcon,
  TrendDownIcon,
  TrendUpIcon,
} from '@phosphor-icons/react'
import { useContext } from 'react'

import ConfigOptionNumberInputRow from '@/components/ConfigOptionNumberInputRow'
import PanelWrapper from '@/components/PanelWrapper'
import MidiFileContext from '@/context/MidiFileContext'
import usePlaybackConfig from '@/hooks/usePlaybackConfig'
import { useMessages } from '@/store/localeStore'
import { getSliderProps } from '@/utils/input'
import { roundTo } from '@/utils/round'
import { getLength } from '@/utils/timeline'

const fadeSliderProps = {
  min: 0, max: 10, step: 0.1,
  marks: [
    { value: 0, label: '0' },
    { value: 10000, label: '10' },
  ],
  label: (v: number) => `${roundTo(v / 1000, 2)}`,
  scale: (v: number) => roundTo(v * 1000, 0),
}

const PlaybackConfigPanel = () => {
  const m = useMessages()
  const { midiData, playback } = useContext(MidiFileContext)
  const length = getLength(midiData, playback)

  const [audioOffset, setAudioOffset] = usePlaybackConfig('audioOffset')
  const [startTime, setStartTime] = usePlaybackConfig('startTime')
  const [endTime, setEndTime] = usePlaybackConfig('endTime')
  const [fadeIn, setFadeIn] = usePlaybackConfig('fadeIn')
  const [fadeOut, setFadeOut] = usePlaybackConfig('fadeOut')

  const setFade = (set: (v: number) => void) => (v: number) =>
    set(roundTo(Math.max(0, v * 1000), 0))

  return <PanelWrapper>
    <ConfigOptionNumberInputRow
      label={<TimerIcon />}
      tooltip={m.playback.audioOffset}
      value={audioOffset / 1000}
      onChange={v => setAudioOffset(v * 1000)}
      rightSection="s"
      step={0.01}
      sliderProps={getSliderProps(-3, 3, 0.01, [0])}
    />
    <ConfigOptionNumberInputRow
      label={<ArrowLineLeftIcon />}
      tooltip={m.playback.startTime}
      value={startTime / 1000}
      onChange={v => {
        const clipped = Math.min(v, endTime ?? length)
        setStartTime(roundTo(clipped * 1000, 0))
      }}
      rightSection="s"
      withSlider={false}
      step={0.1}
    />
    <ConfigOptionNumberInputRow
      label={<ArrowLineRightIcon />}
      tooltip={m.playback.endTime}
      value={(endTime ?? length) / 1000}
      onChange={v => {
        const clipped = Math.max(v, startTime)
        setEndTime(roundTo(clipped * 1000, 0))
      }}
      rightSection="s"
      withSlider={false}
      step={0.1}
      emptyValue={length / 1000}
    />
    <ConfigOptionNumberInputRow
      label={<TrendUpIcon />}
      tooltip={m.playback.fadeIn}
      value={fadeIn / 1000}
      onChange={setFade(setFadeIn)}
      rightSection="s"
      min={0} step={0.1}
      sliderProps={{
        value: fadeIn / 1000,
        onChange: setFade(setFadeIn),
        ...fadeSliderProps,
      }}
    />
    <ConfigOptionNumberInputRow
      label={<TrendDownIcon />}
      tooltip={m.playback.fadeOut}
      value={fadeOut / 1000}
      onChange={setFade(setFadeOut)}
      rightSection="s"
      min={0} step={0.1}
      sliderProps={{
        value: fadeOut / 1000,
        onChange: setFade(setFadeOut),
        ...fadeSliderProps,
      }}
    />
  </PanelWrapper>

}

export default PlaybackConfigPanel
