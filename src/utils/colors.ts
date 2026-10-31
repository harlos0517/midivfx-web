import Color from 'color'

export const fixColorHex = (color: string, fallback: string) => {
  try {
    return new Color(color).hex()
  } catch {
    return fallback
  }
}

export const getTextColor = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const brightness = Math.round(((r * 299) + (g * 587) + (b * 114)) / 1000)
  const textColor = (brightness > 125) ? 'black' : 'white'
  return textColor
}
