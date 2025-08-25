# P-05画面（診断結果表示・サービス導線ページ）開発仕様書

## 1. 概要

### 1.1 ページID
- P-05

### 1.2 目的
診断結果をスコアに基づいたレベルで提示し、ユーザーの現状認識を促す。同時に、具体的な解決策として特定サービス（Haru Automation）を提示し、問い合わせへと繋げる。

### 1.3 変更概要
既存の複雑な診断結果表示（複数サービス紹介等）から、レーダーチャートを残しつつシンプルな診断結果レベル表示とHaru Automation単独のサービス紹介に特化した構成に変更。

## 2. 現状分析

### 2.1 既存実装（result.html）の構成
- **ファイルパス**: `/result.html`
- **現在の主要要素**:
  - DX活用度レーダーチャート（Chart.js使用）
  - 各領域のスコアカード表示
  - 企業分析セクション（フレームワーク説明）
  - DXスコア表示（100点満点）
  - 4つのサービスオファリング紹介

### 2.2 削除対象要素
1. ~~レーダーチャートセクション（`.result-chart-section`）~~ **※維持**
2. スコアカードセクション（`.score-details`）
3. 企業分析セクション（`.analysis-section`）
4. 総合スコアセクション（`.total-score-section`）
5. 複数オファリングセクション（`.offerings-section`）

## 3. 新規実装仕様

### 3.1 画面構成

```
┌─────────────────────────────────────┐
│         ヘッダー                      │
├─────────────────────────────────────┤
│    診断結果レベル表示エリア            │
│    ├ サマリー文                      │
│    ├ レーダーチャート                │
│    └ レベル詳細解説                  │
├─────────────────────────────────────┤
│  Haru Automationサービス紹介エリア    │
│    ├ サービス概要文                  │
│    ├ サービス詳細を見るボタン        │
│    └ お問い合わせボタン              │
├─────────────────────────────────────┤
│    ナビゲーションエリア               │
│    └ 診断をやり直すボタン            │
├─────────────────────────────────────┤
│         フッター                      │
└─────────────────────────────────────┘
```

### 3.2 診断結果レベル表示エリア

#### 3.2.1 サマリー文フォーマット
```
貴社のAI活用スコアは「XXX」、業務改善ポテンシャルは「YYY」となります。
```
- XXX: ユーザーの合計スコア（数値）
- YYY: スコアに応じたレベル名

#### 3.2.2 レーダーチャート表示
- **Chart.js**を使用した既存のレーダーチャート実装を維持
- カテゴリ別スコアの可視化
- 各カテゴリ（経営、人事、マーケティング、営業、IT等）のスコアを表示
- レスポンシブ対応（canvas要素のサイズ調整）

#### 3.2.3 レベル判定基準
| レベル | レベル名 | スコア範囲 |
|--------|----------|------------|
| レベル1 | 業務改善 黎明期 | 0～11点 |
| レベル2 | 業務改善 試行期 | 12～23点 |
| レベル3 | 業務改善 展開期 | 24～32点 |
| レベル4 | 業務改善 先進期 | 33～36点 |

#### 3.2.4 レベル別解説文

**レベル1：業務改善 黎明期**
```
AIやITツールの活用はまだ本格的に始まっていない、もしくは検討段階にあります。
情報収集やツールの知識、具体的な活用アイデアが全体的に不足しており、
個人の関心や努力に依存している状態です。見方を変えれば、これから大きく成長できる
非常に高いポテンシャルを秘めていると言えます。

まずは経営層を含め、AIやITツールがもたらす業務改善の可能性について
共通認識を持つことが第一歩です。他社の成功事例を学ぶ、小規模なセミナーに
参加するなど、情報収集から始めましょう。そして、特定の非効率な業務を一つ選び、
ツールの試験的な導入を検討することをお勧めします。
```

**レベル2：業務改善 試行期**
```
AIやITツールへの関心は高く、一部の部署や意欲的な個人によって
ツールの導入や活用が始まっています。しかし、その取り組みはまだ限定的・散発的であり、
全社的な動きには至っていません。小さな成功体験と、うまくいかなかった経験が
混在している段階です。

個別の成功事例を社内で共有し、横展開する仕組みを作りましょう。
業務改善やDXを推進する担当者を正式に任命し、より体系的な情報収集や
スキルアップの機会（研修など）を提供することが有効です。
外部の専門家の知見も活用し、具体的な業務改善計画の策定に着手するのに
最適なタイミングです。
```

**レベル3：業務改善 展開期**
```
複数の部署でAIやITツールの活用が定着し、業務改善の成功事例も増えています。
DX推進の担当者やチームが存在し、組織的な取り組みとして活動が進んでいます。
一方で、部署ごとに導入したツールが異なったり、部分的な最適化に留まっていたりと、
全社的な戦略や連携にはまだ改善の余地がある状態です。

部署ごとに最適化されている業務プロセスやツールを見直し、
全社的な視点での標準化やデータ連携を推進する必要があります。
専門部署が主導して全社的なDX戦略を策定・実行することで、
より大きな成果が期待できます。外部サービスを活用し、
高度なツール連携や業務自動化を実現するのも効果的です。
```

**レベル4：業務改善 先進期**
```
経営層の強いコミットメントのもと、全社的にAIやITツールが活用され、
業務改善が文化として根付いています。データに基づいた意思決定が浸透し、
継続的な改善サイクルが確立されています。市場の変化にも迅速に対応できる、
非常に競争力の高い組織状態です。

これまでの成功を継続しつつ、AIが自律的に業務を行う「AIエージェント」や、
自社の業務に特化したAIモデルの開発（ファインチューニング）など、
より先進的な技術の導入を検討しましょう。業界のリーダーとして、
AIを活用した新たなビジネスモデルの創出や、サプライチェーン全体の変革を
主導していくことが期待されます。
```

### 3.3 Haru Automationサービス紹介エリア

#### 3.3.1 レイアウト変更仕様（2025-08-25更新）
**目的**: HaruAutomation_UI.pngの参考デザインに基づく2カラムレイアウトの実装

**新レイアウト構成**:
```
┌─────────────────────────────────────────────────────────┐
│                Haru Automationのご紹介                   │
├─────────────────────────────────────────────────────────┤
│ 左カラム（テキストエリア）    │ 右カラム（画像エリア）        │
│                              │                          │
│ 生成AIとあらゆるツールを      │  [アイキャッチ画像]         │
│ 連携させ、"即成果が出る"      │  (1200x630px)              │
│ 自動化を実現                 │                          │
│                              │                          │
│ Haru Automationは...         │                          │
│ [詳細テキスト内容]           │                          │
│                              │                          │
│ ┌─────────────────────┐     │                          │
│ │サービス紹介を見る│ │お問い│     │                          │
│ └─────────────────────┘     │                          │
└─────────────────────────────────────────────────────────┘
```

**デザイン要件**:
- **レイアウト**: 2カラム（デスクトップ）、1カラム（モバイル）
- **左カラム**: テキストコンテンツ（既存テキストを維持）
- **右カラム**: アイキャッチ画像（Haru Automation LP (1200 x 630 px).png）
- **背景色**: rgba(183, 199, 255, 0.2) - 変更なし
- **フォントサイズ・色**: 既存設定を維持
- **画像配置**: 右側、レスポンシブ対応

#### 3.3.2 技術実装要件

**HTML構造**:
```html
<div class="service-introduction">
    <h3 class="service-title">Haru Automation のご紹介</h3>
    <div class="service-content-wrapper">
        <div class="service-text-column">
            <div class="service-description">
                <!-- 既存テキストコンテンツ -->
            </div>
            <div class="service-cta-buttons">
                <!-- 既存ボタン -->
            </div>
        </div>
        <div class="service-image-column">
            <img src="assets/Haru Automation LP (1200 x 630 px).png" 
                 alt="Haru Automation サービス概要図" 
                 class="service-hero-image">
        </div>
    </div>
</div>
```

**CSS実装要件**:
```css
.service-content-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 40px;
}

.service-text-column {
    flex: 1;
}

.service-image-column {
    flex: 0 0 400px; /* 固定幅 */
}

.service-hero-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* モバイル対応 */
@media (max-width: 768px) {
    .service-content-wrapper {
        flex-direction: column;
    }
    
    .service-image-column {
        flex: none;
        width: 100%;
    }
}
```

#### 3.3.3 画像配信方法（本番環境）

**Option 1: GitHub Pages直接配信**
- **パス**: `/assets/Haru Automation LP (1200 x 630 px).png`
- **メリット**: 設定不要、即座に利用可能
- **デメリット**: ファイル名にスペースが含まれるためURL encode必要

**Option 2: リネーム後配信（推奨）**
- **新ファイル名**: `haru-automation-hero.png`
- **パス**: `/assets/haru-automation-hero.png`
- **メリット**: URL が簡潔、トラブル回避
- **デメリット**: ファイル名変更作業が必要

**Option 3: CDN配信**
- **配信先**: Cloudflare, AWS CloudFront等
- **メリット**: 高速配信、キャッシュ最適化
- **デメリット**: 設定・運用コスト

**推奨実装**: Option 2（リネーム後配信）

#### 3.3.4 サービス概要文（静的コンテンツ）- 変更なし
```
生成AIとあらゆるツールを連携させ、"即成果が出る"自動化を実現します。

Haru Automationは、ChatGPTやGeminiなどの生成AIと、
ZapierやDify、PowerAutomateといった各種効率化ツールを最適に組み合わせ、
お客様専用の業務改善フローを構築します。
AI単体では実現できなかった、複雑な業務の自動化や品質向上まで、
一気通貫でご支援。「面倒」をなくし、企業のコア業務に集中できる環境を創り出します。

高額な初期投資は不要です。まずは29,800円の「お試しプラン」で、
業務の一つを自動化することによるインパクトを体感してください。
効果にご納得いただけた上で、本格的なご支援へとステップアップが可能です。
導入後の運用も「丸投げOK」のサポート体制で、安心してご利用いただけます。
```

#### 3.3.3 CTAボタン
1. **サービス詳細を見るボタン**
   - スタイル: プライマリボタン
   - 色: var(--color-primary)
   - アクション: 外部リンクまたはモーダル表示

2. **お問い合わせボタン**
   - スタイル: セカンダリボタン
   - 色: var(--color-secondary)
   - アクション: お問い合わせフォームへ遷移

### 3.4 ナビゲーションエリア

#### 3.4.1 診断をやり直すボタン
- **アクション**: P-01（index.html）へ遷移
- **処理**: ローカルストレージのクリア
- **確認ダイアログ**: 実装必須

## 4. 技術実装仕様

### 4.1 JavaScript処理フロー

```javascript
// 1. ページ読み込み時
document.addEventListener('DOMContentLoaded', async () => {
    // 1.1 診断データの確認
    const assessmentAnswers = Common.storage.get('assessmentAnswers');
    const userData = Common.storage.get('userData');
    
    // 1.2 データ検証
    if (!assessmentAnswers || !userData) {
        // エラー処理：トップページへリダイレクト
    }
    
    // 1.3 スコア計算（GAS連携またはローカル）
    const totalScore = await calculateTotalScore(assessmentAnswers);
    
    // 1.4 レベル判定
    const level = determineLevel(totalScore);
    
    // 1.5 表示更新
    updateDisplay(totalScore, level);
});

// 2. レベル判定関数
function determineLevel(score) {
    if (score <= 11) return 1;
    if (score <= 23) return 2;
    if (score <= 32) return 3;
    return 4;
}
```

### 4.2 データ連携

#### 4.2.1 入力データ
- **assessmentAnswers**: 診断回答データ（ローカルストレージ）
- **userData**: ユーザー情報（ローカルストレージ）

#### 4.2.2 バックエンド連携
- **エンドポイント**: GAS API (`/getResult`)
- **レスポンス形式**:
```json
{
    "total_score": 25,
    "maturity_level": 3,
    "level_name": "業務改善 展開期",
    "level_description": "レベル3の詳細説明文..."
}
```

#### 4.2.3 エラーハンドリング
- API接続失敗時：ローカル計算にフォールバック
- データ不整合時：エラーメッセージ表示後、トップページへ

### 4.3 CSS実装要件

```css
/* 診断結果レベル表示エリア */
.result-level-section {
    padding: 40px 0;
    background: var(--color-base);
}

.result-summary {
    font-size: var(--font-size-h2);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
    margin-bottom: 20px;
}

/* レーダーチャート（既存実装を維持） */
.result-chart-section {
    margin: 30px 0;
}

.chart-container {
    max-width: 500px;
    margin: 0 auto;
}

.chart-wrapper {
    position: relative;
    height: 400px;
}

.level-description {
    font-size: var(--font-size-body);
    line-height: 1.8;
    color: var(--color-text-sub);
    margin-top: 30px;
}

/* Haru Automationサービス紹介エリア */
.service-introduction {
    background: rgba(183, 199, 255, 0.2);
    padding: 40px;
    border-radius: var(--border-radius-medium);
    margin: 40px 0;
}

.service-title {
    font-size: var(--font-size-h2);
    color: var(--color-header);
    margin-bottom: 20px;
}

.service-description {
    font-size: var(--font-size-body);
    line-height: 1.8;
    margin-bottom: 30px;
}

.service-cta-buttons {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

/* レスポンシブ対応 */
@media (max-width: 767px) {
    .service-introduction {
        padding: 20px;
    }
    
    .service-cta-buttons {
        flex-direction: column;
    }
    
    .service-cta-buttons .btn {
        width: 100%;
    }
}
```

## 5. 開発ステップ（詳細分割版）

### 分割開発のメリット
- エラーの早期発見と修正
- 各ステップでの動作確認
- リスクの最小化
- デバッグの容易性

### Phase A: Haru Automationセクション レイアウト変更（2025-08-25追加）

#### Step A1: 画像ファイルのリネームと最適化（15分）
**目的**: 本番環境での画像配信準備

**作業内容**:
- [ ] `Haru Automation LP (1200 x 630 px).png` を `haru-automation-hero.png` にリネーム
- [ ] 画像ファイルサイズの最適化（必要に応じて）
- [ ] assetsディレクトリ内での整理

**確認項目**:
- [ ] リネーム後のファイルが正常に存在する
- [ ] 画像が破損していない
- [ ] ファイルサイズが適切（推奨: 500KB以下）

**リスク**: ファイル破損、参照エラー
**対策**: バックアップを取得してからリネーム作業

#### Step A2: HTMLの2カラム構造追加（30分）
**目的**: サービス紹介エリアに2カラムレイアウト構造を追加

**作業内容**:
- [ ] 既存の `.service-introduction` 内をラップする構造を追加
- [ ] 左カラム（テキスト）と右カラム（画像）の分離
- [ ] 画像要素の追加

**修正対象**: `result.html` の Haru Automation セクション

**追加するHTML構造**:
```html
<!-- 既存の service-introduction div内を以下に変更 -->
<div class="service-content-wrapper">
    <div class="service-text-column">
        <!-- 既存の service-description と service-cta-buttons を移動 -->
    </div>
    <div class="service-image-column">
        <img src="assets/haru-automation-hero.png" 
             alt="Haru Automation サービス概要図" 
             class="service-hero-image">
    </div>
</div>
```

**確認項目**:
- [ ] HTML構造が正しく追加される
- [ ] 既存のテキストとボタンが左カラムに配置される
- [ ] 画像が右カラムに表示される
- [ ] HTMLバリデーションエラーがない

#### Step A3: 2カラムレイアウトのCSS実装（45分）
**目的**: デスクトップ向け2カラムレイアウトの実装

**作業内容**:
- [ ] `.service-content-wrapper` のFlexboxレイアウト実装
- [ ] 左右カラムの幅調整
- [ ] 画像のスタイリング（border-radius, shadow等）
- [ ] 既存スタイルとの整合性確認

**追加するCSS**:
```css
.service-content-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 40px;
    margin-top: 20px;
}

.service-text-column {
    flex: 1;
    min-width: 0; /* Flexbox shrinking対策 */
}

.service-image-column {
    flex: 0 0 400px; /* 400px固定幅 */
}

.service-hero-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.service-hero-image:hover {
    transform: scale(1.02);
}
```

**確認項目**:
- [ ] デスクトップで2カラムレイアウトが正常表示される
- [ ] 画像とテキストの配置バランスが適切
- [ ] 既存の背景色・フォント設定が維持される
- [ ] ホバーエフェクトが動作する

#### Step A4: モバイルレスポンシブ対応（30分）
**目的**: モバイル環境での1カラムレイアウト実装

**作業内容**:
- [ ] モバイル用メディアクエリの追加
- [ ] 1カラムレイアウトへの変更処理
- [ ] 画像サイズの最適化
- [ ] タッチデバイス対応

**追加するCSS**:
```css
@media (max-width: 768px) {
    .service-content-wrapper {
        flex-direction: column;
        gap: 20px;
    }
    
    .service-image-column {
        flex: none;
        width: 100%;
        order: -1; /* 画像を上部に配置 */
    }
    
    .service-hero-image {
        max-width: 100%;
        height: auto;
    }
}

@media (max-width: 480px) {
    .service-content-wrapper {
        gap: 15px;
    }
    
    .service-hero-image {
        border-radius: 6px;
    }
}
```

**確認項目**:
- [ ] モバイルで1カラム表示される
- [ ] 画像がテキストの上部に配置される
- [ ] 画像サイズが適切に調整される
- [ ] タッチ操作が問題ない

#### Step A5: 画像読み込み最適化とエラーハンドリング（20分）
**目的**: 画像読み込み失敗時の対応とパフォーマンス最適化

**作業内容**:
- [ ] 画像のloading="lazy"属性追加
- [ ] 画像読み込み失敗時のフォールバック処理
- [ ] alt属性の適切な設定
- [ ] 画像圧縮の確認

**修正するHTML**:
```html
<img src="assets/haru-automation-hero.png" 
     alt="Haru Automation サービス概要図 - 各種ツールの自動化連携を示すフロー図" 
     class="service-hero-image"
     loading="lazy"
     onerror="this.style.display='none'">
```

**追加するCSS**:
```css
.service-hero-image {
    /* 既存スタイル */
    object-fit: cover;
    background-color: #f8f9fa; /* 読み込み中の背景色 */
}
```

**確認項目**:
- [ ] 画像の遅延読み込みが動作する
- [ ] 画像読み込み失敗時に適切に非表示になる
- [ ] alt属性が適切に設定されている
- [ ] パフォーマンスが向上している

#### Step A6: 統合テストと微調整（30分）
**目的**: 全レイアウト変更の統合確認と品質保証

**作業内容**:
- [ ] デスクトップ・タブレット・モバイルでの表示確認
- [ ] 既存機能への影響確認
- [ ] ページ読み込み速度の確認
- [ ] アクセシビリティの確認

**テストケース**:
- [ ] Desktop (1920px): 2カラムレイアウト表示
- [ ] Tablet (768px): レスポンシブ変化の確認  
- [ ] Mobile (375px): 1カラムレイアウト表示
- [ ] 画像読み込み: 正常表示・エラー時対応
- [ ] ボタン動作: 既存機能が正常動作
- [ ] スクロール: レイアウト崩れがない

**確認項目**:
- [ ] 全デバイスで適切に表示される
- [ ] レーダーチャートとの位置関係が適切
- [ ] JavaScriptエラーが発生しない
- [ ] ページ読み込み速度が許容範囲内（3秒以下）

### Step 1: 不要要素の削除と基礎準備（30分）
**目的**: 現在のresult.htmlから不要要素を安全に削除

**作業内容**:
- [ ] スコアカードセクション（`.score-details`）の削除
- [ ] 企業分析セクション（`.analysis-section`）の削除
- [ ] 総合スコアセクション（`.total-score-section`）の削除
- [ ] 複数オファリングセクション（`.offerings-section`）の削除
- [ ] 対応するJavaScript関数の無効化（generateScoreCards関数等）

**確認項目**:
- [ ] ページが正常に読み込まれる
- [ ] レーダーチャートが引き続き表示される
- [ ] JavaScriptエラーが発生しない

**リスク**: 削除時の依存関係による予期しないエラー
**対策**: 一つずつ削除し、都度動作確認

### Step 2: レベル表示エリアのHTML追加（30分）
**目的**: 診断結果レベル表示用のHTML構造を追加

**作業内容**:
- [ ] サマリー文表示用の要素を追加
- [ ] レベル詳細解説用の要素を追加
- [ ] 既存のレーダーチャートセクションは維持

**追加するHTML構造**:
```html
<!-- 診断結果サマリー（レーダーチャートの前に配置） -->
<div class="result-summary-section">
    <h2 class="result-title">診断結果</h2>
    <p class="result-summary-text" id="resultSummary">
        <!-- 動的に生成される文言 -->
    </p>
</div>

<!-- レベル詳細解説（レーダーチャートの後に配置） -->
<div class="level-detail-section">
    <div class="level-description" id="levelDescription">
        <!-- 動的に生成される詳細解説 -->
    </div>
</div>
```

**確認項目**:
- [ ] 新しい要素が正しく表示される
- [ ] レーダーチャートの位置に影響がない
- [ ] レイアウトが崩れていない

### Step 3: レベル判定ロジックの実装（45分）
**目的**: スコアに基づくレベル判定処理を実装

**作業内容**:
- [ ] レベル判定関数の実装
- [ ] レベル別解説文のデータ準備
- [ ] サマリー文生成関数の実装

**実装する関数**:
```javascript
// レベル判定
function determineMaturityLevel(totalScore) {
    if (totalScore <= 11) return { level: 1, name: '業務改善 黎明期' };
    if (totalScore <= 23) return { level: 2, name: '業務改善 試行期' };
    if (totalScore <= 32) return { level: 3, name: '業務改善 展開期' };
    return { level: 4, name: '業務改善 先進期' };
}

// 解説文取得
function getLevelDescription(level) {
    const descriptions = {
        1: "AIやITツールの活用は...", // レベル1の詳細解説
        2: "AIやITツールへの関心は...", // レベル2の詳細解説
        3: "複数の部署でAIやITツール...", // レベル3の詳細解説
        4: "経営層の強いコミットメント..." // レベル4の詳細解説
    };
    return descriptions[level];
}

// サマリー文生成
function generateSummaryText(totalScore, levelName) {
    return `貴社のAI活用スコアは「${totalScore}」、業務改善ポテンシャルは「${levelName}」となります。`;
}
```

**確認項目**:
- [ ] 各レベルでの判定が正しく動作する
- [ ] 文言が適切に表示される
- [ ] エラーハンドリングが機能する

### Step 4: 動的表示処理の統合（30分）
**目的**: レベル判定結果をページに反映する処理を実装

**作業内容**:
- [ ] 既存の表示処理にレベル表示を追加
- [ ] displayResults関数の修正
- [ ] DOM要素の更新処理

**修正する関数**:
```javascript
function displayResults() {
    console.log('結果表示開始');
    
    // 既存: 総合スコア表示
    // document.getElementById('totalScore').textContent = resultData.totalScore; // 削除
    
    // 新規: レベル判定と表示
    const levelInfo = determineMaturityLevel(resultData.totalScore);
    const summaryText = generateSummaryText(resultData.totalScore, levelInfo.name);
    const descriptionText = getLevelDescription(levelInfo.level);
    
    // DOM更新
    document.getElementById('resultSummary').textContent = summaryText;
    document.getElementById('levelDescription').textContent = descriptionText;
    
    // 既存: レーダーチャート生成（維持）
    generateRadarChart();
}
```

**確認項目**:
- [ ] サマリー文が正しく表示される
- [ ] レベル解説文が正しく表示される
- [ ] レーダーチャートが正常に表示される

### Step 5: Haru AutomationサービスエリアのHTML追加（30分）
**目的**: サービス紹介セクションのHTML構造を実装

**作業内容**:
- [ ] サービス紹介エリアのHTML追加
- [ ] CTAボタンの実装

**追加するHTML構造**:
```html
<!-- Haru Automationサービス紹介エリア -->
<div class="service-introduction">
    <h3 class="service-title">Haru Automation のご紹介</h3>
    <div class="service-description">
        <p>生成AIとあらゆるツールを連携させ、"即成果が出る"自動化を実現します。</p>
        <!-- サービス概要文の続き -->
    </div>
    <div class="service-cta-buttons">
        <button class="btn btn-primary" onclick="openServiceDetail()">
            サービス詳細を見る
        </button>
        <button class="btn btn-secondary" onclick="openContactForm()">
            お問い合わせ
        </button>
    </div>
</div>
```

**確認項目**:
- [ ] サービス紹介エリアが正しく表示される
- [ ] ボタンが適切に配置される
- [ ] レイアウトが整っている

### Step 6: サービスエリアのスタイリング（30分）
**目的**: サービス紹介エリアの視覚的な実装

**作業内容**:
- [ ] 背景色の設定（#B7C7FF）
- [ ] パディングとマージンの調整
- [ ] ボタンスタイルの設定

**追加するCSS**:
```css
.service-introduction {
    background: rgba(183, 199, 255, 0.2);
    padding: 40px;
    border-radius: var(--border-radius-medium);
    margin: 40px 0;
    border: 1px solid rgba(183, 199, 255, 0.3);
}

.service-title {
    font-size: var(--font-size-h2);
    color: var(--color-header);
    margin-bottom: 20px;
    text-align: center;
}

.service-description {
    font-size: var(--font-size-body);
    line-height: 1.8;
    margin-bottom: 30px;
}

.service-cta-buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
}
```

**確認項目**:
- [ ] 背景色が正しく適用される
- [ ] 他のセクションと明確に区別される
- [ ] レスポンシブ表示が適切に動作する

### Step 7: ナビゲーション機能の実装（30分）
**目的**: 診断やり直し機能を実装

**作業内容**:
- [ ] 診断やり直しボタンの追加
- [ ] ストレージクリア処理の実装
- [ ] 確認ダイアログの実装

**追加するHTML**:
```html
<!-- ナビゲーションエリア -->
<div class="navigation-section">
    <div class="navigation-buttons">
        <button class="btn btn-outline" onclick="restartAssessment()">
            診断をやり直す
        </button>
    </div>
</div>
```

**JavaScript関数**:
```javascript
function restartAssessment() {
    if (confirm('診断を最初からやり直しますか？現在の結果は失われます。')) {
        Common.storage.clear();
        Common.navigation.goToPage('index.html');
    }
}
```

**確認項目**:
- [ ] ボタンが正しく動作する
- [ ] 確認ダイアログが表示される
- [ ] ページ遷移が正常に動作する

### Step 8: モバイルレスポンシブ対応（30分）
**目的**: モバイル・タブレットでの表示最適化

**作業内容**:
- [ ] メディアクエリの追加
- [ ] モバイル用スタイル調整
- [ ] ボタン配置の最適化

**追加するCSS**:
```css
@media (max-width: 767px) {
    .service-introduction {
        padding: 20px;
        margin: 20px 0;
    }
    
    .service-cta-buttons {
        flex-direction: column;
    }
    
    .service-cta-buttons .btn {
        width: 100%;
        margin: 5px 0;
    }
    
    .result-summary-text {
        font-size: var(--font-size-body);
    }
    
    .chart-wrapper {
        height: 300px;
    }
}
```

**確認項目**:
- [ ] モバイル表示が適切に動作する
- [ ] ボタンが押しやすいサイズになる
- [ ] レーダーチャートがモバイルで適切に表示される

### Step 9: 統合テストとバグ修正（30分）
**目的**: 全機能の統合確認と問題の修正

**作業内容**:
- [ ] 各レベルでの表示確認
- [ ] エラーケースの動作確認
- [ ] ページ遷移の確認
- [ ] パフォーマンス確認

**テストケース**:
- [ ] レベル1（スコア5）での表示
- [ ] レベル2（スコア15）での表示  
- [ ] レベル3（スコア28）での表示
- [ ] レベル4（スコア35）での表示
- [ ] データ不正時のエラーハンドリング
- [ ] API接続失敗時の動作

**確認項目**:
- [ ] すべての機能が正常に動作する
- [ ] JavaScriptエラーが発生しない
- [ ] レイアウトが適切に表示される
- [ ] パフォーマンスが許容範囲内

### 各ステップ間の確認事項

**ステップ完了時の必須確認**:
1. **ローカルサーバー起動**: 毎回動作確認用にローカルサーバーを起動
2. **ブラウザコンソール**: JavaScriptエラーの有無
3. **表示確認**: レイアウトの崩れがないか
4. **機能確認**: 既存機能が正常に動作するか
5. **レスポンシブ**: モバイル表示に問題がないか

### ローカルサーバー確認手順

**各ステップ完了後は必ずローカルサーバーで動作確認を行う**:

1. **サーバー起動コマンド**:
   ```bash
   # 利用可能なポートでサーバーを起動（推奨ポート: 8001）
   python3 -m http.server 8001
   ```

2. **確認URL**:
   - **メインページ**: http://localhost:8001/result.html
   - **インデックス**: http://localhost:8001/index.html（必要時）

3. **確認項目**:
   - [ ] ページが正常に読み込まれる
   - [ ] ブラウザコンソール（F12 > Console）にエラーが表示されない
   - [ ] レーダーチャートが表示される
   - [ ] 新しく追加した要素が正しく表示される
   - [ ] 削除した要素が表示されない
   - [ ] モバイル表示（F12 > デバイスツールバー）が適切

4. **エラー時の対処**:
   - ブラウザコンソールでエラー詳細を確認
   - 前のステップに戻って修正
   - 必要に応じてコードを段階的にコメントアウトして原因を特定

5. **ポート競合時の対処**:
   ```bash
   # 別のポートを試す
   python3 -m http.server 8002
   python3 -m http.server 8003
   # または利用可能ポートを確認
   lsof -i :8001 || echo "Port 8001 is available"
   ```

**エラー発生時の対処方針**:
1. **即座に前のステップに戻る**
2. **コンソールログで原因を特定**
3. **最小限の修正で問題を解決**
4. **必要に応じてステップを細分化**

### 推奨進行方法

**1日目**: Step 1-3（基礎実装）
**2日目**: Step 4-6（表示機能）
**3日目**: Step 7-9（完成・テスト）

各ステップ完了後は必ず動作確認を行い、問題がないことを確認してから次のステップに進むことを強く推奨します。

## 6. テストケース

### 6.1 機能テスト
1. **レベル1表示テスト**
   - 入力: 合計スコア 0～11点
   - 期待値: 「業務改善 黎明期」の表示

2. **レベル2表示テスト**
   - 入力: 合計スコア 12～23点
   - 期待値: 「業務改善 試行期」の表示

3. **レベル3表示テスト**
   - 入力: 合計スコア 24～32点
   - 期待値: 「業務改善 展開期」の表示

4. **レベル4表示テスト**
   - 入力: 合計スコア 33～36点
   - 期待値: 「業務改善 先進期」の表示

### 6.2 エラーケーステスト
1. **データ欠損テスト**
   - 条件: assessmentAnswersが存在しない
   - 期待値: エラーメッセージ表示後、index.htmlへリダイレクト

2. **API接続失敗テスト**
   - 条件: GAS APIが応答しない
   - 期待値: ローカル計算にフォールバック

### 6.3 UIテスト
1. **レスポンシブ表示**
   - デスクトップ（1920px）
   - タブレット（768px）
   - モバイル（375px）

2. **ボタン動作**
   - サービス詳細ボタンのクリック
   - お問い合わせボタンのクリック
   - 診断やり直しボタンのクリック（確認ダイアログ表示）

## 7. 注意事項

### 7.1 パフォーマンス
- Chart.jsは維持するが、必要最小限の機能のみ使用
- 不要なDOM操作を最小限に抑える

### 7.2 アクセシビリティ
- 適切なARIA属性の使用
- キーボードナビゲーション対応
- スクリーンリーダー対応

### 7.3 セキュリティ
- XSS対策：動的コンテンツのエスケープ処理
- データ検証：クライアント側とサーバー側の両方で実施

## 8. 今後の拡張可能性

### 8.1 Phase 2での追加機能
- 診断結果のPDFダウンロード機能
- 診断結果の共有機能（SNS連携）
- より詳細なレポート機能

### 8.2 データ分析機能
- 業界平均との比較表示
- 過去の診断結果との比較
- 改善提案の自動生成

## 9. 参考資料

### 9.1 関連ファイル
- `/result.html` - 現在の診断結果ページ
- `/js/api.js` - API連携処理
- `/js/common.js` - 共通処理
- `/css/style.css` - スタイルシート

### 9.2 外部リソース
- [Chart.js Documentation](https://www.chartjs.org/) - レーダーチャート実装
- [Google Apps Script API](https://developers.google.com/apps-script) - バックエンド連携

## 10. 更新履歴

| 日付 | バージョン | 更新内容 |
|------|------------|----------|
| 2025-01-24 | 1.0.0 | 初版作成 |
| 2025-01-24 | 1.1.0 | レーダーチャートを削除対象から除外し、診断結果レベル表示エリア内に維持 |
| 2025-01-24 | 1.2.0 | 開発ステップを9段階に詳細分割、各ステップ30分〜45分の実装可能な単位に細分化 |
| 2025-01-24 | 1.3.0 | ローカルサーバー確認手順を追加、各ステップ完了時の必須確認項目を詳細化 |