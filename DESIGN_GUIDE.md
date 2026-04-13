# 森の小人 — デザイン改善ガイド

## 1. 現状の課題整理

### 統一感の欠如
- キャラクターは strokeWidth 0.8 の細い線だが、障害物は 1.6 の太い線 → テイストが混在
- キャラの outline は `#4A4A4A` だが、同じ色でも線の太さが倍違うと別世界に見える
- 背景は View ベースの平面的な色面、木は PNG 画像、障害物は SVG → 3つの技法が混在

### キャラクターの課題
- 頭身比が極端すぎる（頭65%）→ 絵本というよりLINEスタンプ寄り
- 目が大きく、頬チークが主張しすぎ → 幼児向けに見える
- 足元に接地感がない → 浮いて見える

### 配色の課題
- 草原 `#A8D8A0` がやや蛍光寄りで安っぽい
- 花の色 `#F0D868`(黄)、`#E8A0B0`(ピンク) の彩度が高すぎて北欧感から外れる
- 障害物の outline `#4A4A4A` が強すぎて「塗り絵」感がある

### UI の課題
- ボタンの白枠 3px が太くて野暮ったい
- テキスト影 `textShadowRadius: 8` が強すぎる
- スコア表示の黒影 `#00000040` が重い

---

## 2. アートディレクション方針

### コンセプトキーワード
**「北欧の森の絵本を開いたような、静かで温かい世界」**

- 素朴 — 手の込んだ装飾ではなく、シンプルな形と色で語る
- やさしい — 角がなく、丸みと余白がある
- 静か — 情報量を抑え、視線が落ち着く
- 少し上品 — muted pastel で統一し、原色を避ける

### 参考イメージ
- Tove Jansson のムーミン挿絵（水彩の柔らかさ）
- iittala / marimekko の配色（くすんだ北欧カラー）
- 「しろくまちゃんのほっとけーき」のような絵本の親しみやすさ

---

## 3. デザインルール定義

### 3-1. 輪郭線ルール
```
色:        #5A5A5A (現状 #4A4A4A より少し明るく、柔らかく)
太さ:      1.0px に統一（キャラも障害物もすべて）
linecap:   round
linejoin:  round
```
**NG:** 真っ黒 `#000000`、太さのバラつき（0.8と1.6の混在）

### 3-2. 塗りルール
```
ベース:    フラットな1色塗り
影:        ベース色の彩度を少し落とし、明度を10%下げた色を1段だけ
ハイライト: ベース色の明度を10%上げた色を小さく入れる
テカリ:    なし（白いハイライト円は削除）
```

### 3-3. 影ルール
```
接地影:    楕円形、色は #00000008〜#0000000C（非常に薄い）
UI影:      offset (0, 2), blur 4, opacity 0.1
テキスト影: offset (1, 1), blur 3, color は背景に近い暗色
```

### 3-4. 角丸ルール
```
すべての形状は丸みを帯びる
岩、きのこ、切り株 → 角がない有機的な形
UIボタン → borderRadius 12〜20（大きすぎない）
```

---

## 4. 配色ルール（Muted Pastel Nordic）

### 背景
| 要素 | 現状 | 改善後 | 理由 |
|---|---|---|---|
| 草原 | #A8D8A0 | #B8CCAA | 彩度を落とし、オリーブ寄りに |
| 道 | #D0C8B0 | #D4CCB8 | やや温かみを足す |
| 空/水 | #B8D8E8 | #C0D4DC | くすませて絵本風に |
| 川 | #7BB8D0 | #8BBCC8 | 彩度を落とす |

### キャラクター
| 要素 | 現状 | 改善後 |
|---|---|---|
| 帽子赤 | #E05050 | #CC6055 (くすんだ赤) |
| マント青 | #6898B8 | #7A9CAE (グレイッシュブルー) |
| 肌 | #FFE0C0 | #F0D8C0 (少し落ち着かせる) |
| 頬 | #F0A0A0 | 削除またはごく薄く |
| きつねオレンジ | #F5A040 | #D8A060 (トーンダウン) |

### 障害物
| 要素 | 現状 | 改善後 |
|---|---|---|
| 岩 | #C8C8C8 | #B8B8B0 (少し温かみ) |
| きのこ | #F0A050 | #D8A068 (くすませる) |
| 切り株 | #F5F0E8 | #E8E0D4 (少し暗く) |
| 苔 | #8BC48B | #90B888 (オリーブ寄り) |

### UI
| 要素 | 現状 | 改善後 |
|---|---|---|
| ボタン青 | #6898B8 | #7A9CAE |
| ボタン枠 | #FFFFFF 3px | #FFFFFF80 1.5px |
| outline | #4A4A4A | #5A5A5A |
| テキスト影 | #5080A0 blur 8 | #5A5A5A30 blur 3 |
| スコア影 | #00000040 | #00000020 |
| 花(黄) | #F0D868 | #D8C878 |
| 花(ピンク) | #E8A0B0 | #CCAAB0 |
| 花(青) | #88A8D0 | #98ACC0 |

### 全体の輪郭線
| 現状 | 改善後 |
|---|---|
| #4A4A4A | #5A5A5A |

---

## 5. キャラクター改善案

### 頭身比の調整
```
現状:  頭 65% / 体 25% / 足 10%
改善:  頭 55% / 体 32% / 足 13%
```
- 頭の Circle を r=10→r=9 程度に（10-15%縮小）
- 体を y方向に 3-4px 伸ばす
- 足を少し大きくして接地感を出す

### 顔パーツ
- 目を現状の r=2.5 相当 → r=2.0 に縮小
- 目の位置をやや中央寄りに
- 頬チークは opacity 0.45 → 0.2 に弱めるか削除
- 鼻は現状維持（小さくてよい）
- 口の線をやや短く

### 足元の影
- キャラの足元に `Ellipse rx=8 ry=3 fill="#0000000A"` を追加

### きつねの尻尾
- 現状は小さく目立たない → サイズを 1.5倍に
- ふわっとした形にして特徴として活かす

---

## 6. 障害物改善案

### 共通
- stroke を 1.6 → **1.0** に統一（キャラと揃える）
- 白いハイライト stroke（岩の `#FFFFFF 2.5px`）→ 削除
- 影を `#00000015` → `#0000000A` に弱める
- 輪郭色を `#4A4A4A` → `#5A5A5A` に

### 岩
- もう少し丸みを持たせる
- リンゴンベリーは維持（色はくすませる `#C87070`）

### きのこ
- キャップの色をくすませる（#D8A068）
- 斑点模様の色差を弱める

### 切り株
- 樹皮模様を少し減らす（4本→3本）
- ブルーベリーの色をくすませる（#8090B0）

### 池
- 水の色をくすませる（#90BCC0）
- 睡蓮の花の色を抑える

---

## 7. 背景改善案

### レイヤー構成（パララックス風）
```
Layer 0 (最奥):  薄い霞の色面 — 上部 20% に #D8DCD0 (薄い霞)
Layer 1 (遠景):  薄い木のシルエット — opacity 0.15, スクロール速度 0.3x
Layer 2 (中景):  現在の木 — opacity 1.0, スクロール速度 1.0x
Layer 3 (道):    現在の道 + テクスチャ
Layer 4 (前景):  ごく小さな草の葉が画面端に — opacity 0.3, スクロール速度 1.5x
```

### 道のテクスチャ
- 横線の数は維持（50本）
- opacity を 0.45 → 0.3 に下げて主張を弱める
- 色をより自然な土色に寄せる

### 花
- サイズを現状の 3-7px → 2-5px に縮小
- opacity を 0.65 → 0.4 に下げる
- 「見えるけど主張しない」程度に

---

## 8. UI改善案

### ボタン
```
現状:                    改善後:
背景 #6898B8             背景 #7A9CAE
枠 #FFFFFF 3px           枠 #FFFFFF80 1.5px
角丸 30px                角丸 16px
影なし or 強い影          影 (0,2) blur 4 opacity 0.1
```

### テキスト
```
タイトル影: blur 8, #5080A0  → blur 3, #5A5A5A30
スコア影:  blur 4, #00000040 → blur 2, #00000020
文字間:    letterSpacing 6   → letterSpacing 3 (詰める)
```

### ゲームオーバー画面
- オーバーレイ `#00000066` → `#00000044` (少し明るく)
- スコアカード背景 `#FFFFFF30` → `#FFFFFF20`
- 枠 `#FFFFFF44` → `#FFFFFF30`

### キャラ選択画面
- カード背景 `#FFFFFF50` → `#FFFFFF30`
- カード枠 3px → 1.5px
- 選択状態の枠色を `#6898B8` → `#7A9CAE`

---

## 9. 演出改善案（実装優先度順）

### 高優先度
1. **キャラ足元の接地影** — 楕円、非常に薄い
2. **障害物の接地影の統一** — 全て同じ薄さに
3. **ボタンタップの軽い縮小** — 既存だが scale 0.95 → 0.97 に抑える

### 中優先度
4. **遠景レイヤー追加** — 薄い木のシルエットが遅くスクロール
5. **スコア更新時の軽いバウンス** — 値が変わったら scale 1.0→1.1→1.0

### 低優先度
6. **ジャンプの squash & stretch** — バウンス頂点で横に少し広がる
7. **着地の沈み込み** — 着地瞬間にキャラが少し縮む
8. **キャラ選択のふわっと演出** — 選択時に scale 0→1 のバウンス

---

## 10. 実装TODO（優先度順）

### Phase 1: 配色統一（最もインパクトが大きい）
- [ ] colors.ts を新配色に更新
- [ ] outline を #5A5A5A に変更
- [ ] 花・装飾の彩度を落とす

### Phase 2: 線の統一
- [ ] 全障害物の strokeWidth を 1.0 に統一
- [ ] 白いハイライト stroke を削除
- [ ] キャラの strokeWidth も 1.0 に合わせる

### Phase 3: キャラリデザイン
- [ ] 頭身比を 55/32/13 に調整
- [ ] 目を縮小、頬を弱める
- [ ] 足元の接地影を追加
- [ ] きつねの尻尾を拡大

### Phase 4: UI洗練
- [ ] ボタン枠を細く、角丸を小さく
- [ ] テキスト影を弱める
- [ ] letterSpacing を詰める
- [ ] ゲームオーバーのオーバーレイを明るく

### Phase 5: 背景奥行き
- [ ] 遠景レイヤー追加（パララックス）
- [ ] 花のサイズと透明度を下げる
- [ ] 道のテクスチャ透明度を下げる

### Phase 6: 演出
- [ ] スコアバウンス
- [ ] squash & stretch

---

## 11. アセット制作向けプロンプト

### 画像生成AI（Midjourney / DALL-E）向け

**キャラクター:**
```
A small forest gnome character for a children's storybook game, 
Nordic/Scandinavian illustration style, soft muted pastel colors, 
wearing a red pointed cap and blue cloak, simple round face 
with minimal features, short stubby limbs, standing on a forest path. 
Gentle watercolor-like rendering, no harsh outlines, warm and cozy 
atmosphere. White background, character sheet style, multiple angles.
Style: Tove Jansson meets modern children's book illustration.
```

**背景の木:**
```
A simple deciduous tree for a Nordic children's storybook game, 
soft olive-green leaves, warm brown trunk, gentle muted pastel colors, 
no harsh black outlines, slightly rounded and organic shapes, 
watercolor-like texture, transparent background, game asset style.
```

**障害物（岩）:**
```
A small mossy rock for a children's storybook game, 
Nordic forest setting, soft grey-warm tones, tiny red berries growing 
on moss, muted pastel colors, no harsh outlines, rounded organic shape, 
gentle shadows, transparent background.
```

### イラストレーター向けブリーフ
```
テイスト: 北欧絵本風、ムーミンの挿絵のような柔らかさ
色:      muted pastel（くすんだパステル）、原色禁止
線:      濃いグレー (#5A5A5A) で細め (1px)、黒は使わない
形:      有機的で丸みのある形、シャープな角はなし
質感:    フラット塗り + 最小限の影、テカリなし
雰囲気:  静か、温かい、素朴、少し上品
```
