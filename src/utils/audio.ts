/** Audio samples per peak: fine enough for a very wide strip, small enough to keep around. */
const SAMPLES_PER_BUCKET = 512

/** Loudness envelope of a whole audio file, used instead of keeping the decoded samples. */
export interface AudioPeaks {
  /** Pairs of [min, max] sample values, one pair per bucket. */
  data: Float32Array
  /** Length of a bucket (ms). */
  bucketMs: number
}

export const decodeAudio = async(src: string) => {
  const ctx = new AudioContext()
  try {
    return await ctx.decodeAudioData(await (await fetch(src)).arrayBuffer())
  } finally {
    void ctx.close()
  }
}

export const computePeaks = (buffer: AudioBuffer): AudioPeaks => {
  const buckets = Math.ceil(buffer.length / SAMPLES_PER_BUCKET)
  const data = new Float32Array(buckets * 2)
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const samples = buffer.getChannelData(c)
    for (let i = 0; i < samples.length; i++) {
      const bucket = Math.floor(i / SAMPLES_PER_BUCKET) * 2
      const sample = samples[i]!
      if (sample < data[bucket]!) data[bucket] = sample
      if (sample > data[bucket + 1]!) data[bucket + 1] = sample
    }
  }
  return { data, bucketMs: SAMPLES_PER_BUCKET / buffer.sampleRate * 1000 }
}
