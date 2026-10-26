import { useSortable } from '@dnd-kit/react/sortable'
import {
  ActionIcon,
  Box,
  ColorInput,
  Divider,
  Group,
  NumberInput,
  SegmentedControl,
  Slider,
  Space,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@mantine/core'
import {
  AngleIcon,
  ArrowBendDownRightIcon,
  ArrowRightIcon,
  ArrowsInLineVerticalIcon,
  ClosedCaptioningIcon,
  CopySimpleIcon,
  DotsSixVerticalIcon,
  HammerIcon,
  PaintBucketIcon,
  PlusIcon,
  TildeIcon,
  TrashSimpleIcon,
} from '@phosphor-icons/react'
import { useState } from 'react'

import useStyleConfig from '@/hooks/useStyleConfig'
import type { NoteMode, Remap } from '@/utils/config'
import { parseRange, rangeText } from '@/utils/range'

const groupProps = {
  wrap: 'nowrap' as const,
  align: 'center' as const,
  justify: 'stretch' as const,
  h: '2.5rem',
  gap: 'xs',
}

interface RemapConfigBoxProps extends Remap {
  setRemap: (remap: Remap) => void
  onRemove: () => void
}

const RemapConfigBox = (props: RemapConfigBoxProps) => {
  const { originalPitch = '', mappedPitch, color, setRemap, onRemove } = props

  const set = (values: Partial<Remap>) => {
    setRemap({
      originalPitch,
      mappedPitch,
      color,
      ...values,
    })
  }

  return <Group {...groupProps}>
    <TextInput
      flex={2}
      value={originalPitch || ''}
      onChange={e => set({ originalPitch: e.target.value })}
    />
    <ArrowRightIcon size={24} />
    <TextInput
      flex={1}
      value={mappedPitch[0]}
      onChange={e => {
        const v = parseInt(e.target.value, 10)
        set({ mappedPitch: [v || 0, mappedPitch[1]] })
      }}
    />
    <TildeIcon size={24} />
    <TextInput
      flex={1}
      value={mappedPitch[1]}
      onChange={e => {
        const v = parseInt(e.target.value, 10)
        set({ mappedPitch: [mappedPitch[0], v || 127] })
      }}
    />
    <ColorInput
      w={135}
      value={color || '#ffffff'}
      onChange={v => set({ color: v })}
    />
    <ActionIcon size="lg" variant="subtle" color="red" onClick={onRemove}>
      <TrashSimpleIcon size={24} />
    </ActionIcon>
  </Group>
}

const StyleConfigBox = ({ id }: { id: string }) => {
  const [order] = useStyleConfig(id, 'order')
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

  const { ref, handleRef, isDragging } = useSortable({ id, index: order || 0 })

  return <Box ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
    <Stack gap="xs">
      <Group {...groupProps}>
        <ActionIcon
          ref={handleRef}
          variant="subtle"
          color="gray"
          style={{ cursor: 'grab', touchAction: 'none' }}
        >
          <DotsSixVerticalIcon size={20} />
        </ActionIcon>
        <SegmentedControl
          bd="#444444 1px solid"
          data={[
            { value: 'ids', label: '#' },
            { value: 'regex', label: '/' },
          ]}
          value={isRegex ? 'regex' : 'ids'}
          onChange={v => {setIsRegex(v === 'regex')}}
        />
        <TextInput
          flex={2}
          placeholder={isRegex ? 'track name regex' : 'track numbers'}
          value={track || ''}
          onChange={e => setTrack(e.target.value)}
          onBlur={e => {
            if (isRegex) return
            const v = e.target.value
            console.log(v)
            const range = parseRange(v || '', 1, 256)
            const text = rangeText(range)
            setTrack(text)
          }}
        />
        <TextInput
          flex={1.5}
          w={100}
          leftSection="Ch"
          value={channel || ''}
          onChange={e => setChannel(e.target.value)}
          onBlur={e => {
            const v = e.target.value
            console.log(v)
            const range = parseRange(v || '', 1, 256)
            const text = rangeText(range)
            setChannel(text)
          }}
        />
        <ColorInput
          w={135}
          value={color || '#ffffff'}
          onChange={setColor}
        />
        <Switch
          labelPosition="left"
          label={<HammerIcon size={24} />}
          checked={velocity}
          onChange={e => setVelocity(e.currentTarget.checked)}
          styles={{ body: { display: 'flex', alignItems: 'center' } }}
        />
      </Group>
      <Group {...groupProps}>
        <SegmentedControl
          bd="#444444 1px solid"
          data={[
            { value: 'fill', label: <PaintBucketIcon size={20} /> },
            { value: 'decay', label: <ArrowBendDownRightIcon size={20} /> },
            { value: 'CC', label: <ClosedCaptioningIcon size={20} /> },
          ]}
          styles={{
            label: {},
          }}
          value={mode?.startsWith('CC') ? 'CC' : (mode || 'fill')}
          onChange={v => {
            if (v === 'CC') setMode(`CC${cc}` as NoteMode)
            else setMode(v as NoteMode)
          }}
        />
        {mode?.startsWith('CC') ? <NumberInput
          flex={1}
          value={cc}
          min={0}
          max={127}
          step={1}
          onChange={v => {
            const newCC = typeof v === 'string' ? parseInt(v, 10) : v
            setCC(newCC || 0)
            setMode(`CC${newCC}`)
          }}
        /> : mode === 'decay' ? <Slider
          flex={1}
          value={decayRate || 0}
          min={0}
          max={1}
          step={0.01}
          marks={[
            { value: 0, label: '0' },
            { value: 0.5, label: '0.5' },
            { value: 1, label: '1' },
          ]}
          onChange={setDecayRate}
        /> : <Space flex={1}/>}
        <Switch
          label="ped."
          labelPosition="left"
          checked={showPedal}
          onChange={e => setShowPedal(e.currentTarget.checked)}
        />
        {showPedal ? (
          <ColorInput
            w={135}
            value={pedalColor || '#444444'}
            onChange={setPedalColor}
          />
        ) : <Space w={135} />}
      </Group>
      <Group {...groupProps}>
        <ArrowsInLineVerticalIcon size={24} />
        <Slider
          flex={1}
          value={gap || 0}
          min={0}
          max={1}
          step={0.01}
          marks={[
            { value: 0, label: '0' },
            { value: 0.5, label: '0.5' },
            { value: 1, label: '1' },
          ]}
          onChange={setGap}
        />
        <AngleIcon size={24} />
        <Slider
          flex={1}
          value={radius || 0}
          min={0}
          max={0.5}
          step={0.01}
          marks={[{ value: 0, label: '0' }, { value: 0.5, label: '0.5' }]}
          onChange={setRadius}
        />
        <CopySimpleIcon size={24} />
        <Slider
          flex={1}
          min={-10}
          max={10}
          value={z || 0}
          step={0.1}
          marks={[
            { value: -100, label: '-10' },
            { value: 0, label: '0' },
            { value: 10, label: '10' },
          ]}
          onChange={v => setZ(Number(v))}
        />
      </Group>
      <Group {...groupProps}>
        <Text>Note remapping</Text>
        <ActionIcon
          size="lg"
          onClick={() => {
            setRemaps([...(remaps || []), { mappedPitch: [0, 127], color: '#ffffff' }])
          }}
        >
          <PlusIcon size={24} />
        </ActionIcon>
      </Group>
      {!!remaps?.length && <Stack>
        {remaps.map((r, i) => <RemapConfigBox
          key={i}
          {...r}
          setRemap={v => setRemaps(remaps.map((r, idx) => idx === i ? v : r))}
          onRemove={() => setRemaps(remaps.filter((_, idx) => idx !== i))}
        />)}
      </Stack>}
      <Divider mb="md"/>
    </Stack>
  </Box>
}

export default StyleConfigBox
