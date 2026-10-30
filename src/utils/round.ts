export const roundTo = (v: number, decimals: number) => {
  const factor = Math.pow(10, decimals)
  return Math.round(v * factor) / factor
}
