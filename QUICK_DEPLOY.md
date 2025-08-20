# 🚀 クイックデプロイガイド

assessment.haru.agency への本番デプロイ手順

## 📋 前提条件

- GitHub アカウント
- Vercel アカウント（GitHub連携推奨）
- Cloudflare アカウント（ドメイン管理）
- assessment.haru.agency ドメイン取得済み

## ⚡ 手順概要

1. **GitHub リポジトリ作成 & プッシュ** (5分)
2. **Vercel API プロキシデプロイ** (10分)
3. **GitHub Pages 設定** (5分)
4. **Cloudflare DNS 設定** (5分)
5. **動作確認** (5分)

**合計時間: 約30分**

---

## 1️⃣ GitHub リポジトリ作成

### 手動でリポジトリ作成
1. [GitHub](https://github.com) にアクセス
2. **New repository** をクリック
3. 設定:
   - Repository name: `assessment-tool-frontend`
   - Description: `生成AI活用業務効率化アセスメントツール`
   - Public を選択
   - README, .gitignore, license は**追加しない**

### ローカルとの接続
```bash
cd "/Users/ogatatakumi/Desktop/Cursor/assessment-tool-frontend"
git remote add origin https://github.com/YOUR_USERNAME/assessment-tool-frontend.git
git branch -M main
git push -u origin main
```

✅ **確認**: GitHub でファイルが正常にアップロードされている

---

## 2️⃣ Vercel API プロキシデプロイ

### Vercel CLI でデプロイ
```bash
# Vercel CLI インストール（未インストールの場合）
npm install -g vercel

# API プロキシプロジェクトをデプロイ
cd "/Users/ogatatakumi/Desktop/Cursor/assessment-tool-api"
vercel

# プロンプトでの設定:
# ? Set up and deploy "/Users/.../assessment-tool-api"? Yes
# ? Which scope do you want to deploy to? [あなたのアカウント]
# ? Link to existing project? No
# ? What's your project's name? assessment-tool-api
# ? In which directory is your code located? ./
```

### 本番デプロイ
```bash
vercel --prod
```

✅ **確認**: `https://assessment-tool-api.vercel.app/api/proxy` でアクセスできる

---

## 3️⃣ GitHub Pages 設定

### GitHub Pages 有効化
1. リポジトリの **Settings** タブ
2. 左サイドバー **Pages**
3. Source 設定:
   - **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
4. **Save**

### カスタムドメイン設定
1. Custom domain に `assessment.haru.agency` を入力
2. **Save**
3. **Enforce HTTPS** にチェック

⚠️ **注意**: DNS設定完了まで「Domain's DNS record could not be retrieved」エラーが表示される

---

## 4️⃣ Cloudflare DNS 設定

### DNS レコード追加
1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン
2. `haru.agency` ドメインを選択
3. **DNS** > **Records** > **Add record**:
   - **Type**: `CNAME`
   - **Name**: `assessment`
   - **Target**: `YOUR_USERNAME.github.io` (GitHubユーザー名に置き換え)
   - **Proxy status**: 🟠 **Proxied** (オレンジクラウド)
4. **Save**

### SSL/TLS 設定確認
1. **SSL/TLS** タブ
2. **Overview** で以下を確認:
   - Encryption mode: **Full (strict)** 推奨
   - Universal SSL: **Active Certificate**

✅ **確認**: DNS伝播（通常5-10分）を待つ

---

## 5️⃣ 動作確認

### 基本アクセス確認
```bash
# DNS確認
dig assessment.haru.agency

# HTTPS確認
curl -I https://assessment.haru.agency
```

### ブラウザ確認
1. https://assessment.haru.agency にアクセス
2. 以下の動作を確認:
   - [x] トップページの表示
   - [x] SSL証明書の有効性
   - [x] プライバシーポリシーページ
   - [x] 個人情報入力フォーム
   - [x] 診断ページ（API接続テスト）

### API接続確認
1. ブラウザの開発者ツールを開く
2. Console で実行:
```javascript
// API接続テスト
testAPIConnection();
```

✅ **期待結果**: すべてのAPI呼び出しが成功

---

## 🔧 トラブルシューティング

### DNS関連
```bash
# DNS伝播確認
nslookup assessment.haru.agency
# 期待結果: CNAME が YOUR_USERNAME.github.io を指す
```

### SSL証明書
- **症状**: 証明書エラー
- **対処**: Cloudflare SSL mode を「Full (strict)」に変更
- **待機**: 証明書発行まで最大24時間

### GitHub Pages
- **症状**: 404 エラー
- **対処**: Settings > Pages で設定を再保存
- **確認**: Actions タブで build 状況確認

### API接続
- **症状**: CORS エラー
- **対処**: Vercel Functions URL が正しく設定されているか確認
- **確認**: `js/api.js` の `BASE_URL` 設定

---

## 🎯 成功基準

- ✅ https://assessment.haru.agency でサイトが表示
- ✅ SSL証明書が有効
- ✅ 全ページが正常に動作
- ✅ API接続が成功
- ✅ モバイル表示が正常

---

## 📞 サポート

問題が発生した場合:
1. [GitHub Issues](https://github.com/YOUR_USERNAME/assessment-tool-frontend/issues)
2. ログ確認:
   - Vercel: `vercel logs`
   - Cloudflare: Dashboard > Analytics
   - GitHub: Actions タブ

---

**デプロイ完了後**: https://assessment.haru.agency が正常に動作することを確認してください。