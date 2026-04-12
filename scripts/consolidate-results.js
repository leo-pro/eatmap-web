import fs from 'node:fs';
import path from 'node:path';

const REPORTS_DIR = path.join(process.cwd(), 'lighthouse-results', 'lhci_reports');

if (!fs.existsSync(REPORTS_DIR)) {
  console.error(`Erro: o diretório ${REPORTS_DIR} não existe. Execute o lighthouse CI primeiro.`);
  process.exit(1);
}

const files = fs.readdirSync(REPORTS_DIR).filter(file => file.endsWith('.report.json'));

const metricsByUrl = {};

files.forEach(file => {
  const filePath = path.join(REPORTS_DIR, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  const url = data.finalDisplayedUrl || data.finalUrl || data.requestedUrl;
  
  if (!metricsByUrl[url]) {
    metricsByUrl[url] = {
      LCP: [],
      INP: [], // O INP geralmente é capturado em field data, mas deixamos preparado
      CLS: [],
      FCP: [],
      TTI: [],
      TBT: []
    };
  }

  const getAuditValue = (id) => data.audits[id]?.numericValue ?? null;
  
  const lcp = getAuditValue('largest-contentful-paint');
  const cls = getAuditValue('cumulative-layout-shift');
  const fcp = getAuditValue('first-contentful-paint');
  const tti = getAuditValue('interactive');
  const tbt = getAuditValue('total-blocking-time');
  
  // INP muitas vezes não é fornecido nativamente pelo Lighthouse CI laboratorial.
  // Caso não exista a chave direta "interaction-to-next-paint", o valor será ignorado na média.
  const inp = getAuditValue('interaction-to-next-paint') ?? null;

  // Divisão por 1000 para converter de milissegundos para segundos.
  // CLS é mantido como está, pois não mede tempo.
  if (lcp !== null) metricsByUrl[url].LCP.push(lcp / 1000);
  if (inp !== null) metricsByUrl[url].INP.push(inp / 1000);
  if (cls !== null) metricsByUrl[url].CLS.push(cls);
  if (fcp !== null) metricsByUrl[url].FCP.push(fcp / 1000);
  if (tti !== null) metricsByUrl[url].TTI.push(tti / 1000);
  if (tbt !== null) metricsByUrl[url].TBT.push(tbt / 1000);
});

const calculateStats = (arr) => {
  if (!arr || arr.length === 0) return { media: null, desvio_padrao: null, min: null, max: null };
  const n = arr.length;
  // Média
  const media = arr.reduce((a, b) => a + b, 0) / n;
  
  // Desvio Padrão Populacional
  const variance = arr.reduce((a, b) => a + Math.pow(b - media, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  
  // Mínimo e Máximo
  const min = Math.min(...arr);
  const max = Math.max(...arr);

  return {
    media: Number(media.toFixed(3)),
    desvio_padrao: Number(stdDev.toFixed(3)),
    min: Number(min.toFixed(3)),
    max: Number(max.toFixed(3))
  };
};

const results = [];

Object.entries(metricsByUrl).forEach(([url, metrics]) => {
  const row = { URL: url };
  const keys = ['LCP', 'INP', 'CLS', 'FCP', 'TTI', 'TBT'];
  
  keys.forEach(key => {
    const stats = calculateStats(metrics[key]);
    row[`${key}_Media`] = stats.media;
    row[`${key}_DesvioPadrao`] = stats.desvio_padrao;
    row[`${key}_Min`] = stats.min;
    row[`${key}_Max`] = stats.max;
  });
  
  results.push(row);
});

const OUTPUT_DIR = path.join(process.cwd(), 'lighthouse-results');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// JSON
const jsonOutput = path.join(OUTPUT_DIR, 'resultados-consolidados.json');
fs.writeFileSync(jsonOutput, JSON.stringify(results, null, 2));

// CSV
const csvOutput = path.join(OUTPUT_DIR, 'resultados-consolidados.csv');
const csvHeaders = Object.keys(results[0]).join(',');
const csvRows = results.map(row => Object.values(row).join(','));
const csvContent = [csvHeaders, ...csvRows].join('\n');
fs.writeFileSync(csvOutput, csvContent);

console.log('====================================================');
console.log('✅ Arquivos consolidados gerados com sucesso!');
console.log(` - ${jsonOutput}`);
console.log(` - ${csvOutput}`);
console.log('====================================================');
