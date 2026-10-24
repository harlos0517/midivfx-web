import { Line } from '@react-three/drei'

const CursorLine = () => {
  const points = [
    [0, 0, 0] as const,
    [0, 128, 0] as const,
  ]

  return <Line
    points={points}
    color="white"
    lineWidth={1}
  />
}

export default CursorLine
