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

// ===== 連通區塊工具（逆向模式判斷卡死用）=====
const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

// 回傳每格所屬的區塊編號（null 格為 -1）
function labelComponents(board) {
  const R = board.length, C = board[0].length;
  const label = board.map(row => row.map(() => -1));
  let id = 0;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    if (board[r][c] === null || label[r][c] !== -1) continue;
    const col = board[r][c];
    const stack = [[r, c]];
    label[r][c] = id;
    while (stack.length) {
      const [y, x] = stack.pop();
      for (const [dy, dx] of dirs) {
        const ny = y + dy, nx = x + dx;
        if (ny < 0 || nx < 0 || ny >= R || nx >= C) continue;
        if (label[ny][nx] !== -1 || board[ny][nx] !== col) continue;
        label[ny][nx] = id;
        stack.push([ny, nx]);
      }
    }
    id++;
  }
  return label;
}

// 逆向模式：如果某個區塊橫跨了目標圖中兩個不同區域，就永遠分不開 → 卡死
function isStillSolvable(board, goal) {
  const cur = labelComponents(board);
  const tgt = labelComponents(goal);
  const owner = new Map(); // 目前區塊 → 目標區塊
  for (let r = 0; r < board.length; r++) for (let c = 0; c < board[0].length; c++) {
    const a = cur[r][c];
    if (a === -1) continue;
    const b = tgt[r][c];
    if (!owner.has(a)) owner.set(a, b);
    else if (owner.get(a) !== b) return false;
  }
  return true;
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
    if (!b.every(row => row.length === b[0].length)) console.warn(`第${l.id}關 每列長度不一致`);

    if (l.goalBoard) {
      const g = l.goalBoard;
      if (g.length !== b.length || g.some((row, r) => row.length !== b[r].length)) {
        console.warn(`第${l.id}關 goalBoard 大小跟 boardData 不同`);
        return;
      }
      g.forEach((row, r) => row.forEach((v, c) => {
        if ((v === null) !== (b[r][c] === null)) console.warn(`第${l.id}關 (${r},${c}) null 位置跟起始盤面不一致`);
        if (v !== null && !COLORS.includes(v)) console.warn(`第${l.id}關 goalBoard (${r},${c}) 非法值:`, v);
      }));
      if (!isStillSolvable(b, g)) console.warn(`第${l.id}關 起始盤面就已經無解`);
    } else if (!COLORS.includes(l.target)) {
      console.warn(`第${l.id}關 target 不在調色盤:`, l.target);
    }
  });
}
validateLevels();

const levelConfig = {
  title: raw.title || `第 ${levelId} 關`,
  boardData: raw.boardData || buildBoardFromParams(raw),
  goalBoard: raw.goalBoard || null,         // 有 goalBoard 就是逆向解謎關
  target: raw.target || 'blue',
  maxMoves: raw.maxMoves || 6
};
const isReverse = !!levelConfig.goalBoard;

// ===== 逆向模式需要的樣式（直接注入，不用改 style.css）=====
(function injectStyle() {
  const css = `
    .goal-wrap { margin: 12px auto; text-align: center; }
    .goal-wrap .goal-title { font-size: 14px; margin-bottom: 6px; opacity: .8; }
    .goal-grid { display: inline-grid; gap: 2px; padding: 4px; background: rgba(0,0,0,.15); border-radius: 6px; }
    .goal-cell { width: 16px; height: 16px; border-radius: 3px; }
    .goal-cell.hole { background: transparent; }
    .stuck-msg { color: #e74c3c; font-weight: bold; text-align: center; margin: 8px 0; display: none; }
    #board .cell { width: var(--cell, 44px); height: var(--cell, 44px); }
    .target-chip { display: inline-block; width: 14px; height: 14px; border-radius: 4px; vertical-align: -2px; margin-right: 4px; border: 1px solid rgba(0,0,0,.15); }

    /* ---- 互動教學 ---- */
    body.tut-active { padding-bottom: 170px; }
    body.tut-active .cell:not(.tut-focus),
    body.tut-active .color-btn:not(.tut-focus) { opacity: .3; pointer-events: none; }
    body.tut-active .bottom-actions { opacity: .4; }
    .tut-focus { position: relative; z-index: 5; animation: tutPulse 1.1s ease-in-out infinite; }
    .status > div.tut-focus { background: #fff3cd; border-radius: 8px; padding: 2px 8px; }
    @keyframes tutPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
      50%      { box-shadow: 0 0 0 6px rgba(59,130,246,.6); }
    }
    .tut-bubble {
      position: fixed; left: 50%; bottom: 16px; transform: translateX(-50%);
      width: min(440px, calc(100vw - 32px)); z-index: 25;
      background: #1f2937; color: #fff; padding: 14px 16px; border-radius: 14px;
      box-shadow: 0 12px 30px rgba(0,0,0,.3); font-size: 16px; line-height: 1.55;
    }
    .tut-bubble b { color: #fde68a; }
    .tut-row { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; gap: 8px; }
    .tut-step { font-size: 12px; color: #9ca3af; }
    .tut-next { background: #10b981; color: #fff; border: none; border-radius: 8px; padding: 8px 16px; font-size: 15px; cursor: pointer; }
    .tut-skip { background: none; border: none; color: #9ca3af; font-size: 13px; text-decoration: underline; cursor: pointer; }
    .tut-shake { animation: tutShake .35s; }
    @keyframes tutShake {
      0%, 100% { transform: translateX(-50%); }
      25% { transform: translateX(calc(-50% - 8px)); }
      75% { transform: translateX(calc(-50% + 8px)); }
    }
  `;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
})();

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

// 逆向模式：在盤面後面加上「目標圖」和「卡死提示」
let stuckMsgEl = null;
if (isReverse) {
  const wrap = document.createElement('div');
  wrap.className = 'goal-wrap';
  wrap.innerHTML = '<div class="goal-title">目標圖案</div>';
  const grid = document.createElement('div');
  grid.className = 'goal-grid';
  grid.style.gridTemplateColumns = `repeat(${levelConfig.goalBoard[0].length}, 16px)`;
  levelConfig.goalBoard.forEach(row => row.forEach(v => {
    const d = document.createElement('div');
    d.className = 'goal-cell';
    if (v === null) d.classList.add('hole');
    else d.style.backgroundColor = v;
    grid.appendChild(d);
  }));
  wrap.appendChild(grid);

  stuckMsgEl = document.createElement('div');
  stuckMsgEl.className = 'stuck-msg';
  stuckMsgEl.textContent = '⚠️ 兩個不同區域黏在一起了，這盤已經無法完成，請重來';

  boardEl.insertAdjacentElement('afterend', wrap);
  wrap.insertAdjacentElement('afterend', stuckMsgEl);
}

// ===== 狀態 =====
let boardData = JSON.parse(JSON.stringify(levelConfig.boardData));
let currentColor = null;
let movesLeft = levelConfig.maxMoves;
let demoRunning = false;

// ===== 初始化 UI =====
levelTitleEl.textContent = levelConfig.title;
const COLOR_ZH = { red: '紅色', green: '綠色', blue: '藍色', yellow: '黃色' };
if (isReverse) {
  targetLabelEl.textContent = '照下方圖案';
} else {
  targetLabelEl.innerHTML = `<span class="target-chip" style="background:${levelConfig.target}"></span>${COLOR_ZH[levelConfig.target] || levelConfig.target}`;
}
movesLeftEl.textContent = movesLeft;

// 依螢幕寬度自動縮放格子（最大 44px），手機上盤面不會超出畫面
function applyGridCols() {
  const cols = boardData[0]?.length || 10;
  const gap = parseFloat(getComputedStyle(boardEl).columnGap) || 6;
  const bodyPad = parseFloat(getComputedStyle(document.body).paddingLeft) || 0;
  const avail = document.documentElement.clientWidth - bodyPad * 2;
  const size = Math.max(22, Math.min(44, Math.floor((avail - gap * (cols - 1)) / cols)));
  boardEl.style.gridTemplateColumns = `repeat(${cols}, ${size}px)`;
  boardEl.style.setProperty('--cell', size + 'px');
}
window.addEventListener('resize', applyGridCols);

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
  guide.decorate();
}

function onCellClick(r, c, cell) {
  if (demoRunning) return;
  if (!guide.allowCell(r, c)) return;
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
  guide.afterCell();
  checkWinLose();
}

// ===== 互動教學（關卡有 tutorial 欄位時啟動）=====
const guide = {
  steps: Array.isArray(raw.tutorial) && raw.tutorial.length ? raw.tutorial : null,
  i: -1,
  el: null,
  skipped: false,

  active() { return !!this.steps && this.i >= 0 && this.i < this.steps.length; },
  step() { return this.steps[this.i]; },

  start() {
    if (!this.steps || this.skipped) return;
    this.i = 0;
    document.body.classList.add('tut-active');
    this.show();
  },
  end() {
    this.i = -1;
    document.body.classList.remove('tut-active');
    this.clearFocus();
    if (this.el) { this.el.remove(); this.el = null; }
  },
  next() {
    this.i++;
    if (this.i >= this.steps.length) this.end();
    else this.show();
  },

  clearFocus() {
    document.querySelectorAll('.tut-focus').forEach(e => e.classList.remove('tut-focus'));
  },
  // 把這一步要玩家注意的東西亮起來，其他變暗
  decorate() {
    if (!this.active()) return;
    this.clearFocus();
    const s = this.step();
    const targets = [];
    if (s.focus === 'target') targets.push(targetLabelEl.parentElement);
    if (s.focus === 'moves') targets.push(movesLeftEl.parentElement);
    if (s.focus === 'palette') paletteBtns.forEach(b => targets.push(b));
    if (s.focus === 'board') boardEl.querySelectorAll('.cell:not(.hole)').forEach(c => targets.push(c));
    if (s.wait === 'color') paletteBtns.forEach(b => { if (b.dataset.color === s.color) targets.push(b); });
    if (s.wait === 'cell') {
      boardEl.querySelectorAll('.cell').forEach(c => {
        if (boardData[c.dataset.r][c.dataset.c] === s.cellColor) targets.push(c);
      });
    }
    targets.forEach(e => e.classList.add('tut-focus'));
    return targets;
  },
  show() {
    if (!this.el) {
      this.el = document.createElement('div');
      this.el.className = 'tut-bubble';
      this.el.setAttribute('role', 'status');
      this.el.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.el);
    }
    const s = this.step();
    this.el.innerHTML = `
      <div class="tut-text">${s.text}</div>
      <div class="tut-row">
        <button type="button" class="tut-skip">跳過教學</button>
        <span class="tut-step">${this.i + 1} / ${this.steps.length}</span>
        ${s.wait === 'next' ? '<button type="button" class="tut-next">下一步</button>' : '<span></span>'}
      </div>`;
    this.el.querySelector('.tut-skip').onclick = () => { this.skipped = true; this.end(); };
    const nextBtn = this.el.querySelector('.tut-next');
    if (nextBtn) nextBtn.onclick = () => this.next();
    const targets = this.decorate();
    if (targets && targets[0]) targets[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
  },
  shake() {
    if (!this.el) return;
    this.el.classList.remove('tut-shake');
    void this.el.offsetWidth; // 重新觸發動畫
    this.el.classList.add('tut-shake');
  },

  // 點調色盤時：教學中只允許指定顏色
  allowColor(color) {
    if (!this.active()) return true;
    const s = this.step();
    if ((s.wait === 'color' || s.wait === 'cell') && color === s.color) return true;
    this.shake();
    return false;
  },
  afterColor(color) {
    if (!this.active()) return;
    const s = this.step();
    if (s.wait === 'color' && color === s.color) setTimeout(() => this.next(), 250);
  },
  // 點格子時：教學中只允許「用指定顏色點指定顏色的格子」
  allowCell(r, c) {
    if (!this.active()) return true;
    const s = this.step();
    if (s.wait === 'cell' && boardData[r][c] === s.cellColor && currentColor === s.color) return true;
    this.shake();
    return false;
  },
  afterCell() {
    if (this.active() && this.step().wait === 'cell') this.next();
  }
};

// ===== 調色盤 =====
paletteBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const color = btn.dataset.color;
    if (!guide.allowColor(color)) return;
    paletteBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    currentColor = color;
    guide.afterColor(color);
  });
});

helpBtn?.addEventListener('click', () => tutorial.style.display = 'flex');
tutorialOk?.addEventListener('click', () => tutorial.style.display = 'none');
resetBtn?.addEventListener('click', resetLevel);

// 有互動教學的關卡（第一關）一進來就開始教學；規則說明改成按「?」才打開
window.addEventListener('load', () => {
  tutorial.style.display = 'none';
  guide.start();
});

// ===== 染色（DFS）=====
function floodFill(r, c, oldColor, newColor) {
  if (r < 0 || r >= boardData.length || c < 0 || c >= boardData[0].length) return;
  if (boardData[r][c] === null) return;
  if (boardData[r][c] !== oldColor) return;
  boardData[r][c] = newColor;
  for (const [dr, dc] of dirs) floodFill(r + dr, c + dc, oldColor, newColor);
}

// ===== 勝負判定 =====
function isWin() {
  if (isReverse) {
    return boardData.every((row, r) => row.every((cell, c) => cell === levelConfig.goalBoard[r][c]));
  }
  return boardData.every(row => row.every(cell => cell === levelConfig.target || cell === null));
}

function checkWinLose() {
  if (isWin()) {
    setTimeout(() => {
      const goNext = confirm(raw.winText || '恭喜過關！要前往下一關嗎？');
      if (goNext) {
        const nextId = levelId + 1;
        const hasNext = LEVELS.some(l => l.id === nextId);
        location.href = hasNext ? `game.html?level=${nextId}` : 'index.html';
      }
    }, 80);
    return;
  }

  // 逆向模式：提早告訴玩家已經卡死，不用浪費剩下的步數
  if (isReverse && !isStillSolvable(boardData, levelConfig.goalBoard)) {
    if (stuckMsgEl) stuckMsgEl.style.display = 'block';
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
  if (stuckMsgEl) stuckMsgEl.style.display = 'none';
  guide.end();
  renderBoard();
  guide.start(); // 教學關重來時，教學也從頭開始（按過「跳過教學」就不會再出現）
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
