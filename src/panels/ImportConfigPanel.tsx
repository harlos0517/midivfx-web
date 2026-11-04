import { Button, FileButton, FileInput, Group, Stack, Text } from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import {
  DownloadSimpleIcon,
  ImageIcon,
  SlidersHorizontalIcon,
  SpeakerLowIcon,
  UploadSimpleIcon,
} from '@phosphor-icons/react'
import { useContext, useRef, useState } from 'react'
import { SRGBColorSpace, TextureLoader } from 'three'

import ConfigFileModal from '@/components/ConfigFileModal'
import ConfigOptionRow from '@/components/ConfigOptionRow'
import PanelWrapper from '@/components/PanelWrapper'
import MidiFileContext, { type BackgroundImage } from '@/context/MidiFileContext'
import { useIsExporting } from '@/store/exportStore'
import { useMessages } from '@/store/localeStore'
import useVisibilityStore from '@/store/visibilityStore'
import { computePeaks, decodeAudio } from '@/utils/audio'
import { ConfigFileError, parseConfigFile, type ConfigFile } from '@/utils/configFile'
import { parseMidiFile } from '@/utils/midi'
import { resetPlaybackRange } from '@/utils/timeline'

import MIDIIcon from '@/assets/icons/midi.svg?react'

const midiExtensions = ['.mid', '.midi']
const audioExtensions = ['.mp3', '.wav', '.ogg']
const configExtensions = ['.json']
// Only what browsers decode in an <img>; a GIF shows its first frame
const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif', '.bmp']

const hasExtension = (file: File, extensions: string[]) =>
  extensions.some(ext => file.name.toLowerCase().endsWith(ext))

const loadImage = async(file: File): Promise<BackgroundImage> => {
  const url = URL.createObjectURL(file)
  try {
    const texture = await new TextureLoader().loadAsync(url)
    texture.colorSpace = SRGBColorSpace
    const image = texture.image as HTMLImageElement
    return { file, texture, width: image.naturalWidth, height: image.naturalHeight }
  } finally {
    // The image is decoded by now, so the texture no longer needs the URL
    URL.revokeObjectURL(url)
  }
}

const ImportConfigPanel = () => {
  const m = useMessages()
  const context = useContext(MidiFileContext)

  const [midiFile, setMidiFile] = useState<File | null>(null)
  const [audioFile, setaudioFile] = useState<File | null>(null)
  const [midiError, setMidiError] = useState<string | null>(null)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [configError, setConfigError] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  // Only the latest choice applies if an earlier image finishes loading after it
  const imageLoad = useRef(0)
  const [configTarget, setConfigTarget] = useState<'export' | ConfigFile | null>(null)

  const resetConfigInput = useRef<() => void>(null)

  const onConfigFileChange = async(file: File | null) => {
    // The input only fires on a different file, so clear it to let the same file be chosen again
    resetConfigInput.current?.()
    if (!file) return
    try {
      setConfigTarget(parseConfigFile(await file.text()))
      setConfigError(null)
    } catch(err) {
      console.error(err)
      setConfigError(err instanceof ConfigFileError && err.reason === 'newer'
        ? m.errors.newerConfig(file.name)
        : m.errors.invalidConfig(file.name))
    }
  }

  const onMidiFileChange = async(file: File | null) => {
    if (!file) return

    try {
      const midiData = parseMidiFile(new Uint8Array(await file.arrayBuffer()))
      setMidiFile(file)
      setMidiError(null)
      // Track and channel numbers refer to the new file now
      useVisibilityStore.getState().reset()
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

  const onImageFileChange = async(file: File | null) => {
    const load = ++imageLoad.current
    setImageError(null)
    if (!file) {
      context.backgroundImage?.texture.dispose()
      context.setBackgroundImage(null)
      return
    }
    try {
      const image = await loadImage(file)
      if (load !== imageLoad.current) {
        image.texture.dispose()
        return
      }
      context.backgroundImage?.texture.dispose()
      context.setBackgroundImage(image)
    } catch(err) {
      // The previous image stays
      console.error(err)
      if (load === imageLoad.current) setImageError(m.errors.readFile(file.name))
    }
  }

  // Sorted by extension rather than with `accept`: browsers often report MIDI files with an
  // empty MIME type, which `accept` would reject
  const onDrop = (files: File[]) => {
    const midi = files.find(file => hasExtension(file, midiExtensions))
    const audio = files.find(file => hasExtension(file, audioExtensions))
    const config = files.find(file => hasExtension(file, configExtensions))
    const image = files.find(file => hasExtension(file, imageExtensions))
    if (midi) void onMidiFileChange(midi)
    if (audio) void onAudioFileChange(audio)
    if (config) void onConfigFileChange(config)
    if (image) void onImageFileChange(image)

    const known = [midi, audio, config, image]
    const unsupported = files.find(file => !known.includes(file))
    if (!known.some(Boolean) && unsupported)
      setMidiError(m.errors.unsupportedFile(unsupported.name))
  }

  const exporting = useIsExporting()

  return <PanelWrapper>
    <ConfigOptionRow label={<MIDIIcon />} tooltip={m.import.midi}>
      <FileInput
        flex="1"
        aria-label={m.import.midi.name}
        maw="calc(100% - 2rem)"
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
        maw="calc(100% - 2rem)"
        accept={audioExtensions.join(',')}
        value={audioFile}
        onChange={onAudioFileChange}
        error={audioError}
      />
    </ConfigOptionRow>
    <ConfigOptionRow label={<ImageIcon />} tooltip={m.import.image}>
      <FileInput
        flex="1"
        aria-label={m.import.image.name}
        maw="calc(100% - 2rem)"
        accept={imageExtensions.join(',')}
        value={context.backgroundImage?.file ?? null}
        onChange={file => void onImageFileChange(file)}
        error={imageError}
        clearable
      />
    </ConfigOptionRow>
    <ConfigOptionRow label={<SlidersHorizontalIcon />} tooltip={m.import.config}>
      <Stack flex="1" gap={4}>
        <Group grow>
          <FileButton
            resetRef={resetConfigInput}
            accept={configExtensions.join(',')}
            onChange={onConfigFileChange}
          >
            {props => <Button {...props} variant="default">
              <UploadSimpleIcon />
            </Button>}
          </FileButton>
          <Button variant="default" onClick={() => setConfigTarget('export')}>
            <DownloadSimpleIcon />
          </Button>
        </Group>
        {configError && <Text size="xs" c="red">{configError}</Text>}
      </Stack>
    </ConfigOptionRow>
    <ConfigFileModal target={configTarget} onClose={() => setConfigTarget(null)} />
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
