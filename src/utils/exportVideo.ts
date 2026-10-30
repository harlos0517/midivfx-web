import {
  AudioBufferSource,
  BufferTarget,
  CanvasSource,
  getFirstEncodableAudioCodec,
  Mp4OutputFormat,
  Output,
  Quality,
  WebMOutputFormat,
} from 'mediabunny'

import type { RendererHandle } from '@/store/rendererStore'
import type { MidiData } from '@/utils/midi'
import type Playback from '@/utils/Playback'
import { getLength } from '@/utils/timeline'

export interface ExportOptions {
  renderer: RendererHandle
  playback: Playback
  midiData: MidiData | null
  fps: number
  alpha: boolean
  /** ms */
  startTime: number
  /** ms; defaults to the end of the audio or the last MIDI note, whichever is later. */
  endTime?: number | undefined
  onProgress?: (progress: number) => void
  signal?: AbortSignal
}

export interface ExportResult {
  blob: Blob
  extension: string
}

const decodeAudio = async(src: string) => {
  const ctx = new AudioContext()
  try {
    return await ctx.decodeAudioData(await (await fetch(src)).arrayBuffer())
  } finally {
    void ctx.close()
  }
}

/** Audio for [startMs, endMs) of the buffer; parts outside the buffer are silent. */
const sliceAudio = (buffer: AudioBuffer, startMs: number, endMs: number) => {
  const from = Math.round(startMs / 1000 * buffer.sampleRate)
  const to = Math.round(endMs / 1000 * buffer.sampleRate)
  const sliced = new AudioBuffer({
    length: Math.max(1, to - from),
    numberOfChannels: buffer.numberOfChannels,
    sampleRate: buffer.sampleRate,
  })
  const srcFrom = Math.min(buffer.length, Math.max(0, from))
  const srcTo = Math.min(buffer.length, Math.max(0, to))
  for (let c = 0; c < buffer.numberOfChannels; c++)
    sliced.copyToChannel(buffer.getChannelData(c).subarray(srcFrom, srcTo), c, srcFrom - from)
  return sliced
}

const yieldToEventLoop = () => new Promise(resolve => setTimeout(resolve, 0))

export const exportVideo = async({
  renderer, playback, midiData, fps, alpha, startTime, endTime, onProgress, signal,
}: ExportOptions): Promise<ExportResult> => {
  const canvas = renderer.gl.domElement
  if (canvas.width % 2 || canvas.height % 2)
    throw new Error(`Display size must be even (got ${canvas.width}×${canvas.height}).`)

  const end = endTime ?? getLength(midiData, playback)
  if (end <= startTime) throw new Error('Nothing to export: end time is before start time.')

  // H.264/MP4 has no alpha channel, so transparent exports go to VP9/WebM.
  const format = alpha ? new WebMOutputFormat() : new Mp4OutputFormat({ fastStart: 'in-memory' })
  const output = new Output({ format, target: new BufferTarget() })

  const video = new CanvasSource(canvas, {
    codec: alpha ? 'vp9' : 'avc',
    quality: new Quality('high'),
    alpha: alpha ? 'keep' : 'discard',
  })
  output.addVideoTrack(video, { frameRate: fps })

  const audioBuffer = playback.audioSrc
    ? sliceAudio(
      await decodeAudio(playback.audioSrc),
      startTime - playback.audioOffset,
      end - playback.audioOffset,
    )
    : null
  let audio: AudioBufferSource | null = null
  if (audioBuffer) {
    const codec = await getFirstEncodableAudioCodec(
      alpha ? ['opus', 'vorbis'] : ['aac', 'opus'],
      { numberOfChannels: audioBuffer.numberOfChannels, sampleRate: audioBuffer.sampleRate },
    )
    if (codec) {
      audio = new AudioBufferSource({ codec, quality: new Quality('high') })
      output.addAudioTrack(audio)
    } else console.warn('No encodable audio codec found; exporting without audio.')
  }

  const wasPlaying = playback.playing
  const restoreTime = playback.currentTime
  playback.pause()
  renderer.setFrameloop('never')

  try {
    await output.start()

    const totalFrames = Math.ceil((end - startTime) / 1000 * fps)
    for (let i = 0; i < totalFrames; i++) {
      if (signal?.aborted) throw signal.reason
      const t = i / fps
      playback.seek(startTime + t * 1000)
      renderer.advance(performance.now()) // runs useFrame callbacks and renders synchronously
      await video.add(t, 1 / fps)
      if (i % 10 === 0) {
        onProgress?.(i / totalFrames)
        await yieldToEventLoop()
      }
    }

    if (audio && audioBuffer) await audio.add(audioBuffer)
    await output.finalize()
    onProgress?.(1)
  } catch(err) {
    await output.cancel()
    throw err
  } finally {
    renderer.setFrameloop('always')
    playback.seek(restoreTime)
    if (wasPlaying) playback.play()
  }

  return {
    blob: new Blob([output.target.buffer!], { type: format.mimeType }),
    extension: format.fileExtension,
  }
}

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
