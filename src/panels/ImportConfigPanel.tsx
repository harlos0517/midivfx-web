import { useContext, useState } from 'react'

import PanelWrapper from '@/components/PanelWrapper'
import MidiFileContext from '@/context/MidiFileContext'
import { computePeaks, decodeAudio } from '@/utils/audio'
import { parseMidiFile } from '@/utils/midi'
import { resetPlaybackRange } from '@/utils/timeline'

import MIDIIcon from '@/assets/icons/midi.svg?react'
import ConfigOptionRow from '@/components/ConfigOptionRow'
import { FileInput } from '@mantine/core'
import { SpeakerLowIcon } from '@phosphor-icons/react'

const ImportConfigPanel = () => {
  const context = useContext(MidiFileContext)

  const [midiFile, setMidiFile] = useState<File | null>(null)
  const [audioFile, setaudioFile] = useState<File | null>(null)
  const [midiError, setMidiError] = useState<string | null>(null)
  const [audioError, setAudioError] = useState<string | null>(null)

  const onMidiFileChange = async(file: File | null) => {
    if (!file) return

    try {
      const midiData = parseMidiFile(new Uint8Array(await file.arrayBuffer()))
      setMidiFile(file)
      setMidiError(null)
      context.setMidiData(midiData)
      resetPlaybackRange(midiData, context.playback)
    } catch(err) {
      // The previous file stays loaded
      console.error(err)
      setMidiError(`Could not read ${file.name}.`)
    }
  }

  const loadPeaks = async(src: string) => {
    try {
      const peaks = computePeaks(await decodeAudio(src))
      // A newer import may have replaced this audio during the decode
      if (context.playback?.audioSrc === src) context.setAudioPeaks(peaks)
    } catch(err) {
      // Only the navigator's waveform is missing; the audio itself still plays
      console.error(err)
    }
  }

  const onAudioFileChange = async(file: File | null) => {
    if (!file || !context.playback) return

    setaudioFile(file)
    setAudioError(null)
    context.setAudioPeaks(null)
    const audioUrl = URL.createObjectURL(file)
    try {
      await context.playback.loadAudio(audioUrl)
      void loadPeaks(audioUrl)
    } catch(err) {
      console.error(err)
      URL.revokeObjectURL(audioUrl)
      setaudioFile(null)
      setAudioError(`Could not read ${file.name}.`)
    }
    resetPlaybackRange(context.midiData, context.playback)
  }

  return <PanelWrapper>
    <ConfigOptionRow label={<MIDIIcon />}>
      <FileInput
        flex="1"
        maw="calc(100% - 24px - .5rem)"
        accept=".mid,.midi"
        value={midiFile}
        onChange={onMidiFileChange}
        error={midiError}
      />
    </ConfigOptionRow>
    <ConfigOptionRow label={<SpeakerLowIcon />}>
      <FileInput
        flex="1"
        maw="calc(100% - 24px - .5rem)"
        accept=".mp3,.wav,.ogg"
        value={audioFile}
        onChange={onAudioFileChange}
        error={audioError}
      />
    </ConfigOptionRow>
  </PanelWrapper>
}

export default ImportConfigPanel
