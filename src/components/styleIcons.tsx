import type { StyleConfig } from '@/utils/config'
import type { ReactNode } from 'react'

import CCIcon from '@/assets/icons/cc.svg?react'
import ModeIcon from '@/assets/icons/mode.svg?react'
import PedalIcon from '@/assets/icons/pedal.svg?react'
import ThicknessIcon from '@/assets/icons/thickness.svg?react'
import VelocityIcon from '@/assets/icons/velocity.svg?react'
import ZIcon from '@/assets/icons/z.svg?react'
import { AngleIcon, ArrowBendDownRightIcon, PaletteIcon } from '@phosphor-icons/react'

export type OverridableKey =
  Exclude<keyof StyleConfig, 'id' | 'order' | 'track' | 'channel' | 'isRegex' | 'remaps'>

export const styleIcons: Record<OverridableKey, ReactNode> = {
  color: <PaletteIcon />,
  velocity: <VelocityIcon />,
  mode: <ModeIcon />,
  cc: <CCIcon />,
  decayRate: <ArrowBendDownRightIcon />,
  showPedal: <PedalIcon />,
  pedalColor: <PaletteIcon />,
  gap: <ThicknessIcon />,
  radius: <AngleIcon />,
  z: <ZIcon />,
}

export default styleIcons
