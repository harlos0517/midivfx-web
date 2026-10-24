import { Shape, ShapeGeometry } from 'three'

const roundedPlaneGeometry = (w: number, h: number, r: number, segments = 8) => {
  // Clamp the corner radius per axis so a short side doesn't flatten the other axis
  const rx = Math.max(0, Math.min(r, w / 2))
  const ry = Math.max(0, Math.min(r, h / 2))

  const x0 = -w / 2
  const x1 = w / 2
  const y0 = -h / 2
  const y1 = h / 2

  const shape = new Shape()
  shape.moveTo(x0 + rx, y0)
  shape.absellipse(x1 - rx, y0 + ry, rx, ry, -Math.PI / 2, 0, false, 0)
  shape.absellipse(x1 - rx, y1 - ry, rx, ry, 0, Math.PI / 2, false, 0)
  shape.absellipse(x0 + rx, y1 - ry, rx, ry, Math.PI / 2, Math.PI, false, 0)
  shape.absellipse(x0 + rx, y0 + ry, rx, ry, Math.PI, (Math.PI * 3) / 2, false, 0)

  const geometry = new ShapeGeometry(shape, segments)

  // ShapeGeometry uses raw shape coordinates as UVs; remap to 0..1 like PlaneGeometry
  const pos = geometry.getAttribute('position')
  const uv = geometry.getAttribute('uv')
  for (let i = 0; i < uv.count; i++)
    uv.setXY(i, (pos.getX(i) - x0) / w, (pos.getY(i) - y0) / h)

  return geometry
}

export default roundedPlaneGeometry
