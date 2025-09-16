let chart;
let currentData = [];
let analysisResults = [];
let currentFilter = ‘all’;
let isUpdating = false;
const patterns = [
{name: “ゴールデンクロス”, category: “trend”, weight: 0.95, icon: “📈”},
{name: “トレンドライン突破”, category: “trend”, weight: 0.90, icon: “📊”},
{name: “チャネル上抜け”, category: “trend”, weight: 0.85, icon: “⬆️”},
{name: “高値更新パターン”, category: “trend”, weight: 0.90, icon: “🔝”},
{name: “三角保ち合い”, category: “trend”, weight: 0.80, icon: “🔺”},
{name: “フラッグ形成”, category: “trend”, weight: 0.85, icon: “🚩”},
{name: “ウェッジ上抜け”, category: “trend”, weight: 0.75, icon: “📐”},
{name: “レンジブレイク”, category: “trend”, weight: 0.80, icon: “📦”},
{name: “MA順行配列”, category: “trend”, weight: 0.85, icon: “📏”},
{name: “エリオット5波”, category: “trend”, weight: 0.70, icon: “🌊”},
{name: “ダブルボトム”, category: “reversal”, weight: 0.90, icon: “📊”},
{name: “逆ヘッド&ショルダー”, category: “reversal”, weight: 0.95, icon: “👤”},
{name: “トリプルボトム”, category: “reversal”, weight: 0.85, icon: “3️⃣”},
{name: “V字回復”, category: “reversal”, weight: 0.75, icon: “⚡”},
{name: “カップ&ハンドル”, category: “reversal”, weight: 0.80, icon: “☕”},
{name: “下降ウェッジ”, category: “reversal”, weight: 0.85, icon: “📉”},
{name: “強気ダイバージェンス”, category: “reversal”, weight: 0.85, icon: “🔀”},
{name: “明けの明星”, category: “reversal”, weight: 0.80, icon: “⭐”},
{name: “ピンバー”, category: “reversal”, weight: 0.75, icon: “📍”},
{name: “包み足”, category: “reversal”, weight: 0.80, icon: “🎯”},
{name: “RSI反発”, category: “oscillator”, weight: 0.70, icon: “📈”},
{name: “MACDクロス”, category: “oscillator”, weight: 0.75, icon: “✂️”},
{name: “ストキャス反転”, category: “oscillator”, weight: 0.65, icon: “🔄”},
{name: “CCI過売り”, category: “oscillator”, weight: 0.60, icon: “📊”},
{name: “ボリンジャー反発”, category: “oscillator”, weight: 0.70, icon: “🎈”},
{name: “ガートレーパターン”, category: “advanced”, weight: 0.85, icon: “🦋”},
{name: “インサイドバー”, category: “advanced”, weight: 0.60, icon: “📦”},
{name: “フィボナッチ61.8%”, category: “advanced”, weight: 0.75, icon: “🌀”},
{name: “窓埋め完了”, category: “advanced”, weight: 0.65, icon: “🔲”},
{name: “出来高急増”, category: “advanced”, weight: 0.80, icon: “📊”}
];
document.addEventListener(‘DOMContentLoaded’, function() {
setTimeout(() => {
initChart();
generateMockData();
performAnalysis();
setupEventListeners();
startAutoUpdate();
}, 500);
});
function initChart() {
const canvas = document.getElementById(‘priceChart’);
if (!canvas) return;
const ctx = canvas.getContext(‘2d’);
chart = new Chart(ctx, {
type: ‘line’,
data: {
labels: [],
datasets: [{
label: ‘価格’,
data: [],
borderColor: ‘#3b82f6’,
backgroundColor: ‘rgba(59, 130, 246, 0.1)’,
borderWidth: 2.5,
fill: true,
tension: 0.4,
pointRadius: 0
}]
},
options: {
responsive: true,
maintainAspectRatio: false,
scales: {
y: { beginAtZero: false },
x: { }
}
}
});
}
function generateMockData() {
const basePrice = 148.50;
currentData = [];
for (let i = 0; i < 100; i++) {
const price = basePrice + Math.sin(i * 0.08) * 2 + (Math.random() - 0.5) * 0.6;
currentData.push({
time: new Date(Date.now() - (100 - i) * 3600000),
price: price,
volume: Math.random() * 1000000
});
}
updateChart();
}
function updateChart() {
if (!chart) return;
const labels = currentData.map(d => d.time.toLocaleTimeString());
const prices = currentData.map(d => d.price);
chart.data.labels = labels;
chart.data.datasets[0].data = prices;
chart.update();
}
function performAnalysis() {
analysisResults = patterns.map(pattern => {
const signal = generateSignal();
return { …pattern, signal: signal.direction, strength: signal.strength };
});
updateDisplay();
}
function generateSignal() {
const rand = Math.random() + 0.25;
if (rand > 0.65) return { direction: “buy”, strength: 0.8 };
else if (rand < 0.35) return { direction: “sell”, strength: 0.6 };
else return { direction: “neutral”, strength: 0.4 };
}
function updateDisplay() {
const buySignals = analysisResults.filter(r => r.signal === “buy”);
const buyPercentage = Math.round((buySignals.length / analysisResults.length) * 100);
document.getElementById(‘signalPercentage’).textContent = buyPercentage + ‘%’;
document.getElementById(‘confidenceFill’).style.width = buyPercentage + ‘%’;
document.getElementById(‘signalAction’).textContent = buyPercentage >= 70 ? ‘🚀 強力買いシグナル’ : ‘⚖️ 様子見’;
document.getElementById(‘buyCount’).textContent = buySignals.length;
document.getElementById(‘sellCount’).textContent = analysisResults.filter(r => r.signal === “sell”).length;
displayPatterns();
}
function displayPatterns() {
const patternsList = document.getElementById(‘patternsList’);
const filteredPatterns = analysisResults.filter(pattern => currentFilter === ‘all’ || pattern.signal === currentFilter);
patternsList.innerHTML = filteredPatterns.map(pattern =>
‘<div class="pattern-item"><span>’ + pattern.icon + ’ ’ + pattern.name + ‘</span><span>’ +
(pattern.signal === ‘buy’ ? ‘買い’ : pattern.signal === ‘sell’ ? ‘売り’ : ‘中立’) + ‘</span></div>’
).join(’’);
}
function setupEventListeners() {
document.querySelectorAll(’.filter-btn’).forEach(btn => {
btn.addEventListener(‘click’, function() {
document.querySelectorAll(’.filter-btn’).forEach(b => b.classList.remove(‘active’));
this.classList.add(‘active’);
currentFilter = this.dataset.filter;
displayPatterns();
});
});
}
function startAutoUpdate() {
setInterval(() => updateAnalysis(), 10000);
}
function updateAnalysis() {
if (isUpdating) return;
isUpdating = true;
setTimeout(() => {
performAnalysis();
const newValue = Math.max(70, Math.min(95, parseInt(document.getElementById(‘signalPercentage’).textContent) + Math.floor((Math.random() - 0.5) * 8)));
document.getElementById(‘signalPercentage’).textContent = newValue + ‘%’;
document.getElementById(‘confidenceFill’).style.width = newValue + ‘%’;
isUpdating = false;
}, 1000);
}
