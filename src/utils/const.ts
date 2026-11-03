import type { Locale } from '@/store/localeStore'

export const ICON_SIZE = 20

export const DIMMED = '#666666'

export const REPO_URL = 'https://github.com/harlos0517/midivfx-web'
export const WEBSITE_URL = 'https://harlos.music'

const SUPPORT_URL_ZH_TW = 'https://www.hivebee.com.tw/harlosmusic/Donate'
const SUPPORT_URL = 'https://ko-fi.com/harlosmusic'

export const getSupportUrl = (locale: Locale) =>
  locale === 'zh-TW' ? SUPPORT_URL_ZH_TW : SUPPORT_URL
