# MIDIVFX

A MIDI file visualizer that runs in the browser. Import a MIDI file and optional audio, style the notes, and export the result as a video.

**Live site:** https://midivfx.harlos.tw

## Features

- Piano-roll rendering in WebGL
- Audio playback synced to the MIDI, with an adjustable offset
- Per-track and per-channel styles, including color, fade color, decay, velocity, CC opacity, sustain pedal, and pitch remapping
- Cursor indicators and ripples that pulse on the cursor line as notes play
- Background color or image, and fade-in/fade-out at the start and end
- Save and load camera, display, and style settings as a config file to reuse a look
- Video export to MP4, or WebM with transparency
- Dockable panels
- Interface in English, Traditional Chinese, and Japanese, with a tooltip on every option

## Usage

1. Import a MIDI file and, optionally, an audio file in the **Import** panel, or drop them anywhere on the page.
2. Adjust the look in the **Styles**, **Camera**, and **Display** panels.
3. Set the time range and fades in the **Playback** panel, or drag a range in the **Navigator**. Click a track or channel in the **Tracks** panel to hide it.
4. Export the video from the **Export** panel.

### Shortcuts

| Key | Action |
| --- | --- |
| `Space` | Play or pause |
| `←` / `→` | Seek 1 second back or forward |
| `Home` / `End` | Jump to the very start or end |
| `[` / `]` | Jump to the start or end time |
| `R` | Reset the camera |

## Development

Requires Node.js and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

`pnpm build` outputs to `docs/`, which is served by GitHub Pages.
