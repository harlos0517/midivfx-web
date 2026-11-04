/* eslint-disable @stylistic/max-len -- one sentence per string reads better than split strings */

const cameraHint = 'Dragging in the preview also changes this. Press R to reset the camera.'

const en = {
  panels: {
    Main: 'Main',
    Tracks: 'Tracks',
    Styles: 'Styles',
    Import: 'Import',
    Playback: 'Playback',
    Camera: 'Camera',
    Display: 'Display',
    Export: 'Export',
    Navigator: 'Navigator',
    Miscellaneous: 'Miscellaneous',
  },
  hints: {
    toggleSlider: 'Click to switch between the slider and the number input.',
    toggleOverride: 'Click to set this option here or inherit it from earlier styles.',
  },
  errors: {
    readFile: (name: string) => `Could not read ${name}.`,
    oddSize: (width: number, height: number) =>
      `Video size must be even (got ${width}×${height}).`,
    emptyRange: 'Nothing to export: end time is before start time.',
    unsupportedFile: (name: string) => `${name} is not a MIDI, audio, image or config file.`,
    invalidConfig: (name: string) => `${name} is not a MIDIVFX config file.`,
    newerConfig: (name: string) =>
      `${name} was saved by a newer version of MIDIVFX. Reload the page to update.`,
    boundary: {
      title: 'Something went wrong',
      desc: 'Try again, or reload the page if it keeps happening. Reloading keeps your settings but clears imported files.',
      retry: 'Try again',
      reload: 'Reload page',
      showDetails: 'Show details',
      hideDetails: 'Hide details',
    },
    unexpected: {
      title: 'Unexpected error',
      desc: 'Something failed in the background. The app may still work, but reload the page if it misbehaves.',
      repeated: (count: number) => `x${count}`,
      dismiss: 'Dismiss',
    },
    report: {
      copy: 'Copy error',
      copied: 'Copied',
      report: 'Report issue',
    },
  },
  main: {
    empty: {
      title: 'Drop a MIDI file anywhere to start',
      desc: 'Add an audio file the same way, or choose files in the Import panel.',
    },
  },
  import: {
    drop: {
      title: 'Drop to import',
      desc: 'MIDI (.mid, .midi), audio (.mp3, .wav, .ogg), image (.png, .jpg, .webp and more) and config (.json) files',
    },
    midi: {
      name: 'MIDI file',
      desc: 'The .mid or .midi file to visualize. Imports are not saved, so choose it again after reloading the page.',
    },
    audio: {
      name: 'Audio file',
      desc: 'Optional .mp3, .wav or .ogg file that plays with the notes and is included in the export. Imports are not saved, so choose it again after reloading the page.',
    },
    image: {
      name: 'Background image',
      desc: 'Optional image drawn behind the notes and beat lines, in the preview and the export. It is never tone mapped or bloomed. Set how it fits and its opacity in Display. A GIF shows only its first frame. Imports are not saved, so choose it again after reloading the page.',
    },
    config: {
      name: 'Config file',
      desc: 'Saves the camera, display and style settings to a .json file, or loads them from one, so a look can be reused on another song. You choose which of the three to include.',
    },
  },
  playback: {
    audioOffset: {
      name: 'Audio offset',
      desc: 'Shifts the audio relative to the notes, in seconds. Positive values make the audio start later.',
    },
    startTime: {
      name: 'Start time',
      desc: 'Where playback and export begin, in seconds. Negative values add blank time before the song.',
    },
    endTime: {
      name: 'End time',
      desc: 'Where playback and export end, in seconds. Values past the end of the song add blank time after it. Clear the field to use the song length.',
    },
  },
  camera: {
    x: {
      name: 'Camera X',
      desc: `Camera position along the time axis. 0 is level with the cursor. ${cameraHint}`,
    },
    y: {
      name: 'Camera Y',
      desc: `Camera position along the pitch axis. One unit is one semitone, and MIDI pitches run from 0 to 127. ${cameraHint}`,
    },
    z: {
      name: 'Camera Z',
      desc: `Camera distance from the notes. Larger values show more pitches and more time. ${cameraHint}`,
    },
    targetX: {
      name: 'Target X',
      desc: `Position the camera looks at along the time axis. 0 is level with the cursor. ${cameraHint}`,
    },
    targetY: {
      name: 'Target Y',
      desc: `Position the camera looks at along the pitch axis. ${cameraHint}`,
    },
    targetZ: {
      name: 'Target Z',
      desc: `Position the camera looks at along the depth axis. 0 is the plane of the notes. ${cameraHint}`,
    },
  },
  configFile: {
    importTitle: 'Import config',
    exportTitle: 'Export config',
    import: 'Import',
    export: 'Export',
    cancel: 'Cancel',
    replaceStyles: 'Replaces all current styles.',
    resolution: (width: number, height: number) => `Also set resolution to ${width}×${height}`,
    resolutionDesc: 'The camera was set up at this resolution. A different aspect ratio frames the shot differently.',
    excluded: 'Playback times and export settings are not included. The camera\'s resolution is saved with it.',
  },
  display: {
    speed: {
      name: 'Scroll speed',
      desc: 'How fast the notes move, in units per second. Higher values also make notes longer. One unit is the height of one semitone.',
    },
    beat: {
      name: 'Beat lines',
      desc: 'Draws a vertical line on every beat, with stronger lines on measures. The lines stay behind the notes.',
    },
    bloom: {
      name: 'Bloom',
      desc: 'Adds a glow around bright notes.',
    },
    bloomIntensity: {
      name: 'Bloom intensity',
      desc: 'How strong the glow is.',
    },
    bloomThreshold: {
      name: 'Bloom threshold',
      desc: 'Minimum brightness that glows, from 0 to 1. At 1, nothing glows.',
    },
    bloomRadius: {
      name: 'Bloom radius',
      desc: 'How far the glow spreads.',
    },
    backgroundColor: {
      name: 'Background color',
      desc: 'The color behind everything. Not used while the transparent background is on in Export.',
    },
    backgroundSize: {
      name: 'Image size',
      desc: 'Contain fits the whole image inside the frame, with the background color around it. Cover fills the frame and crops what overflows. Stretch fills the frame and ignores the image\'s aspect ratio. Choose the image in Import.',
    },
    backgroundSizes: {
      contain: 'Contain',
      cover: 'Cover',
      stretch: 'Stretch',
    },
    backgroundOpacity: {
      name: 'Image opacity',
      desc: 'How opaque the image is over the background color, from 0 to 1. With the transparent background on, it is the opacity in the exported video. Choose the image in Import.',
    },
  },
  export: {
    width: {
      name: 'Width',
      desc: 'Width of the preview and the exported video, in pixels. Export needs an even number.',
    },
    height: {
      name: 'Height',
      desc: 'Height of the preview and the exported video, in pixels. Export needs an even number.',
    },
    fps: {
      name: 'Frame rate',
      desc: 'Frames per second of the exported video.',
    },
    alpha: {
      name: 'Transparent background',
      desc: 'Keeps the background transparent. This exports WebM instead of MP4.',
    },
    start: (format: string) => `Export ${format}`,
    cancel: 'Cancel',
  },
  style: {
    options: {
      color: {
        name: 'Note color',
        desc: 'Color of the notes.',
      },
      velocity: {
        name: 'Velocity opacity',
        desc: 'Makes softer notes more transparent, based on their MIDI velocity.',
      },
      mode: {
        name: 'Note mode',
        desc: 'How the opacity of a note is decided.',
      },
      cc: {
        name: 'CC number',
        desc: 'MIDI controller that sets the note opacity, from 0 to 127. For example, 11 is Expression. Notes stay fully opaque until the first event of this controller.',
      },
      decayRate: {
        name: 'Decay rate',
        desc: 'How fast notes fade, as the share of opacity lost every 25 ms. Scroll speed does not affect it.',
      },
      showPedal: {
        name: 'Show sustain pedal',
        desc: 'Extends notes for as long as the sustain pedal holds them.',
      },
      pedalColor: {
        name: 'Pedal color',
        desc: 'Color of the part of a note that is held only by the sustain pedal.',
      },
      pedalTrack: {
        name: 'Pedal track',
        desc: 'Track number whose sustain pedal holds these notes, such as a track that holds only the pedal. 0 uses the notes\' own track. A track missing from the file also falls back to the notes\' own.',
      },
      pedalChannel: {
        name: 'Pedal channel',
        desc: 'Channel, from 1 to 16, whose sustain pedal holds these notes. 0 uses the notes\' own channel. A held note still ends when its own pitch is played again.',
      },
      ccTrack: {
        name: 'CC track',
        desc: 'Track number whose CC sets the opacity of these notes. 0 uses the notes\' own track. A track missing from the file also falls back to the notes\' own.',
      },
      ccChannel: {
        name: 'CC channel',
        desc: 'Channel, from 1 to 16, whose CC sets the opacity of these notes. 0 uses the notes\' own channel.',
      },
      thickness: {
        name: 'Note thickness',
        desc: 'How much of its pitch row a note fills. At 1, notes on adjacent pitches touch.',
      },
      radius: {
        name: 'Corner radius',
        desc: 'How rounded the note corners are. One unit is the height of one semitone.',
      },
      z: {
        name: 'Layer',
        desc: 'Position along the depth axis. Higher values are closer to the camera and draw over lower ones.',
      },
    },
    modes: {
      fill: {
        name: 'Fill',
        desc: 'Notes stay solid.',
      },
      decay: {
        name: 'Decay',
        desc: 'Notes fade from start to end.',
      },
      CC: {
        name: 'CC',
        desc: 'Note opacity follows a MIDI controller.',
      },
    },
    track: {
      name: 'Tracks',
      desc: 'Which tracks this style applies to. Leave empty to match every track.',
    },
    byNumber: {
      name: 'Match by number',
      desc: 'Match tracks by number, such as 1-4,7.',
    },
    byName: {
      name: 'Match by name',
      desc: 'Match track names with a case-insensitive regular expression. An invalid pattern matches nothing.',
    },
    channel: {
      name: 'Channels',
      desc: 'Which MIDI channels this style applies to, such as 1-4,7. Leave empty to match all 16.',
    },
    drag: {
      name: 'Reorder',
      desc: 'Drag to change the order. Later styles override earlier ones.',
    },
    locked: {
      name: 'Default style',
      desc: 'The base style for every note. It always comes first and sets every option.',
    },
    expand: {
      name: 'Show or hide options',
      desc: 'Expands or collapses this style.',
    },
    duplicate: {
      name: 'Duplicate',
      desc: 'Adds a copy of this style right after it.',
    },
    delete: {
      name: 'Delete',
      desc: 'Removes this style.',
    },
    add: {
      name: 'Add style',
      desc: 'Adds an empty style at the end. It inherits every option until you set one.',
    },
  },
  remap: {
    heading: 'Percussion Notes Remapping',
    add: {
      name: 'Add remap',
      desc: 'Draws the chosen pitches as one band across a pitch range, in their own color. This suits percussion, where each pitch is a separate instrument.',
    },
    source: {
      name: 'Source pitches',
      desc: 'MIDI pitches to remap, from 0 to 127, such as 36,38-40. Leave empty to match every pitch. If several remaps match, the last one wins.',
    },
    low: {
      name: 'Band start',
      desc: 'One end of the pitch range the band covers.',
    },
    high: {
      name: 'Band end',
      desc: 'The other end of the pitch range the band covers.',
    },
    color: {
      name: 'Band color',
      desc: 'Color of the remapped notes.',
    },
    remove: {
      name: 'Remove remap',
      desc: 'Removes this remap.',
    },
  },
  tracks: {
    expand: {
      name: 'Expand or collapse channels',
      desc: 'Shows the color each channel of this track gets from the styles.',
    },
    track: {
      name: 'Show or hide track',
      desc: 'Hides or shows every note of this track in the preview and the exported video. Channels hidden on their own stay hidden when the track is shown again.',
    },
    channel: {
      name: 'Show or hide channel',
      desc: 'Hides or shows the notes of this channel in the preview and the exported video.',
    },
  },
  miscellaneous: {
    language: {
      name: 'Language',
      desc: 'Language of the interface.',
    },
    tour: {
      name: 'Tour',
      desc: 'Walks through each panel and what it does.',
    },
    history: {
      name: 'Update history',
      desc: 'Lists the changes in each version of MIDIVFX.',
    },
    github: {
      name: 'Source code',
      desc: 'The source code on GitHub. Issues and PRs are welcomed!',
    },
    website: {
      name: 'About author',
      desc: 'The website of the author.',
    },
    support: {
      name: 'Support me',
      desc: 'If MIDIVFX is useful to you, you can support me here!',
    },
  },
  changelog: {
    updated: 'MIDIVFX has been updated',
    history: 'Update history',
  },
  tour: {
    start: 'Start tour',
    labels: {
      skip: 'Skip',
      back: 'Back',
      next: 'Next',
      close: 'Done',
      stepCounter: (current: number, total: number) => `${current} of ${total}`,
    },
    steps: {
      Import: 'Start here. Choose a MIDI file, and optionally an audio file to play along with it and a background image, or drop them anywhere on the page. Imports are not saved, so choose them again after reloading the page.',
      Main: 'The preview, which looks exactly like the exported video. Drag to orbit the camera, right-drag to pan and scroll to zoom. Press Space to play or pause.',
      Navigator: 'An overview of the whole song, with the audio waveform behind the notes. Click to seek, or drag the box and its edges to set where playback and export start and end.',
      Tracks: 'The tracks in the MIDI file, colored by the styles that apply to them. Expand a track to see the color of each channel. Click the track/channel to toggle visiblity for it.',
      Styles: 'Styles decide how notes look. Each one applies to the tracks and channels it matches, and later styles override earlier ones. An option that is not set in a style is inherited from the styles before it.',
      Playback: 'Exact start and end times, and an offset to line the audio up with the notes.',
      Camera: 'Exact camera position and target. Dragging in the preview changes these too, and pressing R resets them.',
      Display: 'The size of the preview and the exported video, how fast the notes scroll, beat lines, bloom and the background.',
      Export: 'Renders the video frame by frame and downloads it. Turn on the transparent background to export WebM instead of MP4.',
      Miscellaneous: 'Change the language, start this tour again, see what changed in each version, or find the source code.',
    },
  },
}

export type Messages = typeof en
export type Tip = Messages['import']['midi']

export default en
