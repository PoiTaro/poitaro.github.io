const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://poitaro.com';
const posts = JSON.parse(fs.readFileSync(path.join(ROOT, 'posts.json'), 'utf8'));

const staticPages = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about.html', changefreq: 'monthly', priority: '0.5' },
  { path: '/contact.html', changefreq: 'monthly', priority: '0.4' },
  { path: '/shindan.html', changefreq: 'monthly', priority: '0.5' }
];
const pageModified = file => fs.statSync(path.join(ROOT, file)).mtime.toISOString();
const entries = staticPages.map(page => ({ ...page, lastmod: pageModified(page.path === '/' ? 'index.html' : page.path.slice(1)) }));
for (const post of posts) entries.push({
  path: `/${post.url}`, lastmod: post.dateModified || post.updatedAt,
  changefreq: 'monthly', priority: '0.8'
});
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map(item => `  <url>\n    <loc>${SITE}${item.path}</loc>\n    <lastmod>${item.lastmod}</lastmod>\n    <changefreq>${item.changefreq}</changefreq>\n    <priority>${item.priority}</priority>\n  </url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
console.log(`${entries.length} URL の sitemap.xml を生成しました。`);
