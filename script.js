let boardData;
let currentColor = null;
let movesLeft;
let levelConfig;

const boardEl = document.getElementById('board');
const paletteBtns = document.querySelectorAll('.color-btn');
const helpBtn = document.getElementById('helpBtn');
const tutorial = document.getElementById('tutorial');
const tutorialOk = document.getElementById('tutorialOk');
const movesLeftEl = document.getElementById('movesLeft');
const targetLabelEl = document.getElementById('targetLabel');

function loadLevel(config){
  levelConfig = config;
  boardData = JSON.parse(JSON.stringify(config.boardData));
  movesLeft = config.maxMoves;
  targetLabelEl.textContent = config.target;
  movesLeftEl.textContent = movesLeft;
  currentColor = null;
  paletteBtns.forEach(b=>b.classList.remove('selected'));
  renderBoard();
}

function renderBoard(){
  boardEl.innerHTML = '';
  for(let r=0;r<boardData.length;r++){
    for(let c=0;c<boardData[r].length;c++){
      const cell = document.createElement('div');
      cell.className = 'cell';
      const color = boardData[r][c];
      cell.dataset.r = r;
      cell.dataset.c = c;
      if(color === null){
        cell.classList.add('hole');
      } else {
        cell.style.backgroundColor = color;
        cell.addEventListener('click', ()=> {
          cell.classList.add('selected');
          setTimeout(()=>cell.classList.remove('selected'),150);
          if(!currentColor) return;
          const oldColor = boardData[r][c];
          if(oldColor === currentColor) return;
          if(movesLeft <= 0) return;
          movesLeft--;
          movesLeftEl.textContent = movesLeft;
          floodFill(r,c,oldColor,currentColor);
          renderBoard();
          checkWinLose();
        });
      }
      boardEl.appendChild(cell);
    }
  }
}

paletteBtns.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    paletteBtns.forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    currentColor = btn.dataset.color;
  });
});

helpBtn.addEventListener('click', ()=> tutorial.style.display = 'flex');
tutorialOk.addEventListener('click', ()=> tutorial.style.display = 'none');

const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
function floodFill(r,c,oldColor,newColor){
  if(r<0||r>=boardData.length||c<0||c>=boardData[0].length) return;
  if(boardData[r][c] === null) return;
  if(boardData[r][c] !== oldColor) return;
  boardData[r][c] = newColor;
  for(let d of dirs) floodFill(r+d[0], c+d[1], oldColor, newColor);
}

function checkWinLose(){
  const allTarget = boardData.every(row => row.every(cell => cell === levelConfig.target || cell === null));
  if(allTarget){
    setTimeout(()=> alert('恭喜過關！'), 80);
    return;
  }
  if(movesLeft <= 0){
    setTimeout(()=> {
      if(!confirm('步數用完，挑戰失敗。要重試嗎？')) return;
      resetLevel();
    }, 80);
  }
}

function resetLevel(){
  boardData = JSON.parse(JSON.stringify(levelConfig.boardData));
  movesLeft = levelConfig.maxMoves;
  movesLeftEl.textContent = movesLeft;
  currentColor = null;
  paletteBtns.forEach(b=>b.classList.remove('selected'));
  renderBoard();
}

window.addEventListener('load', ()=> tutorial.style.display = 'flex');
