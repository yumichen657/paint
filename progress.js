// ===== 通關進度與關卡鎖定 =====
// 記住過了哪幾關（存在這台裝置的瀏覽器裡）。登入帳號後，cloud.js 會把進度同步到雲端。
// 規則：第一關永遠可以玩；其他關要先過前一關才會解鎖。
(function () {
  const KEY = 'fullpaint-progress-v1';
  const listeners = [];
  let cloudSave = null; // 登入後由 cloud.js 設定：把進度上傳到雲端

  function read() {
    try {
      const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(arr) ? arr.filter(Number.isFinite) : [];
    } catch (e) { return []; }
  }
  let cleared = new Set(read());

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify([...cleared].sort((a, b) => a - b))); } catch (e) {}
    listeners.forEach(fn => { try { fn(); } catch (e) {} });
  }
  const levelIds = () => (typeof LEVELS !== 'undefined' ? LEVELS.map(l => l.id) : []);

  window.Progress = {
    list: () => [...cleared].sort((a, b) => a - b),
    isCleared: id => cleared.has(id),

    // 第一關永遠開放；之後要過了前一關（或自己已經過過）才開放
    isUnlocked(id) {
      const ids = levelIds();
      const i = ids.indexOf(id);
      if (i <= 0) return true;
      return cleared.has(id) || cleared.has(ids[i - 1]);
    },

    markCleared(id) {
      if (cleared.has(id)) return;
      cleared.add(id);
      save();
      if (cloudSave) cloudSave([id]).catch(() => {});
    },

    // 把雲端的進度合併進來（兩邊都保留），回傳合併後的結果
    merge(ids) {
      (ids || []).filter(Number.isFinite).forEach(id => cleared.add(id));
      save();
      return this.list();
    },

    // 登出時清空這台裝置的進度，下一個人從頭開始
    reset() { cleared = new Set(); save(); },

    setCloud(fn) { cloudSave = fn; },
    onChange(fn) { listeners.push(fn); }
  };

  // ===== 作弊指令：解除前 n 關的封鎖 =====
  // 用法：在瀏覽器按右鍵「檢查」→ Console（主控台）→ 輸入 unlock(10) 按 Enter
  // 會把第 1～n 關標成已通過（第 n+1 關也會跟著解鎖）；有登入的話會一起存到帳號
  // 最多只能解除前 UNLOCK_MAX 關，超過的部分要自己玩
  const UNLOCK_MAX = 15;
  window.unlock = window.解鎖 = function (n = 10) {
    n = Math.floor(Number(n));
    if (!(n > 0)) { console.log(`用法：unlock(10) 解除前 10 關（最多 ${UNLOCK_MAX} 關）`); return; }
    if (n > UNLOCK_MAX) {
      console.log(`最多只能解除前 ${UNLOCK_MAX} 關，已改成解除前 ${UNLOCK_MAX} 關。`);
      n = UNLOCK_MAX;
    }
    const ids = levelIds().slice(0, n).filter(id => !cleared.has(id));
    ids.forEach(id => cleared.add(id));
    save();
    if (ids.length && cloudSave) cloudSave(ids).catch(() => {});
    const total = Math.min(n, levelIds().length);
    console.log(`已解除前 ${total} 關的封鎖` + (cloudSave ? '，並存到帳號。' : '。（沒有登入，只存在這台裝置）'));
  };

  // 另一個分頁改了進度（例如在遊戲頁過關），選關頁也跟著更新
  window.addEventListener('storage', e => { if (e.key === KEY) { cleared = new Set(read()); save(); } });
})();
