import {
  Box,
  ColorPicker,
  Group,
  NumberInput,
  SegmentedControl,
  Slider,
  Space,
  Stack,
  Switch,
  TextInput,
} from '@mantine/core'
import { useState } from 'react'

import useStyleConfig from '@/hooks/useStyleConfig'
import type { NoteMode, Remap } from '@/utils/config'

interface RemapConfigBoxProps extends Remap {
  setRemap: (remap: Remap) => void
}

const RemapConfigBox = (props: RemapConfigBoxProps) => {
  const { originalPitch = '', mappedPitch, color, setRemap } = props

  const set = (values: Partial<Remap>) => {
    setRemap({
      originalPitch,
      mappedPitch,
      color,
      ...values,
    })
  }

  return <Group>
    <TextInput
      value={originalPitch || ''}
      onChange={e => set({ originalPitch: e.target.value })}
    />
    {'->'}
    <TextInput
      value={mappedPitch[0]}
      onChange={e => {
        const v = parseInt(e.target.value, 10)
        set({ mappedPitch: [v || 0, mappedPitch[1]] })
      }}
    />
    {'~'}
    <TextInput
      value={mappedPitch[1]}
      onChange={e => {
        const v = parseInt(e.target.value, 10)
        set({ mappedPitch: [mappedPitch[0], v || 127] })
      }}
    />
    <ColorPicker
      value={color || '#ffffff'}
      onChange={v => set({ color: v })}
    />
  </Group>
}

const StyleConfigBox = ({ id }: { id: string }) => {

  const [isRegex, setIsRegex] = useStyleConfig(id, 'isRegex')
  const [track, setTrack] = useStyleConfig(id, 'track')
  const [channel, setChannel] = useStyleConfig(id, 'channel')
  const [mode, setMode] = useStyleConfig(id, 'mode')
  const [velocity, setVelocity] = useStyleConfig(id, 'velocity')
  const [color, setColor] = useStyleConfig(id, 'color')
  const [gap, setGap] = useStyleConfig(id, 'gap')
  const [radius, setRadius] = useStyleConfig(id, 'radius')
  const [z, setZ] = useStyleConfig(id, 'z')
  const [decayRate, setDecayRate] = useStyleConfig(id, 'decayRate')
  const [showPedal, setShowPedal] = useStyleConfig(id, 'showPedal')
  const [pedalColor, setPedalColor] = useStyleConfig(id, 'pedalColor')
  const [remaps, setRemaps] = useStyleConfig(id, 'remaps')

  const [cc, setCC] = useState<number>(
    parseInt((mode as string)?.match(/CC(\d+)/)?.[1] || '0', 10) || 0,
  )


  return <Box>
    <Stack>
      <Group wrap="nowrap">
        <SegmentedControl
          data={[
            { value: 'ids', label: '#' },
            { value: 'regex', label: '/' },
          ]}
          value={isRegex ? 'regex' : 'ids'}
          onChange={v => {setIsRegex(v === 'regex')}}
        />
        <TextInput
          label="Track"
          value={track || ''}
          onChange={e => setTrack(e.target.value)}
        />
      </Group>
      <TextInput
        label="Ch"
        value={channel || ''}
        onChange={e => setChannel(e.target.value)}
      />
      <Group wrap="nowrap">
        <SegmentedControl
          data={[
            { value: 'fill', label: 'Fill' },
            { value: 'decay', label: 'Decay' },
            { value: 'CC', label: 'CC' },
          ]}
          value={mode || 'fill'}
          onChange={v => {
            if (v === 'CC') setMode(`CC${cc}` as NoteMode)
            else setMode(v as NoteMode)
          }}
        />
        {mode?.startsWith('CC') && <NumberInput
          label="CC"
          value={cc}
          min={0}
          max={127}
          onChange={v => {
            const newCC = typeof v === 'string' ? parseInt(v, 10) : v
            setCC(newCC || 0)
            setTrack(`CC${newCC}`)
          }}
        />}
        {mode === 'decay' && <Slider
          label="Decay Rate"
          value={decayRate || 0}
          min={0}
          max={1}
          step={0.01}
          onChange={setDecayRate}
        />}
        <Space flex="1" />
        <Switch
          label="Velocity"
          checked={velocity}
          onChange={e => setVelocity(e.currentTarget.checked)}
        />
      </Group>
      <Group wrap="nowrap">
        <ColorPicker
          value={color || '#ffffff'}
          onChange={setColor}
        />
        <Slider
          label="Gap"
          value={gap || 0}
          min={0}
          max={1}
          step={0.01}
          onChange={setGap}
        />
      </Group>
      <Group wrap="nowrap">
        <Slider
          label="Radius"
          value={radius || 0}
          min={0}
          max={1}
          step={0.01}
          onChange={setRadius}
        />
        <Slider
          label="Z"
          min={-100}
          max={100}
          value={z || 0}
          onChange={v => setZ(Number(v))}
        />
      </Group>
      <Group wrap="nowrap">
        <Switch
          label="Show Pedal"
          checked={showPedal}
          onChange={e => setShowPedal(e.currentTarget.checked)}
        />
        {showPedal && (
          <ColorPicker
            value={pedalColor || '#444444'}
            onChange={setPedalColor}
          />
        )}
      </Group>
      <Stack>
        {remaps?.map((r, i) => <RemapConfigBox
          {...r}
          setRemap={v => {
            if (remaps?.[i]) remaps[i] = v
            setRemaps(remaps ? [...remaps] : [])
          }}
        />)}
      </Stack>
    </Stack>
  </Box>
}

export default StyleConfigBox
