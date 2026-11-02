import { useContext, useState } from 'react'

import PanelWrapper from '@/components/PanelWrapper'
import MidiFileContext from '@/context/MidiFileContext'
import { useMessages } from '@/store/localeStore'
import { computePeaks, decodeAudio } from '@/utils/audio'
import { parseMidiFile } from '@/utils/midi'
import { resetPlaybackRange } from '@/utils/timeline'

import MIDIIcon from '@/assets/icons/midi.svg?react'
import ConfigOptionRow from '@/components/ConfigOptionRow'
import { FileInput } from '@mantine/core'
import { SpeakerLowIcon } from '@phosphor-icons/react'

const ImportConfigPanel = () => {
  const m = useMessages()
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
      setMidiError(m.errors.readFile(file.name))
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
      setAudioError(m.errors.readFile(file.name))
    }
    resetPlaybackRange(context.midiData, context.playback)
  }

  return <PanelWrapper>
    <ConfigOptionRow label={<MIDIIcon />} tooltip={m.import.midi}>
      <FileInput
        flex="1"
        aria-label={m.import.midi.name}
        maw="calc(100% - 24px - .5rem)"
        accept=".mid,.midi"
        value={midiFile}
        onChange={onMidiFileChange}
        error={midiError}
      />
    </ConfigOptionRow>
    <ConfigOptionRow label={<SpeakerLowIcon />} tooltip={m.import.audio}>
      <FileInput
        flex="1"
        aria-label={m.import.audio.name}
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
