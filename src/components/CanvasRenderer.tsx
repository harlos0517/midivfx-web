import { useContext } from 'react'

import { BackgroundQuad } from '@/components/Background'
import CursorLine from '@/components/CursorLine'
import { FadeQuad } from '@/components/Fade'
import NoteRenderer from '@/components/NoteRenderer'
import PostEffects from '@/components/PostEffects'
import MidiFileContext from '@/context/MidiFileContext'
import useConfigStore from '@/store/configStore'

const CanvasRenderer = () => {
  const { midiData } = useContext(MidiFileContext)
  // With bloom, PostEffects composites the background and the fade instead, after the glow
  const bloom = useConfigStore(s => s.config.display.bloom)

  return <>
    {!bloom && <BackgroundQuad />}
    <NoteRenderer tracks={midiData?.tracks ?? []} />
    <CursorLine />
    {!bloom && <FadeQuad />}
    <PostEffects />
  </>
}

export default CanvasRenderer
