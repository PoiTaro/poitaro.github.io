/**
 * サムネイル自動生成スクリプト
 * - 入力: articles/*.md (frontmatter: title, description, category, thumbnail等)
 * - 出力: thumbnails/<slug>.png （1200x630, OpenGraph向け）
 * - 特徴: "THE RETURN" High Fashion Editorial Design
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

// ブランド設定
const BRAND = {
  siteName: 'ポイ活Pay太郎',
  tagline: 'High Fashion Point Hacking',
  url: 'poitaro.com',
  black: '#0a0a0a',
  white: '#f8f8f8',
  accent: '#ccff00', // Neon Lime
  purple: '#b4a0ff',
  gray: '#e5e5e5',
};

function buildHtml({ title, category, date }) {
  const safeTitle = (title || 'UNTITLED ISSUE').slice(0, 60);
  const safeCategory = (category || 'EDITORIAL').toUpperCase();
  const safeDate = date || '2026';

  return `<!DOCTYPE html>
  <html lang="ja">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Anton&family=Noto+Sans+JP:wght@400;700;900&family=Playfair+Display:ital,wght@1,400;1,700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
          width: 1200px;
          height: 630px;
          background-color: ${BRAND.black};
          color: ${BRAND.white};
          font-family: 'Noto Sans JP', sans-serif;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        /* Background Texture/Text */
        .bg-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Anton', sans-serif;
          font-size: 400px;
          color: transparent;
          -webkit-text-stroke: 2px rgba(255, 255, 255, 0.05);
          white-space: nowrap;
          z-index: 0;
          line-height: 0.8;
        }

        /* Main Layout */
        .container {
          position: relative;
          z-index: 10;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px;
          border: 20px solid ${BRAND.black}; /* Inner frame effect */
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid ${BRAND.white};
          padding-bottom: 20px;
        }
        .brand-logo {
          font-family: 'Noto Sans JP', sans-serif;
          font-size: 42px;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1;
        }
        .issue-meta {
          text-align: right;
        }
        .category-tag {
          background-color: ${BRAND.accent};
          color: ${BRAND.black};
          font-family: 'Noto Sans JP', sans-serif;
          font-weight: 900;
          font-size: 24px;
          padding: 4px 16px;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 8px;
        }
        .date {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 18px;
          color: ${BRAND.gray};
        }

        /* Main Title Area */
        .main-content {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center; /* Center align */
          padding: 40px 0;
        }
        .title {
          font-family: 'Noto Sans JP', sans-serif;
          font-weight: 900;
          font-size: 64px; /* Adjusted for better whitespace */
          line-height: 1.2;
          text-transform: uppercase;
          word-break: break-word;
          text-align: center; /* Center align */
          max-width: 900px;
        }
        .title span {
            background-color: ${BRAND.white};
            color: ${BRAND.black};
            padding: 0 10px;
        }

        /* Footer */
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-top: 2px solid ${BRAND.white};
          padding-top: 20px;
        }
        .footer-left {
            font-family: 'Noto Sans JP', sans-serif;
            font-weight: 700;
            font-size: 14px;
            letter-spacing: 0.1em;
        }
        .footer-right {
            font-family: 'Noto Sans JP', sans-serif;
            font-weight: 900;
            font-size: 32px;
            color: ${BRAND.accent};
        }
        
        /* Decorative Elements */
        .corner-tl { position: absolute; top: 20px; left: 20px; width: 20px; height: 20px; border-top: 4px solid ${BRAND.accent}; border-left: 4px solid ${BRAND.accent}; }
        .corner-br { position: absolute; bottom: 20px; right: 20px; width: 20px; height: 20px; border-bottom: 4px solid ${BRAND.accent}; border-right: 4px solid ${BRAND.accent}; }

      </style>
    </head>
    <body>
      <div class="bg-text">RETURN</div>
      
      <div class="container">
        <div class="corner-tl"></div>
        <div class="corner-br"></div>

        <div class="header">
          <div class="brand-logo">ポイ活Pay太郎</div>
          <div class="issue-meta">
            <div class="category-tag">${safeCategory}</div>
            <div class="date">ISSUE: ${safeDate}</div>
          </div>
        </div>

        <div class="main-content">
          <h1 class="title">${safeTitle}</h1>
        </div>

        <div class="footer">
          <div class="footer-left">
            SMART LIVING EDITORIAL<br>
            TOKYO, JAPAN
          </div>
          <div class="footer-right">
            ${BRAND.url.toUpperCase()}
          </div>
        </div>
      </div>
    </body>
  </html>`;
}

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox','--disable-setuid-sandbox'],
    defaultViewport: { width: 1200, height: 630, deviceScaleFactor: 1 }
  });

  try {
    const page = await browser.newPage();

    const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));
    for (const md of files) {
      const slug = getSlug(md);
      const outPath = path.join(OUT_DIR, `${slug}.png`);
      
      // 強制上書きモードにするため、存在チェックを外すか、コメントアウト
      // if (fs.existsSync(outPath)) { ... }

      const mdPath = path.join(ARTICLES_DIR, md);
      const raw = fs.readFileSync(mdPath, 'utf8');
      const fm = parseFrontmatter(raw);

      const html = buildHtml({
        title: fm.title || slug,
        category: fm.category || '',
        date: fm.date || new Date().toISOString().split('T')[0],
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
