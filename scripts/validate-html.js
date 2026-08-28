const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const files = ['index.html', 'article-template.html', 'demo-article.html']
    .filter((file) => fs.existsSync(path.join(root, file)));
let failed = false;

for (const file of files) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    const inlineScripts = [...source.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)]
        .map((match) => match[1])
        .filter((script) => script.trim());

    for (const script of inlineScripts) {
        try {
            new Function(script);
        } catch (error) {
            failed = true;
            console.error(`${file}: inline script parse error: ${error.message}`);
        }
    }

    if (duplicateIds.length > 0) {
        failed = true;
        console.error(`${file}: duplicate IDs: ${duplicateIds.join(', ')}`);
    }

    if (!source.includes('<main')) {
        failed = true;
        console.error(`${file}: <main> element is missing`);
    }

    console.log(`${file}: ${inlineScripts.length} inline scripts parsed, ${ids.length} IDs checked`);
}

const demoPath = path.join(root, 'demo-article.html');
if (fs.existsSync(demoPath)) {
    const demoSource = fs.readFileSync(demoPath, 'utf8');
    if (/{{[^}]+}}/.test(demoSource)) {
        failed = true;
        console.error('demo-article.html: unresolved template placeholder found');
    }
}

process.exitCode = failed ? 1 : 0;
