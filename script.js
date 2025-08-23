const params = new URLSearchParams(window.location.search);
const levelId = parseInt(params.get("level"));

// 初始化變數
let selectedColor = null;
let isMouseDown = false;
let levelCompleted = false;
let grid = [];

// 找到 DOM 元素
const gridContainer = document.getElementById("grid-container");
const colorButtons = document.querySelectorAll(".color-btn");
const resetBtn = document.getElementById("reset-btn");
const checkBtn = document.getElementById("check-btn");
const backBtn = document.getElementById("back-btn");
const tutorial = document.getElementById("tutorial");
const tutorialClose = document.getElementById("tutorial-close");
const completion = document.getElementById("completion");
const nextLevelBtn = document.getElementById("next-level-btn");

// 關卡資料
const levels = [
  { size: 10, colors: ["red", "blue"], solution: [ /* 第一關解答 */ ] },
  { size: 10, colors: ["red", "blue", "green"], solution: [ /* 第二關解答 */ ] },
  { size: 10, colors: ["red", "yellow", "green"], solution: [ /* 第三關解答 */ ] },
  { size: 10, colors: ["blue", "yellow", "green"], solution: [ /* 第四關解答 */ ] },
  { size: 10, colors: ["purple", "blue", "green"], solution: [ /* 第五關解答 */ ] },
  { size: 10, colors: ["red", "blue", "yellow"], solution: [ /* 第六關解答 */ ] },
  { size: 10, colors: ["green", "blue", "yellow"], solution: [ /* 第七關解答 */ ] },
  { size: 10, colors: ["red", "blue", "purple"], solution: [ /* 第八關解答 */ ] },
  { size: 10, colors: ["red", "green", "yellow"], solution: [ /* 第九關解答 */ ] },
  { size: 10, colors: ["blue", "green", "purple"], solution: [ /* 第十關解答 */ ] }
];

// 初始化關卡
function initLevel(level) {
  const { size, colors } = levels[level - 1];
  gridContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  gridContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  gridContainer.innerHTML = "";
  grid = Array(size).fill().map(() => Array(size).fill(null));

  // 建立格子
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener("mousedown", () => paintCell(r, c, cell));
      cell.addEventListener("mouseover", () => {
        if (isMouseDown) paintCell(r, c, cell);
      });
      gridContainer.appendChild(cell);
    }
  }

  // 建立調色盤
  const palette = document.getElementById("palette");
  palette.innerHTML = "";
  colors.forEach((color) => {
    const btn = document.createElement("button");
    btn.classList.add("color-btn");
    btn.style.backgroundColor = color;
    btn.addEventListener("click", () => {
      selectedColor = color;
      document.querySelectorAll(".color-btn").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
    palette.appendChild(btn);
  });

  // 重置狀態
  selectedColor = null;
  isMouseDown = false;
  levelCompleted = false;
  completion.style.display = "none";
}

// 塗色
function paintCell(r, c, cell) {
  if (!selectedColor || levelCompleted) return;
  grid[r][c] = selectedColor;
  cell.style.backgroundColor = selectedColor;
}

// 檢查是否完成
function checkCompletion() {
  const { solution } = levels[levelId - 1];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] !== solution[r][c]) return alert("還沒完成喔！");
    }
  }
  levelCompleted = true;
  completion.style.display = "flex";
}

// 重置
function resetLevel() {
  initLevel(levelId);
}

// 下一關
function nextLevel() {
  if (levelId < levels.length) {
    window.location.href = `level.html?level=${levelId + 1}`;
  } else {
    alert("恭喜通關全部關卡！");
  }
}

// 返回主選單
function goBack() {
  window.location.href = "index.html";
}

// 事件監聽
resetBtn?.addEventListener("click", resetLevel);
checkBtn?.addEventListener("click", checkCompletion);
nextLevelBtn?.addEventListener("click", nextLevel);
backBtn?.addEventListener("click", goBack);
tutorialClose?.addEventListener("click", () => (tutorial.style.display = "none"));

document.body.addEventListener("mousedown", () => (isMouseDown = true));
document.body.addEventListener("mouseup", () => (isMouseDown = false));

// ✅ 只在第一關顯示新手教學
window.addEventListener("load", () => {
  if (levelId === 1) {
    tutorial.style.display = "flex";
  } else {
    tutorial.style.display = "none";
  }
});

// 載入關卡
initLevel(levelId);
