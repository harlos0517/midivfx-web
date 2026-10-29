import { FileInput } from '@mantine/core'
import { useContext, useState } from 'react'

import PanelWrapper from '@/components/PanelWrapper'
import MidiFileContext from '@/context/MidiFileContext'
import { parseMidiFile } from '@/utils/midi'

const ImportConfigPanel = () => {
  const context = useContext(MidiFileContext)

  const [midiFile, setMidiFile] = useState<File | null>(null)
  const [audioFile, setaudioFile] = useState<File | null>(null)

  const onMidiFileChange = async(file: File | null) => {
    if (!file) return

    setMidiFile(file)
    const midiData = parseMidiFile(new Uint8Array(await file.arrayBuffer()))
    context.setMidiData(midiData)
  }

  const onAudioFileChange = (file: File | null) => {
    if (!file) return

    setaudioFile(file)
    const audioUrl = URL.createObjectURL(file)
    context.playback?.loadAudio(audioUrl)
  }

  return <PanelWrapper>
    <FileInput
      label="Import MIDI File"
      placeholder="Choose a MIDI file"
      accept=".mid,.midi"
      value={midiFile}
      onChange={onMidiFileChange}
    />
    <FileInput
      label="Import Audio File"
      placeholder="Choose an audio file"
      accept=".mp3,.wav,.ogg"
      value={audioFile}
      onChange={onAudioFileChange}
    />
  </PanelWrapper>
}

export default ImportConfigPanel
