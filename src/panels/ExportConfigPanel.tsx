import { Button, Group, Progress, Select, Switch, Text } from '@mantine/core'
import { useContext } from 'react'

import PanelWrapper from '@/components/PanelWrapper'
import MidiFileContext from '@/context/MidiFileContext'
import useExportConfig from '@/hooks/useExportConfig'
import useConfigStore from '@/store/configStore'
import useExportStore from '@/store/exportStore'
import useRendererStore from '@/store/rendererStore'

const ExportConfigPanel = () => {
  const [fps, setFps] = useExportConfig('fps')
  const [alpha, setAlpha] = useExportConfig('alpha')
  const { midiData, playback } = useContext(MidiFileContext)
  const renderer = useRendererStore(s => s.renderer)

  const progress = useExportStore(s => s.progress)
  const error = useExportStore(s => s.error)
  const start = useExportStore(s => s.start)
  const cancel = useExportStore(s => s.cancel)

  const onExport = () => {
    if (!renderer || !playback) return
    const { startTime, endTime } = useConfigStore.getState().config.playback
    void start({ renderer, playback, midiData, fps, alpha, startTime, endTime })
  }

  const exporting = progress !== null

  return <PanelWrapper isExportPanel>
    <Select
      label="FPS"
      value={fps.toString()}
      onChange={v => setFps(Number(v))}
      data={['15', '24', '30', '60']}
      disabled={exporting}
    />
    <Switch
      label="Alpha Channel (WebM)"
      checked={alpha}
      onChange={e => setAlpha(e.currentTarget.checked)}
      disabled={exporting}
    />
    {exporting
      ? <Group gap="xs" wrap="nowrap">
        <Progress value={progress * 100} style={{ flex: 1 }} />
        <Text size="xs" w={36} ta="right">{Math.round(progress * 100)}%</Text>
        <Button size="xs" variant="default" onClick={cancel}>
          Cancel
        </Button>
      </Group>
      : <Button onClick={onExport} disabled={!renderer || !playback}>
        Export {alpha ? 'WebM' : 'MP4'}
      </Button>}
    {error && <Text size="sm" c="red">{error}</Text>}
  </PanelWrapper>

}

export default ExportConfigPanel
