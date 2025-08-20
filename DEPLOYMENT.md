# デプロイ手順書

## 🔧 GitHub リポジトリ作成手順

### 1. GitHub でリポジトリ作成
1. GitHub (https://github.com) にログイン
2. 新しいリポジトリを作成:
   - **リポジトリ名**: `assessment-tool-frontend`
   - **説明**: `生成AI活用業務効率化アセスメントツール - フロントエンド`
   - **可視性**: Public
   - **README**: 作成しない（既にあるため）
   - **.gitignore**: 作成しない（既にあるため）
   - **ライセンス**: 作成しない

### 2. ローカルリポジトリとの接続
```bash
cd /Users/ogatatakumi/Desktop/Cursor/assessment-tool-frontend
git remote add origin https://github.com/YOUR_USERNAME/assessment-tool-frontend.git
git branch -M main
git push -u origin main
```

### 3. GitHub Pages 設定
1. リポジトリの **Settings** タブに移動
2. 左サイドバーの **Pages** をクリック
3. **Source** を以下に設定:
   - **Deploy from a branch**
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. **Custom domain** に `assessment.haru.agency` を入力
5. **Enforce HTTPS** にチェック
6. **Save** をクリック

## 🚀 Vercel Functions セットアップ

### 1. Vercel プロジェクト作成
```bash
# Vercel CLI インストール（未インストールの場合）
npm i -g vercel

# プロジェクト作成
mkdir assessment-tool-api
cd assessment-tool-api
npm init -y
```

### 2. API プロキシ作成
以下の内容で `/api/proxy.js` を作成:

```javascript
export default async function handler(req, res) {
  // CORS ヘッダー設定
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'https://assessment.haru.agency');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // OPTIONS リクエスト（プリフライト）への対応
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const gasUrl = 'https://script.google.com/macros/s/AKfycbwooCJeciyJfmWZ9BhN8gzsXsp6kYmd70R7_X8ghBj3tFMOKkn4cccG3ai_vjrz_ng1gw/exec';
    
    // クエリパラメータを取得してGASに転送
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const fetchUrl = `${gasUrl}?${urlParams.toString()}`;
    
    const response = await fetch(fetchUrl);
    const data = await response.json();
    
    res.status(200).json(data);
  } catch (error) {
    console.error('プロキシエラー:', error);
    res.status(500).json({ error: 'プロキシサーバーエラー' });
  }
}
```

### 3. Vercel デプロイ
```bash
vercel
# プロンプトに従って設定
# プロジェクト名: assessment-tool-api
```

## 🌐 Cloudflare DNS 設定

### 1. DNS レコード追加
Cloudflare ダッシュボードで以下の DNS レコードを追加:

```
Type: CNAME
Name: assessment
Target: YOUR_USERNAME.github.io
Proxy: Enabled (オレンジクラウド)
```

### 2. SSL/TLS 設定確認
- **SSL/TLS mode**: Full (strict) 推奨
- **Edge Certificates**: Universal SSL が有効であることを確認

## 📊 動作確認手順

### 1. GitHub Pages デプロイ確認
1. https://YOUR_USERNAME.github.io/assessment-tool-frontend/ にアクセス
2. 全ページが正常に表示されることを確認

### 2. カスタムドメイン確認
1. https://assessment.haru.agency にアクセス
2. SSL 証明書が正常に適用されていることを確認
3. 全ページの動作確認

### 3. API 接続テスト
1. ブラウザの開発者ツールを開く
2. 診断ページで API 呼び出しが正常に動作することを確認
3. エラーがないことをコンソールで確認

## 🔧 トラブルシューティング

### DNS 伝播の確認
```bash
# DNS 伝播確認
dig assessment.haru.agency
nslookup assessment.haru.agency
```

### GitHub Pages ビルドログ確認
- リポジトリの **Actions** タブでビルドログを確認
- エラーがある場合は **Pages build and deployment** を確認

### SSL証明書の確認
```bash
# SSL証明書確認
openssl s_client -connect assessment.haru.agency:443 -servername assessment.haru.agency
```

---
**次のステップ**: 上記手順を順次実行してください。