# MIDIVFX

A MIDI file visualizer that runs in the browser. Import a MIDI file and optional audio, style the notes, and export the result as a video.

**Live site:** https://midivfx.harlos.tw

## Features

- Piano-roll rendering in WebGL
- Audio playback synced to the MIDI, with an adjustable offset
- Per-track and per-channel styles, including color, decay, velocity, CC opacity, sustain pedal, and pitch remapping
- Video export to MP4, or WebM with transparency
- Dockable panels

## Usage

1. Import a MIDI file and, optionally, an audio file in the **Import** panel.
2. Adjust the look in the **Styles**, **Camera**, and **Display** panels.
3. Set the time range in the **Playback** panel.
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
