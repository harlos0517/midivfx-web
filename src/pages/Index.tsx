import { Box } from '@mantine/core'
import {
  DockviewApi,
  DockviewDefaultTab,
  DockviewReact,
  themeDark,
  type DockviewReadyEvent,
  type IDockviewPanelHeaderProps,
  type SerializedDockview,
} from 'dockview-react'
import { useEffect, useMemo, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import MidiFileContext from '@/context/MidiFileContext'
import useConfigStore from '@/store/configStore'
import { useIsExporting } from '@/store/exportStore'
import type { AudioPeaks } from '@/utils/audio'
import type { MidiData } from '@/utils/midi'
import Playback from '@/utils/Playback'
import { getLength } from '@/utils/timeline'

import CameraConfigPanel from '@/panels/CameraConfigPanel'
import DisplayConfigPanel from '@/panels/DisplayConfigPanel'
import ExportConfigPanel from '@/panels/ExportConfigPanel'
import ImportConfigPanel from '@/panels/ImportConfigPanel'
import MainPanel from '@/panels/MainPanel'
import NavigatorPanel from '@/panels/NavigatorPanel'
import PlaybackConfigPanel from '@/panels/PlaybackConfigPanel'
import StylesConfigPanel from '@/panels/StylesConfigPanel'
import TracksPanel from '@/panels/TracksPanel'

import 'dockview-react/dist/styles/dockview.css'

const NonClosableTab = (props: IDockviewPanelHeaderProps) =>
  <DockviewDefaultTab {...props} hideClose />

const Index = () => {
  const [midiData, setMidiData] = useState<MidiData | null>(null)
  const [audioPeaks, setAudioPeaks] = useState<AudioPeaks | null>(null)
  const playback = useMemo(() => {
    const playback = new Playback()
    playback.seek(useConfigStore.getState().config.playback.startTime)
    return playback
  }, [])
  const { startTime, endTime, audioOffset } = useConfigStore(s => s.config.playback)

  const [api, setApi] = useState<DockviewApi>()
  const components = useMemo(() => ({
    main: MainPanel,
    navigator: NavigatorPanel,
    playback: PlaybackConfigPanel,
    import: ImportConfigPanel,
    export: ExportConfigPanel,
    camera: CameraConfigPanel,
    display: DisplayConfigPanel,
    styles: StylesConfigPanel,
    tracks: TracksPanel,
  }), [])

  const loadDefaultLayout = (api: DockviewApi) => {
    if (!api) return
    api.addPanel({ id: 'Main', component: 'main' })
    api.addPanel({
      id: 'Navigator', component: 'navigator',
      position: { referencePanel: 'Main', direction: 'below' },
      minimumHeight: 34,
    })
    api.getPanel('Navigator')?.api.setSize({ height: 130 })
    api.addPanel({
      id: 'Tracks', component: 'tracks',
      position: { referencePanel: 'Main', direction: 'left' },
      minimumWidth: 200,
    })
    api.addPanel({
      id: 'Styles', component: 'styles',
      position: { referencePanel: 'Main', direction: 'right' },
      minimumWidth: 320,
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

    api.getPanel('Tracks')?.api.setSize({ width: 330 })
    api.getPanel('Styles')?.api.setSize({ width: 330 })
  }

  useEffect(() => {
    if (!api) return

    const disposable = api.onDidLayoutChange(() => {
      const layout: SerializedDockview = api.toJSON()
      localStorage.setItem('layout', JSON.stringify(layout))
    })

    return () => disposable.dispose()
  }, [api])

  const onReady = (event: DockviewReadyEvent) => {
    setApi(event.api)

    const mySerializedLayout = localStorage.getItem('layout')
    if (mySerializedLayout) {
      try {
        const layout = JSON.parse(mySerializedLayout)
        event.api.fromJSON(layout)
      } catch(err) {
        console.error(err)
        loadDefaultLayout(event.api)
      }
    } else loadDefaultLayout(event.api)
    // loadDefaultLayout(event.api)
  }

  useEffect(() => () => {
    playback.dispose()
  }, [playback])

  useEffect(() => {
    playback.setAudioOffset(audioOffset)
  }, [playback, audioOffset])

  useEffect(() => {
    playback.setRange(startTime, endTime ?? getLength(midiData, playback))
  }, [playback, startTime, endTime, midiData])

  const length = () => getLength(midiData, playback)

  // The export drives the playback clock itself, so the transport keys must leave it alone
  const enabled = !useIsExporting()

  useHotkeys('space', e => {
    e.preventDefault()
    playback.togglePlay()
  }, { enabled })

  useHotkeys('home', e => {
    e.preventDefault()
    playback.seek(Math.min(0, startTime))
  }, { enabled })

  useHotkeys('end', e => {
    e.preventDefault()
    playback.seek(Math.max(length(), endTime ?? length()))
  }, { enabled })

  useHotkeys('ArrowLeft', e => {
    e.preventDefault()
    playback.seek(Math.max(playback.currentTime - 1000, Math.min(0, startTime)))
  }, { enabled })

  useHotkeys('ArrowRight', e => {
    e.preventDefault()
    playback.seek(Math.min(playback.currentTime + 1000, Math.max(length(), endTime ?? length())))
  }, { enabled })

  useHotkeys('[', e => {
    e.preventDefault()
    playback.seek(startTime)
  }, { useKey: true, enabled })

  useHotkeys(']', e => {
    e.preventDefault()
    playback.seek(endTime ?? length())
  }, { useKey: true, enabled })

  return <MidiFileContext.Provider
    value={{ midiData, setMidiData, audioPeaks, setAudioPeaks, playback }}
  >
    <Box h="100dvh" style={{ overflow: 'hidden' }}>
      <DockviewReact
        theme={themeDark}
        components={components}
        defaultTabComponent={NonClosableTab}
        onReady={onReady}
      />
    </Box>
  </MidiFileContext.Provider>
}

export default Index
