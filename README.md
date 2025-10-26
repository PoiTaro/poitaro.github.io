# ポイ活Pay太郎 - サムネイル自動生成

このリポジトリには、Markdown記事からHTMLを生成するスクリプトに加え、OG/Twitter共有向けのサムネイル画像 (1200x630) を自動生成する機能が含まれます。

## 生成の流れ

1. `npm run thumbnails`
   - `articles/*.md` のfrontmatterから `title`/`category` を読み取り、`thumbnails/<slug>.png` を生成します。
   - すでに `thumbnail`/`image` がfrontmatterにある記事はスキップします（手動画像を優先）。
   - PuppeteerでHTMLを描画しスクリーンショットを撮る方式なので、Windowsでも追加のネイティブ依存なく動作します。
2. `npm run build`
   - サムネ生成の後、`node generate-posts.js` を実行し、`articles_html/*.html` と `posts.json`、`sitemap.xml` を更新します。
   - frontmatterに画像が無い記事は `thumbnails/<slug>.png` を `og:image` として自動適用します。

## コマンド

- すべて一括
  - `npm run build`
- サムネのみ再生成（不足分のみ）
  - `npm run thumbnails`
- 特定記事のサムネを再生成したい場合
  - `thumbnails/<slug>.png` を削除してから `npm run thumbnails` を実行

## 仕様

- 出力サイズ: 1200x630 (Open Graph推奨)
- フォント: Google Fontsの Inter / Noto Sans JP を利用
- デザイン: ダーク基調、ブランドカラー (primary-500: #f59e0b) をアクセントに採用
- 優先度:
  1. frontmatterの `thumbnail`/`image` 等が指定されていればそれを使用（絶対URL推奨）
  2. 無ければ `thumbnails/<slug>.png` を自動適用
  3. どちらも無ければフォールバック画像

## 注意点

- 既存の `thumbnails/` に同名PNGがある場合は上書きしません（安全のため）。更新したい場合は該当PNGを削除してください。
- Puppeteerの初回インストールは時間がかかることがあります。
- 共有プレビュー最適化のため、記事テンプレートに `og:image:width=1200` `og:image:height=630` を追加済みです。

## トラブルシューティング

- 会社PCなどでChromiumの起動に失敗する場合
  - セキュリティポリシーでブロックされることがあります。その際はChromeの実行パスを環境変数 `PUPPETEER_EXECUTABLE_PATH` で指定してください。
- 太字の日本語が崩れる場合
  - 表示時の環境依存です。サーバ側の生成ではなくスクリーンショット方式のため、基本的に安定しますが、必要に応じてCSSのフォント指定を変更してください。
