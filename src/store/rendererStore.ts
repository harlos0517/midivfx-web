import type { RootState } from '@react-three/fiber'
import { create } from 'zustand'

/** Handles into the live R3F canvas, so code outside <Canvas> (e.g. export) can drive rendering. */
export type RendererHandle = Pick<RootState, 'gl' | 'advance' | 'setFrameloop'>

interface RendererStore {
  renderer: RendererHandle | null
  setRenderer: (renderer: RendererHandle | null) => void
}

const useRendererStore = create<RendererStore>(set => ({
  renderer: null,
  setRenderer: renderer => set({ renderer }),
}))

export default useRendererStore
