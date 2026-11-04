import { Button, Group, Progress, Select, Switch, Text } from '@mantine/core'
import { useContext } from 'react'

import ConfigOptionNumberInputRow from '@/components/ConfigOptionNumberInputRow'
import ConfigOptionRow from '@/components/ConfigOptionRow'
import PanelWrapper from '@/components/PanelWrapper'
import MidiFileContext from '@/context/MidiFileContext'
import useExportConfig from '@/hooks/useExportConfig'
import useConfigStore from '@/store/configStore'
import useExportStore from '@/store/exportStore'
import { useMessages } from '@/store/localeStore'
import useRendererStore from '@/store/rendererStore'
import { getNumberInputProps } from '@/utils/input'

import AlphaIcon from '@/assets/icons/alpha.svg?react'
import FPSIcon from '@/assets/icons/fps.svg?react'
import HeightIcon from '@/assets/icons/height.svg?react'
import WidthIcon from '@/assets/icons/width.svg?react'

const ExportConfigPanel = () => {
  const m = useMessages()
  const [width, setWidth] = useExportConfig('width')
  const [height, setHeight] = useExportConfig('height')
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
    <ConfigOptionNumberInputRow
      label={<WidthIcon />}
      tooltip={m.export.width}
      value={width}
      {...getNumberInputProps(640, 3840, 20, [1280, 1920, 2560], true)}
      onChange={setWidth}
      rightSection="px"
      rightSectionWidth={32}
      disabled={exporting}
    />
    <ConfigOptionNumberInputRow
      label={<HeightIcon />}
      tooltip={m.export.height}
      value={height}
      {...getNumberInputProps(360, 2160, 20, [720, 1080, 1440], true)}
      onChange={setHeight}
      rightSection="px"
      rightSectionWidth={32}
      disabled={exporting}
    />
    <Group>
      <ConfigOptionRow label={<FPSIcon />} tooltip={m.export.fps}>
        <Select
          flex="1"
          aria-label={m.export.fps.name}
          value={fps.toString()}
          onChange={v => setFps(Number(v))}
          data={['15', '24', '30', '60']}
          disabled={exporting}
        />
      </ConfigOptionRow>
      <ConfigOptionRow label={<AlphaIcon />} tooltip={m.export.alpha}>
        <Switch
          flex="1"
          aria-label={m.export.alpha.name}
          checked={alpha}
          onChange={e => setAlpha(e.currentTarget.checked)}
          disabled={exporting}
        />
      </ConfigOptionRow>
    </Group>
    {exporting
      ? <Group>
        <Progress value={progress * 100} style={{ flex: 1 }} />
        <Text size="xs" w={36} ta="right">{Math.round(progress * 100)}%</Text>
        <Button size="xs" variant="default" onClick={cancel}>
          {m.export.cancel}
        </Button>
      </Group>
      : <Button
        onClick={onExport}
        disabled={!renderer || !playback || !midiData}
        h={40}
      >
        {m.export.start(alpha ? 'WebM' : 'MP4')}
      </Button>}
    {error && <Text size="sm" c="red">{error}</Text>}
  </PanelWrapper>

}

export default ExportConfigPanel
