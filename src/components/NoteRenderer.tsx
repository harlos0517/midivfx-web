import { useFrame } from '@react-three/fiber'
import { useContext, useMemo, useRef } from 'react'
import type { Group } from 'three'

import BeatLines from '@/components/BeatLines'
import Notes from '@/components/Notes'
import MidiFileContext from '@/context/MidiFileContext'
import useStyle from '@/hooks/useStyle'
import useTimeScale from '@/hooks/useTimeScale'
import useConfigStore from '@/store/configStore'
import { type StyleRuntime } from '@/utils/config'
import type { MidiChannelEventData, TrackData } from '@/utils/midi'
import { getMidiDuration } from '@/utils/timeline'

interface NoteTrackProps {
  track: TrackData
  trackNum: number
  songEnd: number
}

const NoteTrack = ({ track, trackNum, songEnd }: NoteTrackProps) => {
  return <group>
    {track.channels.map((ch, i) => <NoteChannel
      key={i}
      notes={ch}
      trackName={track.name}
      trackNum={trackNum}
      channel={i + 1}
      songEnd={songEnd}
    />)}
  </group>
}

type NoteChannelProps = {
  notes: MidiChannelEventData[]
  trackName: string | undefined
  trackNum: number
  channel: number
  songEnd: number
}

const NoteChannel = ({ notes, trackName, trackNum, channel, songEnd }: NoteChannelProps) => {
  const style: StyleRuntime = useStyle(trackName || '', trackNum, channel)
  return <Notes notes={notes} style={style} songEnd={songEnd} />
}

const NoteRenderer = ({ tracks }: { tracks: TrackData[] }) => {
  const groupRef = useRef<Group>(null!)
  const { midiData, playback } = useContext(MidiFileContext)
  const songEnd = useMemo(() => getMidiDuration(midiData), [midiData])
  const timeScale = useTimeScale()
  const showBeats = useConfigStore(s => s.config.display.beat)

  useFrame(() => {
    if (playback)
      groupRef.current.position.x = -playback.currentTime * timeScale
  })

  return <group ref={groupRef}>
    {showBeats && <BeatLines />}
    {tracks.map((track, i) =>
      <NoteTrack key={i} track={track} trackNum={i + 1} songEnd={songEnd} />)}
  </group>
}

export default NoteRenderer
