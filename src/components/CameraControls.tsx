import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { type ComponentRef, useEffect, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import useConfigStore from '@/store/configStore'
import { useIsExporting } from '@/store/exportStore'
import { type CameraConfig, defaultConfig } from '@/utils/config'
import { roundTo } from '@/utils/round'

/** Save the view at most this often while the camera moves; damping can glide for seconds. */
const SAVE_INTERVAL_MS = 250

const isSameView = (a: CameraConfig, b: CameraConfig) =>
  (Object.keys(a) as (keyof CameraConfig)[]).every(key => a[key] === b[key])

const CameraControls = () => {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null!)
  // Set while the config is being applied, so that movement isn't saved back
  const applyingRef = useRef(false)
  // The view last saved from orbiting, which the camera is already at (or gliding past)
  const savedRef = useRef<CameraConfig | null>(null)
  const camera = useThree(s => s.camera)
  const { x, y, z, targetX, targetY, targetZ } = useConfigStore(s => s.config.camera)
  const setConfig = useConfigStore(s => s.setConfig)

  // Config changes (panel edits, `r`) move the camera
  useEffect(() => {
    const controls = controlsRef.current
    const view = { x, y, z, targetX, targetY, targetZ }
    if (savedRef.current && isSameView(view, savedRef.current)) return
    applyingRef.current = true
    // Flush leftover orbit momentum first, or it would glide away from this view: an update
    // without damping applies all of it at once and clears it
    const { enableDamping } = controls
    controls.enableDamping = false
    controls.update()
    controls.enableDamping = enableDamping
    camera.position.set(x, y, z)
    controls.target.set(targetX, targetY, targetZ)
    controls.update()
    applyingRef.current = false
  }, [camera, x, y, z, targetX, targetY, targetZ])

  // Orbiting saves the view to the config as it moves
  useEffect(() => {
    const controls = controlsRef.current
    let timer: ReturnType<typeof setTimeout> | undefined

    const save = () => {
      timer = undefined
      const { position: p } = camera
      const { target: t } = controls
      const view: CameraConfig = {
        x: roundTo(p.x, 2), y: roundTo(p.y, 2), z: roundTo(p.z, 2),
        targetX: roundTo(t.x, 2), targetY: roundTo(t.y, 2), targetZ: roundTo(t.z, 2),
      }
      savedRef.current = view
      setConfig(c => isSameView(c.camera, view) ? c : { ...c, camera: view })
    }

    const onChange = () => {
      if (applyingRef.current || timer !== undefined) return
      timer = setTimeout(save, SAVE_INTERVAL_MS)
    }

    controls.addEventListener('change', onChange)
    return () => {
      controls.removeEventListener('change', onChange)
      clearTimeout(timer)
    }
  }, [camera, setConfig])

  const exporting = useIsExporting()

  useHotkeys('r', e => {
    e.preventDefault()
    setConfig(c => ({ ...c, camera: defaultConfig.camera }))
  }, { enabled: !exporting })

  return <OrbitControls ref={controlsRef} makeDefault enabled={!exporting} />
}

export default CameraControls
