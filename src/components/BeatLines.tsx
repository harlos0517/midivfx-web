import { Line } from '@react-three/drei'
import { useContext, useMemo } from 'react'

import MidiFileContext from '@/context/MidiFileContext'
import useTimeScale from '@/hooks/useTimeScale'
import { getBeats } from '@/utils/beats'

type Point = [number, number, number]

// Drawn before every note regardless of z, so the grid always stays in the background
const RENDER_ORDER = -1000

const BeatLines = () => {
  const { midiData } = useContext(MidiFileContext)
  const timeScale = useTimeScale()

  const { measures, beats } = useMemo(() => {
    const measures: Point[] = []
    const beats: Point[] = []
    for (const beat of midiData ? getBeats(midiData) : []) {
      const x = beat.time * timeScale
      ;(beat.isMeasure ? measures : beats).push([x, 0, 0], [x, 128, 0])
    }
    return { measures, beats }
  }, [midiData, timeScale])

  return <>
    {measures.length > 0 && <Line
      points={measures} segments
      color="white" lineWidth={2} transparent opacity={0.3}
      renderOrder={RENDER_ORDER}
    />}
    {beats.length > 0 && <Line
      points={beats} segments
      color="white" lineWidth={1} transparent opacity={0.1}
      renderOrder={RENDER_ORDER}
    />}
  </>
}

export default BeatLines
