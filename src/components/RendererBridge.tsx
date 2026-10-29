import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'

import useRendererStore from '@/store/rendererStore'

const RendererBridge = () => {
  const gl = useThree(s => s.gl)
  const advance = useThree(s => s.advance)
  const setFrameloop = useThree(s => s.setFrameloop)
  const setRenderer = useRendererStore(s => s.setRenderer)

  useEffect(() => {
    setRenderer({ gl, advance, setFrameloop })
    return () => setRenderer(null)
  }, [gl, advance, setFrameloop, setRenderer])

  return null
}

export default RendererBridge
