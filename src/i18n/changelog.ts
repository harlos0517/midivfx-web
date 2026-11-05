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
    version: '1.2.0',
    date: '2026-11-05',
    changes: {
      en: [
        'Cursor indicators show a circle on the cursor line at each sounding pitch. It pops in at the note on, settles, and shrinks away at the note off, and follows velocity, decay and CC by opacity or size.',
        'Ripples send a ring outward from the cursor line at each note on.',
        'Indicators and ripples are on by default. Turn them off in the default style to keep the previous look.',
        'A fade color for styles: notes blend toward it as velocity, decay or CC lowers them, instead of only fading out.',
        'The Styles panel is wider, and its inputs are laid out more evenly.',
      ],
      'zh-TW': [
        '游標指示器會在游標線上每個發聲的音高顯示圓形。圓形在音符開始時彈出、回穩，並在音符結束時縮小消失，且可依透明度或大小跟隨力度、衰減與 CC。',
        '漣漪會在每個音符開始時，從游標線向外擴散出圓環。',
        '游標指示器與漣漪預設為開啟。若要維持先前的外觀，請在預設樣式中關閉。',
        '樣式新增淡出顏色：音符因力度、衰減或 CC 而變淡時，會漸變為該顏色，而不只是淡出。',
        '樣式面板加寬，輸入欄位的排列也更加整齊。',
      ],
      ja: [
        'カーソルインジケーターが、カーソル線上の発音中の各音高に円を表示します。ノートオンで現れて落ち着き、ノートオフで縮んで消えます。ベロシティ、減衰、CC に不透明度またはサイズで追従します。',
        '波紋が、ノートオンごとにカーソル線から外側へリングを広げます。',
        'カーソルインジケーターと波紋は初期状態でオンです。以前の見た目にするには、デフォルトスタイルでオフにしてください。',
        'スタイルにフェード色を追加しました。ベロシティ、減衰、CC で音符が薄くなるとき、単にフェードアウトするのではなくその色へ変化します。',
        'スタイルパネルが広くなり、入力欄の配置が整いました。',
      ],
    },
  },
  {
    version: '1.1.0',
    date: '2026-11-05',
    changes: {
      en: [
        'The interface is available in Japanese.',
        'Background color, and a background image with its own size and opacity, set in Display. Choose the image in Import.',
        'Fade the picture and audio in and out at the start and end time, set in Playback.',
        'Click a track or channel in the Tracks panel to hide or show its notes in the preview and the export.',
        'Save the camera, display and style settings to a config file, and load them again to reuse a look on another song.',
        'Styles can take the sustain pedal and the opacity CC from another track or channel.',
        'Pedal-held notes connect smoothly to a restrike of the same pitch.',
        'Choose the accent color of the interface in the Miscellaneous panel.',
        'Width and height moved from Display to Export.',
        'Errors show a message with options to try again, copy the details or report the issue, instead of breaking the page.',
      ],
      'zh-TW': [
        '介面提供日文。',
        '新增背景顏色，以及可設定大小與透明度的背景圖片，於顯示面板中設定。圖片於匯入面板中選擇。',
        '可在開始與結束時間淡入與淡出畫面和音訊，於播放面板中設定。',
        '在音軌面板中點擊音軌或聲道，即可在預覽與匯出中隱藏或顯示其音符。',
        '可將攝影機、顯示與樣式設定存成設定檔，再次載入即可在其他曲子沿用相同外觀。',
        '樣式可以使用其他音軌或聲道的延音踏板與控制透明度的 CC。',
        '踏板延長的音符與同音高的重新觸鍵會平順相連。',
        '可在其他面板中選擇介面的主題色。',
        '寬度與高度從顯示面板移至匯出面板。',
        '發生錯誤時會顯示訊息，並可重試、複製詳細資訊或回報問題，而不會使頁面無法使用。',
      ],
      ja: [
        'インターフェースが日本語に対応しました。',
        '背景色と、サイズと不透明度を設定できる背景画像を表示パネルで設定できます。画像はインポートパネルで選択します。',
        '開始・終了時間で映像と音声をフェードイン・フェードアウトできます。再生パネルで設定します。',
        'トラックパネルでトラックやチャンネルをクリックすると、プレビューとエクスポートでその音符を表示・非表示にできます。',
        'カメラ、表示、スタイルの設定を設定ファイルに保存し、読み込んで別の曲でも同じ見た目を使えます。',
        'スタイルで、別のトラックやチャンネルのサステインペダルと不透明度の CC を使えます。',
        'ペダルで伸ばした音符が、同じ音高の打ち直しと滑らかにつながります。',
        'その他パネルでインターフェースのテーマカラーを選べます。',
        '幅と高さが表示パネルからエクスポートパネルに移動しました。',
        'エラー時にページが壊れる代わりにメッセージを表示し、再試行、詳細のコピー、問題の報告ができます。',
      ],
    },
  },
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
