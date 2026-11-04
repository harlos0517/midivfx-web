import { Howl } from 'howler'

import { getFadeGain, getFadeKnots, type Fade } from '@/utils/fade'

/**
 * Timeline clock in ms (MIDI time). It can run outside the audio, e.g. at negative times;
 * the audio is started whenever the clock reaches it, shifted by `audioOffset`.
 */
export default class Playback {
  private offset: number = 0
  private startedAt: number = 0
  private audio: Howl | null = null
  private soundId: number | undefined
  private audioTimer: ReturnType<typeof setTimeout> | undefined
  private stopTimer: ReturnType<typeof setTimeout> | undefined
  private fadeTimer: ReturnType<typeof setTimeout> | undefined
  private _audioOffset: number = 0
  private startTime: number = 0
  private endTime: number | null = null
  private fadeIn: number = 0
  private fadeOut: number = 0
  public playing: boolean = false
  public audioSrc: string | null = null

  static now = () => performance.now()

  /** Resolves once the audio is decoded and its duration is known. */
  loadAudio(src: string) {
    this.audio?.unload()
    this.soundId = undefined
    this.audioSrc = src
    const audio = new Howl({ src: [src], format: ['mp3', 'wav', 'ogg'] })
    this.audio = audio
    return new Promise<void>((resolve, reject) => {
      audio.once('load', () => {
        if (this.playing) this.sync(this.currentTime)
        resolve()
      })
      audio.once('loaderror', (_, err) => {
        // The previous audio is already gone, so a failed load leaves no audio at all
        if (this.audio === audio) {
          this.audio = null
          this.audioSrc = null
        }
        reject(new Error(String(err)))
      })
    })
  }

  /** Audio length (ms), or 0 when no audio is loaded yet. */
  get audioDuration() {
    const d = this.audio?.duration()
    return d ? d * 1000 : 0
  }

  get audioOffset() { return this._audioOffset }

  /** Audio delay relative to the timeline (ms); positive = audio starts later. */
  setAudioOffset(value: number) {
    const time = this.currentTime
    this._audioOffset = value
    if (this.playing) this.sync(time)
  }

  /** Playback stops at `endTime`, and playing from there restarts at `startTime`. */
  setRange(startTime: number, endTime: number | null) {
    this.startTime = startTime
    this.endTime = endTime
    if (this.playing) this.sync(this.currentTime)
  }

  /** Fade durations (ms) from `startTime` and to `endTime`; 0 = off. */
  setFade(fadeIn: number, fadeOut: number) {
    this.fadeIn = fadeIn
    this.fadeOut = fadeOut
    if (this.playing) this.sync(this.currentTime)
  }

  private get fade(): Fade {
    return { start: this.startTime, end: this.endTime, fadeIn: this.fadeIn, fadeOut: this.fadeOut }
  }

  /** Picture and audio gain (0-1) at timeline time `t` (ms). */
  fadeGain(t: number) {
    return getFadeGain(t, this.fade)
  }

  get currentTime() {
    if (!this.playing) return this.offset
    if (this.audio && this.soundId !== undefined && this.audio.playing(this.soundId)) {
      const seek = this.audio.seek(this.soundId)
      if (typeof seek === 'number') return seek * 1000 + this._audioOffset
    }
    return this.offset + (Playback.now() - this.startedAt)
  }

  play() {
    if (this.playing) return
    if (this.endTime !== null && this.offset >= this.endTime) this.offset = this.startTime
    this.playing = true
    this.sync(this.offset)
  }

  pause() {
    if (!this.playing) return
    this.offset = this.currentTime
    this.playing = false
    this.sync(this.offset)
  }

  togglePlay() {
    if (this.playing) this.pause()
    else this.play()
  }

  seek(ms: number) {
    this.sync(ms)
  }

  dispose() {
    clearTimeout(this.audioTimer)
    clearTimeout(this.stopTimer)
    clearTimeout(this.fadeTimer)
    this.audio?.unload()
  }

  set volume(value: number) {
    if (this.audio) this.audio.volume(value)
  }

  /** Moves the clock to `time` and re-aligns the audio and the stop timer with it. */
  private sync(time: number) {
    clearTimeout(this.audioTimer)
    clearTimeout(this.stopTimer)
    clearTimeout(this.fadeTimer)
    this.audio?.pause()
    this.offset = time
    this.startedAt = Playback.now()
    if (!this.playing) return

    const endTime = this.endTime
    // Seeking past the end while playing pauses there instead of jumping back to the end
    if (endTime !== null && time >= endTime) {
      this.playing = false
      return
    }
    if (endTime !== null) {
      this.stopTimer = setTimeout(() => {
        this.pause()
        this.seek(endTime)
      }, Math.max(0, endTime - time))
    }

    const audioPos = time - this._audioOffset
    if (audioPos < 0) this.audioTimer = setTimeout(() => this.startAudio(0), -audioPos)
    else if (audioPos < this.audioDuration) this.startAudio(audioPos)
  }

  private startAudio(ms: number) {
    if (!this.audio) return
    // Play by id, then seek: playing without an id after the sound ended resets its position
    this.soundId = this.audio.play(this.soundId)
    this.audio.seek(ms / 1000, this.soundId)
    this.applyFade(ms + this._audioOffset)
  }

  /**
   * Ramps the volume from timeline time `t` to the next fade knot, then schedules the next ramp.
   * Howler ramps on the audio clock, which is smoother than setting the volume each frame.
   */
  private applyFade(t: number) {
    if (!this.audio || this.soundId === undefined) return
    const next = getFadeKnots(this.fade).find(k => k > t)
    const from = this.fadeGain(t)
    if (next === undefined) {
      this.audio.volume(from, this.soundId)
      return
    }
    const to = this.fadeGain(next)
    if (from === to) this.audio.volume(from, this.soundId)
    else this.audio.fade(from, to, next - t, this.soundId)
    this.fadeTimer = setTimeout(() => this.applyFade(next), next - t)
  }
}
