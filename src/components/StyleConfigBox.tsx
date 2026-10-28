import { useSortable } from '@dnd-kit/react/sortable'
import {
  ActionIcon,
  Box,
  ColorInput,
  Divider,
  Group,
  SegmentedControl,
  Space,
  Stack,
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
  PaletteIcon,
  PianoKeysIcon,
  PlusIcon,
  RectangleIcon,
  TildeIcon,
  TrashSimpleIcon,
} from '@phosphor-icons/react'

import OverridableInput from '@/components/OverridableInput'
import useStyleConfig from '@/hooks/useStyleConfig'
import type { Remap } from '@/utils/config'
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
  const [mode] = useStyleConfig(id, 'mode', true)
  const [showPedal] = useStyleConfig(id, 'showPedal', true)

  const [remaps, setRemaps] = useStyleConfig(id, 'remaps')

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
      </Group>
      <Group {...groupProps}>
        <OverridableInput
          id={id}
          styleKey="color"
          label={<PaletteIcon size={20} />}
          inputType="color"
          wrapperProps={{ w: 180, flex: 1 }}
          overridable
        />
        <OverridableInput
          id={id}
          styleKey="velocity"
          label={<HammerIcon size={24} />}
          inputType="switch"
          inputProps={{
            styles: { body: { display: 'flex', alignItems: 'center' } },
          }}
          overridable
        />
      </Group>
      <Group {...groupProps}>
        <OverridableInput
          id={id}
          label={<RectangleIcon size={20} />}
          styleKey="mode"
          inputType="segmented"
          inputProps={{
            bd: '#444444 1px solid',
          }}
          data={[
            { value: 'fill', label: <PaintBucketIcon size={20} /> },
            { value: 'decay', label: <ArrowBendDownRightIcon size={20} /> },
            { value: 'CC', label: <ClosedCaptioningIcon size={20} /> },
          ]}
          overridable
        />
        {mode === 'CC' ? <OverridableInput
          id={id}
          label="CC"
          styleKey="cc"
          inputType="number"
          wrapperProps={{ flex: 1 }}
          inputProps={{ min: 0, max: 127, step: 1 }}
          overridable
        /> : mode === 'decay' ? <OverridableInput
          id={id}
          label={<ArrowBendDownRightIcon size={20} />}
          styleKey="decayRate"
          inputType="slider"
          wrapperProps={{ flex: 1 }}
          inputProps={{
            min: 0, max: 1, step: 0.01,
            marks: [
              { value: 0, label: '0' },
              { value: 0.5, label: '0.5' },
              { value: 1, label: '1' },
            ],
          }}
          overridable
        /> : <Space flex={1}/>}
      </Group>
      <Group {...groupProps}>
        <OverridableInput
          id={id}
          styleKey="showPedal"
          label={<PianoKeysIcon size={20} />}
          inputType="switch"
          overridable
        />
        {showPedal ? <OverridableInput
          id={id}
          styleKey="pedalColor"
          label={<PaletteIcon size={20} />}
          inputType="color"
          wrapperProps={{ w: 180 }}
          overridable
        /> : <Space w={180} />}
      </Group>
      <Group {...groupProps}>
        <OverridableInput
          id={id}
          label={<ArrowsInLineVerticalIcon size={24} />}
          styleKey="gap"
          inputType="slider"
          wrapperProps={{ flex: 1 }}
          inputProps={{
            min: 0, max: 1, step: 0.01,
            marks: [
              { value: 0, label: '0' },
              { value: 0.5, label: '0.5' },
              { value: 1, label: '1' },
            ],
          }}
          overridable
        />
        <OverridableInput
          id={id}
          label={<AngleIcon size={24} />}
          styleKey="radius"
          inputType="slider"
          wrapperProps={{ flex: 1 }}
          inputProps={{
            min: 0, max: 0.5, step: 0.01,
            marks: [{ value: 0, label: '0' }, { value: 0.5, label: '0.5' }],
          }}
          overridable
        />
      </Group>
      <Group {...groupProps}>
        <OverridableInput
          id={id}
          label={<CopySimpleIcon size={24} />}
          styleKey="z"
          inputType="slider"
          wrapperProps={{ flex: 1 }}
          inputProps={{
            min: -10, max: 10, step: 0.1,
            marks: [
              { value: -10, label: '-10' },
              { value: 0, label: '0' },
              { value: 10, label: '10' },
            ],
          }}
          overridable
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
