import { create } from 'zustand'

const isSeen = () => {
  try {
    return localStorage.getItem('tourSeen') !== null
  } catch {
    return true
  }
}

interface TourStore {
  active: boolean
  start: () => void
  close: () => void
}

const useTourStore = create<TourStore>(set => ({
  // New visitors get the tour once, whether they finish or skip it
  active: !isSeen(),
  start: () => set({ active: true }),
  close: () => {
    localStorage.setItem('tourSeen', '1')
    set({ active: false })
  },
}))

export default useTourStore
