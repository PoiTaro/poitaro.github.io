const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const root = path.resolve(__dirname, '..');
const base = process.env.POITARO_PREVIEW_URL || 'http://127.0.0.1:4174';
const output = path.join(root, 'preview-assets', 'preflight');
const posts = JSON.parse(fs.readFileSync(path.join(root, 'posts.json'), 'utf8'));

async function checkHttp() {
  const urls = ['index.html', 'about.html', 'contact.html', 'shindan.html', '404.html', ...posts.map(post => post.url)];
  const failures = [];
  for (let start = 0; start < urls.length; start += 20) {
    const batch = urls.slice(start, start + 20);
    const results = await Promise.all(batch.map(async relative => {
      try {
        const response = await fetch(`${base}/${relative}`);
        return response.ok ? null : `${relative}: HTTP ${response.status}`;
      } catch (error) { return `${relative}: ${error.message}`; }
    }));
    failures.push(...results.filter(Boolean));
  }
  if (failures.length) throw new Error(`HTTP failures:\n${failures.join('\n')}`);
  console.log(`${urls.length} ページの HTTP 応答を確認しました。`);
}

async function main() {
  await checkHttp();
  fs.mkdirSync(output, { recursive: true });
  const browser = await puppeteer.launch({ headless: true });
  const failures = [];
  try {
    const cases = [
      { name: 'top-desktop', path: 'index.html', viewport: { width: 1440, height: 1000 } },
      { name: 'top-mobile', path: 'index.html', viewport: { width: 390, height: 844, isMobile: true } },
      { name: 'article-desktop', path: 'articles_html/lm-studio-quantization-q4-q5-q8-2026.html', viewport: { width: 1440, height: 1000 } },
      { name: 'article-mobile', path: 'articles_html/lm-studio-quantization-q4-q5-q8-2026.html', viewport: { width: 390, height: 844, isMobile: true } }
    ];
    for (const item of cases) {
      const page = await browser.newPage();
      await page.setViewport(item.viewport);
      page.on('pageerror', error => failures.push(`${item.name}: ${error.message}`));
      page.on('requestfailed', request => {
        if (request.url().startsWith(base)) failures.push(`${item.name}: ${request.url()} (${request.failure()?.errorText})`);
      });
      const response = await page.goto(`${base}/${item.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      if (!response?.ok()) failures.push(`${item.name}: HTTP ${response?.status()}`);
      await new Promise(resolve => setTimeout(resolve, 1200));
      const overflow = await page.evaluate(() => {
        const viewportWidth = document.documentElement.clientWidth;
        const documentWidth = document.documentElement.scrollWidth;
        const offenders = [...document.querySelectorAll('body *')].map(element => {
          const rect = element.getBoundingClientRect();
          return {
            tag: element.tagName.toLowerCase(),
            id: element.id,
            className: typeof element.className === 'string' ? element.className.slice(0, 100) : '',
            left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width)
          };
        }).filter(item => item.right > viewportWidth + 2 || item.left < -2)
          .sort((a, b) => b.right - a.right).slice(0, 8);
        return { viewportWidth, documentWidth, offenders };
      });
      if (overflow.documentWidth > overflow.viewportWidth + 2) {
        failures.push(`${item.name}: 横幅 ${overflow.documentWidth}px > ${overflow.viewportWidth}px\n${JSON.stringify(overflow.offenders, null, 2)}`);
      }
      await page.screenshot({ path: path.join(output, `${item.name}.png`), fullPage: true });
      await page.close();
    }
  } finally { await browser.close(); }
  if (failures.length) throw new Error(failures.join('\n'));
  console.log(`PC・スマホの画面検査に成功しました: ${output}`);
}

main().catch(error => { console.error(error); process.exit(1); });
