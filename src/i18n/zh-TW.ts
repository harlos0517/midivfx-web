/* eslint-disable @stylistic/max-len -- one sentence per string reads better than split strings */

import type { Messages } from '@/i18n/en'

const cameraHint = '在預覽畫面中拖曳也會改變此數值。按 R 可重設攝影機。'

const zhTW: Messages = {
  panels: {
    Main: '主畫面',
    Tracks: '音軌',
    Styles: '樣式',
    Import: '匯入',
    Playback: '播放',
    Camera: '攝影機',
    Display: '顯示',
    Export: '匯出',
    Navigator: '導覽列',
    Miscellaneous: '其他',
  },
  hints: {
    toggleSlider: '點擊可切換滑桿與數字輸入。',
    toggleOverride: '點擊可在此設定這個選項，或改為沿用前面樣式的設定。',
  },
  errors: {
    readFile: name => `無法讀取 ${name}。`,
    oddSize: (width, height) => `影片尺寸必須是偶數（目前為 ${width}×${height}）。`,
    emptyRange: '沒有可匯出的內容：結束時間早於開始時間。',
    unsupportedFile: name => `${name} 不是 MIDI、音訊、圖片或設定檔。`,
    invalidConfig: name => `${name} 不是 MIDIVFX 設定檔。`,
    newerConfig: name => `${name} 是由較新版本的 MIDIVFX 儲存的。請重新整理頁面以更新。`,
    boundary: {
      title: '發生錯誤',
      desc: '請再試一次；若問題持續發生，請重新整理頁面。重新整理會保留設定，但會清除已匯入的檔案。',
      retry: '再試一次',
      reload: '重新整理頁面',
      showDetails: '顯示詳細資訊',
      hideDetails: '隱藏詳細資訊',
    },
    unexpected: {
      title: '未預期的錯誤',
      desc: '背景作業發生錯誤。應用程式可能仍可使用，但若運作異常，請重新整理頁面。',
      repeated: count => `×${count}`,
      dismiss: '關閉',
    },
    report: {
      copy: '複製錯誤',
      copied: '已複製',
      report: '回報問題',
    },
  },
  main: {
    empty: {
      title: '將 MIDI 檔案拖放到任意位置即可開始',
      desc: '音訊檔案也可以用同樣方式加入，或在匯入面板中選擇檔案。',
    },
  },
  import: {
    drop: {
      title: '放開以匯入',
      desc: 'MIDI（.mid、.midi）、音訊（.mp3、.wav、.ogg）、圖片（.png、.jpg、.webp 等）與設定檔（.json）',
    },
    midi: {
      name: 'MIDI 檔案',
      desc: '要視覺化的 .mid 或 .midi 檔案。匯入的檔案不會保存，重新整理頁面後需要再次選擇。',
    },
    audio: {
      name: '音訊檔案',
      desc: '選用的 .mp3、.wav 或 .ogg 檔案，會與音符同步播放並包含在匯出影片中。匯入的檔案不會保存，重新整理頁面後需要再次選擇。',
    },
    image: {
      name: '背景圖片',
      desc: '選用的圖片，畫在音符與拍線後方，會出現在預覽與匯出影片中，且不會經過色調映射或光暈。圖片的尺寸與不透明度在「顯示」中設定。GIF 只會顯示第一格。匯入的檔案不會保存，重新整理頁面後需要再次選擇。',
    },
    config: {
      name: '設定檔',
      desc: '將攝影機、顯示與樣式設定儲存為 .json 檔案，或從檔案載入，以便在其他歌曲重複使用相同外觀。可選擇要包含哪些項目。',
    },
  },
  playback: {
    audioOffset: {
      name: '音訊偏移',
      desc: '調整音訊相對於音符的時間，單位為秒。正值會讓音訊較晚開始。',
    },
    startTime: {
      name: '開始時間',
      desc: '播放與匯出的起點，單位為秒。負值會在歌曲前加入空白時間。',
    },
    endTime: {
      name: '結束時間',
      desc: '播放與匯出的終點，單位為秒。超過歌曲結尾的數值會在歌曲後加入空白時間。清空欄位可使用歌曲長度。',
    },
    fadeIn: {
      name: '淡入',
      desc: '畫面與音訊從開始時間淡入所需的時間，單位為秒。畫面從黑色淡入，背景透明時則從透明淡入。0 為關閉。',
    },
    fadeOut: {
      name: '淡出',
      desc: '畫面與音訊在結束時間前淡出所需的時間，單位為秒。畫面淡出為黑色，背景透明時則淡出為透明。0 為關閉。',
    },
  },
  camera: {
    x: {
      name: '攝影機 X',
      desc: `攝影機在時間軸上的位置。0 與游標對齊。${cameraHint}`,
    },
    y: {
      name: '攝影機 Y',
      desc: `攝影機在音高軸上的位置。一單位為一個半音，MIDI 音高範圍為 0 到 127。${cameraHint}`,
    },
    z: {
      name: '攝影機 Z',
      desc: `攝影機與音符的距離。數值越大，可看到的音高與時間範圍越廣。${cameraHint}`,
    },
    targetX: {
      name: '目標 X',
      desc: `攝影機注視點在時間軸上的位置。0 與游標對齊。${cameraHint}`,
    },
    targetY: {
      name: '目標 Y',
      desc: `攝影機注視點在音高軸上的位置。${cameraHint}`,
    },
    targetZ: {
      name: '目標 Z',
      desc: `攝影機注視點在深度軸上的位置。0 為音符所在的平面。${cameraHint}`,
    },
  },
  configFile: {
    importTitle: '匯入設定',
    exportTitle: '匯出設定',
    import: '匯入',
    export: '匯出',
    cancel: '取消',
    replaceStyles: '會取代目前所有樣式。',
    resolution: (width, height) => `同時將解析度設為 ${width}×${height}`,
    resolutionDesc: '攝影機是在此解析度下設定的。不同的長寬比會讓畫面構圖不同。',
    excluded: '不包含播放時間與匯出設定。攝影機的解析度會一併儲存。',
  },
  display: {
    speed: {
      name: '捲動速度',
      desc: '音符移動的速度，單位為每秒單位數。數值越大，音符也會越長。一單位等於一個半音的高度。',
    },
    beat: {
      name: '拍線',
      desc: '在每一拍畫上垂直線，小節線會更明顯。這些線條會保持在音符後方。',
    },
    bloom: {
      name: '光暈',
      desc: '在明亮的音符周圍加上光暈。',
    },
    bloomIntensity: {
      name: '光暈強度',
      desc: '光暈的強弱。',
    },
    bloomThreshold: {
      name: '光暈門檻',
      desc: '產生光暈所需的最低亮度，範圍為 0 到 1。設為 1 時不會有光暈。',
    },
    bloomRadius: {
      name: '光暈半徑',
      desc: '光暈擴散的範圍。',
    },
    backgroundColor: {
      name: '背景顏色',
      desc: '所有內容後方的顏色。在「匯出」中開啟透明背景時不會使用。',
    },
    backgroundSize: {
      name: '圖片尺寸',
      desc: '「包含」會將整張圖片放進畫面內，周圍顯示背景顏色。「覆蓋」會填滿畫面並裁掉超出的部分。「延展」會填滿畫面，不保留圖片的長寬比。圖片在「匯入」中選擇。',
    },
    backgroundSizes: {
      contain: '包含',
      cover: '覆蓋',
      stretch: '延展',
    },
    backgroundOpacity: {
      name: '圖片不透明度',
      desc: '圖片蓋在背景顏色上的不透明度，範圍為 0 到 1。開啟透明背景時，即為匯出影片中的不透明度。圖片在「匯入」中選擇。',
    },
  },
  export: {
    width: {
      name: '寬度',
      desc: '預覽畫面與匯出影片的寬度，單位為像素。匯出時必須是偶數。',
    },
    height: {
      name: '高度',
      desc: '預覽畫面與匯出影片的高度，單位為像素。匯出時必須是偶數。',
    },
    fps: {
      name: '影格率',
      desc: '匯出影片每秒的影格數。',
    },
    alpha: {
      name: '透明背景',
      desc: '保留透明背景。這會匯出 WebM 而非 MP4。',
    },
    start: format => `匯出 ${format}`,
    cancel: '取消',
  },
  style: {
    options: {
      color: {
        name: '音符顏色',
        desc: '音符的顏色。',
      },
      velocity: {
        name: '力度透明度',
        desc: '依 MIDI 力度讓較弱的音符更透明。',
      },
      mode: {
        name: '音符模式',
        desc: '決定音符透明度的方式。',
      },
      cc: {
        name: 'CC 編號',
        desc: '控制音符透明度的 MIDI 控制器，範圍為 0 到 127。例如 11 為 Expression。在此控制器的第一個事件之前，音符會保持完全不透明。',
      },
      decayRate: {
        name: '衰減率',
        desc: '音符淡出的速度，以每 25 毫秒損失的透明度比例表示。不受捲動速度影響。',
      },
      showPedal: {
        name: '顯示延音踏板',
        desc: '在延音踏板踩住期間延長音符。',
      },
      pedalColor: {
        name: '踏板顏色',
        desc: '音符中僅由延音踏板延續之部分的顏色。',
      },
      pedalTrack: {
        name: '踏板音軌',
        desc: '延續這些音符的延音踏板所在的音軌編號，例如只存放踏板的音軌。設為 0 則使用音符本身的音軌。檔案中不存在的音軌也會改用音符本身的音軌。',
      },
      pedalChannel: {
        name: '踏板頻道',
        desc: '延續這些音符的延音踏板所在的頻道，範圍為 1 到 16。設為 0 則使用音符本身的頻道。同一音高再次彈奏時，延續中的音符仍會結束。',
      },
      ccTrack: {
        name: 'CC 音軌',
        desc: '決定這些音符透明度的 CC 所在的音軌編號。設為 0 則使用音符本身的音軌。檔案中不存在的音軌也會改用音符本身的音軌。',
      },
      ccChannel: {
        name: 'CC 頻道',
        desc: '決定這些音符透明度的 CC 所在的頻道，範圍為 1 到 16。設為 0 則使用音符本身的頻道。',
      },
      thickness: {
        name: '音符粗細',
        desc: '音符佔據音高列的比例。設為 1 時，相鄰音高的音符會緊貼在一起。',
      },
      radius: {
        name: '圓角半徑',
        desc: '音符邊角的圓潤程度。一單位等於一個半音的高度。',
      },
      z: {
        name: '圖層',
        desc: '在深度軸上的位置。數值較高者較靠近攝影機，並會蓋住數值較低者。',
      },
    },
    modes: {
      fill: {
        name: '填滿',
        desc: '音符保持實心。',
      },
      decay: {
        name: '衰減',
        desc: '音符從頭到尾逐漸淡出。',
      },
      CC: {
        name: 'CC',
        desc: '音符透明度跟隨 MIDI 控制器。',
      },
    },
    track: {
      name: '音軌',
      desc: '此樣式套用的音軌。留空會符合所有音軌。',
    },
    byNumber: {
      name: '依編號比對',
      desc: '以編號比對音軌，例如 1-4,7。',
    },
    byName: {
      name: '依名稱比對',
      desc: '以不分大小寫的正規表達式比對音軌名稱。無效的表達式不會符合任何音軌。',
    },
    channel: {
      name: '頻道',
      desc: '此樣式套用的 MIDI 頻道，例如 1-4,7。留空會符合全部 16 個頻道。',
    },
    drag: {
      name: '調整順序',
      desc: '拖曳以變更順序。後面的樣式會覆蓋前面的樣式。',
    },
    locked: {
      name: '預設樣式',
      desc: '所有音符的基礎樣式。它永遠排在最前面，並設定所有選項。',
    },
    expand: {
      name: '顯示或隱藏選項',
      desc: '展開或收合此樣式。',
    },
    duplicate: {
      name: '複製',
      desc: '在此樣式後方加入一份副本。',
    },
    delete: {
      name: '刪除',
      desc: '移除此樣式。',
    },
    add: {
      name: '新增樣式',
      desc: '在最後新增一個空白樣式。在你設定選項之前，所有選項都會沿用前面的設定。',
    },
  },
  remap: {
    heading: '打擊樂音符重新對應',
    add: {
      name: '新增對應',
      desc: '將選定的音高畫成橫跨某個音高範圍的色帶，並使用專屬顏色。適合每個音高代表不同樂器的打擊樂。',
    },
    source: {
      name: '來源音高',
      desc: '要重新對應的 MIDI 音高，範圍為 0 到 127，例如 36,38-40。留空會符合所有音高。若有多個對應符合，以最後一個為準。',
    },
    low: {
      name: '色帶起點',
      desc: '色帶涵蓋之音高範圍的一端。',
    },
    high: {
      name: '色帶終點',
      desc: '色帶涵蓋之音高範圍的另一端。',
    },
    color: {
      name: '色帶顏色',
      desc: '重新對應後音符的顏色。',
    },
    remove: {
      name: '移除對應',
      desc: '移除此對應。',
    },
  },
  tracks: {
    expand: {
      name: '展開或收合頻道',
      desc: '顯示此音軌各頻道從樣式取得的顏色。',
    },
    track: {
      name: '顯示或隱藏音軌',
      desc: '在預覽與匯出的影片中隱藏或顯示此音軌的所有音符。重新顯示音軌時，個別隱藏的頻道仍維持隱藏。',
    },
    channel: {
      name: '顯示或隱藏頻道',
      desc: '在預覽與匯出的影片中隱藏或顯示此頻道的音符。',
    },
  },
  miscellaneous: {
    language: {
      name: '語言',
      desc: '介面的語言。',
    },
    themeColor: {
      name: '主題色',
      desc: '介面的強調色，導覽列中的音符與方框也會使用此顏色。',
    },
    tour: {
      name: '導覽',
      desc: '逐一介紹每個面板與其功能。',
    },
    history: {
      name: '更新紀錄',
      desc: '列出 MIDIVFX 每個版本的變更。',
    },
    github: {
      name: '原始碼',
      desc: 'GitHub 上的原始碼。歡迎提出 Issue 或是提交 PR！',
    },
    website: {
      name: '關於作者',
      desc: '作者的網站。',
    },
    support: {
      name: '支持作者',
      desc: '如果 MIDIVFX 對你有幫助，可以在這裡贊助我！',
    },
  },
  changelog: {
    updated: 'MIDIVFX 已更新',
    history: '更新紀錄',
  },
  tour: {
    start: '開始導覽',
    labels: {
      skip: '略過',
      back: '上一步',
      next: '下一步',
      close: '完成',
      stepCounter: (current, total) => `${current} / ${total}`,
    },
    steps: {
      Import: '從這裡開始。選擇一個 MIDI 檔案，也可以再選擇一個音訊檔案一起播放，以及一張背景圖片，或直接將檔案拖放到頁面上的任意位置。匯入的檔案不會保存，重新整理頁面後需要再次選擇。',
      Main: '預覽畫面，與匯出的影片完全相同。拖曳可旋轉攝影機，右鍵拖曳可平移，滾動滑鼠滾輪可縮放。按空白鍵可播放或暫停。',
      Navigator: '整首曲子的概覽，音符後方是音訊波形。點擊可跳到該位置，拖曳方框或其邊緣可設定播放與匯出的開始和結束位置。',
      Tracks: 'MIDI 檔案中的音軌，顏色來自套用到它們的樣式。展開音軌可查看每個頻道的顏色。點選音軌或頻道可以顯示/隱藏該音軌或頻道。',
      Styles: '樣式決定音符的外觀。每個樣式套用到它所符合的音軌與頻道，後面的樣式會覆寫前面的樣式。樣式中未設定的選項會沿用前面樣式的設定。',
      Playback: '精確的開始與結束時間、兩端的淡入淡出，以及讓音訊與音符對齊的偏移量。',
      Camera: '精確的攝影機位置與目標。在預覽畫面中拖曳也會改變這些數值，按 R 可重設。',
      Display: '預覽畫面與匯出影片的尺寸、音符捲動的速度、節拍線、光暈與背景。',
      Export: '逐格算繪影片並下載。開啟透明背景會匯出 WebM 而非 MP4。',
      Miscellaneous: '可在這裡切換語言、重新開始這個導覽、查看每個版本的變更，或找到原始碼。',
    },
  },
}

export default zhTW
