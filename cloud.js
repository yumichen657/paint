// ===== 帳號登入與雲端同步（Firebase）=====
// 玩家用「帳號名稱＋密碼」註冊、登入；登入後過了哪幾關會存到雲端，換裝置登入也能接著玩。
// 密碼由 Firebase 加密保管，這個程式不會、也看不到玩家的密碼。
import { firebaseConfig, ADMINS } from './firebase-config.js';

const SDK = 'https://www.gstatic.com/firebasejs/10.12.2';
// Firebase 的帳號一定要是 email 格式，所以把帳號名稱接上一個固定的尾巴（不會真的寄信）
const EMAIL_DOMAIN = 'users.fullpaint.vercel.app';
const NAME_RE = /^[A-Za-z0-9_]{3,20}$/;

const bar = document.getElementById('account');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let F = null, S = null, auth = null, db = null;
let pendingName = '';   // 註冊時輸入的帳號名稱（保留大小寫）
let currentUser = null;  // 目前登入的玩家

if (!firebaseConfig || !window.Progress) {
  if (bar) bar.hidden = true;          // 還沒設定 Firebase：只用本機進度
} else {
  start();
}

// ---------- 啟動 ----------
async function start() {
  render({ state: 'loading' });
  let A;
  try {
    [A, F, S] = await Promise.all([
      import(`${SDK}/firebase-app.js`),
      import(`${SDK}/firebase-auth.js`),
      import(`${SDK}/firebase-firestore.js`)
    ]);
  } catch (e) {
    render({ state: 'offline' });
    return;
  }
  const app = A.initializeApp(firebaseConfig);
  auth = F.getAuth(app);
  db = S.getFirestore(app);
  F.onAuthStateChanged(auth, user => {
    currentUser = user;
    if (user) { Progress.setAdmin(isAdmin(user)); onLogin(user); }
    else { Progress.setCloud(null); Progress.setRetryUploader(null); Progress.setAdmin(false); render({ state: 'guest' }); }
  });
}

const isAdmin = user => !!user && (ADMINS || []).some(a => user.email === `${a.toLowerCase()}@${EMAIL_DOMAIN}`);
const nameOf = user => user.displayName || pendingName || (user.email || '').split('@')[0];

// ---------- 登入後：合併本機和雲端的進度 ----------
async function onLogin(user) {
  const name = nameOf(user);
  render({ state: 'user', name, sync: '同步中…' });
  const ref = S.doc(db, 'progress', user.uid);
  try {
    const snap = await S.getDoc(ref);
    const cloud = snap.exists() && Array.isArray(snap.data().cleared) ? snap.data().cleared : [];
    const merged = Progress.merge(cloud);             // 兩邊過的關卡都保留
    if (merged.length !== cloud.length || !snap.exists()) {
      await S.setDoc(ref, { username: name, cleared: merged, updatedAt: S.serverTimestamp() }, { merge: true });
    }
    // 之後每過一關就上傳
    Progress.setCloud(ids => S.setDoc(ref, { cleared: S.arrayUnion(...ids), updatedAt: S.serverTimestamp() }, { merge: true })
      .then(() => render({ state: 'user', name, sync: '進度已同步' }))
      .catch(() => render({ state: 'user', name, sync: '暫時無法同步，下次登入會補上' })));
    // 重新挑戰次數：每關累加（retries.關卡id），沒登入時累積的也會在這裡補上傳
    Progress.setRetryUploader(batch => S.setDoc(ref, {
      retries: Object.fromEntries(Object.entries(batch).map(([id, n]) => [id, S.increment(n)])),
      updatedAt: S.serverTimestamp()
    }, { merge: true }));
    render({ state: 'user', name, sync: '進度已同步' });
  } catch (e) {
    render({ state: 'user', name, sync: '暫時無法同步，下次登入會補上' });
  }
}

// ---------- 畫面 ----------
function render(s) {
  if (!bar) return;
  if (s.state === 'loading') bar.innerHTML = '<span class="sync">帳號載入中…</span>';
  else if (s.state === 'offline') bar.innerHTML = '<span class="sync">無法連線到帳號服務，進度先存在這台裝置</span>';
  else if (s.state === 'guest') {
    bar.innerHTML = `<div class="acct-guest">
        <div class="acct-actions">
          <button type="button" class="acct-btn" data-open="login">登入</button>
          <button type="button" class="acct-btn primary" data-open="signup">註冊</button>
        </div>
        <small class="acct-note">登入後進度會存到雲端，換裝置也能接著玩</small>
      </div>`;
    bar.querySelectorAll('[data-open]').forEach(b => b.onclick = () => openDialog(b.dataset.open));
  } else if (s.state === 'user') {
    const initial = (s.name || '?').charAt(0).toUpperCase();
    bar.innerHTML = `<div class="acct-user">
        <span class="acct-avatar" aria-hidden="true">${esc(initial)}</span>
        <span class="acct-who"><b>${esc(s.name)}</b><small class="${/無法|中/.test(s.sync || '') ? 'pending' : ''}">${esc(s.sync || '')}</small></span>
        ${isAdmin(currentUser) ? '<a class="acct-btn" href="stats.html">📊 統計</a>' : ''}
        <button type="button" class="acct-btn" id="logoutBtn">登出</button>
      </div>`;
    bar.querySelector('#logoutBtn').onclick = logout;
  }
}

// ---------- 登入／註冊視窗 ----------
let dialog = null, mode = 'login';
function buildDialog() {
  dialog = document.createElement('div');
  dialog.className = 'acct-dialog';
  dialog.hidden = true;
  dialog.innerHTML = `
    <form class="acct-box" id="acctForm" autocomplete="on" novalidate>
      <h2>溢彩畫帳號</h2>
      <div class="tabs" role="group" aria-label="登入或註冊">
        <button type="button" data-mode="login">登入</button>
        <button type="button" data-mode="signup">註冊</button>
      </div>
      <label for="acctName">帳號名稱</label>
      <input id="acctName" name="username" autocomplete="username" autocapitalize="off" spellcheck="false" maxlength="20" required>
      <div class="hint" data-show="signup">3～20 個字，只能用英文字母、數字和底線 _</div>
      <label for="acctPw">密碼</label>
      <input id="acctPw" name="password" type="password" required minlength="6">
      <div class="hint" data-show="signup">至少 6 個字。<b>帳號沒有綁 email，忘記密碼就找不回來</b>，請記好。</div>
      <div data-show="signup">
        <label for="acctPw2">再輸入一次密碼</label>
        <input id="acctPw2" type="password" autocomplete="new-password">
      </div>
      <div class="err" id="acctErr" role="alert"></div>
      <div class="row">
        <button type="button" class="acct-btn" id="acctCancel">取消</button>
        <button type="submit" class="acct-btn primary" id="acctOk">登入</button>
      </div>
    </form>`;
  document.body.appendChild(dialog);
  dialog.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => setMode(b.dataset.mode));
  dialog.querySelector('#acctCancel').onclick = closeDialog;
  dialog.addEventListener('click', e => { if (e.target === dialog) closeDialog(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && dialog && !dialog.hidden) closeDialog(); });
  dialog.querySelector('#acctForm').onsubmit = submit;
}
function setMode(m) {
  mode = m;
  dialog.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === m));
  dialog.querySelectorAll('[data-show]').forEach(el => el.hidden = el.dataset.show !== m);
  dialog.querySelector('#acctOk').textContent = m === 'login' ? '登入' : '註冊';
  dialog.querySelector('#acctPw').autocomplete = m === 'login' ? 'current-password' : 'new-password';
  dialog.querySelector('#acctErr').textContent = '';
}
function openDialog(m) {
  if (!dialog) buildDialog();
  setMode(m);
  dialog.hidden = false;
  dialog.querySelector('#acctName').focus();
}
function closeDialog() { if (dialog) dialog.hidden = true; }

const MESSAGES = {
  'auth/email-already-in-use': '這個帳號名稱已經有人用了，換一個試試。',
  'auth/invalid-credential': '帳號或密碼錯誤。',
  'auth/wrong-password': '帳號或密碼錯誤。',
  'auth/user-not-found': '帳號或密碼錯誤。',
  'auth/invalid-email': '帳號名稱格式不對：只能用英文字母、數字和底線 _。',
  'auth/weak-password': '密碼至少要 6 個字。',
  'auth/too-many-requests': '嘗試太多次了，請過幾分鐘再試。',
  'auth/network-request-failed': '網路連線失敗，請檢查網路後再試。',
  'auth/operation-not-allowed': '帳號功能還沒在 Firebase 開啟（Authentication → 電子郵件/密碼）。'
};

async function submit(e) {
  e.preventDefault();
  const err = dialog.querySelector('#acctErr'), ok = dialog.querySelector('#acctOk');
  const name = dialog.querySelector('#acctName').value.trim();
  const pw = dialog.querySelector('#acctPw').value;
  if (!NAME_RE.test(name)) { err.textContent = '帳號名稱要 3～20 個字，只能用英文字母、數字和底線 _。'; return; }
  if (pw.length < 6) { err.textContent = '密碼至少要 6 個字。'; return; }
  if (mode === 'signup' && pw !== dialog.querySelector('#acctPw2').value) { err.textContent = '兩次輸入的密碼不一樣。'; return; }
  const email = `${name.toLowerCase()}@${EMAIL_DOMAIN}`;
  err.textContent = '';
  ok.disabled = true;
  ok.textContent = mode === 'login' ? '登入中…' : '註冊中…';
  try {
    if (mode === 'signup') {
      pendingName = name;
      const cred = await F.createUserWithEmailAndPassword(auth, email, pw);
      try { await F.updateProfile(cred.user, { displayName: name }); } catch (e2) {}
    } else {
      await F.signInWithEmailAndPassword(auth, email, pw);
    }
    closeDialog();
    dialog.querySelector('#acctForm').reset();
  } catch (e3) {
    err.textContent = MESSAGES[e3 && e3.code] || '發生錯誤，請稍後再試。';
  } finally {
    ok.disabled = false;
    ok.textContent = mode === 'login' ? '登入' : '註冊';
  }
}

async function logout() {
  try { await F.signOut(auth); } catch (e) {}
  Progress.setCloud(null);
  Progress.setRetryUploader(null);
  Progress.reset();   // 清掉這台裝置上的進度，下一個人從第一關開始
}
