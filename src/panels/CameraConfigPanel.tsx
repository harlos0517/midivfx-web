import { CameraIcon, CrosshairIcon } from '@phosphor-icons/react'

import ConfigOptionNumberInputRow from '@/components/ConfigOptionNumberInputRow'
import PanelWrapper from '@/components/PanelWrapper'
import useCameraConfig from '@/hooks/useCameraConfig'
import { useMessages } from '@/store/localeStore'
import { getSliderProps } from '@/utils/input'

import XIcon from '@/assets/icons/x.svg?react'
import YIcon from '@/assets/icons/y.svg?react'
import ZIcon from '@/assets/icons/z.svg?react'


const CameraConfigPanel = () => {
  const m = useMessages()
  const [x, setX] = useCameraConfig('x')
  const [y, setY] = useCameraConfig('y')
  const [z, setZ] = useCameraConfig('z')
  const [targetX, setTargetX] = useCameraConfig('targetX')
  const [targetY, setTargetY] = useCameraConfig('targetY')
  const [targetZ, setTargetZ] = useCameraConfig('targetZ')

  return <PanelWrapper>
    <ConfigOptionNumberInputRow
      label={<><CameraIcon /><XIcon /></>}
      tooltip={m.camera.x}
      value={x}
      step={1}
      onChange={setX}
      sliderProps={getSliderProps(-100, 100, 1, [0])}
    />
    <ConfigOptionNumberInputRow
      label={<><CameraIcon /><YIcon /></>}
      tooltip={m.camera.y}
      value={y}
      step={1}
      onChange={setY}
      sliderProps={getSliderProps(0, 128, 1, [64])}
    />
    <ConfigOptionNumberInputRow
      label={<><CameraIcon /><ZIcon /></>}
      tooltip={m.camera.z}
      value={z}
      step={1}
      onChange={setZ}
      sliderProps={getSliderProps(0, 200, 1, [100])}
    />
    <ConfigOptionNumberInputRow
      label={<><CrosshairIcon /><XIcon /></>}
      tooltip={m.camera.targetX}
      value={targetX}
      step={1}
      onChange={setTargetX}
      sliderProps={getSliderProps(-100, 100, 1, [0])}
    />
    <ConfigOptionNumberInputRow
      label={<><CrosshairIcon /><YIcon /></>}
      tooltip={m.camera.targetY}
      value={targetY}
      step={1}
      onChange={setTargetY}
      sliderProps={getSliderProps(0, 128, 1, [64])}
    />
    <ConfigOptionNumberInputRow
      label={<><CrosshairIcon /><ZIcon /></>}
      tooltip={m.camera.targetZ}
      value={targetZ}
      step={1}
      onChange={setTargetZ}
      sliderProps={getSliderProps(-100, 100, 1, [0])}
    />
  </PanelWrapper>
}

export default CameraConfigPanel
