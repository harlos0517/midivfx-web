import {
  defaultConfig,
  defaultStyleRuntime,
  type CameraConfig,
  type Config,
  type DisplayConfig,
  type StyleConfig,
} from '@/utils/config'

/** Bump when the file shape changes, and migrate older versions in `parseConfigFile`. */
export const CONFIG_FILE_VERSION = 1

/** Playback and export are left out: they belong to one song or one render, not to a look. */
export const configSections = ['camera', 'display', 'styles'] as const
export type ConfigSection = typeof configSections[number]

export interface ConfigFile {
  app: 'midivfx'
  version: number
  camera?: CameraConfig
  /** The camera's framing depends on the aspect ratio, so the resolution travels with it. */
  resolution?: { width: number, height: number }
  display?: DisplayConfig
  styles?: StyleConfig[]
}

export class ConfigFileError extends Error {
  constructor(readonly reason: 'invalid' | 'newer') {
    super(reason)
  }
}

export const createConfigFile = (config: Config, sections: ConfigSection[]): ConfigFile => ({
  app: 'midivfx',
  version: CONFIG_FILE_VERSION,
  ...(sections.includes('camera') && {
    camera: config.camera,
    resolution: { width: config.export.width, height: config.export.height },
  }),
  ...(sections.includes('display') && { display: config.display }),
  ...(sections.includes('styles') && { styles: config.styles }),
})

export const downloadConfigFile = (file: ConfigFile, name = 'midivfx-config.json') => {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' }),
  )
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  // Revoking right after click() can cancel the download in some browsers
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

export const parseConfigFile = (text: string): ConfigFile => {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    throw new ConfigFileError('invalid')
  }
  if (!isObject(data) || data.app !== 'midivfx' || typeof data.version !== 'number')
    throw new ConfigFileError('invalid')
  if (data.version > CONFIG_FILE_VERSION) throw new ConfigFileError('newer')

  const { camera, display, styles, resolution } = data
  if (camera !== undefined && !isObject(camera)) throw new ConfigFileError('invalid')
  if (display !== undefined && !isObject(display)) throw new ConfigFileError('invalid')
  if (resolution !== undefined && !isObject(resolution)) throw new ConfigFileError('invalid')
  if (styles !== undefined && !(
    Array.isArray(styles) && styles.every(s => isObject(s) && typeof s.id === 'string')
  )) throw new ConfigFileError('invalid')

  return data as unknown as ConfigFile
}

export const getFileSections = (file: ConfigFile) =>
  configSections.filter(section => file[section] !== undefined)

const importStyles = (styles: StyleConfig[]): StyleConfig[] => {
  const sorted = [...styles].sort((a, b) => a.order - b.order)
  const fileDefault = sorted.find(s => s.id === 'default')
  // The default style must exist, come first and set every key, or the cascade has gaps
  const base: StyleConfig = { ...defaultConfig.styles[0]!, ...defaultStyleRuntime, ...fileDefault }
  return [base, ...sorted.filter(s => s.id !== 'default')]
    .map((s, i) => ({ ...s, order: i + 1 }))
}

export const applyConfigFile = (
  config: Config,
  file: ConfigFile,
  sections: ConfigSection[],
  applyResolution: boolean,
): Config => ({
  ...config,
  ...(sections.includes('camera') && file.camera && {
    camera: { ...defaultConfig.camera, ...file.camera },
  }),
  ...(sections.includes('camera') && applyResolution && file.resolution && {
    export: { ...config.export, ...file.resolution },
  }),
  ...(sections.includes('display') && file.display && {
    display: { ...defaultConfig.display, ...file.display },
  }),
  // Replaced as a whole: the order decides which style wins, so merging two lists mixes cascades
  ...(sections.includes('styles') && file.styles && { styles: importStyles(file.styles) }),
})
