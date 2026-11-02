import {
  ActionIcon,
  ColorInput,
  createTheme,
  Input,
  NumberInput,
  SegmentedControl,
  Slider,
} from '@mantine/core'

export const theme = createTheme({
  components: {
    Input: Input.extend({
      defaultProps: { variant: 'filled', size: 'xs' },
      vars: () => ({ wrapper: {
        '--input-height': '2rem',
        '--input-fz': '1rem',
        '--input-radius': '4px',
      } }),
      styles: { wrapper: { '--input-padding': '4px' } },
    }),
    NumberInput: NumberInput.extend({ styles: { control: { '--ni-chevron-size': '1rem' } } }),
    ColorInput: ColorInput.extend({ defaultProps: { withEyeDropper: false } }),
    SegmentedControl: SegmentedControl.extend({
      defaultProps: { size: 'xs' },
      styles: {
        label: { padding: '2px 4px' },
        root: { height: '2rem', padding: '1px 1px 0 1px', borderRadius: 4 },
      },
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: { size: '2rem' },
      styles: { root: { borderRadius: 4 } },
    }),
    Slider: Slider.extend({
      styles: {
        markLabel: { fontSize: '8px' },
      },
    }),
  },
})
