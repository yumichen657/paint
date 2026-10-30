// ===== 顏色白名單：統一使用 levels.js 的 PALETTE =====
const COLORS = (typeof PALETTE !== 'undefined' && PALETTE.length)
  ? PALETTE
  : ['red', 'green', 'blue', 'yellow'];

// ===== 讀 URL 參數 & 取關卡設定 =====
const params = new URLSearchParams(window.location.search);
const requestedId = parseInt(params.get('level') || '1', 10);
const raw = LEVELS.find(x => x.id === requestedId) || LEVELS[0];
const levelId = raw.id;

// ===== 隨機盤面（同 seed 永遠同一張）=====
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// 若關卡沒提供 boardData，依參數自動生成；障礙只用 null
function buildBoardFromParams(cfg) {
  const rows = cfg.rows || 10;
  const cols = cfg.cols || 10;
  const pal = (cfg.palette && cfg.palette.length) ? cfg.palette : COLORS;
  const holes = new Set((cfg.holes || []).map(([r, c]) => r + ',' + c));
  const rnd = mulberry32(cfg.randomSeed || 1);
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      if (holes.has(r + ',' + c)) return null;
      return pal[Math.floor(rnd() * pal.length)];
    })
  );
}

// ===== 檢查所有關卡資料（只在 console 警告）=====
function validateLevels() {
  LEVELS.forEach(l => {
    const b = l.boardData || buildBoardFromParams(l);
    b.forEach((row, r) => row.forEach((v, c) => {
      if (v !== null && !COLORS.includes(v)) {
        console.warn(`第${l.id}關 (${r},${c}) 非法值:`, v, '（障礙請用 null）');
      }
    }));
    if (!COLORS.includes(l.target)) console.warn(`第${l.id}關 target 不在調色盤:`, l.target);
    if (!b.every(row => row.length === b[0].length)) console.warn(`第${l.id}關 每列長度不一致`);
  });
}
validateLevels();

const levelConfig = {
  title: raw.title || `第 ${levelId} 關`,
  boardData: raw.boardData || buildBoardFromParams(raw),
  target: raw.target || 'blue',
  maxMoves: raw.maxMoves || 6
};

// ===== DOM =====
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

// ===== 狀態 =====
let boardData = JSON.parse(JSON.stringify(levelConfig.boardData));
let currentColor = null;
let movesLeft = levelConfig.maxMoves;
let demoRunning = false;

// ===== 初始化 UI =====
levelTitleEl.textContent = levelConfig.title;
targetLabelEl.textContent = levelConfig.target;
movesLeftEl.textContent = movesLeft;

function applyGridCols() {
  const cols = boardData[0]?.length || 10;
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 44px)`;
}

function renderBoard() {
  boardEl.innerHTML = '';
  applyGridCols();
  for (let r = 0; r < boardData.length; r++) {
    for (let c = 0; c < boardData[r].length; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      const color = boardData[r][c];
      cell.dataset.r = r;
      cell.dataset.c = c;
      if (color === null) {
        cell.classList.add('hole');
      } else {
        cell.style.backgroundColor = color;
        cell.addEventListener('click', () => onCellClick(r, c, cell));
      }
      boardEl.appendChild(cell);
    }
  }
}

function onCellClick(r, c, cell) {
  if (demoRunning) return;
  cell.classList.add('selected');
  setTimeout(() => cell.classList.remove('selected'), 150);
  if (!currentColor) return;
  const oldColor = boardData[r][c];
  if (oldColor === currentColor) return;
  if (movesLeft <= 0) return;
  movesLeft--;
  movesLeftEl.textContent = movesLeft;
  floodFill(r, c, oldColor, currentColor);
  renderBoard();
  checkWinLose();
}

// ===== 調色盤 =====
paletteBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    paletteBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    currentColor = btn.dataset.color;
  });
});

helpBtn?.addEventListener('click', () => tutorial.style.display = 'flex');
tutorialOk?.addEventListener('click', () => tutorial.style.display = 'none');
resetBtn?.addEventListener('click', resetLevel);

window.addEventListener('load', () => {
  tutorial.style.display = (levelId === 1) ? 'flex' : 'none';
});

// ===== 染色（DFS）=====
const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
function floodFill(r, c, oldColor, newColor) {
  if (r < 0 || r >= boardData.length || c < 0 || c >= boardData[0].length) return;
  if (boardData[r][c] === null) return;
  if (boardData[r][c] !== oldColor) return;
  boardData[r][c] = newColor;
  for (const [dr, dc] of dirs) floodFill(r + dr, c + dc, oldColor, newColor);
}

// ===== 勝負判定 =====
function isWin() {
  return boardData.every(row => row.every(cell => cell === levelConfig.target || cell === null));
}

function checkWinLose() {
  if (isWin()) {
    setTimeout(() => {
      const goNext = confirm('恭喜過關！要前往下一關嗎？');
      if (goNext) {
        const nextId = levelId + 1;
        const hasNext = LEVELS.some(l => l.id === nextId);
        location.href = hasNext ? `game.html?level=${nextId}` : 'index.html';
      }
    }, 80);
    return;
  }
  if (movesLeft <= 0) {
    setTimeout(() => {
      if (confirm('步數用完，挑戰失敗。要重試嗎？')) resetLevel();
    }, 80);
  }
}

function resetLevel() {
  if (demoRunning) return;
  boardData = JSON.parse(JSON.stringify(levelConfig.boardData));
  movesLeft = levelConfig.maxMoves;
  movesLeftEl.textContent = movesLeft;
  currentColor = null;
  paletteBtns.forEach(b => b.classList.remove('selected'));
  renderBoard();
}

// ===== 示範：隨機染幾次，結束後還原（不扣步數）=====
runDemoBtn?.addEventListener('click', async () => {
  if (demoRunning) return;

  const cells = [];
  boardData.forEach((row, r) => row.forEach((v, c) => { if (v !== null) cells.push([r, c]); }));
  if (cells.length === 0) return;

  demoRunning = true;
  const snapBoard = JSON.stringify(boardData);
  const snapMoves = movesLeft;
  const steps = raw.demoClicks || 3;

  for (let i = 0; i < steps; i++) {
    const [r, c] = cells[Math.floor(Math.random() * cells.length)];
    const oldColor = boardData[r][c];
    const options = COLORS.filter(x => x !== oldColor);
    if (options.length === 0) break;
    const pick = options[Math.floor(Math.random() * options.length)];
    floodFill(r, c, oldColor, pick);
    renderBoard();
    await new Promise(res => setTimeout(res, 300));
  }

  await new Promise(res => setTimeout(res, 600));
  boardData = JSON.parse(snapBoard);
  movesLeft = snapMoves;
  movesLeftEl.textContent = movesLeft;
  renderBoard();
  demoRunning = false;
});

renderBoard();