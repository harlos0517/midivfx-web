import { Howl } from 'howler'

export default class Playback {
  private offset: number = 0
  private startedAt: number = 0
  private audio: Howl | null = null
  public playing: boolean = false
  public audioSrc: string | null = null

  static now = () => performance.now()

  loadAudio(src: string) {
    this.audio?.unload()
    this.audioSrc = src
    this.audio = new Howl({ src: [src], format: ['mp3', 'wav', 'ogg'] })
    this.audio.on('end', () => this.pause())
  }

  get duration() {
    const d = this.audio?.duration()
    return d ? d * 1000 : 0
  }

  get currentTime() {
    if (this.audio && this.playing) return this.audio.seek() * 1000
    return this.playing ? this.offset + (Playback.now() - this.startedAt) : this.offset
  }

  play()  {
    if (this.playing) return
    this.audio?.seek(this.offset / 1000)
    this.audio?.play()
    this.startedAt = Playback.now()
    this.playing = true
  }

  pause() {
    if (!this.playing) return
    this.offset = this.currentTime
    this.audio?.pause()
    this.playing = false
  }

  togglePlay() {
    if (this.playing) this.pause()
    else this.play()
  }

  seek(ms: number) {
    this.offset = ms
    this.startedAt = Playback.now()
    this.audio?.seek(ms / 1000)
  }

  dispose() { this.audio?.unload() }

  set volume(value: number) {
    if (this.audio) this.audio.volume(value)
  }
}
