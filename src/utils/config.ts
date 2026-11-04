/** `fill`: solid, `decay`: fades over time, `CC`: opacity follows the `cc` controller. */
export type NoteMode = 'fill' | 'decay' | 'CC'

export interface PlaybackConfig {
  /** Start of playback and export (ms); negative = blank time before the song. */
  startTime: number
  /** End of playback and export (ms); past the song = blank time after it. Defaults to length. */
  endTime?: number
  /** Audio delay relative to visual (ms); positive = audio starts later. */
  audioOffset: number
}

export interface ExportConfig {
  /** Canvas size in pixels; also the preview's, since canvas pixels are output pixels. */
  width: number
  height: number
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
  /** Time-axis scale in world units per second; one pitch is 1 unit tall. */
  unitsPerSecond: number
  beat: boolean
  bloom: boolean
  bloomIntensity: number
  /** Minimum luminance (0-1) that glows; note colors stop at 1, so at 1 nothing does. */
  bloomThreshold: number
  bloomRadius: number
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
  thickness: number
  radius: number
  z: number
  decayRate: number
  showPedal: boolean
  pedalColor: string
  /** 1-based track and channel whose sustain pedal applies; 0 = the note's own. */
  pedalTrack: number
  pedalChannel: number
  /** 1-based track and channel whose `cc` sets the opacity; 0 = the note's own. */
  ccTrack: number
  ccChannel: number
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
  cc: 11,
  isRegex: true,
  velocity: false,
  color: '#ffffff',
  thickness: 1,
  radius: 0.33,
  z: 0.00,
  decayRate: 0.0,
  showPedal: true,
  pedalColor: '#444444',
  pedalTrack: 0,
  pedalChannel: 0,
  ccTrack: 0,
  ccChannel: 0,
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
    startTime: -3000,
    audioOffset: 0,
  },
  export: {
    width: 1920,
    height: 1080,
    fps: 60,
    alpha: false,
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
    unitsPerSecond: 20,
    beat: false,
    bloom: false,
    bloomIntensity: 1,
    bloomThreshold: 0,
    bloomRadius: 0.85,
  },
  styles: [{
    id: 'default',
    order: 1,
    ...defaultStyleRuntime,
  }],
}

/**
 * Fills in defaults per section, so options added since a config was saved get their defaults,
 * and moves keys that changed section in older configs.
 */
export const mergeConfig = (saved: Partial<Config>): Config => {
  // Width and height lived in `display` before they moved to `export`
  type LegacyDisplay = Partial<DisplayConfig & Pick<ExportConfig, 'width' | 'height'>>
  const { width, height, ...display } = (saved.display ?? {}) as LegacyDisplay
  return {
    ...defaultConfig,
    ...saved,
    playback: { ...defaultConfig.playback, ...saved.playback },
    export: {
      ...defaultConfig.export,
      ...(width !== undefined && { width }),
      ...(height !== undefined && { height }),
      ...saved.export,
    },
    camera: { ...defaultConfig.camera, ...saved.camera },
    display: { ...defaultConfig.display, ...display },
  }
}
