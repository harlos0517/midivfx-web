import { MantineProvider } from '@mantine/core'
import { IconContext } from '@phosphor-icons/react'

import AppRouter from '@/AppRouter'
import GlobalErrorAlerts from '@/components/GlobalErrorAlerts'

import { theme } from '@/theme'
import { ICON_SIZE } from '@/utils/const'

import '@mantine/core/styles.css'
import '@mantine/dropzone/styles.css'

import './assets/styles/main.sass'


export const App = () =>
  <MantineProvider theme={theme} defaultColorScheme="dark">
    <IconContext.Provider value={{ size: ICON_SIZE }}>
      <AppRouter />
      <GlobalErrorAlerts />
    </IconContext.Provider>
  </MantineProvider>

export default App
