/**
 * サムネイル自動生成スクリプト
 * - 入力: articles/*.md (frontmatter: title, description, category, thumbnail等)
 * - 出力: thumbnails/<slug>.png （1200x630, OpenGraph向け）
 * - 特徴: モダンでおしゃれなファッションサイト風デザイン、JPフォント対応
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

// ブランド設定 - 新しいテーマカラー
const BRAND = {
  siteName: 'ポイ活Pay太郎',
  tagline: 'Smart Savings',
  url: 'poitaro.com',
  primaryColor: '#c9825a',   // brand-500
  secondaryColor: '#b86a45', // brand-600
  accentColor: '#22c55e',    // accent-500
  bgDark: '#171717',         // neutral-900
  bgLight: '#fafafa',        // neutral-50
  fg: '#ffffff',
};

// カテゴリごとのアクセントカラー（新テーマ対応）
const CATEGORY_COLORS = {
  'ポイ活': { primary: '#c9825a', secondary: '#9a5539' },
  'ポイントサイト': { primary: '#ef4444', secondary: '#dc2626' },
  'キャッシュレス': { primary: '#f97316', secondary: '#ea580c' },
  '楽天ポイント': { primary: '#dc2626', secondary: '#b91c1c' },
  'PayPay': { primary: '#ef4444', secondary: '#dc2626' },
  'ガジェット': { primary: '#3b82f6', secondary: '#2563eb' },
  'ガジェット・アプリ': { primary: '#2563eb', secondary: '#1d4ed8' },
  'Web制作': { primary: '#10b981', secondary: '#059669' },
  'ゲーム': { primary: '#a855f7', secondary: '#9333ea' },
  '生成AI': { primary: '#06b6d4', secondary: '#0891b2' },
  'VPN': { primary: '#0ea5e9', secondary: '#0284c7' },
  'LINE': { primary: '#22c55e', secondary: '#16a34a' },
  'アプリ': { primary: '#14b8a6', secondary: '#0d9488' },
  'アフィリエイト': { primary: '#8b5cf6', secondary: '#7c3aed' },
  'プライバシーポリシー': { primary: '#64748b', secondary: '#475569' },
  '節約': { primary: '#c9825a', secondary: '#9a5539' },
  'お得情報': { primary: '#f59e0b', secondary: '#d97706' },
};

function getCategoryColors(category) {
  if (!category) return { primary: BRAND.primaryColor, secondary: BRAND.secondaryColor };
  return CATEGORY_COLORS[category] || { primary: BRAND.primaryColor, secondary: BRAND.secondaryColor };
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

function buildHtml({ title, category, siteName, tagline, colors }) {
  const safeTitle = (title || '無題の記事').slice(0, 60);
  const safeCategory = category || '';
  const { primary, secondary } = colors;

  return `<!DOCTYPE html>
  <html lang="ja">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        
        .card{
          width:1200px;
          height:630px;
          background: linear-gradient(135deg, ${BRAND.bgDark} 0%, #262626 100%);
          color:${BRAND.fg};
          font-family:'Inter','Noto Sans JP',system-ui,-apple-system,sans-serif;
          position:relative;
          overflow:hidden;
          display:flex;
          flex-direction:column;
        }
        
        /* Decorative gradient orbs */
        .orb1{
          position:absolute;
          width:600px;
          height:600px;
          border-radius:50%;
          background: radial-gradient(circle, ${hexToRgba(primary, 0.25)} 0%, transparent 70%);
          top:-200px;
          right:-100px;
          filter:blur(60px);
        }
        .orb2{
          position:absolute;
          width:400px;
          height:400px;
          border-radius:50%;
          background: radial-gradient(circle, ${hexToRgba(secondary, 0.2)} 0%, transparent 70%);
          bottom:-100px;
          left:-50px;
          filter:blur(50px);
        }
        
        /* Grid pattern overlay */
        .grid-overlay{
          position:absolute;
          inset:0;
          background-image: 
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        /* Main content area */
        .content{
          position:relative;
          z-index:10;
          flex:1;
          display:flex;
          flex-direction:column;
          justify-content:center;
          padding:60px 80px;
        }
        
        /* Category badge */
        .category{
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:10px 20px;
          background: linear-gradient(135deg, ${primary}, ${secondary});
          border-radius:50px;
          font-size:18px;
          font-weight:600;
          letter-spacing:0.5px;
          margin-bottom:28px;
          width:fit-content;
          box-shadow: 0 4px 20px ${hexToRgba(primary, 0.4)};
        }
        .category-dot{
          width:8px;
          height:8px;
          background:#fff;
          border-radius:50%;
          animation:pulse 2s infinite;
        }
        @keyframes pulse{
          0%,100%{opacity:1}
          50%{opacity:0.5}
        }
        
        /* Title */
        .title{
          font-family:'Playfair Display','Noto Sans JP',serif;
          font-size:58px;
          font-weight:700;
          line-height:1.2;
          letter-spacing:-0.02em;
          margin-bottom:24px;
          max-width:900px;
          word-break:break-word;
        }
        
        /* Decorative line under title */
        .title-line{
          width:100px;
          height:4px;
          background: linear-gradient(90deg, ${primary}, ${secondary});
          border-radius:2px;
        }
        
        /* Footer bar */
        .footer{
          position:relative;
          z-index:10;
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:24px 80px;
          background: rgba(0,0,0,0.3);
          border-top:1px solid rgba(255,255,255,0.1);
        }
        
        .brand{
          display:flex;
          align-items:center;
          gap:16px;
        }
        .brand-icon{
          width:48px;
          height:48px;
          border-radius:50%;
          overflow:hidden;
          box-shadow: 0 4px 12px ${hexToRgba(BRAND.primaryColor, 0.3)};
        }
        .brand-icon img{
          width:100%;
          height:100%;
          object-fit:cover;
        }
        .brand-text{
          display:flex;
          flex-direction:column;
        }
        .brand-name{
          font-family:'Playfair Display',serif;
          font-size:22px;
          font-weight:600;
          letter-spacing:-0.01em;
        }
        .brand-tagline{
          font-size:11px;
          color:rgba(255,255,255,0.6);
          letter-spacing:2px;
          text-transform:uppercase;
        }
        
        .url{
          font-size:16px;
          color:rgba(255,255,255,0.5);
          font-weight:500;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="orb1"></div>
        <div class="orb2"></div>
        <div class="grid-overlay"></div>
        
        <div class="content">
          ${safeCategory ? `<div class="category"><span class="category-dot"></span><span>${safeCategory}</span></div>` : ''}
          <h1 class="title">${safeTitle}</h1>
          <div class="title-line"></div>
        </div>
        
        <div class="footer">
          <div class="brand">
            <div class="brand-icon">
              <img src="https://poitaro.com/blog/favicon.ico" alt="Logo">
            </div>
            <div class="brand-text">
              <span class="brand-name">${siteName}</span>
              <span class="brand-tagline">${tagline}</span>
            </div>
          </div>
          <span class="url">${BRAND.url}</span>
        </div>
      </div>
    </body>
  </html>`;
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
      
      // 既存のサムネイルがあればスキップ
      if (fs.existsSync(outPath)) {
        console.log(`Skipped (already exists): ${path.relative(ROOT, outPath)}`);
        continue;
      }

      const mdPath = path.join(ARTICLES_DIR, md);
      const raw = fs.readFileSync(mdPath, 'utf8');
      const fm = parseFrontmatter(raw);

      const colors = getCategoryColors(fm.category || '');
      const html = buildHtml({
        title: fm.title || slug,
        category: fm.category || '',
        siteName: BRAND.siteName,
        tagline: BRAND.tagline,
        colors,
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
