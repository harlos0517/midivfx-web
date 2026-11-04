/* eslint-disable @stylistic/max-len -- one sentence per string reads better than split strings */

import type { Locale } from '@/store/localeStore'

export interface ChangelogEntry {
  version: string
  date: string
  changes: Record<Locale, string[]>
}

/** Newest first. The first entry is the current version, so add one to release an update. */
const changelog: ChangelogEntry[] = [
  {
    version: '1.0.2',
    date: '2026-11-04',
    changes: {
      en: [
        'Adjust initial layout.',
      ],
      'zh-TW': [
        '調整初始面版佈局。',
      ],
      ja: [
        '初期パネルレイアウトを調整しました。',
      ],
    },
  },
  {
    version: '1.0.1',
    date: '2026-11-04',
    changes: {
      en: [
        'Added Support link.',
      ],
      'zh-TW': [
        '新增贊助連結。',
      ],
      ja: [
        '支援リンクを追加しました。',
      ],
    },
  },
  {
    version: '1.0.0',
    date: '2026-11-03',
    changes: {
      en: [
        'A guided tour of every panel. It starts on your first visit, and the Miscellaneous panel can start it again.',
        'Drop MIDI and audio files anywhere on the page to import them.',
        'Update notices, and this update history in the Miscellaneous panel.',
      ],
      'zh-TW': [
        '新增逐一介紹每個面板的導覽。首次造訪時會自動開始，也可以在其他面板中重新開始。',
        '可將 MIDI 與音訊檔案拖放到頁面上的任意位置來匯入。',
        '新增更新通知，以及其他面板中的更新紀錄。',
      ],
      ja: [
        'すべてのパネルを紹介するガイドツアー。初回アクセス時に自動で始まり、その他パネルから再開できます。',
        'MIDI と音声ファイルをページのどこにでもドロップしてインポートできます。',
        '更新通知と、その他パネルでの更新履歴。',
      ],
    },
  },
  {
    version: '0.4.0',
    date: '2026-11-02',
    changes: {
      en: [
        'Every option has a tooltip that explains what it does.',
        'The interface is available in Traditional Chinese, with a language switcher in the Miscellaneous panel.',
        'Note gap is replaced by note thickness.',
      ],
      'zh-TW': [
        '每個選項都有說明其功能的提示。',
        '介面提供繁體中文，並可在其他面板中切換語言。',
        '音符間距改為音符粗細。',
      ],
      ja: [
        'すべてのオプションに、機能を説明するツールチップが付きました。',
        'インターフェースが繁体字中国語に対応し、その他パネルで言語を切り替えられます。',
        '音符の間隔は音符の太さに置き換わりました。',
      ],
    },
  },
  {
    version: '0.3.0',
    date: '2026-11-01',
    changes: {
      en: [
        'The Navigator panel shows the whole song with its waveform. Click to seek, or drag to set the playback range.',
        'Bloom adds a glow around bright notes.',
        'Files that cannot be read show an error instead of failing silently.',
      ],
      'zh-TW': [
        '導覽列面板顯示整首曲子與音訊波形。點擊可跳到該位置，拖曳可設定播放範圍。',
        '光暈會在明亮的音符周圍加上光芒。',
        '無法讀取的檔案會顯示錯誤，而不是沒有任何反應。',
      ],
      ja: [
        'ナビゲーターパネルに曲全体と波形を表示します。クリックで移動、ドラッグで再生範囲を設定できます。',
        'ブルームで明るい音符の周りに光彩を加えます。',
        '読み込めないファイルは、何も起きずに失敗するのではなくエラーを表示します。',
      ],
    },
  },
  {
    version: '0.2.0',
    date: '2026-10-30',
    changes: {
      en: [
        'Notes can show the sustain pedal, fade by velocity, follow a MIDI controller, or decay.',
        'Percussion pitches can be remapped into bands with their own color.',
        'Beat and measure lines.',
        'Playback and export can be limited to a start and end time.',
      ],
      'zh-TW': [
        '音符可以顯示延音踏板、依力度調整透明度、跟隨 MIDI 控制器，或逐漸淡出。',
        '打擊樂的音高可以重新對應為各自顏色的色帶。',
        '新增拍線與小節線。',
        '播放與匯出可以限制在指定的開始與結束時間之間。',
      ],
      ja: [
        '音符でサステインペダルの表示、ベロシティによるフェード、MIDI コントローラーへの追従、減衰ができます。',
        '打楽器の音高を、専用の色の帯にリマップできます。',
        '拍線と小節線。',
        '再生とエクスポートを開始・終了時間で制限できます。',
      ],
    },
  },
  {
    version: '0.1.0',
    date: '2026-10-29',
    changes: {
      en: ['First release.'],
      'zh-TW': ['首次發布。'],
      ja: ['最初のリリース。'],
    },
  },
]

export const currentVersion = changelog[0]!.version

export default changelog
