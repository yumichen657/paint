// 顏色白名單（調色盤按鈕也有這四種）
const PALETTE = ['red','green','blue','yellow'];

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
    maxMoves: 2
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
    id: 12,
    title: "第十二關",
    boardData: [
      ['blue',  'blue',  'blue',  'blue',  'red',    'red',    'green',  'green', 'green', 'green'],
      ['blue',  'blue',  'blue',  'blue',  'red',    'red',    'green',  'green', 'green', 'green'],
      ['blue',  'blue',  'red',   'red',   'yellow', 'yellow', 'red',    'red',   'blue',  'blue'],
      ['red',   'red',   'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'red',   'red'],
      ['green', 'green', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'green', 'green'],
      ['blue',  'blue',  'red',   'red',   'yellow', 'yellow', 'red',    'red',   'blue',  'blue'],
      ['green', 'green', 'green', 'green', 'blue',   'blue',   'red',    'red',   'red',   'red'],
      ['green', 'green', 'green', 'green', 'blue',   'blue',   'red',    'red',   'red',   'red']
    ],
    target: 'yellow',
    maxMoves: 4 
  }
  {
    id: 13,
    title: "第十三關",
    boardData: [
      ['blue', 'blue', 'blue', null, 'red', 'red', null, 'green', 'green', 'green'],
      ['blue', 'blue', 'blue', null, 'red', 'red', null, 'green', 'green', 'green'],
      ['blue', 'blue', 'blue', 'red', 'red', 'red', 'red', 'green', 'green', 'green'],
      [null, null, 'red', 'red', 'red', 'red', 'red', 'red', null, null],
      [null, null, 'red', 'red', 'red', 'red', 'red', 'red', null, null],
      ['yellow', 'yellow', 'yellow', 'red', 'red', 'red', 'red', 'blue', 'blue', 'blue'],
      ['yellow', 'yellow', 'yellow', null, 'red', 'red', null, 'blue', 'blue', 'blue'],
      ['yellow', 'yellow', 'yellow', null, 'red', 'red', null, 'blue', 'blue', 'blue']
    ],
    target: 'red',
    maxMoves: 4
  },
  {
    id: 14,
    title: "第十四關",
    boardData: [
      ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red'],
      ['red', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'red'],
      ['red', 'blue', null, null, null, null, null, null, 'blue', 'red'],
      ['red', 'blue', null, 'green', 'green', 'green', 'green', null, 'blue', 'red'],
      ['red', 'blue', null, 'green', 'yellow', 'yellow', 'green', null, 'blue', 'red'],
      ['red', 'blue', null, 'green', 'green', 'green', 'green', null, 'blue', 'red'],
      ['red', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'red'],
      ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red']
    ],
    target: 'yellow',
    maxMoves: 4
  },
  {
    id: 15,
    title: "第十五關",
    boardData: [
      ['yellow', 'yellow', 'blue', 'blue', 'green', 'green', 'red', 'red', 'blue', 'blue'],
      ['yellow', null, null, null, null, null, null, null, null, 'blue'],
      ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', null, 'green'],
      ['green', null, null, null, null, null, null, 'red', null, 'green'],
      ['green', null, 'blue', 'blue', 'blue', 'blue', null, 'red', null, 'red'],
      ['green', null, 'blue', 'yellow', 'yellow', 'blue', null, 'red', null, 'red'],
      ['green', null, null, null, null, null, null, 'red', null, 'red'],
      ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'red', 'red', 'red']
    ],
    target: 'yellow',
    maxMoves: 6
  },
  {
    id: 16,
    title: "第十六關",
    boardData: [
      ['blue', 'red', 'blue', 'red', 'blue', 'red', 'blue', 'red', 'blue', 'red'],
      ['red', 'blue', 'red', 'blue', 'red', 'blue', 'red', 'blue', 'red', 'blue'],
      ['blue', 'red', 'blue', 'red', 'blue', 'red', 'blue', 'red', 'blue', 'red'],
      ['red', 'blue', 'red', 'blue', 'red', 'blue', 'red', 'blue', 'red', 'blue'],
      ['blue', 'red', 'blue', 'red', 'blue', 'red', 'blue', 'red', 'blue', 'red'],
      ['red', 'blue', 'red', 'blue', 'red', 'blue', 'red', 'blue', 'red', 'blue'],
      ['blue', 'red', 'blue', 'red', 'blue', 'red', 'blue', 'red', 'blue', 'red'],
      ['red', 'blue', 'red', 'blue', 'red', 'blue', 'red', 'blue', 'red', 'blue']
    ],
    target: 'green',
    maxMoves: 10
  },
  {
    id: 17,
    title: "第十七關",
    boardData: [
      ['green', 'green', 'green', null, 'yellow', 'yellow', null, 'blue', 'blue', 'blue'],
      ['green', 'red', 'green', null, 'yellow', 'red', 'yellow', null, 'blue', 'red'],
      ['green', 'green', 'green', null, 'yellow', 'yellow', null, 'blue', 'blue', 'blue'],
      [null, null, null, null, null, null, null, null, null, null],
      ['blue', 'blue', 'blue', null, 'green', 'green', null, 'yellow', 'yellow', 'yellow'],
      ['blue', 'red', 'blue', null, 'green', 'red', 'green', null, 'yellow', 'red'],
      ['blue', 'blue', 'blue', null, 'green', 'green', null, 'yellow', 'yellow', 'yellow'],
      ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red']
    ],
    target: 'red',
    maxMoves: 5
  },
  {
    id: 18,
    title: "第十八關",
    boardData: [
      ['blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue'],
      ['blue', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'blue'],
      ['blue', 'red', 'green', 'green', 'green', 'green', 'green', 'green', 'red', 'blue'],
      ['blue', 'red', 'green', 'yellow', 'yellow', 'yellow', 'yellow', 'green', 'red', 'blue'],
      ['blue', 'red', 'green', 'yellow', 'red', 'red', 'yellow', 'green', 'red', 'blue'],
      ['blue', 'red', 'green', 'yellow', 'yellow', 'yellow', 'yellow', 'green', 'red', 'blue'],
      ['blue', 'red', 'green', 'green', 'green', 'green', 'green', 'green', 'red', 'blue'],
      ['blue', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'blue']
    ],
    target: 'red',
    maxMoves: 5
  },
  {
    id: 19,
    title: "第十九關",
    boardData: [
      ['red', null, 'blue', null, 'green', null, 'yellow', null, 'red', null],
      [null, 'red', null, 'blue', null, 'green', null, 'yellow', null, 'red'],
      ['red', null, 'blue', null, 'green', null, 'yellow', null, 'red', null],
      [null, 'red', null, 'blue', null, 'green', null, 'yellow', null, 'red'],
      ['red', null, 'blue', null, 'green', null, 'yellow', null, 'red', null],
      [null, 'red', null, 'blue', null, 'green', null, 'yellow', null, 'red'],
      ['red', null, 'blue', null, 'green', null, 'yellow', null, 'red', null],
      [null, 'red', null, 'blue', null, 'green', null, 'yellow', null, 'red']
    ],
    target: 'blue',
    maxMoves: 12
  },
  {
    id: 20,
    title: "第二十關",
    boardData: [
      ['yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow'],
      ['yellow', null, null, null, null, null, null, null, null, 'yellow'],
      ['yellow', null, 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', null, 'yellow'],
      ['yellow', null, 'blue', null, null, null, null, 'blue', null, 'yellow'],
      ['yellow', null, 'blue', null, 'red', 'red', null, 'blue', null, 'yellow'],
      ['yellow', null, 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', null, 'yellow'],
      ['yellow', null, null, null, null, null, null, null, null, 'yellow'],
      ['yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow']
    ],
    target: 'red',
    maxMoves: 3
  },
  {
    id: 21,
    title: "第二十一關",
    boardData: [
      ['green', 'green', 'green', 'blue', 'blue', 'blue', 'red', 'red', 'red', 'yellow'],
      ['green', 'green', 'green', 'blue', 'blue', 'blue', 'red', 'red', 'red', 'yellow'],
      ['green', 'green', 'green', 'blue', 'blue', 'blue', 'red', 'red', 'red', 'yellow'],
      [null, null, null, null, null, null, null, null, null, 'yellow'],
      ['yellow', 'red', 'red', 'red', 'blue', 'blue', 'blue', 'green', 'green', 'green'],
      ['yellow', 'red', 'red', 'red', 'blue', 'blue', 'blue', 'green', 'green', 'green'],
      ['yellow', 'red', 'red', 'red', 'blue', 'blue', 'blue', 'green', 'green', 'green'],
      ['yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow']
    ],
    target: 'yellow',
    maxMoves: 5
  },
  {
    id: 22,
    title: "第二十二關",
    boardData: [
      ['red', 'blue', 'green', 'yellow', 'red', 'blue', 'green', 'yellow', 'red', 'blue'],
      ['blue', null, null, null, null, null, null, null, null, 'green'],
      ['green', null, 'red', 'blue', 'green', 'yellow', 'red', 'blue', null, 'yellow'],
      ['yellow', null, 'blue', null, null, null, null, 'green', null, 'red'],
      ['red', null, 'green', null, 'yellow', 'yellow', null, 'yellow', null, 'blue'],
      ['blue', null, 'yellow', 'red', 'blue', 'green', 'yellow', 'red', null, 'green'],
      ['green', null, null, null, null, null, null, null, null, 'yellow'],
      ['yellow', 'red', 'blue', 'green', 'yellow', 'red', 'blue', 'green', 'yellow', 'red']
    ],
    target: 'red',
    maxMoves: 8
  }
];
