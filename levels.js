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
  }
];
