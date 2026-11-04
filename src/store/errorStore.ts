import { create } from 'zustand'

import { toError } from '@/utils/errorReport'

/** Older errors are dropped past this, so a burst of distinct errors can't fill the screen. */
const MAX_ERRORS = 3

export interface CaughtError {
  id: number
  key: string
  error: Error
  count: number
}

interface ErrorStore {
  errors: CaughtError[]
  push: (value: unknown) => void
  dismiss: (id: number) => void
}

let nextId = 0

// A throw inside useFrame repeats every frame, so identical errors collapse into one entry
const errorKey = (error: Error) =>
  `${error.name}\n${error.message}\n${error.stack?.split('\n')[1] ?? ''}`

const useErrorStore = create<ErrorStore>(set => ({
  errors: [],

  push: value => {
    const error = toError(value)
    const key = errorKey(error)
    set(({ errors }) => {
      const existing = errors.find(e => e.key === key)
      if (existing)
        return { errors: errors.map(e => e === existing ? { ...e, count: e.count + 1 } : e) }

      return { errors: [...errors, { id: nextId++, key, error, count: 1 }].slice(-MAX_ERRORS) }
    })
  },

  dismiss: id => set(({ errors }) => ({ errors: errors.filter(e => e.id !== id) })),
}))

const isIgnored = (value: unknown) =>
  // Cancelled fetches and decodes are expected, not bugs
  value instanceof DOMException && value.name === 'AbortError'

/**
 * Shows errors that escape event handlers, timers, promises and the render loop.
 * Render errors are caught by ErrorBoundary instead, and errors a panel already
 * catches and shows itself never reach these listeners.
 */
export const installGlobalErrorHandlers = () => {
  window.addEventListener('error', event => {
    // Benign browser noise, and errors from cross-origin scripts carry no details
    if (!event.error) return
    if (isIgnored(event.error)) return
    useErrorStore.getState().push(event.error)
  })

  window.addEventListener('unhandledrejection', event => {
    if (isIgnored(event.reason)) return
    useErrorStore.getState().push(event.reason)
  })
}

export default useErrorStore
