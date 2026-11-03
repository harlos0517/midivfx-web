import { create } from 'zustand'

import changelog, { currentVersion, type ChangelogEntry } from '@/i18n/changelog'
import useTourStore from '@/store/tourStore'

const getLastSeen = () => {
  try {
    return localStorage.getItem('lastSeenVersion')
  } catch {
    return currentVersion
  }
}

const markSeen = () => localStorage.setItem('lastSeenVersion', currentVersion)

/** Entries released since the last visit, empty when there is nothing new to announce. */
const getUnseen = (): ChangelogEntry[] => {
  // The tour already introduces everything, so a first visit has nothing to announce
  if (useTourStore.getState().active) {
    markSeen()
    return []
  }
  const lastSeen = getLastSeen()
  if (lastSeen === currentVersion) return []
  const index = changelog.findIndex(entry => entry.version === lastSeen)
  // Unknown or missing, as for visitors from before update notices: announce the latest only
  return index === -1 ? changelog.slice(0, 1) : changelog.slice(0, index)
}

interface ChangelogStore {
  /** The entries the modal lists, or null while it is closed. */
  entries: ChangelogEntry[] | null
  isUpdate: boolean
  openHistory: () => void
  close: () => void
}

const unseen = getUnseen()

const useChangelogStore = create<ChangelogStore>(set => ({
  entries: unseen.length ? unseen : null,
  isUpdate: unseen.length > 0,
  openHistory: () => set({ entries: changelog, isUpdate: false }),
  close: () => {
    markSeen()
    set({ entries: null })
  },
}))

export default useChangelogStore
