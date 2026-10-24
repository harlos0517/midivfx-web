import { useFrame } from '@react-three/fiber'
import { useContext, useMemo, useRef } from 'react'
import type { Group } from 'three'

import DecayNotes from '@/components/DecayNotes'
import MidiFileContext from '@/context/MidiFileContext'
import { defaultStyleConfig, type StyleRuntime } from '@/utils/config'
import type { MidiChannelEventData, TrackData } from '@/utils/midi'

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
  const { config } = useContext(MidiFileContext)
  const { styles } = config

  const style: StyleRuntime = useMemo(() => {
    let currentStyle = defaultStyleConfig
    for (const s of styles) {
      const trackNameMatches = trackName
        && typeof s.track === 'string' && RegExp(s.track, 'i').test(trackName)
      const trackNumberMatches = !s.track || (Array.isArray(s.track) && s.track.includes(trackNum))
      const channelMatches = !s.channel || s.channel.includes(channel)
      if (!((trackNameMatches || trackNumberMatches) && channelMatches)) continue
      currentStyle = { ...currentStyle, ...s }
    }
    return currentStyle
  }, [channel, styles, trackName, trackNum])

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
    {tracks.map((track, i) => <NoteTrack key={i} track={track} trackNum={i} />)}
  </group>
}

export default NoteRenderer
