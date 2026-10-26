import { useFrame } from '@react-three/fiber'
import { useContext, useMemo, useRef } from 'react'
import type { Group } from 'three'

import DecayNotes from '@/components/DecayNotes'
import MidiFileContext from '@/context/MidiFileContext'
import useConfigStore from '@/store/configStore'
import { defaultStyleConfig, type StyleRuntime } from '@/utils/config'
import type { MidiChannelEventData, TrackData } from '@/utils/midi'
import { parseRange } from '@/utils/range'

const SPEED = 0.02

const NoteTrack = ({ track, trackNum }: { track: TrackData, trackNum: number }) => {
  return <group>
    {track.channels.map((ch, i) => <NoteChannel
      key={i}
      notes={ch}
      trackName={track.name}
      trackNum={trackNum}
      channel={i}
    />)}
  </group>
}

type NoteChannelProps = {
  notes: MidiChannelEventData[]
  trackName: string | undefined
  trackNum: number
  channel: number
}

const NoteChannel = ({ notes, trackName, trackNum, channel }: NoteChannelProps) => {
  const { midiData } = useContext(MidiFileContext)
  const styles = useConfigStore(s => s.config.styles)
  const trackLength = midiData?.tracks.length || 0

  const style: StyleRuntime = useMemo(() => {
    let currentStyle = defaultStyleConfig
    for (const s of styles) {
      const trackNameMatches = trackName && s.isRegex
        && (!s.track || RegExp(s.track, 'i').test(trackName))
      const trackNumberMatches = !s.isRegex
        && (!s.track || parseRange(s.track, 1, trackLength).includes(trackNum))
      const channelMatches = !s.channel || parseRange(s.channel, 1, 16).includes(channel)
      if (!((trackNameMatches || trackNumberMatches) && channelMatches)) continue
      currentStyle = { ...currentStyle, ...s }
    }
    return currentStyle
  }, [styles, trackName, trackLength, trackNum, channel])

  return <DecayNotes notes={notes} style={style} />
}

const NoteRenderer = ({ tracks }: { tracks: TrackData[] }) => {
  const groupRef = useRef<Group>(null!)
  const { playback } = useContext(MidiFileContext)

  useFrame(() => {
    if (playback)
      groupRef.current.position.x = -playback.currentTime * SPEED
  })

  return <group ref={groupRef}>
    {tracks.map((track, i) => <NoteTrack key={i} track={track} trackNum={i + 1} />)}
  </group>
}

export default NoteRenderer
