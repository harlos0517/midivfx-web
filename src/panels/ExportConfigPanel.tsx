import { Select, Stack, Switch } from '@mantine/core'

import useExportConfig from '@/hooks/useExportConfig'

const ExportConfigPanel = () => {
  const [fps, setFps] = useExportConfig('fps')
  const [alpha, setAlpha] = useExportConfig('alpha')

  return <Stack p="md" h="100%" style={{ overflowY: 'auto' }}>
    <Select
      label="FPS"
      value={fps.toString()}
      onChange={v => setFps(Number(v))}
      data={['15', '24', '30', '60']}
    />
    <Switch
      label="Alpha Channel"
      checked={alpha}
      onChange={e => setAlpha(e.currentTarget.checked)}
    />
  </Stack>

}

export default ExportConfigPanel
