# 生成AI活用 業務効率化アセスメントツール

企業の生成AI活用ポテンシャルを可視化するWebベースの診断ツール

## 🌐 本番環境

**URL**: https://assessment.haru.agency

## 📋 概要

このツールは企業が自社の業務における生成AI活用の成熟度を評価し、適切なソリューション導入を促進するためのWebアプリケーションです。

### 主要機能
- Web診断による生成AI活用成熟度の評価
- 診断結果の可視化（スコア・レーダーチャート）
- 推奨サービスの提示とリードジェネレーション
- モバイル対応のレスポンシブデザイン

## 🏗️ 技術構成

- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **ホスティング**: GitHub Pages
- **API**: Google Apps Script + Vercel Functions (CORS Proxy)
- **データベース**: Google Sheets
- **DNS・CDN**: Cloudflare

## 📁 ファイル構成

```
/
├── index.html          # P-01: 概要説明ページ
├── privacy.html        # P-02: プライバシーポリシー
├── register.html       # P-03: 個人情報入力
├── assessment.html     # P-04: 診断ページ
├── result.html         # P-05: 診断結果
├── css/
│   └── style.css      # メインスタイルシート
├── js/
│   ├── common.js      # 共通ユーティリティ
│   ├── app.js         # アプリケーション機能
│   └── api.js         # API クライアント
└── assets/
    └── images/        # 画像リソース
```

## 🚀 本番環境について

### GitHub Pages デプロイ
- **リポジトリ**: `assessment-tool-frontend` (パブリック)
- **ブランチ**: `main` からの自動デプロイ
- **カスタムドメイン**: `assessment.haru.agency`

### API プロキシ
- **Vercel Functions**: `https://assessment-tool-api.vercel.app/api/proxy`
- **Google Apps Script**: 質問データ取得・回答保存・結果計算

### DNS 設定
- **Cloudflare**: DNS管理・CDN・セキュリティ
- **SSL**: 自動証明書

## 📊 監視・運用

- **アクセス解析**: Cloudflare Analytics
- **API監視**: Vercel Functions ログ
- **データ管理**: Google Sheets
- **コスト**: 月額 $0 (無料枠内)

## 🔒 セキュリティ

- HTTPS通信の強制
- CORS対策（Vercel Functionsで解決）
- 入力値のサニタイズ
- XSS・CSRF対策

---

© 2025 Assessment Tool. All Rights Reserved.