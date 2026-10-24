import { createTheme, MantineProvider } from '@mantine/core'

import AppRouter from '@/AppRouter'

import '@mantine/core/styles.css'

import './assets/styles/main.sass'


const theme = createTheme({})

export const App = () =>
  <MantineProvider theme={theme} defaultColorScheme="dark">
    <AppRouter />
  </MantineProvider>

export default App
