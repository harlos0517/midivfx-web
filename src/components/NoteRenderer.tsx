import { useFrame } from '@react-three/fiber'
import { useContext, useRef } from 'react'
import type { Group } from 'three'

import DecayNotes from '@/components/DecayNotes'
import MidiFileContext from '@/context/MidiFileContext'
import useStyle from '@/hooks/useStyle'
import useTimeScale from '@/hooks/useTimeScale'
import { type StyleRuntime } from '@/utils/config'
import type { MidiChannelEventData, TrackData } from '@/utils/midi'

const NoteTrack = ({ track, trackNum }: { track: TrackData, trackNum: number }) => {
  return <group>
    {track.channels.map((ch, i) => <NoteChannel
      key={i}
      notes={ch}
      trackName={track.name}
      trackNum={trackNum}
      channel={i + 1}
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
  const style: StyleRuntime = useStyle(trackName || '', trackNum, channel)
  return <DecayNotes notes={notes} style={style} />
}

const NoteRenderer = ({ tracks }: { tracks: TrackData[] }) => {
  const groupRef = useRef<Group>(null!)
  const { playback } = useContext(MidiFileContext)
  const timeScale = useTimeScale()

  useFrame(() => {
    if (playback)
      groupRef.current.position.x = -playback.currentTime * timeScale
  })

  return <group ref={groupRef}>
    {tracks.map((track, i) => <NoteTrack key={i} track={track} trackNum={i + 1} />)}
  </group>
}

export default NoteRenderer
