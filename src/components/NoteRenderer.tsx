import { useFrame } from '@react-three/fiber'
import { useContext, useMemo, useRef } from 'react'
import type { Group } from 'three'

import BeatLines from '@/components/BeatLines'
import NoteIndicators from '@/components/NoteIndicators'
import Notes from '@/components/Notes'
import MidiFileContext from '@/context/MidiFileContext'
import useStyle from '@/hooks/useStyle'
import useTimeScale from '@/hooks/useTimeScale'
import useConfigStore from '@/store/configStore'
import { useIsHidden } from '@/store/visibilityStore'
import { type StyleRuntime } from '@/utils/config'
import type { MidiChannelEventData, TrackData } from '@/utils/midi'
import { getMidiDuration } from '@/utils/timeline'

interface NoteTrackProps {
  track: TrackData
  tracks: TrackData[]
  trackNum: number
  songEnd: number
}

const NoteTrack = ({ track, tracks, trackNum, songEnd }: NoteTrackProps) => {
  return <group>
    {track.channels.map((ch, i) => <NoteChannel
      key={i}
      notes={ch}
      tracks={tracks}
      trackName={track.name}
      trackNum={trackNum}
      channel={i + 1}
      songEnd={songEnd}
    />)}
  </group>
}

type NoteChannelProps = {
  notes: MidiChannelEventData[]
  tracks: TrackData[]
  trackName: string | undefined
  trackNum: number
  channel: number
  songEnd: number
}

const NoteChannel = (props: NoteChannelProps) => {
  const { notes, tracks, trackName, trackNum, channel, songEnd } = props
  const style: StyleRuntime = useStyle(trackName || '', trackNum, channel)
  const hidden = useIsHidden(trackNum, channel)
  // Hidden channels still lend their controllers, so a pedal-only track can be hidden. A source
  // that doesn't exist in this file falls back to the note's own channel.
  const source = (t: number, c: number) =>
    tracks[(t || trackNum) - 1]?.channels[(c || channel) - 1] ?? notes
  const ccEvents = source(style.ccTrack, style.ccChannel)
  return <>
    <Notes
      notes={notes}
      pedalEvents={source(style.pedalTrack, style.pedalChannel)}
      ccEvents={ccEvents}
      style={style}
      songEnd={songEnd}
      visible={!hidden}
    />
    <NoteIndicators notes={notes} ccEvents={ccEvents} style={style} visible={!hidden} />
  </>
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
      <NoteTrack key={i} track={track} tracks={tracks} trackNum={i + 1} songEnd={songEnd} />)}
  </group>
}

export default NoteRenderer
