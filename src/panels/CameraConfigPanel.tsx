import { CameraIcon, CrosshairIcon } from '@phosphor-icons/react'

import ConfigOptionNumberInputRow from '@/components/ConfigOptionNumberInputRow'
import PanelWrapper from '@/components/PanelWrapper'
import useCameraConfig from '@/hooks/useCameraConfig'
import { getSliderProps } from '@/utils/input'

import XIcon from '@/assets/icons/x.svg?react'
import YIcon from '@/assets/icons/y.svg?react'
import ZIcon from '@/assets/icons/z.svg?react'


const CameraConfigPanel = () => {
  const [x, setX] = useCameraConfig('x')
  const [y, setY] = useCameraConfig('y')
  const [z, setZ] = useCameraConfig('z')
  const [targetX, setTargetX] = useCameraConfig('targetX')
  const [targetY, setTargetY] = useCameraConfig('targetY')
  const [targetZ, setTargetZ] = useCameraConfig('targetZ')

  return <PanelWrapper>
    <ConfigOptionNumberInputRow
      label={<><CameraIcon /><XIcon /></>}
      value={x}
      step={1}
      onChange={setX}
      sliderProps={getSliderProps(-100, 100, 1, [0])}
    />
    <ConfigOptionNumberInputRow
      label={<><CameraIcon /><YIcon /></>}
      value={y}
      step={1}
      onChange={setY}
      sliderProps={getSliderProps(0, 128, 1, [64])}
    />
    <ConfigOptionNumberInputRow
      label={<><CameraIcon /><ZIcon /></>}
      value={z}
      step={1}
      onChange={setZ}
      sliderProps={getSliderProps(0, 200, 1, [100])}
    />
    <ConfigOptionNumberInputRow
      label={<><CrosshairIcon /><XIcon /></>}
      value={targetX}
      step={1}
      onChange={setTargetX}
      sliderProps={getSliderProps(-100, 100, 1, [0])}
    />
    <ConfigOptionNumberInputRow
      label={<><CrosshairIcon /><YIcon /></>}
      value={targetY}
      step={1}
      onChange={setTargetY}
      sliderProps={getSliderProps(0, 128, 1, [64])}
    />
    <ConfigOptionNumberInputRow
      label={<><CrosshairIcon /><ZIcon /></>}
      value={targetZ}
      step={1}
      onChange={setTargetZ}
      sliderProps={getSliderProps(-100, 100, 1, [0])}
    />
  </PanelWrapper>
}

export default CameraConfigPanel
