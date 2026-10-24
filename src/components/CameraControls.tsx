import { OrbitControls } from '@react-three/drei'
import { type ComponentRef, useEffect, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

const CameraControls = () => {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null!)

  useEffect(() => {
    const controls = controlsRef.current
    controls.update()
    controls.saveState()
  }, [])

  useHotkeys('r', e => {
    e.preventDefault()
    controlsRef.current.reset()
  })

  return <OrbitControls ref={controlsRef} makeDefault target={[0, 64, 0]} />
}

export default CameraControls
