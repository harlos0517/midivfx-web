export const generateSliderMarks = (min: number, max: number, mid: number[] | null = null) => {
  const marks = [
    { value: min, label: min.toString() },
    { value: max, label: max.toString() },
    ...(mid !== null ? mid.map(v => ({ value: v, label: v.toString() })) : []),
  ].sort((a, b) => a.value - b.value)
  return marks
}

export const getSliderProps = (
  min: number,
  max: number,
  step: number,
  mid: number[] | null = null,
) => ({
  min, max, step,
  marks: generateSliderMarks(min, max, mid),
})

export const getNumberInputProps = (
  min: number,
  max: number,
  step: number,
  mid: number[] | null = null,
  restrictToMarks: boolean = false,
) => ({
  sliderProps: getSliderProps(min, max, step, mid),
  min,
  max,
  step,
  restrictToMarks,
})
