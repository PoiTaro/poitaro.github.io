/**
 * サムネイル自動生成スクリプト
 * - 入力: articles/*.md (frontmatter: title, description, category, thumbnail等)
 * - 出力: thumbnails/<slug>.png （1200x630, OpenGraph向け）
 * - 特徴: モダンなデザイン、JPフォント対応（Noto Sans JP / fallback）
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = __dirname + '/..';
const ARTICLES_DIR = path.join(ROOT, 'articles');
const OUT_DIR = path.join(ROOT, 'thumbnails');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function parseFrontmatter(markdown) {
  const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(markdown);
  const attributes = {};
  if (match) {
    const frontmatter = match[1];
    frontmatter.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length) {
        let value = valueParts.join(':').trim();
        if (value.startsWith('[') && value.endsWith(']')) {
          attributes[key.trim()] = value
            .slice(1, -1)
            .split(',')
            .map(tag => tag.trim().replace(/^"|"$/g, ''));
        } else {
          attributes[key.trim()] = value.replace(/^[\'" ]|[\'" ]$/g, '');
        }
      }
    });
  }
  return attributes;
}

function getSlug(mdFile) {
  return mdFile.replace(/\.md$/, '');
}

// ブランド設定（必要に応じて調整）
const BRAND = {
  siteName: 'ポイ活Pay太郎',
  url: 'https://poitaro.com/',
  color: '#f59e0b', // default accent (primary-500)
  bg: '#111827', // gray-900
  fg: '#ffffff',
};

// カテゴリごとのイメージカラー
const CATEGORY_COLORS = {
  'ポイ活': '#f59e0b',        // amber-500
  'ポイントサイト': '#ef4444', // red-500
  'キャッシュレス': '#f97316', // orange-500
  '楽天ポイント': '#bf0000',   // Rakuten red
  'ガジェット': '#3b82f6',    // blue-500
  'ガジェット・アプリ': '#2563eb',
  'Web制作': '#10b981',       // emerald-500
  'ゲーム': '#a855f7',        // purple-500
  '生成AI': '#06b6d4',        // cyan-500
  'VPN': '#0ea5e9',           // sky-500
  'LINE': '#06c755',          // LINE green
  'アプリ': '#14b8a6',        // teal-500
  'アフィリエイト': '#8b5cf6',
  'プライバシーポリシー': '#94a3b8', // slate-400
};

function getAccentColor(category) {
  if (!category) return BRAND.color;
  return CATEGORY_COLORS[category] || BRAND.color;
}

function buildHtml({ title, category, siteName, accentColor }) {
  const safeTitle = (title || '無題の記事').slice(0, 80);
  const safeCategory = category || '';
  const grad = `radial-gradient(800px 800px at 50% -20%, ${hexToRgba(accentColor, 0.28)}, rgba(0,0,0,0))`;

  return `<!DOCTYPE html>
  <html lang="ja">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@600;800&family=Noto+Sans+JP:wght@700;900&display=swap" rel="stylesheet">
      <style>
        html,body{margin:0;padding:0}
        .card{
          width:1200px;height:630px;display:grid;place-items:center;
          background:${BRAND.bg};color:${BRAND.fg};
          font-family:Inter,'Noto Sans JP',system-ui,-apple-system,'Segoe UI','Helvetica Neue',sans-serif;
          position:relative;overflow:hidden
        }
        .card:before{content:"";position:absolute;inset:-20%;background:${grad};filter:blur(60px);}        
        .center{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px;padding:0 64px}
        .badge{display:inline-flex;align-items:center;gap:10px;padding:8px 14px;border-radius:999px;background:${hexToRgba(accentColor,0.15)};color:${accentColor};font-weight:800;font-size:22px}
        .dot{width:10px;height:10px;border-radius:999px;background:${accentColor}}
        .title h1{font-size:64px;line-height:1.1;margin:0;word-break:break-word}
        .site{font-size:24px;color:#d1d5db;font-weight:700}
        .footer{position:absolute;right:48px;bottom:32px;font-size:20px;color:#d1d5db}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="center">
          ${safeCategory ? `<div class="badge"><span class="dot"></span><span>${safeCategory}</span></div>` : ''}
          <div class="title"><h1>${safeTitle}</h1></div>
          <div class="site">${siteName}</div>
        </div>
        <div class="footer">${BRAND.url.replace(/\/$/, '')}</div>
      </div>
    </body>
  </html>`;
}

// ヘックスをrgba文字列に変換
function hexToRgba(hex, a) {
  const h = hex.replace('#','');
  const bigint = parseInt(h.length===3 ? h.split('').map(ch=>ch+ch).join('') : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    // Windows PowerShell環境でも動きやすいデフォルト構成
    args: ['--no-sandbox','--disable-setuid-sandbox'],
    defaultViewport: { width: 1200, height: 630, deviceScaleFactor: 1 }
  });

  try {
    const page = await browser.newPage();

    const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));
    for (const md of files) {
      const slug = getSlug(md);
      const outPath = path.join(OUT_DIR, `${slug}.png`);
      // 既存があってもレイアウト更新を反映するため上書き出力

      const mdPath = path.join(ARTICLES_DIR, md);
      const raw = fs.readFileSync(mdPath, 'utf8');
      const fm = parseFrontmatter(raw);

  // たとえfrontmatterに画像があっても、OG用の共通デザインを出すため常に生成（既存pngがあればスキップ）

      const accentColor = getAccentColor(fm.category || '');
      const html = buildHtml({
        title: fm.title || slug,
        category: fm.category || '',
        siteName: BRAND.siteName,
        accentColor,
      });

      await page.setContent(html, { waitUntil: 'networkidle0' });
      await page.screenshot({ path: outPath, type: 'png' });
      console.log(`Generated thumbnail: ${path.relative(ROOT, outPath)}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('Thumbnail generation failed:', err);
  process.exit(1);
});
