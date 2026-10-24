import Color from 'color'
import { useEffect, useMemo } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'

const DECAY_SEG = 100
const DECAY_UNIT = 1
const SPEED = 0.02
const DECAY_UNITS_PER_SEG = DECAY_SEG * SPEED / DECAY_UNIT
const TEXTURE_SIZE = 256

interface NoteProps {
  decayRate: number
  color: string
  width: number
}

// drei's GradientTexture can't be used here: it converts colors through THREE.Color
// (dropping alpha) and draws vertically, so we draw a horizontal RGBA gradient ourselves
const DecayGradient = ({ decayRate, color, width }: NoteProps) => {
  const decayUnits = width / DECAY_UNIT

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = TEXTURE_SIZE
    canvas.height = 1
    const context = canvas.getContext('2d')!

    const c = new Color(color)
    const r = c.red()
    const g = c.green()
    const b = c.blue()
    const decayPerUnit = Math.pow(1 - decayRate, DECAY_UNITS_PER_SEG)

    const gradient = context.createLinearGradient(0, 0, TEXTURE_SIZE, 0)
    let ratio = 1
    for (let i = 0; i < decayUnits; i++) {
      gradient.addColorStop(i / decayUnits, `rgba(${r}, ${g}, ${b}, ${ratio})`)
      ratio *= decayPerUnit
    }
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${ratio})`)

    context.fillStyle = gradient
    context.fillRect(0, 0, TEXTURE_SIZE, 1)

    const texture = new CanvasTexture(canvas)
    texture.colorSpace = SRGBColorSpace
    return texture
  }, [decayUnits, decayRate, color])

  useEffect(() => () => texture.dispose(), [texture])

  return <primitive object={texture} attach="map" />
}

export default DecayGradient
