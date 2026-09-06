const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, '..');
const PUBLIC_PAGES = ['index.html', 'about.html', 'contact.html', 'shindan.html', '404.html'];
const errors = [];
const warnings = [];
const posts = JSON.parse(fs.readFileSync(path.join(ROOT, 'posts.json'), 'utf8'));
const articlePages = posts.map(post => post.url.replaceAll('/', path.sep));
const pages = [...PUBLIC_PAGES, ...articlePages];

function exists(relative) { return fs.existsSync(path.join(ROOT, relative)); }
function addError(file, message) { errors.push(`${file}: ${message}`); }
function attrs(tag) {
  const result = {};
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) result[match[1].toLowerCase()] = match[2] ?? match[3];
  return result;
}
function localTarget(file, ref) {
  const clean = ref.split(/[?#]/)[0];
  if (!clean || /^(?:https?:|mailto:|tel:|data:|javascript:|#|\/\/)/i.test(clean)) return null;
  const decoded = decodeURIComponent(clean);
  if (decoded.startsWith('/')) return decoded.replace(/^\/+/, '');
  return path.normalize(path.join(path.dirname(file), decoded));
}

for (const file of pages) {
  if (!exists(file)) { addError(file, 'ファイルがありません'); continue; }
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const head = html.match(/<head[\s\S]*?<\/head>/i)?.[0] || '';
  if (!/<title>[^<]+<\/title>/i.test(head)) addError(file, 'title がありません');
  if (!/<meta[^>]+name=["']description["'][^>]+content=["'][^"']+/i.test(head) && !/<meta[^>]+content=["'][^"']+["'][^>]+name=["']description["']/i.test(head)) addError(file, 'meta description がありません');
  if (!/<link[^>]+rel=["']canonical["']/i.test(head)) addError(file, 'canonical がありません');
  if (!/<meta[^>]+property=["']og:image["']/i.test(head)) addError(file, 'og:image がありません');
  if (!/<meta[^>]+name=["']viewport["']/i.test(head)) addError(file, 'viewport がありません');
  if (/\{\{[^}]+\}\}/.test(html)) addError(file, '未解決のテンプレート変数があります');

  for (const block of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(block[1]); } catch (error) { addError(file, `JSON-LD が不正です (${error.message})`); }
  }
  const stripped = html.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '');
  for (const tag of stripped.matchAll(/<(?:img|script|link|a)\b[^>]*(?:src|href)\s*=\s*(?:"[^"]*"|'[^']*')[^>]*>/gi)) {
    const fields = attrs(tag[0]);
    const ref = fields.src || fields.href;
    const target = localTarget(file, ref);
    if (target && !exists(target)) addError(file, `参照先がありません: ${ref}`);
  }
  const ids = [...html.matchAll(/\sid=["']([^"']+)["']/gi)].map(match => match[1]);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicates.length) addError(file, `重複 id: ${duplicates.join(', ')}`);
}

const slugs = new Set();
for (const post of posts) {
  if (slugs.has(post.slug)) addError('posts.json', `slug 重複: ${post.slug}`);
  slugs.add(post.slug);
  if (!exists(post.url)) addError('posts.json', `記事がありません: ${post.url}`);
  const thumb = `thumbnails/${post.slug}.png`;
  if (!exists(thumb)) addError('posts.json', `サムネイルがありません: ${thumb}`);
}
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>https:\/\/poitaro\.com([^<]*)<\/loc>/g)].map(match => match[1]));
for (const required of ['/', '/about.html', '/contact.html', '/shindan.html']) if (!sitemapUrls.has(required)) addError('sitemap.xml', `URL がありません: ${required}`);
for (const post of posts) if (!sitemapUrls.has(`/${post.url}`)) addError('sitemap.xml', `記事 URL がありません: /${post.url}`);
if (sitemapUrls.has('/index.html')) warnings.push('sitemap.xml: / と /index.html が重複しています');

for (const warning of warnings) console.warn(`WARN ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`ERROR ${error}`);
  console.error(`検証失敗: ${errors.length} 件`);
  process.exit(1);
}
console.log(`検証成功: ${pages.length} HTML、${posts.length} 記事、${sitemapUrls.size} sitemap URL`);
