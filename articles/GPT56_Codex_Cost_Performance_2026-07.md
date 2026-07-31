---
title: "【2026年7月価格改定】Codexの推論設定、結局どれにするべき？GPT-5.6 Luna・Terra・Solを用途別にコスパ比較"
date: "2026-07-31"
category: "AI・テクノロジー"
tags: ["GPT-5.6", "Codex", "OpenAI", "AI", "プログラミング", "Luna", "Terra", "Sol"]
description: "2026年7月30日のGPT-5.6価格改定を受け、CodexでLuna・Terra・Solのどれを選ぶべきか、effort別の違いとコスパ、5時間の利用枠を長持ちさせる使い分けまで解説します。"
---

<div id="article-body" class="text-[#0a0a0a] font-sans">

<p class="text-base leading-loose mb-6 text-justify">
<span class="float-left font-anton text-[4.5rem] leading-[4rem] pr-4 pt-1 text-[#0a0a0a]">「</span>Codexで一番強いのはSol。だったら、ずっとSolを使えばよくない？」
</p>

<p class="text-base leading-loose mb-6 text-justify">GPT-5.6が登場してから、私もほとんど反射的にSolを選んでいました。せっかく使うなら一番賢いモデルを使いたいし、LunaやTerraを選んで失敗するくらいなら、最初からSolに任せた方が安心だと思っていたからです。</p>

<p class="text-base leading-loose mb-6 text-justify">ところが、2026年7月30日にOpenAIが価格改定を発表。<strong class="font-black text-[#0a0a0a] bg-gradient-to-t from-[#ccff0040] via-[#ccff0040] to-transparent px-1">Lunaは80％、Terraは20％の値下げ</strong>となり、モデルの選び方がかなり変わりました。公式ベンチマークを見ても、日常的なコーディングでは3モデルの差が価格差ほど大きくありません。</p>

<blockquote class="border-l-[6px] border-[#0a0a0a] bg-[#f8f8f8] p-6 my-8 relative font-serif italic text-lg leading-relaxed">
<span class="absolute -top-3 left-4 text-6xl text-[#ccff00] font-serif leading-none">"</span>
結論から言うと、Solは「常に使う標準モデル」ではなく、「難しい場面で投入する切り札」として使う方が、今のCodexではかなり合理的です。
</blockquote>

<div class="my-8 p-5 border-2 border-[#0a0a0a] bg-[#fffbe8] relative">
<div class="absolute -top-4 left-5 bg-[#0a0a0a] text-[#ccff00] font-anton px-4 py-1 tracking-widest">IMPORTANT</div>
<p class="text-sm leading-relaxed mb-0 mt-2"><strong>この記事のグラフについて：</strong> OpenAIはモデル別の公式ベンチマークを公開していますが、Low・Medium・High・XHigh・Maxごとの細かな性能値や消費トークンは公開していません。そのため、effort別グラフは公式価格と公式ベンチマークの傾向をもとにした「比較用の試算」です。公式の実測ランキングではありません。</p>
</div>

<nav aria-label="目次" class="my-10 p-8 border-4 border-[#0a0a0a] bg-white relative shadow-sm">
<div class="absolute -top-5 left-6 bg-[#0a0a0a] text-[#ccff00] font-anton text-2xl px-6 py-1 tracking-widest">INDEX</div>
<ul class="list-none pl-0 space-y-3 mt-2">
<li class="relative pl-6"><span class="absolute left-0 text-[#ccff00] font-bold">▸</span><a href="#price-update" class="text-[#0a0a0a] font-bold hover:text-[#b4a0ff] transition-colors">2026年7月30日、GPT-5.6が価格改定</a></li>
<li class="relative pl-6"><span class="absolute left-0 text-[#ccff00] font-bold">▸</span><a href="#sol-only" class="text-[#0a0a0a] font-bold hover:text-[#b4a0ff] transition-colors">でも結局、Solだけ使えばよくない？</a></li>
<li class="relative pl-6"><span class="absolute left-0 text-[#ccff00] font-bold">▸</span><a href="#models" class="text-[#0a0a0a] font-bold hover:text-[#b4a0ff] transition-colors">Luna・Terra・Solの違い</a></li>
<li class="relative pl-6"><span class="absolute left-0 text-[#ccff00] font-bold">▸</span><a href="#use-cases" class="text-[#0a0a0a] font-bold hover:text-[#b4a0ff] transition-colors">用途別のおすすめ設定</a></li>
<li class="relative pl-6"><span class="absolute left-0 text-[#ccff00] font-bold">▸</span><a href="#effort" class="text-[#0a0a0a] font-bold hover:text-[#b4a0ff] transition-colors">effortとは結局何なのか</a></li>
<li class="relative pl-6"><span class="absolute left-0 text-[#ccff00] font-bold">▸</span><a href="#graph" class="text-[#0a0a0a] font-bold hover:text-[#b4a0ff] transition-colors">effort別・コスパ比較グラフ</a></li>
<li class="relative pl-6"><span class="absolute left-0 text-[#ccff00] font-bold">▸</span><a href="#five-hours" class="text-[#0a0a0a] font-bold hover:text-[#b4a0ff] transition-colors">5時間の利用枠をうまく使う方法</a></li>
<li class="relative pl-6"><span class="absolute left-0 text-[#ccff00] font-bold">▸</span><a href="#my-setting" class="text-[#0a0a0a] font-bold hover:text-[#b4a0ff] transition-colors">私ならこの設定で使う</a></li>
</ul>
</nav>

<hr class="border-none h-[3px] bg-gradient-to-r from-transparent via-[#ccff00] to-transparent my-12">

<h2 id="price-update">2026年7月30日、GPT-5.6が価格改定されました</h2>

<p class="text-base leading-loose mb-6 text-justify">OpenAIは2026年7月30日、GPT-5.6 LunaとTerraの値下げを発表しました。Lunaは80％値下げ、Terraは20％値下げ。Solの価格は据え置きです。APIだけでなく、CodexとChatGPT WorkでもLuna・Terraの利用が以前より少ないクレジット消費になると案内されています。</p>

<div class="w-full overflow-x-auto mb-8 border border-[#e5e5e5] rounded relative">
<div class="text-xs text-[#666] text-right p-2 bg-[#f8f8f8] border-b border-[#e5e5e5] font-sans before:content-['→_']">Scroll</div>
<table class="w-full min-w-[680px] border-2 border-[#0a0a0a] border-collapse bg-white text-sm">
<thead>
<tr>
<th class="bg-[#0a0a0a] text-white p-4 text-left font-anton tracking-wider">MODEL</th>
<th class="bg-[#0a0a0a] text-white p-4 text-left">改定前・入力</th>
<th class="bg-[#0a0a0a] text-white p-4 text-left">改定後・入力</th>
<th class="bg-[#0a0a0a] text-white p-4 text-left">改定前・出力</th>
<th class="bg-[#0a0a0a] text-white p-4 text-left">改定後・出力</th>
<th class="bg-[#0a0a0a] text-[#ccff00] p-4 text-left">値下げ率</th>
</tr>
</thead>
<tbody>
<tr>
<td class="p-4 border-b border-[#e5e5e5] font-black bg-[#f8f8f8]">Luna</td>
<td class="p-4 border-b border-[#e5e5e5] text-gray-500">$1.00</td>
<td class="p-4 border-b border-[#e5e5e5] font-black bg-[#ccff00]/10">$0.20</td>
<td class="p-4 border-b border-[#e5e5e5] text-gray-500">$6.00</td>
<td class="p-4 border-b border-[#e5e5e5] font-black bg-[#ccff00]/10">$1.20</td>
<td class="p-4 border-b border-[#e5e5e5] font-black text-[#0a0a0a] bg-[#ccff00]">80％OFF</td>
</tr>
<tr>
<td class="p-4 border-b border-[#e5e5e5] font-black bg-[#f8f8f8]">Terra</td>
<td class="p-4 border-b border-[#e5e5e5] text-gray-500">$2.50</td>
<td class="p-4 border-b border-[#e5e5e5] font-black bg-[#b4a0ff]/10">$2.00</td>
<td class="p-4 border-b border-[#e5e5e5] text-gray-500">$15.00</td>
<td class="p-4 border-b border-[#e5e5e5] font-black bg-[#b4a0ff]/10">$12.00</td>
<td class="p-4 border-b border-[#e5e5e5] font-black">20％OFF</td>
</tr>
<tr>
<td class="p-4 font-black bg-[#f8f8f8]">Sol</td>
<td class="p-4">$5.00</td>
<td class="p-4 font-black">$5.00</td>
<td class="p-4">$30.00</td>
<td class="p-4 font-black">$30.00</td>
<td class="p-4 text-gray-500">変更なし</td>
</tr>
</tbody>
</table>
</div>

<p class="text-xs text-gray-500 leading-relaxed mb-8">※すべて100万トークンあたりのAPI価格。キャッシュ入力やFast modeなどは別料金です。価格は2026年7月31日時点。</p>

<div class="grid md:grid-cols-3 gap-4 my-8">
<div class="border-2 border-[#0a0a0a] p-5 bg-white text-center">
<p class="font-anton text-3xl mb-1">$0.044</p>
<p class="font-black text-sm mb-1">Luna</p>
<p class="text-xs text-gray-600 mb-0">入力10万＋出力2万</p>
</div>
<div class="border-2 border-[#0a0a0a] p-5 bg-[#f3efff] text-center">
<p class="font-anton text-3xl mb-1">$0.440</p>
<p class="font-black text-sm mb-1">Terra</p>
<p class="text-xs text-gray-600 mb-0">入力10万＋出力2万</p>
</div>
<div class="border-2 border-[#0a0a0a] p-5 bg-[#0a0a0a] text-white text-center">
<p class="font-anton text-3xl mb-1 text-[#ccff00]">$1.100</p>
<p class="font-black text-sm mb-1 text-white">Sol</p>
<p class="text-xs text-gray-300 mb-0">入力10万＋出力2万</p>
</div>
</div>

<p class="text-base leading-loose mb-6 text-justify">同じトークン量なら、料金比はほぼ<strong>Luna：Terra：Sol＝1：10：25</strong>です。Solを1回使う予算で、理論上はLunaを約25回使える計算になります。もちろん実際のCodexでは、タスクごとに読み込むコード量や推論量が違うため、この通りの回数になるわけではありません。それでも、モデル選択の重さがかなり違うことは分かります。</p>

<div class="text-right mb-10">
<a href="https://openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/" target="_blank" rel="noopener noreferrer" class="inline-block text-sm font-bold border-b-2 border-[#b4a0ff]">OpenAI公式の価格改定発表を見る →</a>
</div>

<hr class="border-none h-[3px] bg-gradient-to-r from-transparent via-[#ccff00] to-transparent my-12">

<h2 id="sol-only">でも結局、LunaやTerraって使わなくない？Solでよくない？</h2>

<p class="text-base leading-loose mb-6 text-justify">これはかなり自然な疑問です。SolはGPT-5.6ファミリーの最上位であり、難しいコーディング、長い調査、設計、科学、サイバーセキュリティなどで最も高い能力を持ちます。失敗が許されない仕事なら、最初からSolを選ぶ安心感もあります。</p>

<p class="text-base leading-loose mb-6 text-justify">ただし、Codexで毎回やる作業が、すべて最難関というわけではありません。文字の変更、ボタン追加、既存パターンに沿った画面実装、テスト作成、定型的なリファクタリングなどは、問題が整理されていればLunaやTerraでも十分に処理できます。</p>

<h3 class="font-sans text-[1.35rem] font-black mt-10 mb-6 text-[#b4a0ff]">公式ベンチマークを見ると、コーディングでは意外と近い</h3>

<div class="w-full overflow-x-auto mb-8 border border-[#e5e5e5] rounded relative">
<div class="text-xs text-[#666] text-right p-2 bg-[#f8f8f8] border-b border-[#e5e5e5] font-sans before:content-['→_']">Scroll</div>
<table class="w-full min-w-[620px] border-2 border-[#0a0a0a] border-collapse bg-white text-sm">
<thead>
<tr>
<th class="bg-[#0a0a0a] text-white p-4 text-left">OpenAI公式評価</th>
<th class="bg-[#0a0a0a] text-[#ccff00] p-4 text-left">Luna</th>
<th class="bg-[#0a0a0a] text-[#b4a0ff] p-4 text-left">Terra</th>
<th class="bg-[#0a0a0a] text-white p-4 text-left">Sol</th>
</tr>
</thead>
<tbody>
<tr>
<td class="p-4 border-b border-[#e5e5e5] font-bold bg-[#f8f8f8]">Artificial Analysis Intelligence Index</td>
<td class="p-4 border-b border-[#e5e5e5]">51.2</td>
<td class="p-4 border-b border-[#e5e5e5] font-bold">55.0</td>
<td class="p-4 border-b border-[#e5e5e5] font-black">58.9</td>
</tr>
<tr>
<td class="p-4 border-b border-[#e5e5e5] font-bold bg-[#f8f8f8]">Coding Agent Index</td>
<td class="p-4 border-b border-[#e5e5e5]">74.6</td>
<td class="p-4 border-b border-[#e5e5e5] font-bold">77.4</td>
<td class="p-4 border-b border-[#e5e5e5] font-black">80.0</td>
</tr>
<tr>
<td class="p-4 font-bold bg-[#f8f8f8]">SWE-Bench Pro</td>
<td class="p-4">62.7％</td>
<td class="p-4 font-bold">63.4％</td>
<td class="p-4 font-black">64.6％</td>
</tr>
</tbody>
</table>
</div>

<p class="text-base leading-loose mb-6 text-justify">特にCoding Agent Indexでは、Lunaが74.6、Terraが77.4、Solが80.0。Solが最強なのは間違いありませんが、<strong>価格が25倍だから性能も25倍というわけではありません。</strong>普通の実装でLunaやTerraが候補になる理由は、ここにあります。</p>

<div class="my-8 p-6 border-2 border-[#0a0a0a] bg-[#0a0a0a] text-white">
<p class="font-anton text-xl tracking-wider text-[#ccff00] mb-3">THE KEY IDEA</p>
<p class="text-base leading-loose mb-0 text-white">Solを使わないのではなく、<strong class="text-white bg-transparent px-0">Solを使う場所を選ぶ</strong>。簡単な工程までSolで埋め尽くさず、不確実性が高い場面だけ最上位モデルに任せるのがコスパの良い使い方です。</p>
</div>

<hr class="border-none h-[3px] bg-gradient-to-r from-transparent via-[#ccff00] to-transparent my-12">

<h2 id="models">Luna・Terra・Solの違いをざっくり整理</h2>

<div class="grid md:grid-cols-3 gap-5 my-8">
<div class="border-2 border-[#0a0a0a] p-6 bg-white relative">
<div class="absolute -top-4 left-4 bg-[#ccff00] border-2 border-[#0a0a0a] px-3 py-1 font-anton">LUNA</div>
<p class="font-black text-lg mt-3 mb-3">速くて、とにかく安い</p>
<p class="text-sm text-gray-700 leading-relaxed mb-4">指示が明確な作業、定型処理、軽い修正、テスト追加、文章やデータの整形などに向きます。</p>
<ul class="list-none pl-2 mb-0 space-y-2">
<li class="relative pl-5 text-xs font-bold"><span class="absolute left-0 text-[#ccff00]">▸</span>小さなUI修正</li>
<li class="relative pl-5 text-xs font-bold"><span class="absolute left-0 text-[#ccff00]">▸</span>既存コードに沿った実装</li>
<li class="relative pl-5 text-xs font-bold"><span class="absolute left-0 text-[#ccff00]">▸</span>テスト・コメント・整形</li>
</ul>
</div>
<div class="border-2 border-[#0a0a0a] p-6 bg-[#f3efff] relative">
<div class="absolute -top-4 left-4 bg-[#b4a0ff] border-2 border-[#0a0a0a] px-3 py-1 font-anton">TERRA</div>
<p class="font-black text-lg mt-3 mb-3">日常開発のバランス型</p>
<p class="text-sm text-gray-700 leading-relaxed mb-4">実装力と料金のバランスがよく、Codexの標準モデルとして最も使いやすい立ち位置です。</p>
<ul class="list-none pl-2 mb-0 space-y-2">
<li class="relative pl-5 text-xs font-bold"><span class="absolute left-0 text-[#b4a0ff]">▸</span>普通の機能追加</li>
<li class="relative pl-5 text-xs font-bold"><span class="absolute left-0 text-[#b4a0ff]">▸</span>Flutter・Python・Unity</li>
<li class="relative pl-5 text-xs font-bold"><span class="absolute left-0 text-[#b4a0ff]">▸</span>中規模リファクタリング</li>
</ul>
</div>
<div class="border-2 border-[#0a0a0a] p-6 bg-[#0a0a0a] text-white relative">
<div class="absolute -top-4 left-4 bg-white text-[#0a0a0a] border-2 border-[#0a0a0a] px-3 py-1 font-anton">SOL</div>
<p class="font-black text-lg mt-3 mb-3 text-white">難問を突破する最上位</p>
<p class="text-sm text-gray-300 leading-relaxed mb-4">曖昧な要件、原因不明の不具合、設計判断、広い影響範囲を伴う作業で強みが出ます。</p>
<ul class="list-none pl-2 mb-0 space-y-2 border-l-[#ccff00] bg-none">
<li class="relative pl-5 text-xs font-bold text-white"><span class="absolute left-0 text-[#ccff00]">▸</span>アーキテクチャ設計</li>
<li class="relative pl-5 text-xs font-bold text-white"><span class="absolute left-0 text-[#ccff00]">▸</span>原因不明の難しいバグ</li>
<li class="relative pl-5 text-xs font-bold text-white"><span class="absolute left-0 text-[#ccff00]">▸</span>重要なレビュー・検証</li>
</ul>
</div>
</div>

<p class="text-base leading-loose mb-6 text-justify">ざっくり言えば、Lunaは作業員、Terraは頼れる実装担当、Solは設計者兼トラブルシューターです。もちろん実際には重なる部分もありますが、この役割分担で考えると選びやすくなります。</p>

<hr class="border-none h-[3px] bg-gradient-to-r from-transparent via-[#ccff00] to-transparent my-12">

<h2 id="use-cases">用途別比較：Codexではどのモデルを選ぶべき？</h2>

<div class="w-full overflow-x-auto mb-10 border border-[#e5e5e5] rounded relative">
<div class="text-xs text-[#666] text-right p-2 bg-[#f8f8f8] border-b border-[#e5e5e5] font-sans before:content-['→_']">Scroll</div>
<table class="w-full min-w-[760px] border-2 border-[#0a0a0a] border-collapse bg-white text-sm">
<thead>
<tr>
<th class="bg-[#0a0a0a] text-white p-4 text-left">用途</th>
<th class="bg-[#0a0a0a] text-[#ccff00] p-4 text-left">おすすめ</th>
<th class="bg-[#0a0a0a] text-white p-4 text-left">理由</th>
</tr>
</thead>
<tbody>
<tr><td class="p-4 border-b border-[#e5e5e5] font-bold bg-[#f8f8f8]">誤字、CSS、文言、軽いUI修正</td><td class="p-4 border-b border-[#e5e5e5] font-black">Luna Low〜High</td><td class="p-4 border-b border-[#e5e5e5]">答えがほぼ決まっており、深い探索が不要</td></tr>
<tr><td class="p-4 border-b border-[#e5e5e5] font-bold bg-[#f8f8f8]">既存機能に沿った小規模実装</td><td class="p-4 border-b border-[#e5e5e5] font-black">Luna High</td><td class="p-4 border-b border-[#e5e5e5]">安価でも、明確な仕様なら十分に実装しやすい</td></tr>
<tr><td class="p-4 border-b border-[#e5e5e5] font-bold bg-[#f8f8f8]">一般的な機能追加</td><td class="p-4 border-b border-[#e5e5e5] font-black bg-[#b4a0ff]/10">Terra High</td><td class="p-4 border-b border-[#e5e5e5]">性能・速度・利用枠のバランスが良い</td></tr>
<tr><td class="p-4 border-b border-[#e5e5e5] font-bold bg-[#f8f8f8]">複数ファイルの改修、リファクタリング</td><td class="p-4 border-b border-[#e5e5e5] font-black">Terra High〜XHigh</td><td class="p-4 border-b border-[#e5e5e5]">影響範囲を考えつつ、Solより安く進めやすい</td></tr>
<tr><td class="p-4 border-b border-[#e5e5e5] font-bold bg-[#f8f8f8]">設計方針、技術選定、仕様の整理</td><td class="p-4 border-b border-[#e5e5e5] font-black">Sol Medium〜High</td><td class="p-4 border-b border-[#e5e5e5]">曖昧さを整理し、全体最適を考える仕事</td></tr>
<tr><td class="p-4 border-b border-[#e5e5e5] font-bold bg-[#f8f8f8]">何度直しても再発するバグ</td><td class="p-4 border-b border-[#e5e5e5] font-black">Sol High〜XHigh</td><td class="p-4 border-b border-[#e5e5e5]">仮説を複数立て、検証し直す価値が大きい</td></tr>
<tr><td class="p-4 font-bold bg-[#f8f8f8]">重要な最終レビュー</td><td class="p-4 font-black bg-[#0a0a0a] text-[#ccff00]">Sol XHigh〜Max</td><td class="p-4">コストより見落としを減らすことを優先</td></tr>
</tbody>
</table>
</div>

<div class="my-8 p-6 border-2 border-[#0a0a0a] bg-white">
<p class="font-black text-lg mb-3">迷ったときの基準</p>
<p class="text-sm leading-relaxed mb-0">「手順が見えている仕事」はLunaかTerra。「何を直せばよいか分からない仕事」はSol。この基準だけでも、無駄なSol使用をかなり減らせます。</p>
</div>

<hr class="border-none h-[3px] bg-gradient-to-r from-transparent via-[#ccff00] to-transparent my-12">

<h2 id="effort">effortって結局何？モデルの頭が良くなるの？</h2>

<p class="text-base leading-loose mb-6 text-justify">Codexのモデル選択には、Low、Medium、High、XHigh、Maxといった<strong>effort（推論努力）</strong>があります。APIではnoneも利用できますが、この記事ではCodexで使い分ける主要な段階に絞ります。</p>

<p class="text-base leading-loose mb-6 text-justify">effortを上げても、LunaがSolに変身するわけではありません。モデルが持つ知識や基本能力は同じです。変わるのは、<strong>答えを出す前に、どこまで探索・比較・検証・修正に時間を使うか</strong>です。</p>

<div class="space-y-4 my-8">
<div class="border-2 border-[#0a0a0a] p-5 bg-white flex flex-col md:flex-row md:items-center gap-4">
<div class="md:w-28 font-anton text-2xl">LOW</div>
<div class="flex-1 text-sm leading-relaxed"><strong>まず動く答えを早く出す。</strong> 誤字修正や単純な変更など、考え直す価値が小さい作業向け。</div>
<div class="text-xs font-mono bg-[#f8f8f8] px-4 py-2 border border-[#e5e5e5]">問題 → 最初の案 → 提出</div>
</div>
<div class="border-2 border-[#0a0a0a] p-5 bg-white flex flex-col md:flex-row md:items-center gap-4">
<div class="md:w-28 font-anton text-2xl">MEDIUM</div>
<div class="flex-1 text-sm leading-relaxed"><strong>速度と品質の標準設定。</strong> OpenAIもバランスの良い開始地点として案内しています。</div>
<div class="text-xs font-mono bg-[#f8f8f8] px-4 py-2 border border-[#e5e5e5]">問題 → 少し比較 → 提出</div>
</div>
<div class="border-2 border-[#0a0a0a] p-5 bg-[#f7f4ff] flex flex-col md:flex-row md:items-center gap-4">
<div class="md:w-28 font-anton text-2xl text-[#6d55d8]">HIGH</div>
<div class="flex-1 text-sm leading-relaxed"><strong>自分の案をレビューしてから出す感覚。</strong> 影響範囲やテストまで考えてほしい実装向け。</div>
<div class="text-xs font-mono bg-white px-4 py-2 border border-[#b4a0ff]">複数案 → 比較 → 修正 → 提出</div>
</div>
<div class="border-2 border-[#0a0a0a] p-5 bg-[#f3efff] flex flex-col md:flex-row md:items-center gap-4">
<div class="md:w-28 font-anton text-2xl text-[#6d55d8]">XHIGH</div>
<div class="flex-1 text-sm leading-relaxed"><strong>さらに探索し、検証を重ねる。</strong> 難しいバグや複数の制約がある作業で効果が出やすい設定。</div>
<div class="text-xs font-mono bg-white px-4 py-2 border border-[#b4a0ff]">仮説A/B/C → 検証 → 再検討</div>
</div>
<div class="border-2 border-[#0a0a0a] p-5 bg-[#0a0a0a] text-white flex flex-col md:flex-row md:items-center gap-4">
<div class="md:w-28 font-anton text-2xl text-[#ccff00]">MAX</div>
<div class="flex-1 text-sm leading-relaxed text-white"><strong class="text-white bg-transparent px-0">品質最優先の最終手段。</strong> XHighより長く考え、代替案の探索、チェック、修正に多くの計算を使います。</div>
<div class="text-xs font-mono bg-white text-[#0a0a0a] px-4 py-2 border border-[#ccff00]">探索 → 検証 → 再設計 → 最終確認</div>
</div>
</div>

<h3 class="font-sans text-[1.35rem] font-black mt-10 mb-6 text-[#b4a0ff]">effortを上げると起きやすい変化</h3>

<div class="grid md:grid-cols-2 gap-4 my-8">
<div class="border-2 border-[#0a0a0a] p-5 bg-white">
<p class="font-black mb-3">良くなる可能性があるもの</p>
<ul class="list-none pl-2 mb-0 space-y-2">
<li class="relative pl-5 text-sm"><span class="absolute left-0 text-[#ccff00] font-bold">▸</span>複数案の比較</li>
<li class="relative pl-5 text-sm"><span class="absolute left-0 text-[#ccff00] font-bold">▸</span>見落としや矛盾の発見</li>
<li class="relative pl-5 text-sm"><span class="absolute left-0 text-[#ccff00] font-bold">▸</span>テスト・検証・自己修正</li>
<li class="relative pl-5 text-sm"><span class="absolute left-0 text-[#ccff00] font-bold">▸</span>長い手順を最後まで進める安定性</li>
</ul>
</div>
<div class="border-2 border-[#0a0a0a] p-5 bg-[#f8f8f8]">
<p class="font-black mb-3">増えやすいもの</p>
<ul class="list-none pl-2 mb-0 space-y-2 border-l-[#b4a0ff]">
<li class="relative pl-5 text-sm"><span class="absolute left-0 text-[#b4a0ff] font-bold">▸</span>応答までの時間</li>
<li class="relative pl-5 text-sm"><span class="absolute left-0 text-[#b4a0ff] font-bold">▸</span>推論・出力トークン</li>
<li class="relative pl-5 text-sm"><span class="absolute left-0 text-[#b4a0ff] font-bold">▸</span>Codexの利用枠・クレジット消費</li>
<li class="relative pl-5 text-sm"><span class="absolute left-0 text-[#b4a0ff] font-bold">▸</span>簡単な作業での待ち時間</li>
</ul>
</div>
</div>

<p class="text-base leading-loose mb-6 text-justify">つまり、effortは「高いほど正義」ではありません。答えがほぼ一つに決まっている作業でMaxを使っても、結果はあまり変わらず、時間と利用枠だけ多く消費する可能性があります。逆に、原因が分からないバグや設計のように、考え直す価値が大きい仕事ではHigh以上の効果が出やすくなります。</p>

<div class="text-right mb-10">
<a href="https://developers.openai.com/api/docs/guides/latest-model" target="_blank" rel="noopener noreferrer" class="inline-block text-sm font-bold border-b-2 border-[#b4a0ff]">OpenAI公式のGPT-5.6モデルガイドを見る →</a>
</div>

<hr class="border-none h-[3px] bg-gradient-to-r from-transparent via-[#ccff00] to-transparent my-12">

<h2 id="graph">effort別・コスパ別グラフで見るおすすめ設定</h2>

<p class="text-base leading-loose mb-6 text-justify">ここまでの内容を、性能とコストの散布図にまとめました。縦軸は性能イメージ、横軸は入力10万トークン＋出力2万トークンのAPI料金を基準にした推定コストです。点はつながず、各モデル・effortを独立した選択肢として配置しています。</p>

<figure class="my-10">
![gpt56-codex-effort-cost-graph.png](/images/gpt56-codex-effort-cost-graph.png)

<figcaption class="text-xs text-gray-500 leading-relaxed mt-3">※モデル単位の価格は公式値。effort別の性能・消費倍率は非公開のため、グラフ内の点は比較用の試算です。実際の消費はコードベース、入力、出力、ツール実行によって変動します。</figcaption>
</figure>

<h3 class="font-sans text-[1.35rem] font-black mt-10 mb-6 text-[#b4a0ff]">注目は「Terra XHigh」と「Sol Medium」</h3>

<p class="text-base leading-loose mb-6 text-justify">グラフ上で面白いのが、Terra XHighとSol Mediumの位置です。試算では、Terra XHighの方が安いまま、Sol Mediumに近い品質を狙える可能性があります。</p>

<div class="my-8 p-6 border-4 border-[#0a0a0a] bg-[#ccff00] relative">
<div class="absolute -top-5 left-6 bg-[#0a0a0a] text-white font-anton text-xl px-5 py-1">WHY?</div>
<p class="text-base font-black mt-2 mb-3">Terraの単価は、同じトークン量ならSolの40％です。</p>
<p class="text-sm leading-relaxed mb-0">つまりTerra XHighがSol Mediumより多く考えたとしても、使用トークンが2.5倍未満なら、計算上はまだTerraの方が安くなります。もちろん「Terra XHighが必ずSol Mediumより賢い」という意味ではありません。難問への安定性や設計判断では、Solの基本能力が効く場面があります。</p>
</div>

<p class="text-base leading-loose mb-6 text-justify">この比較から分かるのは、モデルとeffortを別々に考える必要があるということです。「上位モデルを低effortで使う」だけでなく、「一段下のモデルに多めに考えさせる」という選択肢もあります。日常開発では、この中間地点がかなりおいしいです。</p>

<div class="grid md:grid-cols-3 gap-4 my-8">
<div class="border-2 border-[#0a0a0a] p-5 bg-white">
<p class="font-anton text-xl mb-2">BEST VALUE</p>
<p class="font-black mb-2">Luna High</p>
<p class="text-xs text-gray-600 leading-relaxed mb-0">仕様が明確な小さな実装を大量にこなす。</p>
</div>
<div class="border-2 border-[#0a0a0a] p-5 bg-[#f3efff]">
<p class="font-anton text-xl mb-2">DAILY DRIVER</p>
<p class="font-black mb-2">Terra High</p>
<p class="text-xs text-gray-600 leading-relaxed mb-0">普通の開発で最も無難な標準設定。</p>
</div>
<div class="border-2 border-[#0a0a0a] p-5 bg-[#0a0a0a] text-white">
<p class="font-anton text-xl mb-2 text-[#ccff00]">HARD MODE</p>
<p class="font-black mb-2 text-white">Sol High</p>
<p class="text-xs text-gray-300 leading-relaxed mb-0">曖昧さや難しい判断を突破する。</p>
</div>
</div>

<hr class="border-none h-[3px] bg-gradient-to-r from-transparent via-[#ccff00] to-transparent my-12">

<h2 id="five-hours">5時間の利用枠でうまくやっていく使い方</h2>

<p class="text-base leading-loose mb-6 text-justify">Codexの画面に表示される「5時間」の枠は、5時間ずっと作業できるという意味ではありません。OpenAIの公式説明でも、消費量はタスクの規模と複雑さ、選んだモデル、実行場所、長いセッションや大きなコードベースなどによって変わるとされています。</p>

<p class="text-base leading-loose mb-6 text-justify">そのため、利用枠を長持ちさせるには、プロンプトを一文字でも短くすることより、<strong>高価な推論をどこに使うか</strong>を決める方が重要です。</p>

<div class="my-10 p-6 border-2 border-[#0a0a0a] bg-white">
<h3 class="font-anton text-2xl text-[#0a0a0a] mb-6 tracking-wider">SMART CODEX ROUTE</h3>
<div class="flex flex-col md:flex-row items-stretch gap-3">
<div class="flex-1 p-4 border-2 border-[#0a0a0a] bg-[#f8f8f8]">
<p class="font-anton text-[#b4a0ff] mb-1">STEP 1</p>
<p class="font-black text-sm mb-2">Terra Highで開始</p>
<p class="text-xs text-gray-600 mb-0">通常の実装・修正を進める</p>
</div>
<div class="self-center font-anton text-2xl rotate-90 md:rotate-0">→</div>
<div class="flex-1 p-4 border-2 border-[#0a0a0a] bg-[#f3efff]">
<p class="font-anton text-[#b4a0ff] mb-1">STEP 2</p>
<p class="font-black text-sm mb-2">Terra XHighへ</p>
<p class="text-xs text-gray-600 mb-0">難しければ同モデルで深く考える</p>
</div>
<div class="self-center font-anton text-2xl rotate-90 md:rotate-0">→</div>
<div class="flex-1 p-4 border-2 border-[#0a0a0a] bg-[#0a0a0a] text-white">
<p class="font-anton text-[#ccff00] mb-1">STEP 3</p>
<p class="font-black text-sm mb-2 text-white">Sol Highへ昇格</p>
<p class="text-xs text-gray-300 mb-0">原因や設計そのものが難しい場合</p>
</div>
<div class="self-center font-anton text-2xl rotate-90 md:rotate-0">→</div>
<div class="flex-1 p-4 border-2 border-[#ccff00] bg-[#0a0a0a] text-white">
<p class="font-anton text-[#ccff00] mb-1">FINAL</p>
<p class="font-black text-sm mb-2 text-white">Sol Max</p>
<p class="text-xs text-gray-300 mb-0">重要案件・最後の切り札</p>
</div>
</div>
</div>

<h3 class="font-sans text-[1.35rem] font-black mt-10 mb-6 text-[#b4a0ff]">利用枠を無駄にしにくい7つのルール</h3>

<ol class="list-none pl-6 mb-8 border-l-[3px] border-[#b4a0ff] bg-gradient-to-r from-[#b4a0ff08] to-transparent py-4">
<li class="relative pl-10 mb-5 leading-relaxed"><span class="absolute left-0 text-[#b4a0ff] font-bold font-anton">01</span><strong>標準をSolではなくTerra Highにする。</strong><br><span class="text-sm text-gray-700">普通の実装なら、まずTerraで十分かを試します。</span></li>
<li class="relative pl-10 mb-5 leading-relaxed"><span class="absolute left-0 text-[#b4a0ff] font-bold font-anton">02</span><strong>明確な単純作業はLunaへ落とす。</strong><br><span class="text-sm text-gray-700">文言、CSS、テスト、既存パターンの複製などはLuna Highが強力です。</span></li>
<li class="relative pl-10 mb-5 leading-relaxed"><span class="absolute left-0 text-[#b4a0ff] font-bold font-anton">03</span><strong>設計だけSol、実装はLuna・Terraに分ける。</strong><br><span class="text-sm text-gray-700">OpenAIも、Solで不確実性を解消して計画を作り、Lunaで明確な変更やテストを実行するワークフローを例示しています。</span></li>
<li class="relative pl-10 mb-5 leading-relaxed"><span class="absolute left-0 text-[#b4a0ff] font-bold font-anton">04</span><strong>いきなりXHigh・Maxにしない。</strong><br><span class="text-sm text-gray-700">まずHighで試し、失敗理由が「考察不足」だと判断できるときだけ上げます。</span></li>
<li class="relative pl-10 mb-5 leading-relaxed"><span class="absolute left-0 text-[#b4a0ff] font-bold font-anton">05</span><strong>タスクを一つの目的に絞る。</strong><br><span class="text-sm text-gray-700">「全部直して」より、対象画面・不具合・完了条件を明確にした方が無駄な探索を減らせます。</span></li>
<li class="relative pl-10 mb-5 leading-relaxed"><span class="absolute left-0 text-[#b4a0ff] font-bold font-anton">06</span><strong>長くなりすぎたセッションを整理する。</strong><br><span class="text-sm text-gray-700">必要な前提と現在の課題を短くまとめ、新しいタスクとして切り出すと、不要な文脈の再読を減らしやすくなります。</span></li>
<li class="relative pl-10 mb-0 leading-relaxed"><span class="absolute left-0 text-[#b4a0ff] font-bold font-anton">07</span><strong>急ぎでないならFast modeを常用しない。</strong><br><span class="text-sm text-gray-700">Fast modeは速度を上げる代わりに、対応モデルではクレジット消費率も高くなります。</span></li>
</ol>

<div class="my-8 p-6 border-2 border-[#0a0a0a] bg-[#fffbe8]">
<p class="font-black mb-2">大切なのは「弱いモデルから順番に試す」ことではありません。</p>
<p class="text-sm leading-relaxed mb-0">タスクの難易度を見て、最初から適切な場所に置くことです。明らかに難しい設計をLuna Lowへ投げ、何度も失敗させるのも利用枠の無駄です。簡単な作業にSol Maxを使うのと同じくらい、モデルを下げすぎることにも注意が必要です。</p>
</div>

<div class="text-right mb-10">
<a href="https://help.openai.com/ja-jp/articles/11369540-chatgpt%E3%83%97%E3%83%A9%E3%83%B3%E3%81%A7codex%E3%82%92%E4%BD%BF%E3%81%86" target="_blank" rel="noopener noreferrer" class="inline-block text-sm font-bold border-b-2 border-[#b4a0ff]">Codexの利用上限に関する公式説明を見る →</a>
</div>

<hr class="border-none h-[3px] bg-gradient-to-r from-transparent via-[#ccff00] to-transparent my-12">

<h2 id="my-setting">結局、私ならこの設定で使います</h2>

<p class="text-base leading-loose mb-6 text-justify">今回、価格とベンチマーク、effortの仕組みをまとめて考えた結果、私ならCodexの標準設定を<strong>Terra High</strong>にします。そこから、作業内容に応じて上下へ動かす形です。</p>

<div class="my-10 border-4 border-[#0a0a0a] bg-white">
<div class="grid md:grid-cols-4">
<div class="p-6 border-b-2 md:border-b-0 md:border-r-2 border-[#0a0a0a]">
<p class="font-anton text-xl mb-2">LIGHT</p>
<p class="font-black mb-2 bg-[#ccff00] inline-block px-2">Luna High</p>
<p class="text-xs text-gray-600 leading-relaxed mb-0">軽いUI、HTML、CSS、テスト、明確な小修正。</p>
</div>
<div class="p-6 border-b-2 md:border-b-0 md:border-r-2 border-[#0a0a0a] bg-[#f3efff]">
<p class="font-anton text-xl mb-2">DEFAULT</p>
<p class="font-black mb-2 bg-[#b4a0ff] inline-block px-2">Terra High</p>
<p class="text-xs text-gray-600 leading-relaxed mb-0">Flutter、Python、Unityを含む一般的な機能追加。</p>
</div>
<div class="p-6 border-b-2 md:border-b-0 md:border-r-2 border-[#0a0a0a]">
<p class="font-anton text-xl mb-2">DEEP</p>
<p class="font-black mb-2 border-b-4 border-[#b4a0ff] inline-block">Terra XHigh</p>
<p class="text-xs text-gray-600 leading-relaxed mb-0">普通より難しいが、Solへ上げるほどか迷う作業。</p>
</div>
<div class="p-6 bg-[#0a0a0a] text-white">
<p class="font-anton text-xl mb-2 text-[#ccff00]">CRITICAL</p>
<p class="font-black mb-2 text-white">Sol High / Max</p>
<p class="text-xs text-gray-300 leading-relaxed mb-0">設計、難解なバグ、重要レビュー。Maxは最後だけ。</p>
</div>
</div>
</div>

<p class="text-base leading-loose mb-6 text-justify">特に価格改定後は、Lunaを「性能の低い節約モデル」と見るのはもったいないです。公式のCoding Agent Indexで74.6を出しながら、API単価はSolの25分の1。仕様を明確に渡せる人ほど、Lunaの価値は大きくなります。</p>

<p class="text-base leading-loose mb-6 text-justify">そしてTerraは、今回の値下げでさらに使いやすくなりました。Sol Mediumを毎回使う前に、Terra HighやXHighで足りないかを考える。これだけで、Codexの5時間枠をかなり現実的に運用しやすくなるはずです。</p>

<div class="mt-16 p-8 border-4 border-[#0a0a0a] bg-gradient-to-br from-[#f8f8f8] to-[#e5e5e5] relative">
<div class="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#0a0a0a] text-[#ccff00] font-anton text-2xl px-6 py-1 tracking-widest">SUMMARY</div>
<p class="text-base font-bold mb-5 mt-2 text-center text-[#0a0a0a]">「最強モデルを固定」ではなく、<span class="bg-[#ccff00] px-1">仕事の難しさに合わせて推論予算を配る</span>のが正解です。</p>
<ul class="list-none pl-0 space-y-3 mb-6">
<li class="relative pl-6 text-sm font-bold"><span class="absolute left-0 text-[#b4a0ff] font-black">✓</span> Lunaは80％値下げ。明確な作業では圧倒的なコスパ</li>
<li class="relative pl-6 text-sm font-bold"><span class="absolute left-0 text-[#b4a0ff] font-black">✓</span> Terraは日常開発の標準候補。迷ったらHighから</li>
<li class="relative pl-6 text-sm font-bold"><span class="absolute left-0 text-[#b4a0ff] font-black">✓</span> effortはモデル変更ではなく、探索・検証・修正に使う量</li>
<li class="relative pl-6 text-sm font-bold"><span class="absolute left-0 text-[#b4a0ff] font-black">✓</span> Terra XHighはSol Mediumに対する有力なコスパ候補</li>
<li class="relative pl-6 text-sm font-bold"><span class="absolute left-0 text-[#b4a0ff] font-black">✓</span> Solは設計・難問・最終レビューに集中させる</li>
</ul>
<p class="text-sm leading-loose text-justify text-gray-700 mb-0">GPT-5.6では、単純に「どのモデルが一番強いか」だけを見るより、「この作業には、どこまでの知能と考える時間が必要か」を判断する方が大切になりました。価格改定で選択肢が増えた今こそ、Sol一択から卒業して、自分の開発に合った組み合わせを見つけてみてください。</p>
</div>

<section class="mt-16 p-6 border-2 border-[#0a0a0a] bg-white">
<h3 class="font-anton text-xl text-[#0a0a0a] mb-4 tracking-wider">OFFICIAL SOURCES</h3>
<ul class="list-none pl-0 mb-0 space-y-3">
<li class="relative pl-5 text-sm"><span class="absolute left-0 text-[#ccff00] font-bold">▸</span><a href="https://openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/" target="_blank" rel="noopener noreferrer">OpenAI：Advancing the price-performance frontier with GPT-5.6</a></li>
<li class="relative pl-5 text-sm"><span class="absolute left-0 text-[#ccff00] font-bold">▸</span><a href="https://openai.com/index/gpt-5-6/" target="_blank" rel="noopener noreferrer">OpenAI：GPT-5.6 launch announcement and benchmarks</a></li>
<li class="relative pl-5 text-sm"><span class="absolute left-0 text-[#ccff00] font-bold">▸</span><a href="https://developers.openai.com/api/docs/guides/latest-model" target="_blank" rel="noopener noreferrer">OpenAI Developers：GPT-5.6 model guidance</a></li>
<li class="relative pl-5 text-sm"><span class="absolute left-0 text-[#ccff00] font-bold">▸</span><a href="https://help.openai.com/ja-jp/articles/20001106-codex-rate-card" target="_blank" rel="noopener noreferrer">OpenAI Help Center：Codexレート表</a></li>
<li class="relative pl-5 text-sm"><span class="absolute left-0 text-[#ccff00] font-bold">▸</span><a href="https://help.openai.com/ja-jp/articles/11369540-chatgpt%E3%83%97%E3%83%A9%E3%83%B3%E3%81%A7codex%E3%82%92%E4%BD%BF%E3%81%86" target="_blank" rel="noopener noreferrer">OpenAI Help Center：ChatGPTプランでCodexを使う</a></li>
</ul>
<p class="text-xs text-gray-500 mt-5 mb-0">情報確認日：2026年7月31日。価格、提供モデル、利用上限は今後変更される可能性があります。</p>
</section>

</div>