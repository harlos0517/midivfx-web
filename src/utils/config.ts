/** `fill`, `decay`, or a MIDI CC number such as `CC9`. */
export type NoteMode = 'fill' | 'decay' | 'CC'

export interface PlaybackConfig {
  /** Extra time before first note (us). */
  startPadding: number
  /** Extra time after last note (us). */
  endPadding: number
  startTime: number
  /** Defaults to full length. */
  endTime?: number
  /** Audio delay relative to visual (us); positive = audio starts later. */
  audioOffset: number
}

export interface ExportConfig {
  fps: number
  alpha: boolean
}

export interface CameraConfig {
  x: number
  y: number
  z: number
  targetX: number
  targetY: number
  targetZ: number
}

export interface DisplayConfig {
  width: number
  height: number
  /** Pixels per millisecond. */
  speed: number
  beat: boolean
}

export interface Remap {
  originalPitch?: string // range notation
  mappedPitch: [number, number]
  color: string
}

export interface StyleRuntime {
  isRegex: boolean
  mode: NoteMode
  cc: number
  velocity: boolean
  color: string
  gap: number
  radius: number
  z: number
  decayRate: number
  showPedal: boolean
  pedalColor: string
  remaps: Remap[]
}

export type StyleConfig = Partial<StyleRuntime> & {
  id: string
  order: number
  track?: string // 1-based track numbers, range notation or regex
  channel?: string // 1-based channel numbers, range notation
}

export interface Config {
  playback: PlaybackConfig
  export: ExportConfig
  camera: CameraConfig
  display: DisplayConfig
  styles: StyleConfig[]
}

export const defaultStyleRuntime: Omit<StyleRuntime, 'id' | 'order'> = {
  mode: 'fill',
  cc: 2,
  isRegex: true,
  velocity: false,
  color: '#ffffff',
  gap: 0.1,
  radius: 0.33,
  z: 0.00,
  decayRate: 0.0,
  showPedal: true,
  pedalColor: '#444444',
  remaps: [],
}

export const defaultStyleConfig = {
  id: 'default',
  mode: 'fill' as const,
  isRegex: true,
  remaps: [],
}

export const defaultConfig: Config = {
  playback: {
    startPadding: 3000,
    endPadding: 3000,
    startTime: 0,
    audioOffset: 0,
  },
  export: {
    fps: 60,
    alpha: true,
  },
  camera: {
    x: 0.0,
    y: 64.0,
    z: 100.0,
    targetX: 0.0,
    targetY: 64.0,
    targetZ: 0.0,
  },
  display: {
    width: 1920,
    height: 1080,
    speed: 1,
    beat: false,
  },
  styles: [{
    id: 'default',
    order: 1,
    ...defaultStyleRuntime,
  }],
}
