import { create } from 'zustand'

/** Mantine's built-in palettes, which come with all the shades a primary color needs. */
export const themeColors = [
  'blue', 'cyan', 'teal', 'green', 'lime', 'yellow',
  'orange', 'red', 'pink', 'grape', 'violet', 'indigo',
] as const

export type ThemeColor = typeof themeColors[number]

const isThemeColor = (value: string | null): value is ThemeColor =>
  themeColors.includes(value as ThemeColor)

const getInitialThemeColor = (): ThemeColor => {
  try {
    const saved = localStorage.getItem('themeColor')
    if (isThemeColor(saved)) return saved
  } catch {
    // storage unavailable: fall back to the default
  }
  return 'blue'
}

interface ThemeStore {
  themeColor: ThemeColor
  setThemeColor: (themeColor: ThemeColor) => void
}

const useThemeStore = create<ThemeStore>(set => ({
  themeColor: getInitialThemeColor(),
  setThemeColor: themeColor => {
    try {
      localStorage.setItem('themeColor', themeColor)
    } catch {
      // storage unavailable: the choice lasts until reload
    }
    set({ themeColor })
  },
}))

export default useThemeStore
