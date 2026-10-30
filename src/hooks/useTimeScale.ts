import useConfigStore from '@/store/configStore'

/** World units per millisecond along the time (x) axis. */
const useTimeScale = () => useConfigStore(s => s.config.display.unitsPerSecond) / 1000

export default useTimeScale
