const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'images', 'gpt56-codex-effort-cost-graph.png');

const models = [
  { name: 'Luna', color: '#67B7E1', baseCost: 0.044, baseScore: 74.6 },
  { name: 'Terra', color: '#2F6FB3', baseCost: 0.440, baseScore: 77.4 },
  { name: 'Sol', color: '#1F2937', baseCost: 1.100, baseScore: 80.0 }
];
const efforts = [
  { name: 'Low', cost: 0.70, score: -1.5 },
  { name: 'Medium', cost: 1.00, score: 0 },
  { name: 'High', cost: 1.40, score: 0.9 },
  { name: 'XHigh', cost: 1.90, score: 1.6 },
  { name: 'Max', cost: 2.50, score: 2.0 }
];
const width = 1600, height = 900;
const plot = { left: 180, top: 150, right: 1480, bottom: 720 };
const maxCost = 3.0, minScore = 72, maxScore = 83;
const x = value => plot.left + value / maxCost * (plot.right - plot.left);
const y = value => plot.bottom - (value - minScore) / (maxScore - minScore) * (plot.bottom - plot.top);
const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;' }[char]));

const points = models.flatMap((model, modelIndex) => efforts.map((effort, effortIndex) => {
  const cost = model.baseCost * effort.cost;
  const score = Math.min(82.4, model.baseScore + effort.score);
  const dx = modelIndex === 0 ? 15 : 17;
  const dy = effortIndex % 2 ? 23 : -14;
  return `<g><circle cx="${x(cost)}" cy="${y(score)}" r="12" fill="${model.color}" stroke="#FAFAF8" stroke-width="5"/><text x="${x(cost)+dx}" y="${y(score)+dy}" class="point">${esc(model.name)} ${esc(effort.name)}</text></g>`;
})).join('');
const xGrid = [0, .5, 1, 1.5, 2, 2.5, 3].map(value => `<line x1="${x(value)}" y1="${plot.top}" x2="${x(value)}" y2="${plot.bottom}" class="grid"/><text x="${x(value)}" y="${plot.bottom+42}" class="tick" text-anchor="middle">$${value.toFixed(1)}</text>`).join('');
const yGrid = [72,74,76,78,80,82].map(value => `<line x1="${plot.left}" y1="${y(value)}" x2="${plot.right}" y2="${y(value)}" class="grid"/><text x="${plot.left-24}" y="${y(value)+7}" class="tick" text-anchor="end">${value}</text>`).join('');
const legend = models.map((model, index) => `<circle cx="${1040+index*145}" cy="100" r="9" fill="${model.color}"/><text x="${1058+index*145}" y="107" class="legend">${model.name}</text>`).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<style>
text{font-family:'Noto Sans JP','Yu Gothic',sans-serif;fill:#1F2937}.title{font-size:40px;font-weight:900}.subtitle{font-size:18px;fill:#6B7280}.axis{font-size:20px;font-weight:700}.tick{font-size:16px;fill:#6B7280}.point{font-size:15px;font-weight:700}.legend{font-size:17px;font-weight:700}.note{font-size:16px;fill:#4B5563}.grid{stroke:#DDECF5;stroke-width:2}.frame{stroke:#1F2937;stroke-width:3;fill:none}
</style>
<rect width="1600" height="900" fill="#FAFAF8"/><rect x="24" y="24" width="1552" height="852" class="frame"/>
<circle cx="78" cy="82" r="30" fill="none" stroke="#67B7E1" stroke-width="12" opacity=".35"/><g opacity=".35">${Array.from({length:10},(_,i)=>Array.from({length:5},(_,j)=>`<circle cx="${1380+i*16}" cy="${55+j*16}" r="2.5" fill="#2F6FB3"/>`).join('')).join('')}</g>
<text x="82" y="92" class="title">GPT-5.6：推論設定のコストと性能イメージ</text><text x="84" y="126" class="subtitle">入力10万＋出力2万トークン相当の試算／点は独立した選択肢</text>${legend}
${xGrid}${yGrid}<rect x="${plot.left}" y="${plot.top}" width="${plot.right-plot.left}" height="${plot.bottom-plot.top}" class="frame"/>
${points}
<text x="${(plot.left+plot.right)/2}" y="795" class="axis" text-anchor="middle">推定コスト（米ドル） →</text>
<text x="60" y="${(plot.top+plot.bottom)/2}" class="axis" text-anchor="middle" transform="rotate(-90 60 ${(plot.top+plot.bottom)/2})">性能イメージ →</text>
<text x="800" y="842" class="note" text-anchor="middle">※ effort別の性能・消費倍率は非公開のため比較用の試算。公式実測ランキングではありません。</text>
</svg>`;

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.setContent(`<html><body style="margin:0">${svg}</body></html>`, { waitUntil: 'load' });
    await page.screenshot({ path: output, type: 'png' });
    console.log(`記事グラフを生成しました: ${output}`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
