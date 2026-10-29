import useConfigStore from '@/store/configStore'

/** World units per millisecond at `display.speed = 1`. */
const BASE_TIME_SCALE = 0.02

/** World units per millisecond along the time (x) axis. */
const useTimeScale = () => useConfigStore(s => s.config.display.speed) * BASE_TIME_SCALE

export default useTimeScale
