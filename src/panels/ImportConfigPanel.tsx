import { FileInput } from '@mantine/core'
import { useContext, useState } from 'react'

import PanelWrapper from '@/components/PanelWrapper'
import MidiFileContext from '@/context/MidiFileContext'
import { parseMidiFile } from '@/utils/midi'
import { resetPlaybackRange } from '@/utils/timeline'

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

  const onAudioFileChange = async(file: File | null) => {
    if (!file || !context.playback) return

    setaudioFile(file)
    setAudioError(null)
    const audioUrl = URL.createObjectURL(file)
    try {
      await context.playback.loadAudio(audioUrl)
    } catch(err) {
      console.error(err)
      URL.revokeObjectURL(audioUrl)
      setaudioFile(null)
      setAudioError(`Could not read ${file.name}.`)
    }
    resetPlaybackRange(context.midiData, context.playback)
  }

  return <PanelWrapper>
    <FileInput
      label="Import MIDI File"
      placeholder="Choose a MIDI file"
      accept=".mid,.midi"
      value={midiFile}
      onChange={onMidiFileChange}
      error={midiError}
    />
    <FileInput
      label="Import Audio File"
      placeholder="Choose an audio file"
      accept=".mp3,.wav,.ogg"
      value={audioFile}
      onChange={onAudioFileChange}
      error={audioError}
    />
  </PanelWrapper>
}

export default ImportConfigPanel
