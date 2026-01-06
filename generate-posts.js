const fs = require('fs');
const path = require('path');
// marked is an ESM-only package; import it dynamically inside an async wrapper below
let marked;

const articlesDir = path.join(__dirname, 'articles');
const articlesHtmlDir = path.join(__dirname, 'articles_html'); // 新しい出力ディレクトリ
const postsJsonPath = path.join(__dirname, 'posts.json');
const sitemapPath = path.join(__dirname, 'sitemap.xml');
// Some tools or previous registrations may use a capitalized filename ("Sitemap.xml").
// Create an uppercase-variant path so we can write both and avoid case-sensitivity issues
// on GitHub Pages / when external services (like Search Console) expect the other case.
const sitemapPathUpper = path.join(__dirname, 'Sitemap.xml');
const articleTemplatePath = path.join(__dirname, 'article-template.html'); // テンプレートファイルのパス

// Wrap the main script in an async IIFE so we can dynamically import ESM modules
(async () => {
    ({ marked } = await import('marked'));


// サイトURLを新ドメインに変更
const baseUrl = 'https://poitaro.com/';

// articles_html ディレクトリが存在しない場合は作成
if (!fs.existsSync(articlesHtmlDir)) {
    fs.mkdirSync(articlesHtmlDir);
}

// --- Frontmatterをパースする関数 ---
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
                    attributes[key.trim()] = value.slice(1, -1).split(',').map(tag => tag.trim().replace(/^"|"$/g, ''));
                } else {
                    attributes[key.trim()] = value.replace(/^['" ]|['" ]$/g, '');
                }
            }
        });
    }
    return attributes;
}

// --- Markdownコンテンツを抽出する関数 ---
function extractMarkdownContent(markdown) {
    const frontmatterRegex = /^---\s*[\s\S]*?\s*---/;
    return markdown.replace(frontmatterRegex, '').trim();
}

// 1. articlesディレクトリからマークダウンファイルの一覧を取得
const articleFiles = fs.readdirSync(articlesDir).filter(file => file.endsWith('.md'));

// 記事テンプレートを読み込む
const articleTemplate = fs.readFileSync(articleTemplatePath, 'utf8');

// 2. 各ファイルの情報を取得し、新しい順にソート
const rawPosts = articleFiles.map(file => {
    const filePath = path.join(articlesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const stats = fs.statSync(filePath);
    const attributes = parseFrontmatter(content);
    const markdownContent = extractMarkdownContent(content);
    let htmlContent = marked(markdownContent); // MarkdownをHTMLに変換

    // Remove the first H1 tag if it exists (to prevent duplicate titles)
    htmlContent = htmlContent.replace(/^\s*<h1[^>]*>.*?<\/h1>\s*/is, '');

    // H2見出しを抽出して目次を作成し、本文内のH2にidアンカーを付与
    const h2Regex = /<h2>(.*?)<\/h2>/g;
    const h2Matches = [...htmlContent.matchAll(h2Regex)].map(m => m[1]);
    const slugify = (s) => s
        .toString()
        .trim()
        .toLowerCase()
        .replace(/<[^>]+>/g, '') // strip HTML
        .replace(/&[^;]+;/g, '') // strip entities
        .replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9faf\s-]/g, '') // keep jp chars
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

    const h2Anchors = h2Matches.map(text => ({ text, id: slugify(text) }));
    if (h2Anchors.length > 0) {
        // 本文の<h2>にidを付与
        h2Anchors.forEach(({ id, text }) => {
            const h2Tag = `<h2>${text}</h2>`;
            const h2TagWithId = `<h2 id="${id}">${text}</h2>`;
            htmlContent = htmlContent.replace(h2Tag, h2TagWithId);
        });
    }

    const slug = file.replace(/\.md$/, ''); // ファイル名からスラッグを生成
    const articleHtmlFileName = `${slug}.html`;
    const articleRelativeUrl = `articles_html/${articleHtmlFileName}`;
    const articleAbsoluteUrl = `${baseUrl}${articleRelativeUrl}`;
    const articleHtmlFilePath = path.join(articlesHtmlDir, articleHtmlFileName);

    // タグのHTMLを生成
    let tagsHtml = '';
    if (attributes.tags && attributes.tags.length > 0) {
        tagsHtml = attributes.tags.map(tag => `<a href="${baseUrl}index.html?tag=${encodeURIComponent(tag)}">${tag}</a>`).join('');
    } else {
        // タグがない場合はタグセクションを非表示にするためのコメント
        tagsHtml = '<!-- No tags, hide section -->';
    }

    // Determine image fields
    const fmImage = attributes.thumbnail || attributes.image || attributes.image_url || attributes.imageUrl || attributes.img || null;
    const generatedThumbRel = `thumbnails/${slug}.png`;
    const generatedThumbExists = (() => { try { return fs.existsSync(path.join(__dirname, generatedThumbRel)); } catch { return false; } })();
    const generatedThumbAbs = generatedThumbExists ? `${baseUrl}${generatedThumbRel}` : null;

    // Logic Update:
    // 1. Site Display (Hero/Grid): Prefer Clean Image (Frontmatter) -> Fallback to Generated -> Fallback to Placeholder
    // 2. OGP (Social): Prefer Generated (Text) -> Fallback to Clean -> Fallback to Placeholder

    let displayImageValue;
    let displayImageAbs;
    
    // Resolve Display Image (Prioritize Generated Thumbnail for "Text on Image" look)
    if (generatedThumbExists) {
        displayImageValue = `../${generatedThumbRel}`;
        displayImageAbs = generatedThumbAbs;
    } else if (fmImage) {
        displayImageValue = fmImage;
        displayImageAbs = /^https?:\/\//.test(fmImage) ? fmImage : `${baseUrl}${fmImage.replace(/^\.\/?/, '')}`;
    } else {
        displayImageValue = 'https://placehold.co/1200x630/111827/FFFFFF?text=PoiTaro';
        displayImageAbs = displayImageValue;
    }

    // Resolve OGP Image (Text-heavy)
    const ogImageValue = generatedThumbAbs || displayImageAbs;

        return {
        slug: slug, // スラッグを追加
        url: articleRelativeUrl, // 新しいURL形式
        mtime: stats.mtime.getTime(),
        title: attributes.title || '無題の記事',
        date: attributes.date || new Date(stats.mtime).toISOString().split('T')[0],
        category: attributes.category || '未分類',
        categoryColor: attributes.categoryColor || 'gray',
    image: displayImageValue, // Used for site display (clean)
    imageAbsolute: displayImageAbs,
    ogImage: ogImageValue, // Used for meta tags (text)
        description: attributes.description || '記事の説明がありません。',
        tags: attributes.tags || [],
            content: htmlContent, // Add the full HTML content
            toc: h2Anchors, // Array of {text, id}
                articleHtmlFilePath,
                articleAbsoluteUrl,
                tagsHtml
    };
}).sort((a, b) => {
    // date frontmatterで降順ソート（新しい記事が先頭）
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
}); // 降順（新しいものが先頭）にソート

// 関連記事を計算する関数（タグ一致を優先、次にカテゴリ一致。自分自身は除外。最大3件）
function getRelatedPosts(current, all) {
    const candidates = all.filter(p => p.slug !== current.slug);
    const score = (p) => {
        const tagOverlap = (current.tags || []).filter(t => (p.tags || []).includes(t)).length;
        const categoryBonus = current.category && p.category && current.category === p.category ? 0.5 : 0;
        return tagOverlap + categoryBonus;
    };
    const scored = candidates
        .map(p => ({ p, s: score(p) }))
        .sort((a, b) => b.s - a.s || b.p.mtime - a.p.mtime);

    // まずスコア>0を優先的に最大3件
    const primary = scored.filter(({ s }) => s > 0).slice(0, 3).map(({ p }) => p);
    if (primary.length === 3) return primary;

    // 足りない分は最新順で補充（重複を避ける）
    const need = 3 - primary.length;
    const fallback = candidates
        .filter(p => !primary.some(pp => pp.slug === p.slug))
        .sort((a, b) => b.mtime - a.mtime)
        .slice(0, need);
    return primary.concat(fallback);
}

// 関連記事セクションのHTMLを生成
function buildRelatedHtml(related) {
        if (!related || related.length === 0) return '';
        return `
        <section class="mt-16 pt-10 border-t-2 border-black">
            <h2 class="font-anton text-3xl mb-6 flex items-center"><span class="text-brand-accent mr-2 text-4xl">>></span>RELATED ISSUES</h2>
            <div class="grid gap-4 grid-cols-1 md:grid-cols-3">
                ${related.map(r => `
                    <div class="group">
                        <a href="../${r.url}" class="block bg-white border border-gray-200 hover:border-black transition-colors overflow-hidden">
                            <div class="w-full aspect-video overflow-hidden relative">
                                <img src="${r.image}" alt="${r.title}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 mix-blend-multiply">
                                <div class="absolute inset-0 bg-brand-accent/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        </a>
                        <a href="../${r.url}" class="block mt-2 text-center py-2 border border-black bg-white hover:bg-black hover:text-brand-accent transition-colors font-anton text-sm tracking-wider">
                            記事を見る >>
                        </a>
                    </div>
                `).join('')}
            </div>
        </section>
        `;
}

// 目次のHTMLを生成（H2のみ）
function buildTocHtml(toc) {
        if (!toc || toc.length === 0) return '';
        return `
        <nav aria-label="目次" class="mb-12 p-6 border border-gray-300 bg-brand-white relative">
            <div class="absolute -top-3 left-4 bg-brand-white px-2 font-anton text-xl tracking-wider">INDEX</div>
            <ul class="space-y-3 mt-2">
                ${toc.map((item, index) => `
                    <li class="flex items-baseline group">
                        <span class="font-anton text-brand-accent mr-3 text-lg">0${index + 1}.</span>
                        <a href="#${item.id}" class="font-sans font-bold text-sm border-b border-transparent hover:border-black transition-colors group-hover:text-brand-purple">
                            ${item.text}
                        </a>
                    </li>
                `).join('')}
            </ul>
        </nav>`;
}

// 3. 各記事の最終HTMLを生成（関連記事を挿入）
rawPosts.forEach(current => {
        const related = getRelatedPosts(current, rawPosts);
        const relatedHtml = buildRelatedHtml(related);
    const tocHtml = buildTocHtml(current.toc);
    
    // カテゴリをURLパラメータ用にエンコード（実際のカテゴリ名をそのまま使用）
    const categoryForUrl = encodeURIComponent(current.category || '');

    // テーブルを横スクロール可能にラップ（補助テキスト付き）
    let contentWithScrollableTables = current.content.replace(
        /<table>/g,
        '<div class="table-wrapper"><table>'
    ).replace(
        /<\/table>/g,
        '</table><div class="table-scroll-hint">スクロールして全体を表示</div></div>'
    );

    let finalHtml = articleTemplate
                .replace(/{{title}}/g, current.title)
                .replace(/{{date}}/g, current.date)
                .replace(/{{category}}/g, current.category)
                .replace(/{{category_slug}}/g, categoryForUrl)
                .replace(/{{description}}/g, current.description)
                .replace(/{{image}}/g, current.image)
        .replace(/{{ogImage}}/g, current.ogImage || current.imageAbsolute)
                .replace(/{{url}}/g, current.articleAbsoluteUrl)
                .replace(/{{alt_title}}/g, current.title)
                .replace(/{{categoryColor}}/g, current.categoryColor)
                .replace(/<!-- Tags will be displayed here -->/g, current.tagsHtml)
            .replace(/<!-- TOC will be displayed here -->/g, tocHtml)
            .replace(/{{content}}/g, contentWithScrollableTables)
                .replace(/<!-- Related posts will be displayed here -->/g, relatedHtml);

        fs.writeFileSync(current.articleHtmlFilePath, finalHtml);
});

// posts.jsonファイルに書き出す（公開メタ + 更新日時）
const finalPosts = rawPosts.map(({ mtime, articleHtmlFilePath, articleAbsoluteUrl, tagsHtml, content, ...rest }) => ({
    ...rest,
    updatedAt: new Date(mtime).toISOString()
}));
fs.writeFileSync(postsJsonPath, JSON.stringify(finalPosts, null, 4));

console.log(`Successfully generated posts.json with ${finalPosts.length} articles.`);
console.log(`Successfully generated ${finalPosts.length} HTML articles in ${articlesHtmlDir}.`);

// 4. サイトマップ(sitemap.xml)を生成
const sitemapContent = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}index.html</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
    <url>
        <loc>${baseUrl}contact.html</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.4</priority>
    </url>
${rawPosts.map(post => `
  <url>
    <loc>${baseUrl}${post.url}</loc>
    <lastmod>${new Date(post.mtime).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`).join('')}
</urlset>
`.trim();

fs.writeFileSync(sitemapPath, sitemapContent);
// Also write an uppercase variant to cover tooling or registration that used a different case
try {
    fs.writeFileSync(sitemapPathUpper, sitemapContent);
    console.log('Also wrote Sitemap.xml (uppercase) for compatibility.');
} catch (e) {
    // Non-fatal: log and continue
    console.warn('Failed to write uppercase Sitemap.xml (this is non-fatal):', e && e.message);
}

console.log('Successfully generated sitemap.xml');

})().catch(err => {
    console.error('Fatal error in generate-posts.js:', err);
    process.exit(1);
});
