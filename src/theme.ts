import {
  ActionIcon,
  Button,
  ColorInput,
  createTheme,
  Group,
  Input,
  NumberInput,
  SegmentedControl,
  Slider,
  Stack,
  Tooltip,
} from '@mantine/core'

export const theme = createTheme({
  components: {
    Button: Button.extend({
      styles: {
        root: {
          padding: '0 4px',
          borderRadius: 4,
          lineHeight: '1rem',
          height: '2rem',
        },
      },
    }),
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
        root: {
          height: '2rem',
          padding: '1px 1px 0 1px',
          borderRadius: 4,
          border: '1px solid #444444',
        },
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
    Group: Group.extend({
      defaultProps: { gap: 'xs', wrap: 'nowrap' },
    }),
    Stack: Stack.extend({
      defaultProps: { gap: 'xs' },
    }),
    Tooltip: Tooltip.extend({
      defaultProps: {
        multiline: true,
        w: 260,
        openDelay: 300,
        // Without focus, or a tooltip would stay open after its button is clicked
        events: { hover: true, focus: false, touch: true },
      },
    }),
  },
})
