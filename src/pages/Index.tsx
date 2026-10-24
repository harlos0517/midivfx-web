import { Box } from '@mantine/core'
import { useEffect, useMemo, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import MidiFileContext from '@/context/MidiFileContext'
import MainPanel from '@/panels/MainPanel'
import { exampleConfig } from '@/utils/config'
import type { MidiData } from '@/utils/midi'
import Playback from '@/utils/Playback'
import { DockviewReact, themeDark } from 'dockview-react'

import ImportPanel from '@/panels/ImportPanel'
import PlaybackConfigPanel from '@/panels/PlaybackConfigPanel'
import 'dockview-react/dist/styles/dockview.css'

const Index = () => {
  const [midiData, setMidiData] = useState<MidiData | null>(null)
  const playback = useMemo(() => new Playback(), [])

  useEffect(() => () => playback.dispose(), [playback])

  useHotkeys('space', e => {
    e.preventDefault()
    playback?.togglePlay()
  })

  useHotkeys('home', e => {
    e.preventDefault()
    playback?.seek(0)
  })

  useHotkeys('end', e => {
    e.preventDefault()
    playback?.seek(playback?.duration ?? 0)
  })

  useHotkeys('ArrowLeft', e => {
    e.preventDefault()
    playback?.seek(Math.max((playback?.currentTime ?? 0) - 1000, 0))
  })

  useHotkeys('ArrowRight', e => {
    e.preventDefault()
    playback?.seek(Math.min((playback?.currentTime ?? 0) + 1000, playback?.duration ?? 0))
  })

  return <MidiFileContext.Provider
    value={{ midiData, setMidiData, playback, config: exampleConfig }}
  >
    <Box h="100dvh" style={{ overflow: 'hidden' }}>
      <DockviewReact
        theme={themeDark}
        components={{
          main: MainPanel,
          playback: PlaybackConfigPanel,
          import: ImportPanel,
        }}
        onReady={event => {
          event.api.addPanel({ id: 'Main', component: 'main' })
          event.api.addPanel({
            id: 'Import', component: 'import',
            position: { referencePanel: 'Main', direction: 'below' },
          })
          event.api.addPanel({
            id: 'Playback', component: 'playback',
            position: { referencePanel: 'Import', direction: 'right' },
          })
        }}
      />
    </Box>
  </MidiFileContext.Provider>
}

export default Index
