# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

MIDIVFX is a client-only browser app (https://midivfx.harlos.tw) that imports a MIDI file and optional audio, renders the notes as a piano roll in WebGL, and exports the result as a video. There is no backend. All state lives in the browser.

## Commands

Package manager is pnpm.

```bash
pnpm dev                 # Vite dev server
pnpm build               # Build into docs/ (overwrites the deployed site, see Deployment)
pnpm exec tsc --noEmit   # Typecheck (the build does not typecheck)
pnpm lint                # Lint (pnpm lint:fix to autofix)
```

- **There are no tests.** To run a single file, use `pnpm exec tsx path/to/file.ts`. Verify behavior by running the app.
- `example/` is gitignored and holds a sample `.mid` and `.mp3` for manual testing. Its `config.json` is from an older schema (`startPadding`, `speed`) and does not match `Config`. Config import/export isn't implemented yet, so leave the file as is until it is.

## Architecture

The stack is React 19, react-three-fiber, Zustand, Mantine (UI), and dockview (dockable panels). `@/` maps to `src/`. The only route is `src/pages/Index.tsx`, which owns the dockview layout, the transport hotkeys, and the `MidiFileContext` provider.

### State lives in three places

- **`MidiFileContext`** holds `midiData` (parsed MIDI) and `playback` (the single `Playback` instance). Neither is persisted, so imports are lost on reload.
- **`configStore`** holds all user settings as `Config` (`src/utils/config.ts`) and writes them to `localStorage['config']` on every change. Section hooks (`usePlaybackConfig`, `useCameraConfig`, and so on) read and write one key. Outside React, use `useConfigStore.getState()`.
- **`exportStore`** and **`rendererStore`** are not persisted. They hold export progress and cancellation, and handles into the live R3F canvas. `RendererBridge` publishes those handles so code outside `<Canvas>` can drive rendering.

### The clock drives everything

`Playback` (`src/utils/Playback.ts`) is a plain mutable class, not React state, and it is the only source of time. It holds the timeline clock in ms, which can be negative for blank lead-in. While audio is playing the clock reads from the Howler position (plus `audioOffset`), otherwise from `performance.now()`.

The scene never re-renders on time. `NoteRenderer` reads `playback.currentTime` in `useFrame` and shifts one group along -x. Notes are static geometry and the cursor stays at x = 0. World axes: x is time (`unitsPerSecond` / 1000 units per ms), y is MIDI pitch (1 unit per pitch), and z is layering.

### Export

`exportVideo` takes over rendering, so export stays deterministic: it pauses playback, sets the R3F frameloop to `'never'`, then for each frame calls `playback.seek(t)`, `renderer.advance()`, and `video.add()`. The audio is sliced and encoded separately.

- Anything animated must derive from `playback.currentTime` inside `useFrame`. Anything based on wall-clock time or timers will be wrong in exported video.
- Alpha on exports VP9/WebM. Alpha off exports H.264/MP4.
- The canvas uses `dpr={1}` at exactly `display.width` × `display.height` and is scaled down with CSS to fit the panel, so canvas pixels equal output pixels. Export requires even dimensions.
- While exporting, user input must not touch the clock or camera: gate hotkeys and controls on `useIsExporting()`. `PanelWrapper` overlays every panel except Export.

### Styles cascade like CSS

`config.styles` is an ordered list of partial `StyleConfig` entries. A missing key means "inherit", not "default value". `useStyle(trackName, trackNum, channel)` starts from `defaultStyleRuntime` and spreads every matching style in order, so later styles win. It is resolved per track and channel. Tracks match by regex on the name (`isRegex`) or by range notation on the number. Channels match by range notation. See `parseRange`, e.g. `1-4,7`.

Track and channel numbers are 1-based in styles and UI, but `track.channels` is a 0-based array.

`OverridableInput` is the per-field toggle: clearing an override deletes the key via `useStyleConfig`. The `default` style is always overridden.

Pitch remaps within a style follow the same rule, last match wins. A remapped note becomes one band covering the mapped pitch range.

### Note rendering

`Notes.tsx` builds one `InstancedMesh` with a custom `ShaderMaterial` per track/channel, inside a `useMemo`. Rounded corners, decay, the pedal-held tail color, and CC opacity are all computed in the fragment shader. CC events are stored in a float texture and binary-searched in GLSL. Depth test and depth write are off, so `renderOrder` (derived from `z`) determines layering.

MIDI ticks are converted to ms in `src/utils/midi.ts` via `tempoMap`. Note and event durations come from `endEvent`. Sustain pedal hold is computed in `src/utils/controllers.ts`.

## When changing things

- **New config section:** add it to the per-section merge in `configStore`, or configs saved before the change will be missing its defaults.
- **New style option:** add it to `StyleRuntime` and `defaultStyleRuntime`. If it affects note geometry or uniforms, also add it to the `useMemo` dependency list in `Notes.tsx`.
- **New panel:** wrap it in `PanelWrapper`, and register it in both `components` and `loadDefaultLayout` in `Index.tsx`. The saved layout in `localStorage['layout']` takes priority over the default, so clear that key to see the panel in a browser that has already used the app.
- **New hotkey:** pass `enabled: !exporting`.
- **`getLength` vs `getMidiDuration`:** `getLength` (`src/utils/timeline.ts`) includes audio and is the song length used for playback and export. `getMidiDuration` is MIDI only.

## Code style

ESLint comes from `@harlos/eslint-config`: 2 spaces, no semicolons, single quotes, `async(` and `catch(err)` with no space. Components are arrow functions with a default export. Indexed access needs `!` because `noUncheckedIndexedAccess` is on. Comments are sparse and explain why, not what.

## Deployment

The built site is committed to `docs/` and served by GitHub Pages on the custom domain. `public/CNAME` is copied into each build. By repo convention, rebuild and commit `docs/` as a separate `build` commit on `main` after merging; don't rebuild as part of a feature change.
