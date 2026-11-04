import { create } from 'zustand'

/** Track and channel numbers are 1-based, as in the UI. */
const channelKey = (track: number, channel: number) => `${track}:${channel}`

interface VisibilityStore {
  hiddenTracks: ReadonlySet<number>
  /** Kept apart from `hiddenTracks` so showing a track again restores its channels as they were. */
  hiddenChannels: ReadonlySet<string>
  toggleTrack: (track: number) => void
  toggleChannel: (track: number, channel: number) => void
  reset: () => void
}

const toggled = <T>(set: ReadonlySet<T>, value: T) => {
  const next = new Set(set)
  if (!next.delete(value)) next.add(value)
  return next
}

const useVisibilityStore = create<VisibilityStore>(set => ({
  hiddenTracks: new Set(),
  hiddenChannels: new Set(),
  toggleTrack: track => set(s => ({ hiddenTracks: toggled(s.hiddenTracks, track) })),
  toggleChannel: (track, channel) =>
    set(s => ({ hiddenChannels: toggled(s.hiddenChannels, channelKey(track, channel)) })),
  reset: () => set({ hiddenTracks: new Set(), hiddenChannels: new Set() }),
}))

export const isHidden = (
  { hiddenTracks, hiddenChannels }: Pick<VisibilityStore, 'hiddenTracks' | 'hiddenChannels'>,
  track: number,
  channel: number,
) => hiddenTracks.has(track) || hiddenChannels.has(channelKey(track, channel))

export const useIsHidden = (track: number, channel: number) =>
  useVisibilityStore(s => isHidden(s, track, channel))

export const useIsTrackHidden = (track: number) =>
  useVisibilityStore(s => s.hiddenTracks.has(track))

export default useVisibilityStore
