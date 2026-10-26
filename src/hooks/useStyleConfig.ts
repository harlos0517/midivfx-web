import useConfigStore from '@/store/configStore'
import { type StyleRuntime } from '@/utils/config'

const useStyleConfig = <T extends keyof StyleRuntime>(id: string, key: T) => {
  const value = useConfigStore(s => s.config.styles.find(style => style.id === id)?.[key])
  const setConfig = useConfigStore(s => s.setConfig)

  const updateValue = (newValue: StyleRuntime[T]) => {
    setConfig(c => {
      const thisStyle = c.styles.find(style => style.id === id)
      if (!thisStyle) return c
      return {
        ...c,
        styles: [
          ...c.styles.filter(style => style.id !== id),
          { ...thisStyle, [key]: newValue, id, order: thisStyle.order },
        ].sort((a, b) => a.order - b.order),
      }
    })
  }

  return [value, updateValue] as const
}

export default useStyleConfig
