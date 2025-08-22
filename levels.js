// 顏色白名單（調色盤按鈕也有這四種）
const PALETTE = ['red','green','blue','yellow'];

/**
 * LEVELS:
 * - 若提供 boardData（陣列陣列），就用它
 * - 否則由 rows/cols/palette/holes/randomSeed 自動生成
 */
const LEVELS = [
  {
    id: 1,
    title: "第一關",
    subtitle: "這麼簡單都過不了？",
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

  // 後面示範幾關用自動生成，需與調色盤相同顏色
  {
    id: 2,
    title: "第二關",
    subtitle: "要不你回家洗洗睡？",
    rows: 10, cols: 10,
    target: 'yellow', maxMoves: 6,
    palette: PALETTE,
    holes: [[3,9],[5,9]],
    randomSeed: 2
  },
  {
    id: 3,
    title: "第三關",
    subtitle: "就這實力你玩個 der",
    rows: 10, cols: 10,
    target: 'green', maxMoves: 7,
    palette: PALETTE,
    holes: [[2,2],[2,7],[7,2],[7,7]],
    randomSeed: 3
  },
  {
    id: 4,
    title: "第四關",
    rows: 8, cols: 12,
    target: 'red', maxMoves: 6,
    palette: PALETTE, randomSeed: 4
  },
  {
    id: 5, title: "第五關", rows: 12, cols: 12, target: 'blue', maxMoves: 8, palette: PALETTE, randomSeed: 5
  },
  {
    id: 6, title: "第六關", rows: 10, cols: 10, target: 'green', maxMoves: 6, palette: PALETTE, randomSeed: 6
  },
  {
    id: 7, title: "第七關", rows: 9, cols: 9, target: 'yellow', maxMoves: 5, palette: PALETTE, randomSeed: 7
  },
  {
    id: 8, title: "第八關", rows: 10, cols: 14, target: 'blue', maxMoves: 9, palette: PALETTE, randomSeed: 8
  },
  {
    id: 9, title: "第九關", rows: 10, cols: 10, target: 'red', maxMoves: 7, palette: PALETTE, randomSeed: 9
  },
  {
    id: 10, title: "第十關", rows: 10, cols: 10, target: 'green', maxMoves: 7, palette: PALETTE, randomSeed: 10
  }
];
