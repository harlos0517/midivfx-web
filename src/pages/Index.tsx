import { Box } from '@mantine/core'
import { Buffer } from 'buffer'
import { useEffect, useMemo, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import MainPanel from '@/components/MainPanel'
import MidiFileContext from '@/context/MidiFileContext'
import { exampleConfig } from '@/utils/config'
import type { MidiData } from '@/utils/midi'
import { parseMidiFile } from '@/utils/midi'
import Playback from '@/utils/Playback'
import { DockviewReact, themeDark } from 'dockview-react'

import 'dockview-react/dist/styles/dockview.css'

const Index = () => {
  const [midiData, setMidiData] = useState<MidiData | null>(null)
  const playback = useMemo(() => new Playback(), [])
  playback.loadAudio('/nine_point_eight-orchestra-v2.4.mp3')

  useEffect(() => () => playback.dispose(), [playback])

  useEffect(() => {
    const data = fetch('/nine_point_eight-orchestra-v2.4.mid')
    data.then(response => response.arrayBuffer())
      .then(buffer => setMidiData(parseMidiFile(Buffer.from(buffer))))
  }, [])


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

  return <MidiFileContext.Provider value={{ midiData, playback, config: exampleConfig }}>
    <Box h="100dvh" style={{ overflow: 'hidden' }}>
      <DockviewReact
        theme={themeDark}
        components={{
          main: MainPanel,
          import: () => <div>Import</div>,
          settings: () => <div>Settings</div>,
        }}
        onReady={event => {
          event.api.addPanel({
            id: 'main',
            component: 'main',
          })
        }}
      />
    </Box>
  </MidiFileContext.Provider>
}

export default Index
