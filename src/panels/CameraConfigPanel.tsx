import { CameraIcon, CrosshairIcon } from '@phosphor-icons/react'

import ConfigOptionNumberInput from '@/components/ConfigOptionNumberInput'
import PanelWrapper from '@/components/PanelWrapper'
import useCameraConfig from '@/hooks/useCameraConfig'
import { CUSTOM_ICON_STYLE, ICON_SIZE } from '@/utils/const'
import { generateSliderMarks } from '@/utils/input'

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
    <ConfigOptionNumberInput
      label={<><CameraIcon size={ICON_SIZE} /><XIcon {...CUSTOM_ICON_STYLE} /></>}
      value={x}
      step={1}
      onChange={v => setX(Number(v))}
      sliderProps={{ min: -100, max: 100, step: 1, marks: generateSliderMarks(-100, 100) }}
    />
    <ConfigOptionNumberInput
      label={<><CameraIcon size={ICON_SIZE} /><YIcon {...CUSTOM_ICON_STYLE} /></>}
      value={y}
      step={1}
      onChange={v => setY(Number(v))}
      sliderProps={{ min: 0, max: 128, step: 1, marks: generateSliderMarks(0, 128) }}
    />
    <ConfigOptionNumberInput
      label={<><CameraIcon size={ICON_SIZE} /><ZIcon {...CUSTOM_ICON_STYLE} /></>}
      value={z}
      step={1}
      onChange={v => setZ(Number(v))}
      sliderProps={{ min: 0, max: 200, step: 1, marks: generateSliderMarks(0, 200) }}
    />
    <ConfigOptionNumberInput
      label={<><CrosshairIcon size={ICON_SIZE} /><XIcon {...CUSTOM_ICON_STYLE} /></>}
      value={targetX}
      step={1}
      onChange={v => setTargetX(Number(v))}
      sliderProps={{ min: -100, max: 100, step: 1, marks: generateSliderMarks(-100, 100) }}
    />
    <ConfigOptionNumberInput
      label={<><CrosshairIcon size={ICON_SIZE} /><YIcon {...CUSTOM_ICON_STYLE} /></>}
      value={targetY}
      step={1}
      onChange={v => setTargetY(Number(v))}
      sliderProps={{ min: 0, max: 128, step: 1, marks: generateSliderMarks(0, 128) }}
    />
    <ConfigOptionNumberInput
      label={<><CrosshairIcon size={ICON_SIZE} /><ZIcon {...CUSTOM_ICON_STYLE} /></>}
      value={targetZ}
      step={1}
      onChange={v => setTargetZ(Number(v))}
      sliderProps={{ min: -100, max: 100, step: 1, marks: generateSliderMarks(-100, 100) }}
    />
  </PanelWrapper>
}

export default CameraConfigPanel
