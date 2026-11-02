import { create } from 'zustand'

import en, { type Messages } from '@/i18n/en'
import zhTW from '@/i18n/zh-TW'

const dictionaries = { en, 'zh-TW': zhTW } satisfies Record<string, Messages>

export type Locale = keyof typeof dictionaries

/** Written in their own language, so they stay readable whichever locale is active. */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  'zh-TW': '繁體中文',
}

const isLocale = (value: string | null): value is Locale =>
  value !== null && value in dictionaries

const getInitialLocale = (): Locale => {
  try {
    const saved = localStorage.getItem('locale')
    if (isLocale(saved)) return saved
  } catch {
    // storage unavailable: fall back to the browser language
  }
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh-TW' : 'en'
}

interface LocaleStore {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const useLocaleStore = create<LocaleStore>(set => ({
  locale: getInitialLocale(),
  setLocale: locale => {
    localStorage.setItem('locale', locale)
    document.documentElement.lang = locale
    set({ locale })
  },
}))

document.documentElement.lang = useLocaleStore.getState().locale

export const useMessages = () => useLocaleStore(s => dictionaries[s.locale])

/** For code outside React. */
export const getMessages = () => dictionaries[useLocaleStore.getState().locale]

export default useLocaleStore
