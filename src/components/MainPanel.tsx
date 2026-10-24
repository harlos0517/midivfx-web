import { Box } from '@mantine/core'
import { useElementSize } from '@mantine/hooks'
import { Canvas } from '@react-three/fiber'
import { useContext } from 'react'

import CameraControls from '@/components/CameraControls'
import CanvasRenderer from '@/components/CanvasRenderer'
import MidiFileContext from '@/context/MidiFileContext'

const MainPanel = () => {
  const { config } = useContext(MidiFileContext)

  const { width, height } = config.display
  const { ref: panelRef, width: panelWidth, height: panelHeight } = useElementSize()
  const scale = panelWidth && panelHeight ? Math.min(panelWidth / width, panelHeight / height) : 0

  return <Box ref={panelRef} h="100%" pos="relative" style={{ overflow: 'hidden' }}>
    <Box
      w={width} h={height} bg="black"
      pos="absolute" top="50%" left="50%"
      style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
    >
      <Canvas
        dpr={1}
        resize={{ offsetSize: true }}
        camera={{ fov: 75, near: 0.1, far: 2000, position: [0, 64, 100] }}
      >
        <CameraControls />
        <CanvasRenderer />
      </Canvas>
    </Box>
  </Box>
}

export default MainPanel
