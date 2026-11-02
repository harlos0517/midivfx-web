import { CameraIcon, CrosshairIcon } from '@phosphor-icons/react'

import ConfigOptionNumberInputRow from '@/components/ConfigOptionNumberInputRow'
import PanelWrapper from '@/components/PanelWrapper'
import useCameraConfig from '@/hooks/useCameraConfig'
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
    <ConfigOptionNumberInputRow
      label={<><CameraIcon /><XIcon /></>}
      value={x}
      step={1}
      onChange={v => setX(Number(v))}
      sliderProps={{ min: -100, max: 100, step: 1, marks: generateSliderMarks(-100, 100) }}
    />
    <ConfigOptionNumberInputRow
      label={<><CameraIcon /><YIcon /></>}
      value={y}
      step={1}
      onChange={v => setY(Number(v))}
      sliderProps={{ min: 0, max: 128, step: 1, marks: generateSliderMarks(0, 128) }}
    />
    <ConfigOptionNumberInputRow
      label={<><CameraIcon /><ZIcon /></>}
      value={z}
      step={1}
      onChange={v => setZ(Number(v))}
      sliderProps={{ min: 0, max: 200, step: 1, marks: generateSliderMarks(0, 200) }}
    />
    <ConfigOptionNumberInputRow
      label={<><CrosshairIcon /><XIcon /></>}
      value={targetX}
      step={1}
      onChange={v => setTargetX(Number(v))}
      sliderProps={{ min: -100, max: 100, step: 1, marks: generateSliderMarks(-100, 100) }}
    />
    <ConfigOptionNumberInputRow
      label={<><CrosshairIcon /><YIcon /></>}
      value={targetY}
      step={1}
      onChange={v => setTargetY(Number(v))}
      sliderProps={{ min: 0, max: 128, step: 1, marks: generateSliderMarks(0, 128) }}
    />
    <ConfigOptionNumberInputRow
      label={<><CrosshairIcon /><ZIcon /></>}
      value={targetZ}
      step={1}
      onChange={v => setTargetZ(Number(v))}
      sliderProps={{ min: -100, max: 100, step: 1, marks: generateSliderMarks(-100, 100) }}
    />
  </PanelWrapper>
}

export default CameraConfigPanel
