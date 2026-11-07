// ===== Firebase 設定碼 =====
// 來自 Firebase 主控台：專案設定 → 你的應用程式 → 網頁應用程式。
// 這段設定碼不是密碼，放在網頁裡是正常的；資料的保護靠 Firestore 的「規則」。
// 改成 null 可以關掉帳號功能（遊戲照樣能玩，進度只存在這台裝置）。
export const firebaseConfig = {
  apiKey: 'AIzaSyB_vE26l-QIPKyKtk9OWT01UPez-izXSxE',
  authDomain: 'paint-5a9bc.firebaseapp.com',
  projectId: 'paint-5a9bc',
  storageBucket: 'paint-5a9bc.firebasestorage.app',
  messagingSenderId: '852566235063',
  appId: '1:852566235063:web:204b5c568d7a63afa0fa32'
};

// 管理員帳號名稱（小寫）：登入這些帳號會在選關頁看到「統計」按鈕，可以看所有玩家的通關和重開次數。
// ⚠️ 真正擋住其他人看資料的是 Firebase 的「規則」，這裡改了之後規則也要一起改。
export const ADMINS = ['aaaaaa'];
