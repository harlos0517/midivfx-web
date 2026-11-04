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
  ArrowBendDownRightIcon,
  ArrowRightIcon,
  CaretDownIcon,
  CaretUpIcon,
  CopyIcon,
  DotsSixVerticalIcon,
  HashIcon,
  LockIcon,
  MusicNotesIcon,
  PaintBucketIcon,
  PlusIcon,
  TagIcon,
  TildeIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { useState } from 'react'

import OptionTooltip from '@/components/OptionTooltip'
import Overridable from '@/components/Overridable'
import OverridableInput from '@/components/OverridableInput'
import useStyleConfig from '@/hooks/useStyleConfig'
import useConfigStore from '@/store/configStore'
import { useMessages } from '@/store/localeStore'
import { getTextColor } from '@/utils/colors'
import type { Remap } from '@/utils/config'
import { ICON_SIZE } from '@/utils/const'
import { getSliderProps } from '@/utils/input'
import { normalizeRange } from '@/utils/range'

import CCIcon from '@/assets/icons/cc.svg?react'
import ChannelIcon from '@/assets/icons/channel.svg?react'
import TrackIcon from '@/assets/icons/track.svg?react'

interface RemapConfigBoxProps extends Remap {
  setRemap: (remap: Remap) => void
  onRemove: () => void
}

const RemapConfigBox = (props: RemapConfigBoxProps) => {
  const { originalPitch = '', mappedPitch, color, setRemap, onRemove } = props
  const m = useMessages()

  const set = (values: Partial<Remap>) => {
    setRemap({
      originalPitch,
      mappedPitch,
      color,
      ...values,
    })
  }

  return <Group gap="0">
    <OptionTooltip tip={m.remap.source}><MusicNotesIcon /></OptionTooltip>
    <TextInput
      flex={2} ml="4px"
      aria-label={m.remap.source.name}
      value={originalPitch || ''}
      onChange={e => set({ originalPitch: e.target.value })}
    />
    <ArrowRightIcon style={{  margin: '0 4px' }} />
    <OptionTooltip tip={m.remap.low}>
      <TextInput
        flex={1} miw={48}
        aria-label={m.remap.low.name}
        value={mappedPitch[0]}
        onChange={e => {
          const v = parseInt(e.target.value, 10)
          set({ mappedPitch: [v || 0, mappedPitch[1]] })
        }}
      />
    </OptionTooltip>
    <TildeIcon />
    <OptionTooltip tip={m.remap.high}>
      <TextInput
        flex={1} miw={48}
        aria-label={m.remap.high.name}
        value={mappedPitch[1]}
        onChange={e => {
          const v = parseInt(e.target.value, 10)
          set({ mappedPitch: [mappedPitch[0], v || 127] })
        }}
      />
    </OptionTooltip>
    <OptionTooltip tip={m.remap.color}>
      <ColorInput
        w={108} mx="4px"
        aria-label={m.remap.color.name}
        value={color || '#ffffff'}
        onChange={v => set({ color: v })}
      />
    </OptionTooltip>
    <OptionTooltip tip={m.remap.remove}>
      <ActionIcon
        variant="subtle" color="red" onClick={onRemove}
        aria-label={m.remap.remove.name}
      >
        <TrashIcon color="red" />
      </ActionIcon>
    </OptionTooltip>
  </Group>
}

const StyleConfigBox = ({ id }: { id: string }) => {
  const m = useMessages()
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

  const { ref, handleRef, isDragging } = useSortable({
    id,
    index: order || 0,
    disabled: id === 'default',
  })

  const copy = () => {
    setConfig(c => {
      const i = c.styles.findIndex(style => style.id === id)
      const newStyle = {
        ...c.styles.find(style => style.id === id),
        id: window.crypto.randomUUID(),
        order: c.styles[c.styles.length - 1]!.order + 1,
      }
      c.styles.splice(i + 1, 0, newStyle)
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

  return <Box ref={ref}
    style={{ opacity: isDragging ? 0.5 : 1 }}
    data-no-dnd={String(id === 'default')}
  >
    <Stack>
      <Group gap="4px">
        {id === 'default'
          ? <OptionTooltip tip={m.style.locked}>
            <LockIcon color="gray" style={{ padding: '0 2px' }} />
          </OptionTooltip>
          : <OptionTooltip tip={m.style.drag}>
            <DotsSixVerticalIcon
              ref={handleRef} color="gray"
              style={{ cursor: 'grab', touchAction: 'none' }}
            />
          </OptionTooltip>
        }
        <OptionTooltip tip={m.style.expand}>
          <ActionIcon
            variant="subtle"
            aria-label={m.style.expand.name}
            aria-expanded={isExpanded}
            onClick={() => { setIsExpanded(!isExpanded) }}
          >
            {isExpanded ? <CaretUpIcon /> : <CaretDownIcon /> }
          </ActionIcon>
        </OptionTooltip>
        <OptionTooltip tip={m.style.duplicate}>
          <ActionIcon variant="subtle" onClick={copy} aria-label={m.style.duplicate.name}>
            <CopyIcon />
          </ActionIcon>
        </OptionTooltip>
        <OptionTooltip tip={m.style.delete} disabled={id === 'default'}>
          <ActionIcon
            variant="subtle"
            onClick={deleteStyle}
            disabled={id === 'default'}
            color="red"
            aria-label={m.style.delete.name}
          >
            <TrashIcon color={id === 'default' ? 'gray' : 'red'}/>
          </ActionIcon>
        </OptionTooltip>
        <Group px={4} h={32} gap={4} flex={1} bdrs={4}
          bg={color || 'transparent'} c={getTextColor(color || '#000000')}
        >
          <Text flex="0 0 auto"><TrackIcon /></Text>
          <Text mr="xs" flex="1 1 auto" textWrap="nowrap"
            style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
          >
            {isRegex ? (track  || '*') : (track ? ('#' + track) : '*')}
          </Text>
          <Text flex="0 0 auto"><ChannelIcon/></Text>
          <Text flex="0 0 auto">{channel || '1-16'}</Text>
        </Group>
      </Group>
      <Collapse expanded={!isExpanded}>
        <Group justify="space-between">
          <Overridable id={id} styleKey="color" />
          <Overridable id={id} styleKey="velocity" />
          <Overridable id={id} styleKey="mode" />
          {mode === 'CC'
            ? <Overridable id={id} styleKey="cc" />
            : mode === 'decay'
              ? <Overridable id={id} styleKey="decayRate" />
              : <Space w={ICON_SIZE} />}
          <Overridable id={id} styleKey="showPedal" />
          {showPedal
            ? <Overridable id={id} styleKey="pedalColor" />
            : <Space w={ICON_SIZE} />}
          <Overridable id={id} styleKey="thickness" />
          <Overridable id={id} styleKey="radius" />
          <Overridable id={id} styleKey="z" />
        </Group>
      </Collapse>
      <Collapse expanded={isExpanded}>
        <Stack>
          <Group>
            <Group gap="2px" flex={2}>
              <OptionTooltip tip={m.style.track}><TrackIcon /></OptionTooltip>
              <SegmentedControl
                aria-label={m.style.track.name}
                data={[
                  {
                    value: 'ids',
                    label: <OptionTooltip tip={m.style.byNumber}>
                      <HashIcon size={16} aria-label={m.style.byNumber.name} />
                    </OptionTooltip>,
                  },
                  {
                    value: 'regex',
                    label: <OptionTooltip tip={m.style.byName}>
                      <TagIcon size={16} aria-label={m.style.byName.name} />
                    </OptionTooltip>,
                  },
                ]}
                value={isRegex ? 'regex' : 'ids'}
                onChange={v => {
                  setIsRegex(v === 'regex')
                  if (v === 'regex') return
                  setTrack(normalizeRange(track || '', 1, 256))
                }}
              />
              <TextInput
                flex={1}
                aria-label={m.style.track.name}
                value={track || ''}
                onChange={e => setTrack(e.target.value)}
                onBlur={e => {
                  if (isRegex) return
                  setTrack(normalizeRange(e.target.value, 1, 256))
                }}
              />
            </Group>
            <Group gap="2px" flex={1}>
              <OptionTooltip tip={m.style.channel}><ChannelIcon/></OptionTooltip>
              <TextInput
                flex={1}
                w={100}
                aria-label={m.style.channel.name}
                value={channel || ''}
                onChange={e => setChannel(e.target.value)}
                onBlur={e => setChannel(normalizeRange(e.target.value, 1, 16))}
              />
            </Group>
          </Group>
          <Group>
            <OverridableInput
              id={id}
              styleKey="color"
              inputType="color"
              wrapperProps={{ w: 180, flex: 1 }}
            />
            <OverridableInput
              id={id}
              styleKey="velocity"
              inputType="switch"
              inputProps={{
                styles: { body: { display: 'flex', alignItems: 'center' } },
              }}
            />
          </Group>
          <Group>
            <OverridableInput
              id={id}
              styleKey="mode"
              inputType="segmented"
              data={[
                {
                  value: 'fill',
                  label: <OptionTooltip tip={m.style.modes.fill}>
                    <PaintBucketIcon size={16} aria-label={m.style.modes.fill.name} />
                  </OptionTooltip>,
                },
                {
                  value: 'decay',
                  label: <OptionTooltip tip={m.style.modes.decay}>
                    <ArrowBendDownRightIcon size={16} aria-label={m.style.modes.decay.name} />
                  </OptionTooltip>,
                },
                {
                  value: 'CC',
                  label: <OptionTooltip tip={m.style.modes.CC}>
                    <CCIcon width={16} height={16} aria-label={m.style.modes.CC.name} />
                  </OptionTooltip>,
                },
              ]}
            />
            {mode === 'CC' ? <OverridableInput
              id={id}
              styleKey="cc"
              inputType="number"
              wrapperProps={{ flex: 1 }}
              inputProps={{ min: 0, max: 127, step: 1 }}
            /> : mode === 'decay' ? <OverridableInput
              id={id}
              styleKey="decayRate"
              inputType="slider"
              wrapperProps={{ flex: 1 }}
              inputProps={getSliderProps(0, 1, 0.01, [0.5])}
            /> : <Space flex={1}/>}
            {mode === 'CC' && <>
              <OverridableInput
                id={id}
                styleKey="ccTrack"
                inputType="number"
                wrapperProps={{ flex: 1 }}
                inputProps={{ min: 0, max: 256, step: 1, allowDecimal: false }}
              />
              <OverridableInput
                id={id}
                styleKey="ccChannel"
                inputType="number"
                wrapperProps={{ flex: 1 }}
                inputProps={{ min: 0, max: 16, step: 1, allowDecimal: false }}
              />
            </>}
          </Group>
          <Group>
            <OverridableInput
              id={id}
              styleKey="showPedal"
              inputType="switch"
            />
            {showPedal ? <OverridableInput
              id={id}
              styleKey="pedalColor"
              inputType="color"
              wrapperProps={{ w: 132 }}
            /> : <Space w={132} />}
            {showPedal && <>
              <OverridableInput
                id={id}
                styleKey="pedalTrack"
                inputType="number"
                wrapperProps={{ flex: 1 }}
                inputProps={{ min: 0, max: 256, step: 1, allowDecimal: false }}
              />
              <OverridableInput
                id={id}
                styleKey="pedalChannel"
                inputType="number"
                wrapperProps={{ flex: 1 }}
                inputProps={{ min: 0, max: 16, step: 1, allowDecimal: false }}
              />
            </>}
          </Group>
          <Group>
            <OverridableInput
              id={id}
              styleKey="thickness"
              inputType="slider"
              wrapperProps={{ flex: 1 }}
              inputProps={getSliderProps(0, 1, 0.01, [0.5])}
            />
            <OverridableInput
              id={id}
              styleKey="radius"
              inputType="slider"
              wrapperProps={{ flex: 1 }}
              inputProps={getSliderProps(0, 0.5, 0.01)}
            />
          </Group>
          <Group>
            <OverridableInput
              id={id}
              styleKey="z"
              inputType="slider"
              wrapperProps={{ flex: 1 }}
              inputProps={getSliderProps(-10, 10, 0.1, [0])}
            />
          </Group>
          <Group>
            <Text flex={1}>{m.remap.heading}</Text>
            <OptionTooltip tip={m.remap.add}>
              <ActionIcon
                aria-label={m.remap.add.name}
                onClick={() => {
                  setRemaps([...(remaps || []), { mappedPitch: [0, 127], color: '#ffffff' }])
                }}
              >
                <PlusIcon />
              </ActionIcon>
            </OptionTooltip>
          </Group>
          {!!remaps?.length && <Stack>
            {remaps.map((r, i) => <RemapConfigBox
              key={i} {...r}
              setRemap={v => setRemaps(remaps.map((r, idx) => idx === i ? v : r))}
              onRemove={() => setRemaps(remaps.filter((_, idx) => idx !== i))}
            />)}
          </Stack>}
        </Stack>
      </Collapse>
      <Divider my="xs"/>
    </Stack>
  </Box>
}

export default StyleConfigBox
