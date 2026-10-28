import useConfigStore from '@/store/configStore'
import { type StyleConfig } from '@/utils/config'

const useStyleConfig = <T extends keyof StyleConfig>(id: string, key: T, overridable = false) => {
  const value = useConfigStore(s => s.config.styles.find(style => style.id === id)?.[key])
  const setConfig = useConfigStore(s => s.setConfig)

  const updateValue = (newValue: StyleConfig[T]) => {
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

  const clearOverride = overridable ? () => {
    setConfig(c => {
      const thisStyle = c.styles.find(style => style.id === id)
      if (!thisStyle) return c
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: _, ...rest } = thisStyle
      return {
        ...c,
        styles: [
          ...c.styles.filter(style => style.id !== id),
          { ...rest, id, order: thisStyle.order },
        ].sort((a, b) => a.order - b.order),
      }
    })
  } : () => {}

  return [value, updateValue, clearOverride] as const
}

export default useStyleConfig
