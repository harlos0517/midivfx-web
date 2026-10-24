/** `fill`, `decay`, or a MIDI CC number such as `CC9`. */
export type NoteMode = 'fill' | 'decay' | `CC${number}`

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
}

export interface DisplayConfig {
  width: number
  height: number
  /** Pixels per microsecond. */
  speed: number
  beat: boolean
}

export interface Remap {
  mapStartPitch: number
  mapEndPitch: number
  color: string
}

export interface StyleRuntime {
  track: number[] | string // 1-based track numbers, all if empty, track if string
  channel: number[] // 1-based channel numbers, all if empt
  mode: NoteMode
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

export type StyleConfig = Partial<StyleRuntime>

export interface Config {
  playback: PlaybackConfig
  export: ExportConfig
  camera: CameraConfig
  display: DisplayConfig
  styles: StyleConfig[]
}

export const defaultStyleConfig: StyleRuntime = {
  track: [],
  channel: [],
  mode: 'fill',
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

export const defaultConfig: Config = {
  playback: {
    startPadding: 3000000,
    endPadding: 3000000,
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
    targetY: 0.0,
  },
  display: {
    width: 1920,
    height: 1080,
    speed: 0.02,
    beat: false,
  },
  styles: [{
    mode: 'fill',
    velocity: false,
    color: '#ffffff',
    gap: 0.1,
    radius: 0.33,
    z: 0.00,
    decayRate: 0.0,
    showPedal: true,
    pedalColor: '#444444',
  }],
}

export const parseStyle = (style: StyleConfig): StyleRuntime => ({
  ...defaultStyleConfig,
  ...style,
})

export const ALL_CHANNELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

export const exampleConfig: Config = {
  playback: {
    startPadding: 1000000,
    endPadding: 3000000,
    startTime: 0,
    audioOffset: 0,
  },
  export: {
    fps: 60,
    alpha: true,
  },
  camera: {
    x: 0.0,
    y: 0.0,
    z: 3200.0,
    targetX: 0.0,
    targetY: 0.0,
  },
  display: {
    width: 1920,
    height: 1080,
    speed: 0.001,
    beat: false,
  },
  styles: [
    { ...defaultStyleConfig },
    { track: 'piccolo', z: 0.60, color: '#ff4444' },
    { track: 'flute', z: 0.61, color: '#ff0000' },
    { track: 'oboe', z: 0.62, color: '#ff6600' },
    { track: 'clarinet', z: 0.63, color: '#ffcc00' },
    { track: 'bassoon', z: 0.41, color: '#660000' },
    { track: 'horn', z: 0.42, color: '#00ff88' },
    { track: 'trumpet', z: 0.43, color: '#00ffff' },
    { track: 'trombone', z: 0.44, color: '#00aaff' },
    { track: 'tuba', z: 0.45, color: '#0044aa' },
    { track: 'violin', z: 0.20, color: '#aa00ff' },
    { track: 'viola', z: 0.21, color: '#8800aa' },
    { track: 'cello', z: 0.22, color: '#440088' },
    { track: 'contrabass', z: 0.23, color: '#220044' },
    {
      track: 'glockenspiel',
      mode: 'decay',
      z: 0.01,
      color: '#ffffff',
      decayRate: 0.4,
    },
    {
      track: 'chimes',
      mode: 'decay',
      z: 0.02,
      color: '#aaaaaa',
      decayRate: 0.2,
    },
    {
      track: 'cymbal',
      mode: 'decay',
      z: 0.03,
      color: '#ffff00',
      decayRate: 0.25,
      remaps: [
        { mapStartPitch: 124, mapEndPitch: 127, color: '#ffff00' },
      ],
    },
    {
      track: 'bass drum',
      mode: 'decay',
      z: 0.04,
      color: '#444444',
      decayRate: 0.75,
      remaps: [
        { mapStartPitch: 0, mapEndPitch: 5, color: '#444444' },
      ],
    },
    {
      track: 'snare drum',
      mode: 'decay',
      z: 0.05,
      color: '#888888',
      decayRate: 0.9,
      remaps: [
        { mapStartPitch: 6, mapEndPitch: 12, color: '#888888' },
      ],
    },
    {
      track: 'timpani',
      mode: 'decay',
      z: 0.06,
      color: '#884400',
      decayRate: 0.25,
      remaps: [],
    },
  ],
}
