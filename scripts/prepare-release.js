const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'release-candidate');
const FILES = [
  '.nojekyll', 'CNAME', 'ads.txt', 'robots.txt', 'sitemap.xml', 'llms.txt',
  'index.html', 'about.html', 'contact.html', 'shindan.html', '404.html',
  'site.webmanifest', 'favicon.ico', 'posts.json',
  'announcement.html', 'announcement-config.json', 'announcement-content.html', 'contact-config.json'
];
const DIRECTORIES = ['articles_html'];
const EXCLUDED_ARTICLES = new Set(['recommended-point-sites.html']);

if (path.resolve(OUT) !== path.resolve(ROOT, 'release-candidate')) throw new Error('公開候補の出力先が不正です');
if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
for (const file of FILES) {
  const source = path.join(ROOT, file);
  if (!fs.existsSync(source)) throw new Error(`公開ファイルがありません: ${file}`);
  fs.copyFileSync(source, path.join(OUT, file));
}
for (const directory of DIRECTORIES) {
  fs.cpSync(path.join(ROOT, directory), path.join(OUT, directory), {
    recursive: true,
    filter: source => !(directory === 'articles_html' && EXCLUDED_ARTICLES.has(path.basename(source)))
  });
}
const publicHtml = [
  'index.html', 'about.html', 'contact.html', 'shindan.html', '404.html',
  ...fs.readdirSync(path.join(ROOT, 'articles_html'))
    .filter(name => name.endsWith('.html') && !EXCLUDED_ARTICLES.has(name))
    .map(name => path.join('articles_html', name))
];
const referencedAssets = new Set();
for (const relative of [...publicHtml, 'site.webmanifest', 'announcement.html']) {
  const content = fs.readFileSync(path.join(ROOT, relative), 'utf8');
  for (const match of content.matchAll(/(?:\.\.\/|\/)?((?:images|thumbnails)\/[^"'`\s)<>{}]+)/g)) {
    let asset = match[1].split(/[?#]/)[0];
    try { asset = decodeURIComponent(asset); } catch {}
    referencedAssets.add(asset.replaceAll('/', path.sep));
  }
}
for (const post of JSON.parse(fs.readFileSync(path.join(ROOT, 'posts.json'), 'utf8'))) {
  referencedAssets.add(path.join('thumbnails', `${post.slug}.png`));
}
referencedAssets.add(path.join('thumbnails', 'og-image-editorial-v1.png'));
for (const relative of referencedAssets) {
  const source = path.join(ROOT, relative);
  if (!fs.existsSync(source)) throw new Error(`参照アセットがありません: ${relative}`);
  const destination = path.join(OUT, relative);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}
const records = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else {
      const content = fs.readFileSync(full);
      records.push({
        path: path.relative(OUT, full).replaceAll(path.sep, '/'),
        bytes: content.length,
        sha256: crypto.createHash('sha256').update(content).digest('hex')
      });
    }
  }
}
walk(OUT);
records.sort((a, b) => a.path.localeCompare(b.path));
const manifest = {
  generatedAt: new Date().toISOString(),
  source: 'poitaro-maximize-working',
  productionTouched: false,
  excludedLegacyFiles: ['articles_html/recommended-point-sites.html'],
  payloadFileCount: records.length,
  totalBytes: records.reduce((sum, item) => sum + item.bytes, 0),
  files: records
};
fs.writeFileSync(path.join(OUT, 'release-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`公開候補を作成しました: ${OUT}`);
console.log(`${manifest.payloadFileCount} payload files / ${manifest.totalBytes} bytes`);
