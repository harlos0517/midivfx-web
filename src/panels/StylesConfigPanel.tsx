import { move } from '@dnd-kit/helpers'
import { DragDropProvider, type DragEndEvent } from '@dnd-kit/react'
import { ActionIcon, Box } from '@mantine/core'
import { useShallow } from 'zustand/react/shallow'

import StyleConfigBox from '@/components/StyleConfigBox'
import useConfigStore from '@/store/configStore'
import { defaultStyleConfig } from '@/utils/config'
import { PlusIcon } from '@phosphor-icons/react'

const StylesConfigPanel = () => {
  const ids = useConfigStore(useShallow(s => s.config.styles.map(style => style.id)))
  const setConfig = useConfigStore(s => s.setConfig)

  const onDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return
    const newIds = move(ids, event)
    setConfig(c => ({
      ...c,
      styles: c.styles
        .map(style => ({ ...style, order: newIds.indexOf(style.id) }))
        .sort((a, b) => a.order - b.order),
    }))
  }

  return <DragDropProvider onDragEnd={onDragEnd}>
    <Box p="md" h="100%" style={{ overflowY: 'auto' }}>
      {ids.map(id => <StyleConfigBox key={id} id={id} />)}
      <ActionIcon
        w="100%"
        size="xl"
        onClick={() => {
          setConfig(c => ({
            ...c,
            styles: [...c.styles, {
              ...defaultStyleConfig,
              id: window.crypto.randomUUID(),
              order: c.styles[c.styles.length - 1]!.order + 1,
            }],
          }))
        }}
      >
        <PlusIcon size={24} />
      </ActionIcon>
    </Box>
  </DragDropProvider>
}

export default StylesConfigPanel
