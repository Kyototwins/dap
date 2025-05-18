
// グローバルな Firebase 型定義
interface Window {
  firebase?: {
    app: any;
    messaging: () => any;
  };
}
