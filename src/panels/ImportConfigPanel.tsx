import { FileInput, Stack, Text } from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import { SpeakerLowIcon } from '@phosphor-icons/react'
import { useContext, useState } from 'react'

import ConfigOptionRow from '@/components/ConfigOptionRow'
import PanelWrapper from '@/components/PanelWrapper'
import MidiFileContext from '@/context/MidiFileContext'
import { useIsExporting } from '@/store/exportStore'
import { useMessages } from '@/store/localeStore'
import { computePeaks, decodeAudio } from '@/utils/audio'
import { parseMidiFile } from '@/utils/midi'
import { resetPlaybackRange } from '@/utils/timeline'

import MIDIIcon from '@/assets/icons/midi.svg?react'

const midiExtensions = ['.mid', '.midi']
const audioExtensions = ['.mp3', '.wav', '.ogg']

const hasExtension = (file: File, extensions: string[]) =>
  extensions.some(ext => file.name.toLowerCase().endsWith(ext))

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

  // Sorted by extension rather than with `accept`: browsers often report MIDI files with an
  // empty MIME type, which `accept` would reject
  const onDrop = (files: File[]) => {
    const midi = files.find(file => hasExtension(file, midiExtensions))
    const audio = files.find(file => hasExtension(file, audioExtensions))
    if (midi) void onMidiFileChange(midi)
    if (audio) void onAudioFileChange(audio)

    const unsupported = files.find(file => file !== midi && file !== audio)
    if (!midi && !audio && unsupported) setMidiError(m.errors.unsupportedFile(unsupported.name))
  }

  const exporting = useIsExporting()

  return <PanelWrapper>
    <ConfigOptionRow label={<MIDIIcon />} tooltip={m.import.midi}>
      <FileInput
        flex="1"
        aria-label={m.import.midi.name}
        maw="calc(100% - 24px - .5rem)"
        accept={midiExtensions.join(',')}
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
        accept={audioExtensions.join(',')}
        value={audioFile}
        onChange={onAudioFileChange}
        error={audioError}
      />
    </ConfigOptionRow>
    <Dropzone.FullScreen active={!exporting} onDrop={onDrop}>
      <Stack
        align="center" justify="center"
        mih="calc(100dvh - 4rem)" style={{ pointerEvents: 'none' }}
      >
        <MIDIIcon width={64} height={64} />
        <Text size="xl">{m.import.drop.title}</Text>
        <Text c="dimmed">{m.import.drop.desc}</Text>
      </Stack>
    </Dropzone.FullScreen>
  </PanelWrapper>
}

export default ImportConfigPanel
