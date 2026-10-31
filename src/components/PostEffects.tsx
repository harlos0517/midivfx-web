import { Bloom, EffectComposer, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

import useConfigStore from '@/store/configStore'

const PostEffects = () => {
  const bloom = useConfigStore(s => s.config.display.bloom)
  const intensity = useConfigStore(s => s.config.display.bloomIntensity)
  const threshold = useConfigStore(s => s.config.display.bloomThreshold)
  const radius = useConfigStore(s => s.config.display.bloomRadius)

  if (!bloom) return null

  // three skips the canvas tone mapping when rendering into the composer's buffer, so without
  // ToneMapping the note colors would differ from bloom off. It goes first so the notes are mapped
  // but the glow, which Bloom builds from the input buffer, is added afterwards and not dimmed
  return <EffectComposer>
    <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    <Bloom intensity={intensity} luminanceThreshold={threshold} radius={radius} />
  </EffectComposer>
}

export default PostEffects
