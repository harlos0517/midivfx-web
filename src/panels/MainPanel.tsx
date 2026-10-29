import { Box } from '@mantine/core'
import { useElementSize } from '@mantine/hooks'
import { Canvas } from '@react-three/fiber'

import CameraControls from '@/components/CameraControls'
import CanvasRenderer from '@/components/CanvasRenderer'
import RendererBridge from '@/components/RendererBridge'
import useConfigStore from '@/store/configStore'

const MainPanel = () => {
  const width = useConfigStore(s => s.config.display.width)
  const height = useConfigStore(s => s.config.display.height)
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
        camera={{ fov: 75, near: 0.1, far: 2000, position: [0, 64, 100] }}
      >
        <RendererBridge />
        <CameraControls />
        <CanvasRenderer />
      </Canvas>
    </Box>
  </Box>
}

export default MainPanel
