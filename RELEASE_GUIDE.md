# もりのさんぽみち — リリース手順書

> 最終更新: 2026-04-12

---

## 実装済み (コード確認済み)

- [x] Apple Developer Program 登録済み (Team: TOSHIAKI KIYOTSUNE)
- [x] EAS CLI インストール & ログイン済み
- [x] Expo アカウント作成済み / projectId 設定済み
- [x] Bundle ID: `com.kiyo.morisanpomichi`
- [x] ゲーム本体完成 (4キャラ・全障害物・多言語・ハイスコア)
- [x] AdMob バナー広告実装済み (タイトル・ゲームオーバー画面)
- [x] ATT (App Tracking Transparency) 実装済み
- [x] AdMob App ID を `app.json` に設定済み (`ca-app-pub-6637778639316730~9515140971`)
- [x] `eas.json` production プロファイル設定済み (`autoIncrement: true`)
- [x] `app.json` version: `1.0.0`
- [x] アイコン / スプラッシュ / Android アイコン一式 配置済み

---

## 残タスク一覧

### Step 1 — コード最終調整

- [ ] **`USE_PRODUCTION_ADS` を `true` に変更**
  - ファイル: `src/ads/ids.ts` の13行目
  - TestFlight 段階はまだ `false` のまま。**App Store 審査提出ビルドのみ `true` にする**
- [ ] インタースティシャル広告の実装 (任意 — 後回し可)
  - ゲームオーバー後に3回に1回表示
  - `src/ads/ids.ts` に `PROD_INTERSTITIAL_IOS` を追加
  - `GameOverScreen.tsx` または `App.tsx` で `InterstitialAd` を呼ぶ
- [ ] 実機で30分以上プレイしてクラッシュ確認
  - 全キャラ (小人/きつね/くま/しか) で動作確認
  - スコア500超で池障害物が出現するか
  - ハイスコアがアプリ再起動後も保持されるか
  - バックグラウンド→フォアグラウンド復帰時の挙動

---

### Step 2 — アセット準備

#### プライバシーポリシー (必須)
- [x] `docs/privacy-policy.html` 作成済み (日本語・英語対応)
- [ ] GitHub Pages で公開してURLを取得
  ```
  リポジトリ Settings → Pages → Branch: main / docs → Save
  ```
- [ ] 公開後のURLを App Store Connect に入力

#### スクリーンショット (App Store 審査に必須)
最低1枚、推奨5枚:
- [ ] iPhone 6.9" (1320×2868 または 2868×1320)
- [ ] iPhone 6.5" (1284×2778) — 推奨

撮影シーン案:
1. タイトル画面
2. ゲームプレイ中 (キャラが走る場面)
3. 橋を渡る場面
4. ゲームオーバー画面
5. キャラクター選択画面

#### アプリの説明文
- [ ] **アプリ名**: もりのさんぽみち (30文字以内)
- [ ] **サブタイトル**: 北欧の森を駆け抜けるカジュアルゲーム (30文字以内)
- [ ] **キーワード**: カジュアル, ランゲーム, 森, かわいい, 北欧, キャラ (100文字以内)
- [ ] **説明文** (4000文字以内): 日本語版 + 英語版の両方

---

### Step 3 — Apple Developer Portal 設定

- [ ] https://developer.apple.com → Certificates, Identifiers & Profiles
- [ ] Identifiers → App IDs → 新規作成
  - Bundle ID: `com.kiyo.morisanpomichi`
  - 名前: `Mori Sanpomichi`
  - Capabilities: ゲームのみなので基本不要

---

### Step 4 — App Store Connect 設定

#### アプリ新規作成
- [ ] https://appstoreconnect.apple.com → マイApp → + → 新規App
  - プラットフォーム: iOS
  - 名前: もりのさんぽみち
  - プライマリ言語: 日本語
  - Bundle ID: `com.kiyo.morisanpomichi`
  - SKU: `morisanpomichi-001`

#### App情報
- [ ] カテゴリ: **ゲーム > カジュアル**
- [ ] 副カテゴリ: アクション または アドベンチャー
- [ ] 年齢制限: 4+
- [ ] 著作権: `© 2026 Toshiaki Kiyotsune`
- [ ] プライバシーポリシーURL: (Step 2 で取得したもの)

#### App Privacy (重要)
AdMob を使うため以下を申告:
- [ ] **識別子** (デバイスID) — 広告用
- [ ] **使用状況データ** — 分析用
- [ ] **データは追跡に使用される**: Yes

#### 価格と配信
- [ ] 価格: 無料
- [ ] 配信国: 日本 + 英語圏 (US, UK, CA, AU, NZ)

---

### Step 5 — TestFlight ビルド & テスト

```bash
# ビルド作成 (15〜30分)
eas build --platform ios --profile production

# App Store Connect にアップロード
eas submit --platform ios --latest
```

- [ ] ビルド完了を待つ
- [ ] App Store Connect → TestFlight → 処理完了まで待つ (10〜30分)
- [ ] 輸出コンプライアンス: **暗号化なし** を選択
- [ ] 内部テスターに自分を追加
- [ ] TestFlight アプリから実機でダウンロード・全機能確認
- [ ] バナー広告がテスト広告として表示されるか確認
- [ ] クラッシュなし確認

---

### Step 6 — 審査提出

#### 審査前チェック
- [ ] スクリーンショットをアップロード済み
- [ ] 説明文・キーワード入力済み
- [ ] プライバシーポリシーURL有効
- [ ] 年齢制限アンケート完了
- [ ] App Privacy 完了
- [ ] ビルドをバージョン 1.0.0 に紐付け

#### 審査の質問への回答
- **輸出コンプライアンス**: 暗号化を使用しない → Yes
- **広告ID (IDFA)**: 使用する → Yes (AdMob用)
- **ログイン機能**: なし

#### 提出
- [ ] 「審査へ提出」
- [ ] リリース方法: **手動リリース** (承認後に自分でタイミングを選ぶ)

---

### Step 7 — 審査 (待機) & リリース

- 通常 1〜3日で結果
- 承認後 → 手動リリース → App Store 掲載まで最大24時間

#### よくある却下理由と対策
| 理由 | 対策 |
|---|---|
| プライバシーポリシー不備 | 内容を充実させる |
| スクリーンショットが実機と異なる | 実機で撮影し直す |
| 広告の表示が過剰 | バナーのみに抑える |
| クラッシュ | TestFlight で十分確認する |

#### リリース後
- [ ] App Store URL を SNS や友人に共有
- [ ] AdMob の収益確認 (翌日以降から反映)
- [ ] クラッシュレポート確認 (App Store Connect → Analytics)

---

## コードの重要な切り替えポイント

### `src/ads/ids.ts` — 本番広告の有効化

```ts
// TestFlight 中は false のまま
// App Store 審査提出ビルドのみ true にする
const USE_PRODUCTION_ADS = false; // ← ここを true に変える
```

**注意**: 本番 ID は App Store 公開後に AdMob が承認してから広告が配信される。
TestFlight 段階でテスト ID のままにしておいても審査には問題ない。

---

## 費用まとめ

| 項目 | 費用 |
|---|---|
| Apple Developer Program | $99/年 (支払い済み) |
| AdMob | 無料 |
| EAS Build | 無料枠内 (月30ビルド) |
| プライバシーポリシーホスティング | 無料 (GitHub Pages) |
| 追加コスト | **$0** |

---

## 参考リンク

- Expo Application Services: https://expo.dev/eas
- App Store Connect: https://appstoreconnect.apple.com
- AdMob: https://admob.google.com
- Apple Developer: https://developer.apple.com
- iOS App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
