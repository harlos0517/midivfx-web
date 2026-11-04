import { MantineProvider } from '@mantine/core'
import { IconContext } from '@phosphor-icons/react'
import { useMemo } from 'react'

import AppRouter from '@/AppRouter'
import GlobalErrorAlerts from '@/components/GlobalErrorAlerts'
import useThemeStore from '@/store/themeStore'

import { theme } from '@/theme'
import { ICON_SIZE } from '@/utils/const'

import '@mantine/core/styles.css'
import '@mantine/dropzone/styles.css'

import './assets/styles/main.sass'


export const App = () => {
  const themeColor = useThemeStore(s => s.themeColor)
  const themed = useMemo(() => ({ ...theme, primaryColor: themeColor }), [themeColor])

  return <MantineProvider theme={themed} defaultColorScheme="dark">
    <IconContext.Provider value={{ size: ICON_SIZE }}>
      <AppRouter />
      <GlobalErrorAlerts />
    </IconContext.Provider>
  </MantineProvider>
}

export default App
