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

export const defaultStyleConfig: Omit<StyleRuntime, 'id' | 'order'> = {
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
    targetY: 0.0,
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

export const exampleConfig: Config = {
  playback: {
    startPadding: 1000,
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
    y: 0.0,
    z: 3200.0,
    targetX: 0.0,
    targetY: 0.0,
  },
  display: {
    width: 1920,
    height: 1080,
    speed: 1,
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
      mode: 'decay' as const,
      z: 0.01,
      color: '#ffffff',
      decayRate: 0.4,
    },
    {
      track: 'chimes',
      mode: 'decay' as const,
      z: 0.02,
      color: '#aaaaaa',
      decayRate: 0.2,
    },
    {
      track: 'cymbal',
      mode: 'decay' as const,
      z: 0.03,
      color: '#ffff00',
      decayRate: 0.25,
      remaps: [
        { mappedPitch: [124, 127] as [number, number], color: '#ffff00' },
      ],
    },
    {
      track: 'bass drum',
      mode: 'decay' as const,
      z: 0.04,
      color: '#444444',
      decayRate: 0.75,
      remaps: [
        { mappedPitch: [0, 5] as [number, number], color: '#444444' },
      ],
    },
    {
      track: 'snare drum',
      mode: 'decay' as const,
      z: 0.05,
      color: '#888888',
      decayRate: 0.9,
      remaps: [
        { mappedPitch: [6, 12] as [number, number], color: '#888888' },
      ],
    },
    {
      track: 'timpani',
      mode: 'decay' as const,
      z: 0.06,
      color: '#884400',
      decayRate: 0.25,
      remaps: [],
    },
  ].map((s, i) => ({ id: window.crypto.randomUUID(), order: i, ...s })),
}
