import { useContext } from 'react'

import CursorLine from '@/components/CursorLine'
import NoteRenderer from '@/components/NoteRenderer'
import MidiFileContext from '@/context/MidiFileContext'

const CanvasRenderer = () => {
  const { midiData } = useContext(MidiFileContext)

  return <>
    <NoteRenderer tracks={midiData?.tracks ?? []} />
    <CursorLine />
  </>
}

export default CanvasRenderer
