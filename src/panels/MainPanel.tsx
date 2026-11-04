import { Box, Stack, Text } from '@mantine/core'
import { useElementSize } from '@mantine/hooks'
import { Canvas } from '@react-three/fiber'
import { useContext } from 'react'

import CameraControls from '@/components/CameraControls'
import CanvasRenderer from '@/components/CanvasRenderer'
import RendererBridge from '@/components/RendererBridge'
import MidiFileContext from '@/context/MidiFileContext'
import useConfigStore from '@/store/configStore'
import { useMessages } from '@/store/localeStore'

import MIDIIcon from '@/assets/icons/midi.svg?react'

const MainPanel = () => {
  const m = useMessages()
  const { midiData } = useContext(MidiFileContext)
  const width = useConfigStore(s => s.config.export.width)
  const height = useConfigStore(s => s.config.export.height)
  const { ref: panelRef, width: panelWidth, height: panelHeight } = useElementSize()
  const scale = panelWidth && panelHeight ? Math.min(panelWidth / width, panelHeight / height) : 0

  return <Box ref={panelRef} h="100%" pos="relative" style={{ overflow: 'hidden' }}>
    <Box
      bg="black"
      pos="absolute" top="50%" left="50%"
      style={{ width, height, transform: `translate(-50%, -50%) scale(${scale})` }}
    >
      <Canvas
        dpr={1}
        resize={{ offsetSize: true }}
        camera={{ fov: 75, near: 0.1, far: 2000 }}
      >
        <RendererBridge />
        <CameraControls />
        <CanvasRenderer />
      </Canvas>
    </Box>
    {/* Only a hint: the Import panel's full-screen dropzone takes the drop */}
    {!midiData && <Box bg="rgba(0, 0, 0, 0.5)" pos="absolute" inset="0">
      <Stack
        pos="absolute" inset="1rem"
        align="center" justify="center" ta="center" p="md"
        bd="dashed 2px var(--mantine-color-dark-3)" bdrs="md"
        c="dimmed"
        style={{ pointerEvents: 'none' }}
      >
        <MIDIIcon width={48} height={48} />
        <Text size="lg">{m.main.empty.title}</Text>
        <Text size="sm">{m.main.empty.desc}</Text>
      </Stack>
    </Box>}
  </Box>
}

export default MainPanel
