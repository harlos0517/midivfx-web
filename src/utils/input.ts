export const generateSliderMarks = (min: number, max: number, mid: number | null = 0) => {
  const marks = [
    { value: min, label: min.toString() },
    { value: max, label: max.toString() },
    ...(mid !== null ? [{ value: mid, label: mid.toString() }] : []),
  ].sort((a, b) => a.value - b.value)
  return marks
}
