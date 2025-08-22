const levels = {
  1: {
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
  2: {
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
  3: {
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
  4: {
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
  5: {
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
  6: {
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
  7: {
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
  8: {
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
  9: {
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
    maxMoves: 3
  },
  10: {
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
};
