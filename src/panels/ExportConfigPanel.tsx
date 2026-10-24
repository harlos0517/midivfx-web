import { Select, Stack, Switch } from '@mantine/core'

import useConfig from '@/hooks/useConfig'

const ExportConfigPanel = () => {
  const [fpsValue, setFpsValue] = useConfig(
    c => c.export.fps,
    (c, v) => { c.export.fps = v },
  )
  const [alphaValue, setAlphaValue] = useConfig(
    c => c.export.alpha,
    (c, v) => { c.export.alpha = v },
  )

  return <Stack p="md" h="100%" style={{ overflowY: 'auto' }}>
    <Select
      label="FPS"
      value={fpsValue.toString()}
      onChange={v => setFpsValue(Number(v))}
      data={['15', '24', '30', '60']}
    />
    <Switch
      label="Alpha Channel"
      checked={alphaValue}
      onChange={e => setAlphaValue(e.currentTarget.checked)}
    />
  </Stack>

}

export default ExportConfigPanel
