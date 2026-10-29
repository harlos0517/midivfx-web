import { create } from 'zustand'

import { downloadBlob, exportVideo, type ExportOptions } from '@/utils/exportVideo'

interface ExportStore {
  /** 0-1 while exporting, null when idle. */
  progress: number | null
  error: string | null
  abortController: AbortController | null
  start: (options: Omit<ExportOptions, 'onProgress' | 'signal'>) => Promise<void>
  cancel: () => void
}

const useExportStore = create<ExportStore>((set, get) => ({
  progress: null,
  error: null,
  abortController: null,

  start: async options => {
    if (get().abortController) return
    const abortController = new AbortController()
    set({ progress: 0, error: null, abortController })

    try {
      const { blob, extension } = await exportVideo({
        ...options,
        onProgress: progress => set({ progress }),
        signal: abortController.signal,
      })
      downloadBlob(blob, `midivfx${extension}`)
    } catch(err) {
      if (!abortController.signal.aborted)
        set({ error: err instanceof Error ? err.message : String(err) })
    } finally {
      set({ progress: null, abortController: null })
    }
  },

  cancel: () => get().abortController?.abort(),
}))

export const useIsExporting = () => useExportStore(s => s.progress !== null)

export default useExportStore
