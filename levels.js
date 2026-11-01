// 顏色白名單（調色盤按鈕也有這四種）
const PALETTE = ['red','green','blue','yellow'];

// 畫面上實際顯示的顏色（關卡資料仍用 red/green/blue/yellow，只換外觀）
// 低飽和配色：看久不刺眼；四色亮度差距大，色盲玩家也分得出來
const COLOR_HEX = {
  red:    '#C8553D', // 赤陶紅
  green:  '#8FC1A9', // 鼠尾草綠
  blue:   '#3E5C76', // 石板藍
  yellow: '#F2C57C'  // 沙黃
};

/**
 * LEVELS:
 * 每一關都使用你提供的 boardData、target、maxMoves
 */
const LEVELS = [
  {
    id: 1,
    title: "第一關",
    boardData: [
      ['red','red','red','red','red','red','red','red','red','red'],
      ['red','green','green','green','green','green','green','green','green','red'],
      ['red','green','green','green','green','green','green','green','green','red'],
      ['red','green','green','green','green','green','green','green','green','red'],
      ['red','green','green','green','green','green','green','green','green','red'],
      ['red','green','green','green','green','green','green','green','green','red'],
      ['red','red','red','red','red','red','red','red','red','red'],
      ['red','blue','blue','blue','blue','blue','blue','blue','blue','red']
    ],
    target: 'blue',
    maxMoves: 2,
    // 互動教學：依序執行，每一步完成才會進到下一步
    // focus: 'target' 目標顏色｜'moves' 剩餘步數｜'palette' 整個調色盤｜'board' 整個畫板
    // wait: 'next' 按「下一步」｜'color' 點指定顏色按鈕｜'cell' 用指定顏色點指定顏色的格子
    tutorial: [
      { text: '歡迎來到溢彩畫！🎨<br>目標：把整個畫板都變成<b>藍色</b>。', focus: 'target', wait: 'next' },
      { text: '每染一次色會用掉 1 步。<br>這關只有 <b>2 步</b>，要想好再出手！', focus: 'moves', wait: 'next' },
      { text: '先在調色盤點<b>紅色</b>。', wait: 'color', color: 'red' },
      { text: '現在點中間任何一格<b>綠色</b>。', wait: 'cell', cellColor: 'green', color: 'red' },
      { text: '看到了嗎？<b>相連的同色格子會一起變色</b>，整片綠色都變紅了！<br>接著點<b>藍色</b>。', wait: 'color', color: 'blue' },
      { text: '最後點任何一格<b>紅色</b>，把整片紅色一次染成藍色！', wait: 'cell', cellColor: 'red', color: 'blue' }
    ],
    winText: '教學完成！🎉\n\n之後的關卡會出現灰色斜線的「障礙格」：不能染色，也會把兩邊隔開。\n忘記規則可以按右上角的「?」。\n\n要前往第二關嗎？'
  },
  {
    id: 2,
    title: "第二關",
    boardData: [
      ['red','red','red','red','red','red','red','red','red','red'],
      ['red','green','green','green','red','red','green','green','green','red'],
      ['red','green','blue','green','green','green','green','blue','green','red'],
      ['red','green','green','green','green','green','green','green','green','red'],
      ['red','red','red','red','red','red','red','red','red','red'],
      ['red','green','green','green','green','green','green','green','green','red'],
      ['red','green','green','green','green','green','green','green','green','red'],
      ['red','red','red','red','red','red','red','red','red','red']
    ],
    target: 'yellow',
    maxMoves: 3
  },
  {
    id: 3,
    title: "第三關",
    boardData: [
      ['red','red','red','red','red','red','red','red','red','red'],
      ['red','blue','blue','blue','red','yellow','yellow','yellow','red','red'],
      ['red','blue','green','blue','red','yellow','green','yellow','red','red'],
      ['red','blue','blue','blue','red','yellow','yellow','yellow','red','red'],
      ['red','red','red','red','red','red','red','red','red','red'],
      ['red','green','green','green','green','green','green','green','green','red'],
      ['red','green','green','green','green','green','green','green','green','red'],
      ['red','red','red','red','red','red','red','red','red','red']
    ],
    target: 'green',
    maxMoves: 3
  },
  {
    id: 4,
    title: "第四關",
    boardData: [
      ['blue','yellow','blue','yellow','blue','yellow','blue','yellow','blue','yellow'],
      ['yellow','yellow','green','yellow','green','yellow','green','yellow','green','yellow'], 
      ['green','red','green','red','green','red','green','red','green','red'],
      ['red','red','red','red','red','red','red','red','red','red'],
      ['green','red','green','red','green','red','green','red','green','red'],
      ['red','red','red','red','red','red','red','red','red','red'],
      ['green','red','green','red','green','red','green','red','green','red'],
      ['blue','yellow','blue','yellow','blue','yellow','blue','yellow','blue','yellow']
    ],
    target: 'blue',
    maxMoves: 3
  },
  {
    id: 5,
    title: "第五關",
    boardData: [
      ['blue','yellow','blue','yellow','blue','yellow','blue','yellow','blue','blue'],
      ['yellow','yellow','green','yellow','green','yellow','green','yellow','green','yellow'],
      ['green','red','green','red','green','red','green','red','green','red'],
      ['red','red','red','red','red','red','red','red','red', null ],
      ['green','red','green','red','green','red','green','red','green','red'],
      ['red','red','red','red','red','red','red','red','red', null ],
      ['green','red','green','red','green','red','green','red','green','red'],
      ['blue','yellow','blue','yellow','blue','yellow','blue','yellow','blue','blue']
    ],
    target: 'blue',
    maxMoves: 4
  },
  {
    id: 6,
    title: "第六關",
    boardData: [
      ['blue','red','red','blue','red','red','blue','red','red','blue'],
      ['green','red','red','green','red','red','green','red','red','green'],
      ['yellow','yellow','yellow','yellow','blue','blue','yellow','yellow','yellow','yellow'],
      ['green','red','red','green','blue','blue','green','red','red','green'],
      ['blue','red','red','blue','blue','blue','blue','red','red','blue'],
      ['yellow','yellow','yellow','yellow','blue','blue','yellow','yellow','yellow','yellow'],
      ['blue','red','red','blue','red','red','blue','red','red','blue'],
      ['green','red','red','green','red','red','green','red','red','green']
    ],
    target: 'blue',
    maxMoves: 4
  },
  {
    id: 7,
    title: "第七關",
    boardData: [
      ['red','red','red','red','red','blue','red','blue','red','blue'],
      ['red','red','green','green','red','blue','red','blue','red','blue'],
      ['red','green','green','green','green','green','green','green','green','green'],
      ['yellow','yellow','yellow','yellow','yellow','yellow','yellow','yellow','yellow','yellow'],
      ['yellow','yellow','yellow','yellow','yellow','yellow','yellow','yellow','yellow','yellow'],
      ['red','green','green','green','green','green','green','green','green','green'],
      ['red','red','green','green','red','blue','red','blue','red','blue'],
      ['red','red','red','red','red','blue','red','blue','red','blue']
    ],
    target: 'blue',
    maxMoves: 3
  },
  {
    id: 8,
    title: "第八關",
    boardData: [
      ['red','red','red','red','red','blue','red','blue','red','blue'],
      ['red','red','green','green','red','blue','red','blue','red','blue'],
      ['red','blue','blue','blue','blue','blue','blue','blue','blue','green'],
      ['yellow','blue','yellow','green','yellow','yellow','yellow','yellow','blue','yellow'],
      ['yellow','blue','yellow','green','yellow','yellow','yellow','yellow','blue','yellow'],
      ['red','blue','blue','blue','blue','blue','blue','blue','blue','green'],
      ['red','red','green','green','red','blue','red','blue','red','blue'],
      ['red','red','red','red','red','blue','red','blue','red','blue']
    ],
    target: 'red',
    maxMoves: 4
  },
  {
    id: 9,
    title: "第九關",
    boardData: [
      ['red','red','red','red','red','blue','red','blue','red','blue'],
      ['red','red','green','green','red','blue','red','blue','red','blue'],
      ['red','green','green','green','green','green','green','green','green','green'],
      [ null,'green','yellow','red','yellow','red','yellow','red','yellow','red'],
      [ null,'green','red','yellow','red','yellow','red','yellow','red','yellow'],
      ['red','green','green','green','green','green','green','green','green','green'],
      ['red','red','green','green','red','blue','red','blue','red','blue'],
      ['red','red','red','red','red','blue','red','blue','red','blue']
    ],
    target: 'red',
    maxMoves: 4
  },
  {
    id: 10,
    title: "第十關",
    boardData: [
      ['red','blue','blue','blue','green', null ,'red','blue','green','red'],
      ['red','blue', null ,'red', null ,'red','red', null ,'blue', null ],
      [ null , null ,'red','yellow','yellow','blue','yellow','green','red','red'],
      ['red','blue', null ,'yellow','red','blue','blue','green','green','red'],
      ['yellow','green','green','green','green', null ,'blue','yellow','yellow','green'],
      ['yellow','red','red', null ,'red','red','yellow','green','green', null],
      ['green','red', null , null ,'yellow','yellow', null ,'blue','blue','red'],
      ['yellow','yellow','yellow', null , null ,'green', null , null ,'red','red']
    ],
    target: 'red',
    maxMoves: 7
  },
  {
    id: 11,
    title: "第十一關",
    boardData: [
      ['red','red','red','red','yellow','yellow','yellow','yellow','blue','blue'],
      ['red','green','green','red','yellow','blue','blue','yellow','blue','blue'],
      ['red','green','green','red','yellow','yellow','yellow','yellow','green','green'],
      ['red','red','red','red', null ,'blue','blue','blue','green','green'],
      ['green','green','green','green', null ,'blue','red','blue','yellow','yellow'],
      ['green','red','red','green','blue','blue','blue','blue','yellow','yellow'],
      ['green','green','green','green', null ,'red','red','red','yellow','yellow'],
      ['blue','blue','blue','blue', null ,'red','yellow','yellow','yellow','yellow']
    ],
    target: 'yellow',
    maxMoves: 5
  },

  // ===== 進階關卡（12～31）：每關 maxMoves = 已證明的最少步數，零容錯 =====
  {
    id: 12,
    title: "第十二關",
    boardData: [
      ['yellow','yellow','blue','blue','green','green','green','green','green','green'],
      ['yellow','blue','blue','blue','green','green','green','green','green','red'],
      ['blue','blue','yellow','blue','green','green','green','green','green','green'],
      [ null ,'yellow','yellow','green','green','green','green','blue','red','blue'],
      ['yellow','yellow','yellow','yellow','green','green','blue','red', null ,'blue'],
      ['yellow','yellow','yellow','yellow','yellow', null ,'yellow','blue','yellow','yellow'],
      ['yellow', null ,'yellow','red','red','yellow','blue','yellow','blue','red'],
      ['blue','blue','red','red','red','blue', null ,'blue', null , null ]
    ],
    target: 'red',
    maxMoves: 5
  },
  {
    id: 13,
    title: "第十三關",
    boardData: [
      ['yellow','yellow','yellow','yellow','green','green','red','green','blue','green'],
      ['yellow','yellow','yellow','yellow','yellow','red','red','red','blue','blue'],
      ['green','green','green','blue','yellow','red','red','red','red','red'],
      [ null , null , null , null , null ,'yellow', null , null , null , null ],
      ['green','yellow','red','red','red','red','red','red','green','green'],
      ['red','red','red','red','red','red','green','yellow','yellow','green'],
      ['red','red','red','red','red','green','green','yellow','blue','green'],
      ['green','green','green','green','yellow','blue','blue','blue','red','green']
    ],
    target: 'red',
    maxMoves: 5
  },
  {
    id: 14,
    title: "第十四關",
    boardData: [
      ['blue','blue','red','red','red','red','red','red','red','red'],
      ['blue', null ,'blue','red', null ,'red','red', null ,'red','red'],
      ['blue','blue','yellow','yellow','red','red','red','red','green','yellow'],
      ['blue','yellow','green','green', null ,'red','red', null ,'yellow','green'],
      ['green','green','green','green','yellow','yellow','red','red','yellow','green'],
      ['blue', null ,'green','green', null ,'yellow','blue','red','blue','blue'],
      ['blue','yellow','blue','yellow','yellow','red','blue','green','yellow','blue'],
      ['blue', null ,'green','red', null ,'red','green', null ,'green','blue']
    ],
    target: 'green',
    maxMoves: 5
  },
  {
    id: 15,
    title: "第十五關",
    boardData: [
      ['green','green','red','green','green','yellow','yellow','yellow','green','green'],
      ['green','green','red','green', null ,'yellow','yellow', null ,'yellow','green'],
      ['green','blue','red','blue','green','green','yellow','yellow','green','blue'],
      ['blue', null ,'blue','blue', null ,'blue','yellow', null ,'green','green'],
      ['blue','blue','blue','blue','blue','yellow','blue','green','green','yellow'],
      ['blue', null ,'blue','red','green','yellow','green', null ,'green','green'],
      ['blue','red','red','red','green','green','green','green','red','yellow'],
      ['blue','blue','red','red', null ,'blue','blue', null ,'red','yellow']
    ],
    target: 'red',
    maxMoves: 5
  },
  {
    id: 16,
    title: "第十六關",
    boardData: [
      ['red','red','yellow','yellow','red','blue','blue','blue','blue','red'],
      ['red', null ,'green','green', null ,'blue','blue', null ,'blue','red'],
      ['yellow','yellow','red','green','yellow','yellow','green','green','blue','yellow'],
      ['red','red','red','blue', null ,'yellow','blue','blue','blue','yellow'],
      ['blue','red','green','green','green','green','blue','blue','blue','yellow'],
      ['blue', null ,'blue','yellow', null ,'red','blue', null ,'blue','blue'],
      ['blue','blue','blue','green','red','red','yellow','green','blue','blue'],
      ['blue','blue','green','yellow', null ,'blue','yellow', null ,'yellow','yellow']
    ],
    target: 'green',
    maxMoves: 6
  },
  {
    id: 17,
    title: "第十七關",
    boardData: [
      ['yellow','blue','blue','red','red', null ,'yellow','blue','yellow','yellow'],
      [ null ,'yellow','red','red','red','red','red','yellow','yellow','yellow'],
      ['red','red','green','green','blue','blue','red','blue','red','red'],
      [ null ,'green','red','red','red','blue','red','red','blue','red'],
      ['red','red','green','blue','yellow','yellow', null ,'red','red','red'],
      ['red','red','blue','blue','green','red','red', null ,'red','red'],
      ['red', null ,'red','blue','green','green','blue','red','red','blue'],
      ['red','red','red','green','green','green','blue','blue','blue','blue']
    ],
    target: 'green',
    maxMoves: 5
  },
  {
    id: 18,
    title: "第十八關",
    boardData: [
      ['green','green','green','green', null ,'green','red','red','red','red'],
      ['red','red','red','green','green','red','green','red','red','red'],
      ['red','red','yellow','yellow', null ,'yellow','blue','red','red','red'],
      ['red','red','yellow','red', null ,'yellow','blue','blue','red','red'],
      ['red','red','red','green', null ,'yellow','blue','blue','blue','red'],
      ['yellow','yellow','yellow','red', null ,'yellow','yellow','blue','red','red'],
      ['green','yellow','red','red', null ,'yellow','red','red','green','green'],
      ['green','green','green','green', null ,'green','yellow','red','green','green']
    ],
    target: 'blue',
    maxMoves: 6
  },
  {
    id: 19,
    title: "第十九關",
    boardData: [
      ['red','red','red', null ,'red','red','red','red','green','red'],
      ['red','red','yellow','red','red','red','yellow','blue','green','red'],
      ['yellow','red','red', null ,'red','yellow','yellow','blue','green','red'],
      ['yellow','red','yellow', null ,'blue','yellow','yellow','yellow','red','red'],
      ['green','yellow','blue', null ,'green','yellow','yellow','blue','yellow','yellow'],
      ['green','red','blue', null ,'red','blue','blue','blue','yellow','yellow'],
      ['red','red','red', null ,'blue','green','yellow','yellow','yellow','yellow'],
      ['red','red','red', null ,'blue','green','green','red','red','red']
    ],
    target: 'green',
    maxMoves: 6
  },
  {
    id: 20,
    title: "第二十關",
    boardData: [
      ['blue','yellow','yellow','yellow','red', null ,'yellow','yellow','yellow','yellow'],
      ['blue','red','red','yellow','red', null ,'red','yellow','yellow','yellow'],
      ['red','red','green','green','red', null ,'blue','yellow','yellow','yellow'],
      ['red','red','yellow','red','green', null ,'blue','red','red','red'],
      [ null , null , null ,'blue','green', null , null ,'red', null , null ],
      ['blue','blue','yellow','blue','blue', null ,'blue','blue','red','red'],
      ['blue','blue','blue','red','red', null ,'green','blue','blue','red'],
      ['red','blue','yellow','green','red', null ,'blue','blue','blue','red']
    ],
    target: 'green',
    maxMoves: 10
  },
  {
    id: 21,
    title: "第二十一關",
    boardData: [
      ['blue','red','green','red', null ,'blue','blue','green','yellow','yellow'],
      ['red','red','green','red', null ,'blue','blue','blue','green','yellow'],
      ['red','red','green','red', null ,'yellow','red','yellow','green','red'],
      [ null , null , null , null ,'yellow', null ,'red','green', null , null ],
      ['blue','blue','red','red', null ,'green','red','green','red','red'],
      ['green','green','green','yellow', null ,'green','yellow','green','red','red'],
      ['green','green','yellow','yellow', null ,'green','yellow','green','yellow','yellow'],
      ['green','green','yellow','yellow', null ,'yellow','yellow','yellow','red','red']
    ],
    target: 'blue',
    maxMoves: 11
  },
  {
    id: 22,
    title: "第二十二關",
    boardData: [
      ['yellow','yellow','red','red','red','blue','blue','blue','blue','blue'],
      ['yellow','yellow','red','red','red', null ,'green','blue','blue','blue'],
      ['yellow','yellow','green','green','green', null ,'blue','green','green','blue'],
      [ null , null , null , null , null , null , null , null , null , null ],
      ['yellow','green','green','blue','red','red','green','green','blue','blue'],
      ['green','yellow','green','red','red', null ,'blue','red','blue','green'],
      ['yellow','green','green','red','green', null ,'blue','red','red','green'],
      ['yellow','yellow','green','red','green', null ,'blue','green','red','red']
    ],
    target: 'red',
    maxMoves: 10
  },
  {
    id: 23,
    title: "第二十三關",
    boardData: [
      ['yellow','yellow','yellow', null ,'blue','blue','yellow','yellow','yellow','blue'],
      ['yellow','red','blue', null ,'blue','blue','yellow','yellow','yellow','yellow'],
      ['red','yellow','red', null ,'green','blue','yellow','yellow','blue','yellow'],
      ['red','red','green', null ,'green','red','green','blue','blue','blue'],
      ['blue','yellow','yellow','yellow','green','blue','blue','yellow','yellow','yellow'],
      ['blue','blue','yellow', null ,'blue','blue','blue','blue','yellow','yellow'],
      ['red','red','blue', null ,'blue','blue','blue','blue','yellow','yellow'],
      ['red','green','green', null ,'red','yellow','yellow','yellow','green','green']
    ],
    target: 'green',
    maxMoves: 6
  },
  {
    id: 24,
    title: "第二十四關",
    boardData: [
      ['green','red','yellow','blue','blue','blue','blue','blue','green','green'],
      ['green','red','red','blue','blue','blue','blue','blue','yellow','green'],
      ['red','red','red','green','red','blue','blue','red','yellow','green'],
      ['yellow','yellow','yellow','red','red','red','red','red','yellow','yellow'],
      ['yellow','yellow','yellow','yellow','red','red','red','red','red','yellow'],
      ['red','red','yellow','green','green','green','yellow','green','red','red'],
      ['green','green','green','blue','blue','yellow','yellow','green','green','red'],
      ['yellow','green','yellow','yellow','green','yellow','yellow','green','yellow','green']
    ],
    target: 'red',
    maxMoves: 5
  },
  {
    id: 25,
    title: "第二十五關",
    boardData: [
      ['blue','blue','blue','blue','blue','red','red','red','green','green'],
      ['blue', null , null ,'red','yellow','red','red','red','green', null ],
      [ null ,'blue','blue','red','yellow','green','yellow', null ,'blue','green'],
      [ null ,'green','blue','green','red','red','yellow','blue','blue','blue'],
      ['green','yellow','yellow','green','red','red','yellow','blue','blue','green'],
      ['green','yellow','yellow','blue','blue','blue', null ,'blue','blue','red'],
      ['green','yellow','red','blue','blue','blue','green','green','red','red'],
      ['green','yellow','red','red','blue','green','green','green', null ,'yellow']
    ],
    target: 'blue',
    maxMoves: 6
  },
  {
    id: 26,
    title: "第二十六關",
    boardData: [
      ['blue','blue','blue','blue','blue','yellow','yellow','blue','blue','green'],
      ['blue','blue','blue','blue','yellow','yellow','yellow','blue','red','red'],
      ['green','green','blue','blue','blue','yellow','yellow','yellow','red','red'],
      ['blue','green','green','blue','blue','blue','green','red','green','red'],
      ['blue','green','green','green','blue','red','red','red','red','blue'],
      [ null , null , null , null ,'green','blue', null , null , null , null ],
      ['blue','blue','green','green','blue','blue','green','red','red','red'],
      ['blue','blue','blue','blue','red','blue','red','red','red','red']
    ],
    target: 'yellow',
    maxMoves: 5
  },
  {
    id: 27,
    title: "第二十七關",
    boardData: [
      ['green','red','green','blue', null ,'blue','blue','red','red','blue'],
      ['green','red','blue','blue', null ,'blue','blue','red','red','red'],
      ['green','green','blue','blue', null ,'blue','green','red','blue','blue'],
      ['green','green','yellow','yellow', null ,'blue','green','red','blue','red'],
      ['yellow', null , null , null ,'yellow', null , null , null , null , null ],
      ['yellow','yellow','green','green', null ,'blue','green','yellow','red','red'],
      ['red','green','green','blue', null ,'blue','green','green','blue','green'],
      ['red','blue','red','red', null ,'green','green','green','blue','red']
    ],
    target: 'yellow',
    maxMoves: 13
  },
  {
    id: 28,
    title: "第二十八關",
    boardData: [
      ['green','green','blue','yellow','yellow','red','green','red','red','red'],
      ['green', null ,'blue','yellow', null ,'yellow','green', null ,'red','red'],
      ['blue','blue','blue','blue','yellow','yellow','green','red','red','yellow'],
      ['red', null ,'yellow','green', null ,'red','red', null ,'yellow','yellow'],
      ['yellow','red','yellow','yellow','red','red','red','red','red','green'],
      ['blue', null ,'yellow','blue', null ,'red','red', null ,'red','red'],
      ['blue','blue','red','blue','blue','blue','red','green','red','yellow'],
      ['green', null ,'yellow','blue','yellow','green','green', null ,'yellow','yellow']
    ],
    target: 'blue',
    maxMoves: 6
  },
  {
    id: 29,
    title: "第二十九關",
    boardData: [
      ['red','yellow','red', null ,'red','red','blue','red','blue','blue'],
      ['yellow','yellow','yellow','red','red','blue','blue','red','green','green'],
      ['red','yellow','yellow','green','green','red','green','green','green','green'],
      ['red','red','blue','red','green','green','red','green','green','green'],
      ['red', null ,'red','green','red','red','red','green','yellow','green'],
      ['red','red','red','blue','blue', null ,'red','yellow','yellow','yellow'],
      ['red','red','red','red','blue','red','blue','red','red','blue'],
      ['red','red','red','red','blue','blue', null ,'yellow','blue','blue']
    ],
    target: 'yellow',
    maxMoves: 5
  },
  {
    id: 30,
    title: "第三十關",
    boardData: [
      ['green','red','red','red','red','yellow','blue','blue','blue','red'],
      ['green','red','red','red','red','yellow','red','blue','red','red'],
      ['green','green','blue','blue','blue','blue','green','green','red','red'],
      ['green','red','blue','blue','blue','blue','green','blue','red','blue'],
      [ null , null , null , null , null , null , null ,'blue', null , null ],
      ['blue','red','red','blue','green','yellow','blue','yellow','blue','green'],
      ['yellow','red','red','yellow','yellow','blue','blue','yellow','blue','green'],
      ['yellow','yellow','yellow','yellow','blue','yellow','blue','yellow','green','green']
    ],
    target: 'green',
    maxMoves: 6
  },
  {
    id: 31,
    title: "第三十一關",
    boardData: [
      ['red','red','red','red', null ,'blue','yellow','yellow','yellow','yellow'],
      ['red','red','red','yellow', null ,'blue','yellow','yellow','yellow','red'],
      ['red','red','red','red', null ,'blue','blue','yellow','red','red'],
      ['blue','blue','red','yellow', null ,'red','red','red','red','green'],
      [ null , null ,'blue', null ,'yellow', null , null , null , null , null ],
      ['blue','green','red','green', null ,'red','red','red','blue','yellow'],
      ['yellow','red','yellow','yellow', null ,'yellow','red','red','yellow','yellow'],
      ['red','yellow','red','red','yellow','yellow','red','red','yellow','yellow']
    ],
    target: 'green',
    maxMoves: 10
  }
];
