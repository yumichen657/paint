// 讀 URL 參數
const params = new URLSearchParams(window.location.search);
const levelId = parseInt(params.get("level") || "1", 10);

// 取關卡設定
const raw = LEVELS.find(x => x.id === levelId) || LEVELS[0];

// 若沒提供 boardData，依參數自動生成
function mulberry32(a){ // 確保每次同 seed 都產生同一張盤
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
function buildBoardFromParams(cfg){
  const rows = cfg.rows || 10;
  const cols = cfg.cols || 10;
  const pal = (cfg.palette && cfg.palette.length) ? cfg.palette : ['red','green','blue','yellow'];
  const holes = cfg.holes || []; // [[r,c],...]
  const rnd = mulberry32(cfg.randomSeed || 1);
  const board = Array.from({length: rows}, (_, r) =>
    Array.from({length: cols}, (_, c) => {
      // 如果是洞
      if (holes.some(([hr,hc]) => hr===r && hc===c)) return null;
      // 隨機顏色（可改為其他生成規則）
      const color = pal[Math.floor(rnd() * pal.length)];
      return color;
    })
  );
  return board;
}

const levelConfig = {
  title: raw.title || `第 ${levelId} 關`,
  boardData: raw.boardData || buildBoardFromParams(raw),
  target: raw.target || 'blue',
  maxMoves: raw.maxMoves || 6
};

// ---- DOM ----
const boardEl = document.getElementById('board');
const paletteBtns = document.querySelectorAll('.color-btn');
const helpBtn = document.getElementById('helpBtn');
const tutorial = document.getElementById('tutorial');
const tutorialOk = document.getElementById('tutorialOk');
const runDemoBtn = document.getElementById('runDemo');
const movesLeftEl = document.getElementById('movesLeft');
const targetLabelEl = document.getElementById('targetLabel');
const levelTitleEl = document.getElementById('levelTitle');
const resetBtn = document.getElementById('resetBtn');

// ---- 狀態 ----
let boardData = JSON.parse(JSON.stringify(levelConfig.boardData));
let currentColor = null;
let movesLeft = levelConfig.maxMoves;

// ---- 初始化 UI ----
levelTitleEl.textContent = levelConfig.title;
targetLabelEl.textContent = levelConfig.target;
movesLeftEl.textContent = movesLeft;

// 依盤面寬度動態設定欄數
function applyGridCols(){
  const cols = boardData[0]?.length || 10;
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 44px)`;
}

function renderBoard(){
  boardEl.innerHTML = '';
  applyGridCols();
  for(let r=0; r<boardData.length; r++){
    for(let c=0; c<boardData[r].length; c++){
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

helpBtn?.addEventListener('click', ()=> tutorial.style.display = 'flex');
tutorialOk?.addEventListener('click', ()=> tutorial.style.display = 'none');
resetBtn?.addEventListener('click', resetLevel);

// ✅ 只在第一關顯示新手教學
window.addEventListener('load', ()=> {
  if (levelId === 1) {
    tutorial.style.display = 'flex';
  } else {
    tutorial.style.display = 'none';
  }
});


// ---- 染色（DFS） ----
const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
function floodFill(r,c,oldColor,newColor){
  if(r<0||r>=boardData.length||c<0||c>=boardData[0].length) return;
  if(boardData[r][c] === null) return; // 洞不填色
  if(boardData[r][c] !== oldColor) return;
  boardData[r][c] = newColor;
  for(const [dr,dc] of dirs) floodFill(r+dr, c+dc, oldColor, newColor);
}

// ---- 勝負判定 ----
function checkWinLose(){
  const allTarget = boardData.every(row => row.every(cell => cell === levelConfig.target || cell === null));
  if(allTarget){
    setTimeout(()=> {
      const goNext = confirm('恭喜過關！要前往下一關嗎？');
      if (goNext) {
        const nextId = levelId + 1;
        const hasNext = LEVELS.some(l => l.id === nextId);
        if (hasNext) location.href = `game.html?level=${nextId}`;
        else location.href = 'index.html';
      }
    }, 80);
    return;
  }
  if(movesLeft <= 0){
    setTimeout(()=> {
      if(confirm('步數用完，挑戰失敗。要重試嗎？')) resetLevel();
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

// ---- 示範（可選：如果想要固定示範流程，可在 raw.demoClicks 定義） ----
runDemoBtn?.addEventListener('click', async () => {
  // 預設做幾次隨機合法點擊，只為演示染色效果
  const rows = boardData.length, cols = boardData[0].length;
  const demoSteps = raw.demoClicks || 3;
  for(let i=0;i<demoSteps;i++){
    // 任選一格 + 任選一個不同顏色
    let r = Math.floor(Math.random()*rows);
    let c = Math.floor(Math.random()*cols);
    if (boardData[r][c] === null) { i--; continue; }
    const oldColor = boardData[r][c];
    const options = ['red','green','blue','yellow'].filter(x => x !== oldColor);
    const pick = options[Math.floor(Math.random()*options.length)];
    currentColor = pick;
    movesLeft = Math.max(0, movesLeft-1);
    movesLeftEl.textContent = movesLeft;
    floodFill(r,c,oldColor,pick);
    renderBoard();
    await new Promise(res=>setTimeout(res,300));
    if (movesLeft<=0) break;
  }
});

renderBoard();
