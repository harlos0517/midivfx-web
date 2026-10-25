import { useContext } from 'react'

import MidiFileContext from '@/context/MidiFileContext'
import { type StyleConfig, type StyleRuntime } from '@/utils/config'

const useStyleConfig = <T extends keyof StyleRuntime>(id: string, key: T) => {
  const { config, setConfig } = useContext(MidiFileContext)

  const thisStyle = config.styles.find(style => style.id === id)

  const value: StyleConfig[T] | undefined = thisStyle ? thisStyle[key] : undefined

  const updateValue = (newValue: StyleRuntime[T]) => {
    if (!thisStyle) return
    setConfig({
      ...config,
      styles: [
        ...config.styles.filter(style => style.id !== id),
        { ...thisStyle, [key]: newValue, id, order: thisStyle.order },
      ].sort((a, b) => a.order - b.order),
    })
  }

  return [value, updateValue] as const
}

export default useStyleConfig
