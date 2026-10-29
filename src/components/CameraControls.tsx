import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { type ComponentRef, useEffect, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import useConfigStore from '@/store/configStore'

const CameraControls = () => {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null!)
  const camera = useThree(s => s.camera)
  const { x, y, z, targetX, targetY } = useConfigStore(s => s.config.camera)

  // The config is the home view: orbiting moves away from it, and `r` returns to it
  useEffect(() => {
    const controls = controlsRef.current
    camera.position.set(x, y, z)
    controls.target.set(targetX, targetY, 0)
    controls.update()
    controls.saveState()
  }, [camera, x, y, z, targetX, targetY])

  useHotkeys('r', e => {
    e.preventDefault()
    controlsRef.current.reset()
  })

  return <OrbitControls ref={controlsRef} makeDefault />
}

export default CameraControls
