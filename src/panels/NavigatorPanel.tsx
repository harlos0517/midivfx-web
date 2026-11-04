import { Box, Text } from '@mantine/core'
import { clamp, useElementSize } from '@mantine/hooks'
import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from 'react'

import PanelWrapper from '@/components/PanelWrapper'
import MidiFileContext from '@/context/MidiFileContext'
import usePlaybackConfig from '@/hooks/usePlaybackConfig'
import useConfigStore from '@/store/configStore'
import useVisibilityStore, { isHidden } from '@/store/visibilityStore'
import { drawNotes, drawWaveform, type TimeRange } from '@/utils/drawNavigator'
import { getFadeGain, getFadeKnots, type Fade } from '@/utils/fade'
import { DEFAULT_PADDING, getLength } from '@/utils/timeline'

/** Shortest range the box can be resized to (ms). */
const MIN_RANGE = 1000
/** Pointer travel (px) that turns a press on the box into a drag instead of a click. */
const DRAG_THRESHOLD = 3

type DragMode = 'move' | 'start' | 'end'

interface Drag {
  mode: DragMode
  x: number
  range: TimeRange
  moved: boolean
}

const formatTime = (ms: number) => `${(ms / 1000).toFixed(2)}s`

/**
 * SVG path of the gain over the range box, in a 1×1 box with y down: the area above the curve is
 * shaded, as it is what the fades take away.
 */
const getFadePath = (fade: Fade & { end: number }) => {
  const length = fade.end - fade.start
  const points = getFadeKnots(fade)
    .filter(k => k >= fade.start && k <= fade.end)
    .map(k => `L${(k - fade.start) / length},${1 - getFadeGain(k, fade)}`)
  return `M0,0 ${points.join(' ')} L1,0 Z`
}

const canvasStyle = {
  position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none',
} as const

const NavigatorPanel = () => {
  const { midiData, audioPeaks, playback } = useContext(MidiFileContext)
  const { ref: trackRef, width, height } = useElementSize()
  const waveformRef = useRef<HTMLCanvasElement>(null)
  const notesRef = useRef<HTMLCanvasElement>(null)
  const playheadRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<Drag | null>(null)

  const [audioOffset] = usePlaybackConfig('audioOffset')
  const [startTime] = usePlaybackConfig('startTime')
  const [endTime] = usePlaybackConfig('endTime')
  const [fadeIn] = usePlaybackConfig('fadeIn')
  const [fadeOut] = usePlaybackConfig('fadeOut')
  const hiddenTracks = useVisibilityStore(s => s.hiddenTracks)
  const hiddenChannels = useVisibilityStore(s => s.hiddenChannels)

  // audioPeaks stands in for the audio changing, which Playback can't signal to React
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const length = useMemo(() => getLength(midiData, playback), [
    midiData, playback, audioPeaks, audioOffset,
  ])
  const hasContent = midiData !== null || audioPeaks !== null

  // Built from the saved range, not the dragged one, so the scale holds still during a drag
  const saved = useMemo(
    () => ({ start: startTime, end: endTime ?? length }),
    [startTime, endTime, length],
  )
  const domain = useMemo(() => ({
    start: Math.min(-DEFAULT_PADDING, saved.start),
    end: Math.max(length + DEFAULT_PADDING, saved.end),
  }), [saved, length])
  const span = domain.end - domain.start

  // Saving on every move would restart the audio each time, so a drag only saves on release
  const [draft, setDraft] = useState<TimeRange | null>(null)
  const range = draft ?? saved

  useEffect(() => {
    if (!width || !waveformRef.current) return
    drawWaveform(waveformRef.current, width, height, domain, audioPeaks, audioOffset)
  }, [width, height, domain, audioPeaks, audioOffset])

  useEffect(() => {
    if (!width || !notesRef.current) return
    drawNotes(notesRef.current, width, height, domain, midiData,
      (track, channel) => isHidden({ hiddenTracks, hiddenChannels }, track, channel))
  }, [width, height, domain, midiData, hiddenTracks, hiddenChannels])

  useEffect(() => {
    let frame: number
    const update = () => {
      const x = ((playback?.currentTime ?? 0) - domain.start) / span * width
      if (playheadRef.current) playheadRef.current.style.transform = `translateX(${x}px)`
      frame = requestAnimationFrame(update)
    }
    frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)
  }, [playback, domain, span, width])

  const seekTo = (e: PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    playback?.seek(domain.start + (e.clientX - rect.left) / rect.width * span)
  }

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.button !== 0 || !hasContent) return
    const mode = (e.target as HTMLElement).dataset['drag'] as DragMode | undefined
    if (!mode) {
      seekTo(e)
      return
    }
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { mode, x: e.clientX, range, moved: false }
  }

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current
    if (!drag) return
    const dx = e.clientX - drag.x
    if (!drag.moved && Math.abs(dx) < DRAG_THRESHOLD) return
    drag.moved = true

    const { start, end } = drag.range
    const delta = dx / e.currentTarget.getBoundingClientRect().width * span
    if (drag.mode === 'move') {
      const shift = clamp(delta, domain.start - start, domain.end - end)
      setDraft({ start: start + shift, end: end + shift })
    } else if (drag.mode === 'start')
      setDraft({ start: clamp(start + delta, domain.start, end - MIN_RANGE), end })
    else
      setDraft({ start, end: clamp(end + delta, start + MIN_RANGE, domain.end) })
  }

  const onPointerUp = (e: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current
    dragRef.current = null
    if (!drag) return
    if (!drag.moved) {
      // With the default range the box fills the strip, so it has to take clicks to seek too
      if (drag.mode === 'move') seekTo(e)
      return
    }
    if (draft) {
      useConfigStore.getState().setConfig(c => ({
        ...c,
        playback: {
          ...c.playback,
          startTime: Math.round(draft.start),
          endTime: Math.round(draft.end),
        },
      }))
    }
    setDraft(null)
  }

  const onPointerCancel = () => {
    dragRef.current = null
    setDraft(null)
  }

  return <PanelWrapper withPadding={false}>
    <Box
      ref={trackRef}
      flex={1}
      mih={0}
      pos="relative"
      bg="black"
      style={{ overflow: 'hidden', touchAction: 'none', cursor: hasContent ? 'text' : 'default' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <canvas ref={waveformRef} style={canvasStyle} />
      <canvas ref={notesRef} style={canvasStyle} />

      {hasContent ? <Box
        data-drag="move"
        pos="absolute" top={0} bottom={0}
        bd="1px solid blue.4"
        style={{
          left: `calc(${(range.start - domain.start) / span * 100}% + 1px)`,
          width: `calc(${Math.max(0, range.end - range.start) / span * 100}% - 1px)`,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
          cursor: draft ? 'grabbing' : 'grab',
        }}
      >
        {(fadeIn > 0 || fadeOut > 0) && range.end > range.start && <svg
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
          style={{ ...canvasStyle, overflow: 'visible' }}
        >
          <path
            d={getFadePath({ start: range.start, end: range.end, fadeIn, fadeOut })}
            fill="rgba(0, 0, 0, 0.5)"
            stroke="var(--mantine-color-blue-4)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        </svg>}
        <Box
          data-drag="start"
          pos="absolute" top={0} bottom={0} left={0} w={8} bg="transparent"
          style={{ cursor: 'ew-resize' }}
        />
        <Box
          data-drag="end"
          pos="absolute" top={0} bottom={0} right={0} w={8} bg="transparent"
          style={{ cursor: 'ew-resize' }}
        />
      </Box> : <></>}

      {hasContent && <Box
        ref={playheadRef}
        pos="absolute" top={0} bottom={0} left={0} w={1} bg="white"
        style={{ pointerEvents: 'none' }}
      />}

      {draft && <Text
        pos="absolute" top={2} left={2} px={4} size="xs" c="white" bg="rgba(0, 0, 0, 0.75)"
        style={{ pointerEvents: 'none' }}
      >
        {formatTime(draft.start)} ~ {formatTime(draft.end)}
      </Text>}
    </Box>
  </PanelWrapper>
}

export default NavigatorPanel
