const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const ROOT = __dirname;
const ARTICLES_DIR = path.join(ROOT, 'articles');
const OUTPUT_DIR = path.join(ROOT, 'articles_html');
const TEMPLATE_PATH = path.join(ROOT, 'article-template.html');
const POSTS_PATH = path.join(ROOT, 'posts.json');
const SITE_URL = 'https://poitaro.com';
const CHECK_ONLY = process.argv.includes('--check');

function parseFrontmatter(source, filename) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) throw new Error(`${filename}: frontmatter がありません`);
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!field) continue;
    const [, key, raw] = field;
    const value = raw.trim();
    if (!value) data[key] = '';
    else if (value.startsWith('[') || value.startsWith('{') || value.startsWith('"')) {
      try { data[key] = JSON.parse(value); }
      catch { data[key] = value.replace(/^['"]|['"]$/g, ''); }
    } else if (value.startsWith("'") && value.endsWith("'")) {
      data[key] = value.slice(1, -1).replace(/''/g, "'");
    } else data[key] = value;
  }
  return { data, body: source.slice(match[0].length) };
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function plainText(html) {
  return String(html).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function headingId(text, used) {
  const base = plainText(text).normalize('NFKC').toLowerCase()
    .replace(/[^\p{L}\p{N}-]+/gu, '');
  let id = base || 'section';
  let suffix = 2;
  while (used.has(id)) id = `${base || 'section'}-${suffix++}`;
  used.add(id);
  return id;
}

function renderMarkdown(markdown) {
  const withoutTitle = markdown
    .replace(/^\s*#\s+[^\r\n]+\r?\n+/, '')
    .replace(/\s+id=["']article-body["']/gi, '');
  let html = marked.parse(withoutTitle, { gfm: true, breaks: false });
  const toc = [];
  const used = new Set();
  html = html.replace(/<h([23])(?:\s[^>]*)?>([\s\S]*?)<\/h\1>/g, (_, depth, inner) => {
    const id = headingId(inner, used);
    if (depth === '2') toc.push({ text: plainText(inner), id });
    return `<h${depth} id="${escapeHtml(id)}">${inner}</h${depth}>`;
  });
  const tocHtml = toc.length ? `<nav aria-label="目次" class="mb-12 p-6 border border-gray-300 bg-brand-white relative">
            <div class="absolute -top-3 left-4 bg-brand-white px-2 font-anton text-xl tracking-wider">INDEX</div>
            <ul class="space-y-3 mt-2">
${toc.map((item, index) => `                <li class="flex items-baseline group">
                    <span class="font-anton text-brand-accent mr-3 text-lg">${String(index + 1).padStart(2, '0')}.</span>
                    <a href="#${escapeHtml(item.id)}" class="font-sans font-bold text-sm border-b border-transparent hover:border-brand-black transition-colors group-hover:text-brand-purple">${escapeHtml(item.text)}</a>
                </li>`).join('\n')}
            </ul>
        </nav>\n` : '';
  return { html: tocHtml + html, toc };
}

function isoPublished(date) {
  const parsed = new Date(`${date}T00:00:00+09:00`);
  if (Number.isNaN(parsed.getTime())) throw new Error(`不正な日付: ${date}`);
  return parsed.toISOString();
}

function replaceTemplate(template, values) {
  return template.replace(/\{\{([A-Za-z0-9_]+)\}\}/g, (whole, key) => {
    if (!(key in values)) throw new Error(`テンプレート値がありません: ${key}`);
    return values[key];
  });
}

function jsonLd(post) {
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: [post.ogImage],
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: { '@type': 'Person', name: 'ポイ活Pay太郎', url: `${SITE_URL}/about.html` },
    publisher: { '@type': 'Organization', name: 'ポイ活Pay太郎', url: `${SITE_URL}/` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/${post.url}` },
    articleSection: post.category,
    keywords: post.tags.join(', ')
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: post.category, item: `${SITE_URL}/?category=${encodeURIComponent(post.category)}` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/${post.url}` }
    ]
  };
  return { article: JSON.stringify(article), breadcrumb: JSON.stringify(breadcrumb) };
}

function main() {
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const previous = fs.existsSync(POSTS_PATH) ? JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8')) : [];
  const previousBySlug = new Map(previous.map(post => [post.slug, post]));
  const generated = [];
  const errors = [];

  for (const filename of fs.readdirSync(ARTICLES_DIR).filter(name => name.endsWith('.md')).sort()) {
    try {
      const slug = path.basename(filename, '.md');
      const fullPath = path.join(ARTICLES_DIR, filename);
      const { data, body } = parseFrontmatter(fs.readFileSync(fullPath, 'utf8'), filename);
      const old = previousBySlug.get(slug);
      for (const key of ['title', 'date', 'category', 'description', 'categoryColor']) {
        if (!data[key] && old?.[key]) data[key] = old[key];
      }
      if ((!Array.isArray(data.tags) || data.tags.length === 0) && Array.isArray(old?.tags)) data.tags = old.tags;
      for (const required of ['title', 'date', 'category', 'description']) {
        if (!data[required]) throw new Error(`${filename}: ${required} がありません`);
      }
      const rendered = renderMarkdown(body);
      const stat = fs.statSync(fullPath);
      const datePublished = old?.datePublished || isoPublished(data.date);
      const dateModified = old?.dateModified || stat.mtime.toISOString();
      const thumbnail = `../thumbnails/${slug}.png`;
      const absoluteThumbnail = `${SITE_URL}/thumbnails/${encodeURIComponent(slug)}.png`;
      const post = {
        slug,
        url: `articles_html/${slug}.html`,
        title: String(data.title),
        date: String(data.date),
        datePublished,
        dateModified,
        dateModifiedLabel: dateModified.slice(0, 10),
        category: String(data.category),
        categoryColor: String(data.categoryColor || '#2F6FB3'),
        image: thumbnail,
        imageAbsolute: absoluteThumbnail,
        ogImage: absoluteThumbnail,
        description: String(data.description),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        toc: rendered.toc,
        updatedAt: dateModified
      };
      const ld = jsonLd(post);
      const html = replaceTemplate(template, {
        title: escapeHtml(post.title), alt_title: escapeHtml(post.title),
        description: escapeHtml(post.description), category: escapeHtml(post.category),
        categoryColor: escapeHtml(post.categoryColor), date: escapeHtml(post.date),
        datePublished: escapeHtml(post.datePublished), dateModified: escapeHtml(post.dateModified),
        dateModifiedLabel: escapeHtml(post.dateModifiedLabel), image: escapeHtml(post.image),
        ogImage: escapeHtml(post.ogImage), url: escapeHtml(`${SITE_URL}/${post.url}`),
        articleJsonLd: ld.article.replace(/</g, '\\u003c'),
        breadcrumbJsonLd: ld.breadcrumb.replace(/</g, '\\u003c'), content: rendered.html
      });
      const thumbPath = path.join(ROOT, 'thumbnails', `${slug}.png`);
      if (!fs.existsSync(thumbPath)) throw new Error(`${filename}: サムネイルがありません (${thumbPath})`);
      generated.push({ post, html, filename });
    } catch (error) { errors.push(error.message); }
  }

  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
    return;
  }

  const previousOrder = new Map(previous.map((post, index) => [post.slug, index]));
  generated.sort((a, b) => b.post.date.localeCompare(a.post.date) ||
    (previousOrder.get(a.post.slug) ?? 9999) - (previousOrder.get(b.post.slug) ?? 9999) ||
    a.post.slug.localeCompare(b.post.slug));

  if (!CHECK_ONLY) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    for (const item of generated) fs.writeFileSync(path.join(OUTPUT_DIR, `${item.post.slug}.html`), item.html);
    fs.writeFileSync(POSTS_PATH, `${JSON.stringify(generated.map(item => item.post), null, 2)}\n`);
  }
  console.log(`${generated.length} 記事を${CHECK_ONLY ? '検査' : '生成'}しました。`);
}

main();
