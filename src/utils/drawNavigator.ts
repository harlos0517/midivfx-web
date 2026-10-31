import type { AudioPeaks } from '@/utils/audio'
import type { MidiData } from '@/utils/midi'

const WAVEFORM_COLOR = '#5c5f66'
const NOTE_COLOR = '#74c0fc'

export interface TimeRange {
  /** ms */
  start: number
  /** ms */
  end: number
}

/** Matches the canvas to its CSS size in device pixels, which also clears it. */
const prepareCanvas = (canvas: HTMLCanvasElement, width: number, height: number) => {
  canvas.width = Math.round(width * window.devicePixelRatio)
  canvas.height = Math.round(height * window.devicePixelRatio)
  return canvas.getContext('2d')!
}

export const drawWaveform = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  domain: TimeRange,
  peaks: AudioPeaks | null,
  audioOffset: number,
) => {
  const ctx = prepareCanvas(canvas, width, height)
  if (!peaks) return

  const { data, bucketMs } = peaks
  const buckets = data.length / 2
  const msPerPixel = (domain.end - domain.start) / canvas.width
  const middle = canvas.height / 2
  ctx.fillStyle = WAVEFORM_COLOR
  for (let x = 0; x < canvas.width; x++) {
    const time = domain.start + x * msPerPixel - audioOffset
    const from = Math.floor(time / bucketMs)
    // At least one bucket, or short songs on a wide strip would draw with gaps
    const to = Math.max(from + 1, Math.floor((time + msPerPixel) / bucketMs))

    let min = Infinity
    let max = -Infinity
    for (let i = Math.max(0, from); i < Math.min(buckets, to); i++) {
      min = Math.min(min, data[i * 2]!)
      max = Math.max(max, data[i * 2 + 1]!)
    }
    if (max < min) continue
    ctx.fillRect(x, middle - max * middle, 1, Math.max(1, (max - min) * middle))
  }
}

export const drawNotes = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  domain: TimeRange,
  midiData: MidiData | null,
) => {
  const ctx = prepareCanvas(canvas, width, height)

  let low = Infinity
  let high = -Infinity
  const forEachNote = (draw: (noteNumber: number, start: number, end: number) => void) => {
    for (const track of midiData?.tracks ?? []) {
      for (const channel of track.channels) {
        for (const e of channel) {
          if (e.type !== 'noteOn' || e.velocity === 0) continue
          draw(e.noteNumber, e.time, e.endEvent?.time ?? e.time)
        }
      }
    }
  }
  forEachNote(noteNumber => {
    low = Math.min(low, noteNumber)
    high = Math.max(high, noteNumber)
  })
  if (high < low) return

  const pixelsPerMs = canvas.width / (domain.end - domain.start)
  const rowHeight = canvas.height / (high - low + 1)
  ctx.fillStyle = NOTE_COLOR
  forEachNote((noteNumber, start, end) => {
    ctx.fillRect(
      (start - domain.start) * pixelsPerMs,
      (high - noteNumber) * rowHeight,
      Math.max(1, (end - start) * pixelsPerMs),
      Math.max(1, rowHeight),
    )
  })
}
