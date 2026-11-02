import { createTheme, MantineProvider } from '@mantine/core'
import { IconContext } from '@phosphor-icons/react'

import AppRouter from '@/AppRouter'

import { ICON_SIZE } from '@/utils/const'

import '@mantine/core/styles.css'

import './assets/styles/main.sass'



const theme = createTheme({})

export const App = () =>
  <MantineProvider theme={theme} defaultColorScheme="dark">
    <IconContext.Provider value={{ size: ICON_SIZE }}>
      <AppRouter />
    </IconContext.Provider>
  </MantineProvider>

export default App
