import type { StyleConfig } from '@/utils/config'
import type { ReactNode } from 'react'

import CCIcon from '@/assets/icons/cc.svg?react'
import ChannelIcon from '@/assets/icons/channel.svg?react'
import ModeIcon from '@/assets/icons/mode.svg?react'
import PedalIcon from '@/assets/icons/pedal.svg?react'
import ThicknessIcon from '@/assets/icons/thickness.svg?react'
import TrackIcon from '@/assets/icons/track.svg?react'
import VelocityIcon from '@/assets/icons/velocity.svg?react'
import ZIcon from '@/assets/icons/z.svg?react'
import {
  AngleIcon,
  ArrowBendDownRightIcon,
  ArrowLineDownIcon,
  ArrowLineUpIcon,
  ArrowsOutIcon,
  CircleIcon,
  GradientIcon,
  PaletteIcon,
  TargetIcon,
  TimerIcon,
  TrendDownIcon,
  TrendUpIcon,
} from '@phosphor-icons/react'

export type OverridableStyleKey =
  Exclude<keyof StyleConfig, 'id' | 'order' | 'track' | 'channel' | 'isRegex' | 'remaps'>

export const styleIcons: Record<OverridableStyleKey, ReactNode> = {
  color: <PaletteIcon />,
  secondaryColor: <GradientIcon />,
  velocity: <VelocityIcon />,
  mode: <ModeIcon />,
  cc: <CCIcon />,
  decayRate: <ArrowBendDownRightIcon />,
  showPedal: <PedalIcon />,
  pedalColor: <PaletteIcon />,
  pedalTrack: <TrackIcon />,
  pedalChannel: <ChannelIcon />,
  ccTrack: <TrackIcon />,
  ccChannel: <ChannelIcon />,
  thickness: <ThicknessIcon />,
  radius: <AngleIcon />,
  z: <ZIcon />,
  indicator: <CircleIcon />,
  indicatorSize: <ArrowsOutIcon />,
  indicatorPeak: <ArrowLineUpIcon />,
  indicatorAttack: <TrendUpIcon />,
  indicatorSettle: <ArrowLineDownIcon />,
  indicatorRelease: <TrendDownIcon />,
  indicatorFollow: <VelocityIcon />,
  ripple: <TargetIcon />,
  rippleScale: <ArrowsOutIcon />,
  rippleDuration: <TimerIcon />,
  rippleWidth: <ThicknessIcon />,
}

export default styleIcons
