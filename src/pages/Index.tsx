import { Box } from '@mantine/core'
import {
  DockviewApi,
  DockviewReact,
  themeDark,
  type DockviewReadyEvent,
  type SerializedDockview,
} from 'dockview-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import MidiFileContext from '@/context/MidiFileContext'
import type { MidiData } from '@/utils/midi'
import Playback from '@/utils/Playback'

import CameraConfigPanel from '@/panels/CameraConfigPanel'
import DisplayConfigPanel from '@/panels/DisplayConfigPanel'
import ExportConfigPanel from '@/panels/ExportConfigPanel'
import ImportConfigPanel from '@/panels/ImportConfigPanel'
import MainPanel from '@/panels/MainPanel'
import PlaybackConfigPanel from '@/panels/PlaybackConfigPanel'
import StylesConfigPanel from '@/panels/StylesConfigPanel'
import TracksPanel from '@/panels/TracksPanel'

import 'dockview-react/dist/styles/dockview.css'

const Index = () => {
  const [midiData, setMidiData] = useState<MidiData | null>(null)
  const playback = useMemo(() => new Playback(), [])

  useEffect(() => () => playback.dispose(), [playback])

  const [api, setApi] = useState<DockviewApi>()
  const components = useMemo(() => ({
    main: MainPanel,
    playback: PlaybackConfigPanel,
    import: ImportConfigPanel,
    export: ExportConfigPanel,
    camera: CameraConfigPanel,
    display: DisplayConfigPanel,
    styles: StylesConfigPanel,
    tracks: TracksPanel,
  }), [])

  const loadDefaultLayout = useCallback(() => {
    if (!api) return
    api.addPanel({ id: 'Main', component: 'main' })
    api.addPanel({
      id: 'Tracks', component: 'tracks',
      position: { referencePanel: 'Main', direction: 'left' },
      minimumWidth: 200,
    })
    api.addPanel({
      id: 'Styles', component: 'styles',
      position: { referencePanel: 'Main', direction: 'right' },
    })
    api.addPanel({
      id: 'Import', component: 'import',
      position: { referencePanel: 'Main', direction: 'below' },
    })
    api.addPanel({
      id: 'Playback', component: 'playback',
      position: { referencePanel: 'Import', direction: 'right' },
    })
    api.addPanel({
      id: 'Camera', component: 'camera',
      position: { referencePanel: 'Playback', direction: 'right' },
    })
    api.addPanel({
      id: 'Display', component: 'display',
      position: { referencePanel: 'Camera', direction: 'right' },
    })
    api.addPanel({
      id: 'Export', component: 'export',
      position: { referencePanel: 'Import', direction: 'below' },
    })

    api.getPanel('Tracks')?.api.setSize({ width: 320 })
  }, [api])

  useEffect(() => {
    if (!api) return

    // const mySerializedLayout = localStorage.getItem('layout')
    // if (mySerializedLayout) {
    //   try {
    //     const layout = JSON.parse(mySerializedLayout)
    //     api.fromJSON(layout)
    //   } catch(err) {
    //     console.error(err)
    //     loadDefaultLayout()
    //   }
    // } else loadDefaultLayout()
    loadDefaultLayout()

    const disposable = api.onDidLayoutChange(() => {
      const layout: SerializedDockview = api.toJSON()
      localStorage.setItem('layout', JSON.stringify(layout))
    })

    return () => disposable.dispose()
  }, [api, loadDefaultLayout])

  const onReady = (event: DockviewReadyEvent) => {
    setApi(event.api)
  }

  useEffect(() => () => {
    playback.dispose()
  }, [playback])

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
    value={{ midiData, setMidiData, playback }}
  >
    <Box h="100dvh" style={{ overflow: 'hidden' }}>
      <DockviewReact
        theme={themeDark}
        components={components}
        onReady={onReady}
      />
    </Box>
  </MidiFileContext.Provider>
}

export default Index
