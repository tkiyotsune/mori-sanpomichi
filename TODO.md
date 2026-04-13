# 森の小人 - 公開までのTODO

## Phase 1: アカウント準備
- [ ] Expo アカウント作成（https://expo.dev）
- [ ] Apple Developer Program 登録（$99/年）
- [ ] Google AdMob アカウント作成（https://admob.google.com）

## Phase 2: 広告実装
- [ ] `react-native-google-mobile-ads` 導入
- [ ] AdMob でアプリ登録 → 広告ユニットID 取得
  - バナー広告（タイトル画面 / ゲームオーバー画面）
  - インタースティシャル広告（ゲームオーバー後、数回に1回）
- [ ] 広告コンポーネント作成・各画面に配置
- [ ] テスト広告で動作確認

## Phase 3: EAS Build 環境構築
- [ ] EAS CLI インストール（`npm install -g eas-cli`）
- [ ] `eas login`
- [ ] `eas build:configure` → `eas.json` 生成
- [ ] `expo-dev-client` 導入
- [ ] Development Build で実機テスト（広告含む）

## Phase 4: アプリ素材準備
- [ ] アプリアイコン作成（1024x1024px）
- [ ] スプラッシュ画像更新
- [ ] App Store スクリーンショット撮影
  - iPhone 6.7 インチ（1290x2796）
  - iPhone 6.5 インチ（1284x2778）
- [ ] アプリ説明文（日本語 / 英語）
- [ ] プライバシーポリシーページ作成（GitHub Pages 等）

## Phase 5: TestFlight
- [ ] `eas build --platform ios`（本番ビルド作成）
- [ ] `eas submit --platform ios`（App Store Connect へ提出）
- [ ] App Store Connect で TestFlight テスター招待
- [ ] テスト・フィードバック収集
- [ ] バグ修正・調整

## Phase 6: App Store 公開
- [ ] App Store Connect メタデータ入力
  - アプリ名 / 説明文 / キーワード
  - スクリーンショット
  - プライバシーポリシー URL
  - カテゴリ: Games > Casual
  - 年齢レーティング設定
- [ ] App Privacy 設定（AdMob データ収集の申告）
- [ ] 審査提出
- [ ] 審査通過 → 公開

## コスト
| 項目 | 金額 |
|---|---|
| Apple Developer Program | $99/年（約 ¥15,000） |
| AdMob | 無料 |
| EAS Build | 無料枠（月30ビルド） |

## 黒字ライン
2アプリ合算（thai + 森の小人）で DAU 15〜30人
