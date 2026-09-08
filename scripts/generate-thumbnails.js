/**
 * サムネイル自動生成スクリプト
 * - 入力: articles/*.md の frontmatter
 * - 出力: thumbnails/<slug>.png (1200 x 630)
 * - テーマ: Blue Editorial Card
 *
 * Usage:
 *   node scripts/generate-thumbnails.js --force
 *   node scripts/generate-thumbnails.js articles/example.md
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const puppeteer = require('puppeteer');

const ROOT = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, 'articles');
const OUT_DIR = path.join(ROOT, 'thumbnails');

const BRAND = {
  siteName: 'ポイ活Pay太郎',
  descriptor: 'SMART LIVING EDITORIAL',
  url: 'POITARO.COM',
  ink: '#1F2937',
  paper: '#FAFAF8',
  blue: '#2F6FB3',
  sky: '#67B7E1',
  gray: '#E5E7EB',
};

const HIGHLIGHT_TERMS = [
  'Q4・Q5・Q8', 'Q4・Q5', 'GPT-5.6', 'ChatGPT', 'LM Studio',
  'PayPay', '楽天ポイント', '楽天ペイ', 'Vポイント', 'dポイント',
  'iPhone', 'iPad', 'Switch 2', 'Nintendo Switch', 'AI', '生成AI',
  '量子化', '無料', '最強', '還元', 'ポイント', '2026年版', '2026年最新',
];

function parseFrontmatter(markdown) {
  const match = /^---\s*\r?\n([\s\S]*?)\r?\n---/.exec(markdown);
  const attributes = {};
  if (!match) return attributes;

  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':');
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (!key) continue;
    value = value.replace(/^(['"])([\s\S]*)\1$/, '$2');
    attributes[key] = value;
  }
  return attributes;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderTitle(title) {
  const terms = HIGHLIGHT_TERMS
    .filter(term => title.toLowerCase().includes(term.toLowerCase()))
    .sort((a, b) => b.length - a.length);

  if (terms.length === 0) return escapeHtml(title);

  const pattern = new RegExp(terms.map(escapeRegExp).join('|'), 'gi');
  let cursor = 0;
  let highlights = 0;
  let html = '';
  let match;

  while ((match = pattern.exec(title)) !== null) {
    html += escapeHtml(title.slice(cursor, match.index));
    if (highlights < 2) {
      html += `<span>${escapeHtml(match[0])}</span>`;
      highlights += 1;
    } else {
      html += escapeHtml(match[0]);
    }
    cursor = match.index + match[0].length;
  }
  html += escapeHtml(title.slice(cursor));
  return html.replace(/\n/g, '<br>');
}

function visualLength(value) {
  return [...value].reduce((sum, char) => sum + (/^[\x00-\x7F]$/.test(char) ? 0.55 : 1), 0);
}

function splitBalancedTitle(title) {
  const units = typeof Intl.Segmenter === 'function'
    ? [...new Intl.Segmenter('ja', { granularity: 'word' }).segment(title)].map(item => item.segment)
    : [...title];
  const total = visualLength(title);
  const lineCount = total <= 18 ? 1 : total <= 34 ? 2 : total <= 52 ? 3 : 4;
  if (lineCount === 1) return [title];

  const lines = [];
  let start = 0;

  for (let line = 0; line < lineCount - 1; line += 1) {
    const linesRemaining = lineCount - line;
    const remaining = units.slice(start);
    const target = visualLength(remaining.join('')) / linesRemaining;
    const maxEnd = units.length - (linesRemaining - 1);
    let bestEnd = start + 1;
    let bestScore = Number.POSITIVE_INFINITY;

    for (let end = start + 1; end <= maxEnd; end += 1) {
      const segment = units.slice(start, end).join('');
      const width = visualLength(segment);
      const previousUnit = units[end - 1] || '';
      const nextUnit = units[end] || '';
      const previous = [...previousUnit].at(-1) || '';
      const next = [...nextUnit][0] || '';
      let penalty = Math.abs(width - target);

      if (/[A-Za-z0-9]/.test(previous) && /[A-Za-z0-9]/.test(next)) penalty += 30;
      if (/[「『（【〈《]/.test(previous)) penalty += 20;
      if (/[、。！？）」』】〉》]/.test(next)) penalty += 20;
      if (/[。！？】｜]/.test(previous)) penalty -= 1.5;
      if (segment.length < 4) penalty += 10;

      if (penalty < bestScore) {
        bestScore = penalty;
        bestEnd = end;
      }
    }

    lines.push(units.slice(start, bestEnd).join(''));
    start = bestEnd;
  }

  lines.push(units.slice(start).join(''));
  return lines;
}

function titleStyle(title) {
  const lines = splitBalancedTitle(title);
  const longestLine = Math.max(...lines.map(visualLength));
  const size = Math.max(38, Math.min(76, Math.floor(870 / longestLine)));
  return { size, lines };
}

function categoryVisual(category, title) {
  const source = `${category} ${title}`.toLowerCase();
  if (/ai|gpt|llm|生成|テクノロジ|プログラミング|codex/.test(source)) return 'AI';
  if (/pay|ポイント|ポイ活|決済|カード|楽天|dポイント|vポイント|ponta/.test(source)) return 'PAY';
  if (/iphone|ipad|スマホ|ガジェット|ゲーム|switch|エミュ|3ds|playstation/.test(source)) return 'TECH';
  if (/テレビ|tv|動画|映画|録画|配信/.test(source)) return 'MEDIA';
  if (/副業|投資|税|収入|お金|節約/.test(source)) return 'MONEY';
  return 'INFO';
}

function normalizeArticleFile(file) {
  const basename = path.basename(file.replace(/\\/g, '/'));
  if (!basename.toLowerCase().endsWith('.md')) return null;
  return fs.existsSync(path.join(ARTICLES_DIR, basename)) ? basename : null;
}

function getChangedArticleFiles() {
  const before = process.env.GITHUB_EVENT_BEFORE || process.env.GITHUB_BEFORE;
  const sha = process.env.GITHUB_SHA || 'HEAD';
  if (!before || /^0+$/.test(before)) return [];

  try {
    const output = execFileSync(
      'git',
      ['diff', '--name-only', '--diff-filter=AMR', before, sha, '--', 'articles'],
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    );
    return output.split(/\r?\n/).map(normalizeArticleFile).filter(Boolean);
  } catch {
    console.warn('変更記事を検出できないため、未生成サムネイルだけを対象にします。');
    return [];
  }
}

function getTargetFiles(allFiles) {
  const args = process.argv.slice(2);
  if (args.includes('--force') || args.includes('-f')) return allFiles;

  const explicit = args
    .filter(arg => !arg.startsWith('-'))
    .map(normalizeArticleFile)
    .filter(Boolean);
  if (explicit.length > 0) return [...new Set(explicit)];

  const changed = getChangedArticleFiles();
  const missing = allFiles.filter(file => {
    const slug = path.basename(file, '.md');
    return !fs.existsSync(path.join(OUT_DIR, `${slug}.png`));
  });
  return [...new Set([...changed, ...missing])];
}

function buildHtml({ title, category, date }) {
  const safeTitle = title || '新しい記事';
  const safeCategory = (category || '編集記事').slice(0, 24);
  const safeDate = (date || new Date().toISOString().slice(0, 10)).replace(/-/g, '.');
  const ghost = categoryVisual(safeCategory, safeTitle);
  const style = titleStyle(safeTitle);

  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
    body {
      position: relative;
      background: ${BRAND.paper};
      color: ${BRAND.ink};
      font-family: "Noto Sans CJK JP", "Noto Sans JP", "Yu Gothic", "YuGothic", "Meiryo", sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .frame {
      position: absolute;
      inset: 24px;
      overflow: hidden;
      border: 3px solid ${BRAND.ink};
      background: rgba(255, 255, 255, .5);
    }
    .dots {
      position: absolute;
      width: 410px;
      height: 215px;
      opacity: .48;
      background-image: radial-gradient(circle, rgba(47, 111, 179, .32) 4px, transparent 4.5px);
      background-size: 30px 30px;
    }
    .dots.top { top: 18px; left: -7px; }
    .dots.bottom { right: -18px; bottom: -8px; }
    .arc {
      position: absolute;
      left: -190px;
      top: 122px;
      width: 360px;
      height: 360px;
      border: 3px solid ${BRAND.blue};
      border-radius: 50%;
      opacity: .92;
    }
    .panel {
      position: absolute;
      right: -72px;
      top: -105px;
      width: 325px;
      height: 305px;
      transform: rotate(28deg);
      background: rgba(103, 183, 225, .34);
    }
    .ghost {
      position: absolute;
      right: 62px;
      bottom: 18px;
      color: transparent;
      -webkit-text-stroke: 2px rgba(103, 183, 225, .34);
      font-size: 250px;
      font-weight: 900;
      line-height: .8;
      letter-spacing: -.06em;
      user-select: none;
    }
    .layout {
      position: relative;
      z-index: 2;
      height: 100%;
      padding: 27px 38px 25px;
      display: grid;
      grid-template-rows: 72px 1fr 62px;
    }
    .header {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      gap: 24px;
      border-bottom: 2px solid ${BRAND.blue};
    }
    .site {
      font-size: 35px;
      line-height: 1;
      font-weight: 700;
      font-family: "Noto Sans CJK JP", "Noto Sans JP", sans-serif;
      white-space: nowrap;
      letter-spacing: -.04em;
    }
    .separator { width: 2px; height: 42px; background: ${BRAND.blue}; }
    .category {
      padding: 7px 18px 8px;
      background: ${BRAND.blue};
      color: white;
      font-size: 20px;
      font-weight: 700;
      line-height: 1;
      white-space: nowrap;
    }
    .title-wrap {
      min-height: 0;
      display: flex;
      align-items: center;
      padding: 18px 85px 16px;
    }
    h1 {
      position: relative;
      z-index: 3;
      width: 100%;
      margin: 0;
      font-size: ${style.size}px;
      font-weight: 700;
      font-family: "Noto Sans CJK JP", "Noto Sans JP", sans-serif;
      line-height: 1.2;
      letter-spacing: -.045em;
      overflow-wrap: anywhere;
      text-wrap: balance;
      text-align: center;
    }
    h1 span { color: ${BRAND.blue}; }
    .footer {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      border-top: 2px solid ${BRAND.blue};
      padding-top: 13px;
    }
    .date {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 25px;
      font-style: italic;
      letter-spacing: .02em;
    }
    .descriptor {
      text-align: right;
      font-size: 12px;
      font-weight: 700;
      line-height: 1.45;
      letter-spacing: .13em;
      white-space: nowrap;
    }
    .descriptor strong { color: ${BRAND.blue}; font-size: 16px; letter-spacing: .04em; }
  </style>
</head>
<body>
  <div class="frame">
    <div class="dots top"></div>
    <div class="dots bottom"></div>
    <div class="arc"></div>
    <div class="panel"></div>
    <div class="ghost">${escapeHtml(ghost)}</div>
    <div class="layout">
      <header class="header">
        <div class="site">${BRAND.siteName}</div>
        <div class="separator"></div>
        <div class="category">${escapeHtml(safeCategory)}</div>
      </header>
      <main class="title-wrap">
        <h1>${renderTitle(style.lines.join('\n'))}</h1>
      </main>
      <footer class="footer">
        <div class="date">${escapeHtml(safeDate)}</div>
        <div class="descriptor">${BRAND.descriptor}<br><strong>${BRAND.url}</strong></div>
      </footer>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const allFiles = fs.readdirSync(ARTICLES_DIR)
    .filter(file => file.toLowerCase().endsWith('.md'))
    .sort((a, b) => a.localeCompare(b, 'ja'));
  const targetFiles = getTargetFiles(allFiles);

  if (targetFiles.length === 0) {
    console.log('No thumbnails need regeneration.');
    return;
  }

  console.log(`Generating ${targetFiles.length} thumbnail(s) with Blue Editorial Card theme.`);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1200, height: 630, deviceScaleFactor: 1 },
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

    for (const file of targetFiles) {
      const slug = path.basename(file, '.md');
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8');
      const fm = parseFrontmatter(raw);
      const html = buildHtml({
        title: fm.title || slug,
        category: fm.category || '編集記事',
        date: fm.date || '',
      });

      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      await page.evaluate(async () => {
        await Promise.race([
          document.fonts.ready,
          new Promise(resolve => setTimeout(resolve, 10000)),
        ]);
      });
      await page.screenshot({
        path: path.join(OUT_DIR, `${slug}.png`),
        type: 'png',
        captureBeyondViewport: false,
      });
      console.log(`Generated: thumbnails/${slug}.png`);
    }
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error('Thumbnail generation failed:', error);
  process.exitCode = 1;
});
