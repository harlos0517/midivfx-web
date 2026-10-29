import { useContext, useMemo } from 'react'

import MidiFileContext from '@/context/MidiFileContext'
import useConfigStore from '@/store/configStore'
import { type StyleRuntime, defaultStyleRuntime } from '@/utils/config'
import { parseRange } from '@/utils/range'

// Invalid patterns (e.g. while still typing) match nothing instead of throwing
const testRegex = (pattern: string, text: string) => {
  try {
    return RegExp(pattern, 'i').test(text)
  } catch {
    return false
  }
}

const useStyle = (trackName: string, trackNum: number, channel: number) => {
  const { midiData } = useContext(MidiFileContext)
  const styles = useConfigStore(s => s.config.styles)
  const trackLength = midiData?.tracks.length || 0

  const style: StyleRuntime = useMemo(() => {
    let currentStyle = defaultStyleRuntime
    for (const s of styles) {
      const trackNameMatches = s.isRegex && (!s.track || testRegex(s.track, trackName))
      const trackNumberMatches = !s.isRegex
        && (!s.track || parseRange(s.track, 1, trackLength).includes(trackNum))
      const channelMatches = !s.channel || parseRange(s.channel, 1, 16).includes(channel)
      if (!((trackNameMatches || trackNumberMatches) && channelMatches)) continue
      currentStyle = { ...currentStyle, ...s }
    }
    return currentStyle
  }, [styles, trackName, trackLength, trackNum, channel])

  return style
}

export default useStyle
