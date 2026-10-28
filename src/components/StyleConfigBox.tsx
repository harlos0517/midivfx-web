import { useSortable } from '@dnd-kit/react/sortable'
import {
  ActionIcon,
  Box,
  Collapse,
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
  BroadcastIcon,
  CaretDownIcon,
  CaretUpIcon,
  ClosedCaptioningIcon,
  CopyIcon,
  CopySimpleIcon,
  DotsSixVerticalIcon,
  HammerIcon,
  PaintBucketIcon,
  PaletteIcon,
  PianoKeysIcon,
  PlusIcon,
  RectangleIcon,
  TextTIcon,
  TildeIcon,
  TrashIcon,
  TrashSimpleIcon,
} from '@phosphor-icons/react'
import { useState } from 'react'

import Overridable from '@/components/Overridable'
import OverridableInput from '@/components/OverridableInput'
import useStyleConfig from '@/hooks/useStyleConfig'
import useConfigStore from '@/store/configStore'
import { getTextColor } from '@/utils/colors'
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
    <ArrowRightIcon size={20} />
    <TextInput
      flex={1}
      value={mappedPitch[0]}
      onChange={e => {
        const v = parseInt(e.target.value, 10)
        set({ mappedPitch: [v || 0, mappedPitch[1]] })
      }}
    />
    <TildeIcon size={20} />
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
      <TrashSimpleIcon size={20} />
    </ActionIcon>
  </Group>
}

const StyleConfigBox = ({ id }: { id: string }) => {
  const setConfig = useConfigStore(s => s.setConfig)

  const [order] = useStyleConfig(id, 'order')
  const [isRegex, setIsRegex] = useStyleConfig(id, 'isRegex')
  const [track, setTrack] = useStyleConfig(id, 'track')
  const [channel, setChannel] = useStyleConfig(id, 'channel')
  const [mode] = useStyleConfig(id, 'mode', true)
  const [color] = useStyleConfig(id, 'color', true)
  const [showPedal] = useStyleConfig(id, 'showPedal', true)
  const [remaps, setRemaps] = useStyleConfig(id, 'remaps')

  const [isExpanded, setIsExpanded] = useState(false)

  const { ref, handleRef, isDragging } = useSortable({ id, index: order || 0 })

  const copy = () => {
    setConfig(c => {
      const i = c.styles.findIndex(style => style.id === id)
      const newStyle = {
        ...c.styles.find(style => style.id === id),
        id: window.crypto.randomUUID(),
        order: c.styles[c.styles.length - 1]!.order + 1,
      }
      c.styles.splice(i, 0, newStyle)
      return ({
        ...c,
        styles: [...c.styles],
      })
    })
  }

  const deleteStyle = () => {
    setConfig(c => {
      const i = c.styles.findIndex(style => style.id === id)
      c.styles.splice(i, 1)
      return ({
        ...c,
        styles: [...c.styles],
      })
    })
  }

  return <Box ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
    <Stack gap="xs">
      <Group {...groupProps} gap="4px">
        <ActionIcon
          size="lg"
          ref={handleRef}
          variant="subtle"
          style={{ cursor: 'grab', touchAction: 'none' }}
        >
          <DotsSixVerticalIcon size={20} color="gray" />
        </ActionIcon>
        <ActionIcon
          size="lg"
          variant="subtle"
          onClick={() => { setIsExpanded(!isExpanded) }}
        >
          {isExpanded
            ? <CaretUpIcon size={20} />
            : <CaretDownIcon size={20} />
          }
        </ActionIcon>
        <ActionIcon
          size="lg"
          variant="subtle"
          onClick={copy}
        >
          <CopyIcon size={20} />
        </ActionIcon>
        <ActionIcon
          size="lg"
          variant="subtle"
          onClick={deleteStyle}
        >
          <TrashIcon size={20} color="red" />
        </ActionIcon>
        <Group {...groupProps} px={4} h={32}
          gap={4} flex={1} bdrs={4}
          bg={color || 'transparent'} c={getTextColor(color || '#000000')}
        >
          <Text flex="0 0 auto"><TextTIcon size={20} /></Text>
          <Text mr="xs" flex="1 1 auto" textWrap="nowrap"
            style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
          >
            {isRegex ? (track  || '*') : (track ? ('#' + track) : '*')}
          </Text>
          <Text flex="0 0 auto"><BroadcastIcon size={20} /></Text>
          <Text flex="0 0 auto">{channel || '1-16'}</Text>
        </Group>
      </Group>
      <Collapse expanded={!isExpanded}>
        <Group gap="xs">
          <Overridable id={id} styleKey="color" label={<PaletteIcon size={20} />} />
          <Overridable id={id} styleKey="velocity" label={<HammerIcon size={20} />} />
          <Overridable id={id} label={<RectangleIcon size={20} />} styleKey="mode" />
          {mode === 'CC'
            ? <Overridable id={id} label="CC" styleKey="cc" />
            : mode === 'decay'
              ? <Overridable id={id}
                label={<ArrowBendDownRightIcon size={20} />}
                styleKey="decayRate"
              />
              : <Space flex={1}/>}
          <Overridable id={id} styleKey="showPedal" label={<PianoKeysIcon size={20} />} />
          {showPedal
            ? <Overridable id={id} styleKey="pedalColor" label={<PaletteIcon size={20} />} />
            : <Space flex={1} />}
          <Overridable id={id} label={<ArrowsInLineVerticalIcon size={20} />} styleKey="gap" />
          <Overridable id={id} label={<AngleIcon size={20} />} styleKey="radius" />
          <Overridable id={id} label={<CopySimpleIcon size={20} />} styleKey="z" />
        </Group>
      </Collapse>
      <Collapse expanded={isExpanded}>
        <Stack gap="xs">
          <Group {...groupProps}>
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
            />
            <OverridableInput
              id={id}
              styleKey="velocity"
              label={<HammerIcon size={20} />}
              inputType="switch"
              inputProps={{
                styles: { body: { display: 'flex', alignItems: 'center' } },
              }}
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
            />
            {mode === 'CC' ? <OverridableInput
              id={id}
              label="CC"
              styleKey="cc"
              inputType="number"
              wrapperProps={{ flex: 1 }}
              inputProps={{ min: 0, max: 127, step: 1 }}
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
            /> : <Space flex={1}/>}
          </Group>
          <Group {...groupProps}>
            <OverridableInput
              id={id}
              styleKey="showPedal"
              label={<PianoKeysIcon size={20} />}
              inputType="switch"
            />
            {showPedal ? <OverridableInput
              id={id}
              styleKey="pedalColor"
              label={<PaletteIcon size={20} />}
              inputType="color"
              wrapperProps={{ w: 180 }}
            /> : <Space w={180} />}
          </Group>
          <Group {...groupProps}>
            <OverridableInput
              id={id}
              label={<ArrowsInLineVerticalIcon size={20} />}
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
            />
            <OverridableInput
              id={id}
              label={<AngleIcon size={20} />}
              styleKey="radius"
              inputType="slider"
              wrapperProps={{ flex: 1 }}
              inputProps={{
                min: 0, max: 0.5, step: 0.01,
                marks: [{ value: 0, label: '0' }, { value: 0.5, label: '0.5' }],
              }}
            />
          </Group>
          <Group {...groupProps}>
            <OverridableInput
              id={id}
              label={<CopySimpleIcon size={20} />}
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
              <PlusIcon size={20} />
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
        </Stack>
      </Collapse>
      <Divider mb="md"/>
    </Stack>
  </Box>
}

export default StyleConfigBox
