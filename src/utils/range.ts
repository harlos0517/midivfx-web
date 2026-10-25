export const parseRange = (value: string, min: number, max: number): number[] => {
  const ranges = value.split(',').map(v => v.trim())
  const result = []

  for (const range of ranges) {
    if (range.includes('-')) {
      const [start, end] = range.split('-').map(v => parseInt(v.trim(), 10))
      const from = start !== undefined && !isNaN(start) ? Math.max(min, start) : min
      const to = end !== undefined && !isNaN(end) ? Math.min(max, end) : max
      for (let i = from; i <= to; i++) result.push(i)
    } else {
      const num = parseInt(range, 10)
      if (!isNaN(num)) result.push(num)
    }
  }
  return [...new Set(result.filter(n => n >= min && n <= max))]
}

