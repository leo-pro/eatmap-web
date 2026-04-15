import fs from 'node:fs';
import puppeteer from 'puppeteer';
import { startFlow } from 'lighthouse';

// Verifica se os diretórios existem
const OUTPUT_DIR = './lighthouse-results/flows';
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function captureFlow(version, title) {
  console.log(`\n==============================================`);
  console.log(`🚀 Iniciando teste: ${title} (Versão ${version.toUpperCase()})`);
  console.log(`==============================================`);
  
  // Inicia o Puppeteer (headless para rodar no terminal sem abrir janela, mude para false se quiser ver o robô agindo)
  const browser = await puppeteer.launch({ 
    headless: true,
    defaultViewport: { width: 412, height: 915 } // Viewport similar a mobile
  });
  const page = await browser.newPage();
  
  const flow = await startFlow(page, { 
    name: `Fluxo de Usuário - ${title}`,
    configContext: {
      settingsOverrides: {
        disableStorageReset: false, // Iniciar com cache limpo
        formFactor: 'mobile',
        throttlingMethod: 'devtools',
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          requestLatencyMs: 150,
          downloadThroughputKbps: 1638.4,
          uploadThroughputKbps: 675,
          cpuSlowdownMultiplier: 4,
        },
        screenEmulation: {
          mobile: true,
          width: 412,
          height: 915,
          deviceScaleFactor: 2.625,
          disabled: false,
        },
      }
    }
  });

  const baseUrl = `http://localhost:4173/${version}/restaurants`;

  try {
    // =========================================================================
    // TAREFA 1 — Navegar pela listagem de restaurantes sem aplicar nenhum filtro
    // =========================================================================
    console.log('\n📋 TAREFA 1 — Navegar pela listagem sem filtro');

    // 1.1 Carga fria da página (Navigation)
    console.log('  📍 1.1 Navegando para a página inicial (Carga Fria)...');
    await flow.navigate(baseUrl, { stepName: 'T1 · Carga Fria da Listagem' });

    // Aguarda os cards de restaurantes aparecerem
    await page.waitForSelector('xpath/.//h3');
    await new Promise(r => setTimeout(r, 1000));

    // 1.2 Fazer scroll pela listagem (Timespan)
    console.log('  📍 1.2 Fazendo scroll pela listagem de restaurantes...');
    await flow.startTimespan({ stepName: 'T1 · Scroll pela Listagem' });

    // Scroll suave até o final para visualizar todos os cards
    await page.evaluate(async () => {
      const distance = 300;
      const delay = 150;
      while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
        document.scrollingElement.scrollBy(0, distance);
        await new Promise(r => setTimeout(r, delay));
      }
    });
    await new Promise(r => setTimeout(r, 1000));
    await flow.endTimespan();

    // =========================================================================
    // TAREFA 2 — Buscar "Pizza Artigiana" e acessar a página de detalhes
    // =========================================================================
    console.log('\n📋 TAREFA 2 — Buscar "Pizza Artigiana" e acessar detalhes');

    // Voltar ao topo antes de interagir com os filtros
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 500));

    // 2.1 Digitar "Pizza Artigiana" no campo de busca e aplicar filtro (Timespan)
    console.log('  📍 2.1 Digitando "Pizza Artigiana" no campo de busca e aplicando filtro...');
    await flow.startTimespan({ stepName: 'T2 · Busca por Pizza Artigiana' });

    // Localiza o campo de busca pelo placeholder
    const searchInput = await page.waitForSelector('input[placeholder*="restaurante"]');
    await searchInput.click();
    await searchInput.type('Pizza Artigiana', { delay: 60 });

    // Clica no botão "Aplicar filtros"
    const applyBtn = await page.waitForSelector('xpath/.//button[contains(., "Aplicar filtros")]');
    await applyBtn.click();

    // Aguarda a listagem atualizar com o resultado
    await page.waitForSelector('xpath/.//h3[contains(text(), "Pizza Artigiana")]');
    await new Promise(r => setTimeout(r, 1000));
    await flow.endTimespan();

    // 2.2 Clicar no card do Pizza Artigiana para abrir detalhes (Timespan)
    console.log('  📍 2.2 Abrindo a página de detalhes do "Pizza Artigiana"...');
    await flow.startTimespan({ stepName: 'T2 · Abrir Detalhes do Pizza Artigiana' });

    const pokeCard = await page.$$('xpath/.//h3[contains(text(), "Pizza Artigiana")]');
    await pokeCard[0].click();

    // Aguarda a página de detalhes carregar (botão "Voltar para a listagem")
    await page.waitForSelector('xpath/.//button[contains(., "Voltar para a listagem")]');
    await new Promise(r => setTimeout(r, 1000));
    await flow.endTimespan();

    // 2.3 Voltar para a listagem (Timespan)
    console.log('  📍 2.3 Voltando para a listagem de restaurantes...');
    await flow.startTimespan({ stepName: 'T2 · Voltar para Listagem' });

    const btnBack1 = await page.$$('xpath/.//button[contains(., "Voltar para a listagem")]');
    await btnBack1[0].click();

    // Aguarda a listagem reaparecer
    await page.waitForSelector('xpath/.//h3');
    await new Promise(r => setTimeout(r, 1000));
    await flow.endTimespan();

    // 2.4 Limpar o campo de busca para restaurar a listagem completa
    console.log('  📍 2.4 Limpando filtros para restaurar a listagem completa...');
    await flow.startTimespan({ stepName: 'T2 · Limpar Filtros' });

    // Clica no botão "Limpar"
    const clearBtn = await page.waitForSelector('xpath/.//button[contains(., "Limpar")]');
    await clearBtn.click();

    // Aguarda a listagem completa recarregar
    await page.waitForSelector('xpath/.//h3');
    await new Promise(r => setTimeout(r, 1000));
    await flow.endTimespan();

    // =========================================================================
    // TAREFA 3 — Usar a paginação para ir até a página 3 e voltar à página 1
    // =========================================================================
    console.log('\n📋 TAREFA 3 — Paginação: ir até a página 3 e retornar');

    // Scroll até o final para visualizar a paginação
    await page.evaluate(() => window.scrollTo(0, document.scrollingElement.scrollHeight));
    await new Promise(r => setTimeout(r, 500));

    // 3.1 Ir da página 1 para a página 2 (Timespan)
    console.log('  📍 3.1 Avançando para a página 2...');
    await flow.startTimespan({ stepName: 'T3 · Página 1 → 2' });

    const nextBtn1 = await page.waitForSelector('xpath/.//button[contains(., "Proxima")]');
    await nextBtn1.click();

    // Aguarda os novos cards carregarem
    await page.waitForSelector('xpath/.//h3');
    await new Promise(r => setTimeout(r, 1500));
    await flow.endTimespan();

    // 3.2 Ir da página 2 para a página 3 (Timespan)
    console.log('  📍 3.2 Avançando para a página 3...');
    // Scroll até o final novamente para visualizar a paginação
    await page.evaluate(() => window.scrollTo(0, document.scrollingElement.scrollHeight));
    await new Promise(r => setTimeout(r, 500));

    await flow.startTimespan({ stepName: 'T3 · Página 2 → 3' });

    const nextBtn2 = await page.waitForSelector('xpath/.//button[contains(., "Proxima")]');
    await nextBtn2.click();

    await page.waitForSelector('xpath/.//h3');
    await new Promise(r => setTimeout(r, 1500));
    await flow.endTimespan();

    // 3.3 Voltar da página 3 para a página 2 (Timespan)
    console.log('  📍 3.3 Voltando para a página 2...');
    await page.evaluate(() => window.scrollTo(0, document.scrollingElement.scrollHeight));
    await new Promise(r => setTimeout(r, 500));

    await flow.startTimespan({ stepName: 'T3 · Página 3 → 2' });

    const prevBtn1 = await page.waitForSelector('xpath/.//button[contains(., "Anterior")]');
    await prevBtn1.click();

    await page.waitForSelector('xpath/.//h3');
    await new Promise(r => setTimeout(r, 1500));
    await flow.endTimespan();

    // 3.4 Voltar da página 2 para a página 1 (Timespan)
    console.log('  📍 3.4 Voltando para a página 1...');
    await page.evaluate(() => window.scrollTo(0, document.scrollingElement.scrollHeight));
    await new Promise(r => setTimeout(r, 500));

    await flow.startTimespan({ stepName: 'T3 · Página 2 → 1' });

    const prevBtn2 = await page.waitForSelector('xpath/.//button[contains(., "Anterior")]');
    await prevBtn2.click();

    await page.waitForSelector('xpath/.//h3');
    await new Promise(r => setTimeout(r, 1500));
    await flow.endTimespan();

    // =========================================================================
    // TAREFA 4 — Acessar um restaurante da primeira página, ler detalhes e voltar
    // =========================================================================
    console.log('\n📋 TAREFA 4 — Acessar detalhes de um restaurante e retornar');

    // Scroll de volta ao topo para selecionar o primeiro restaurante visível
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 500));

    // 4.1 Clicar no primeiro restaurante da listagem (Timespan)
    console.log('  📍 4.1 Abrindo o primeiro restaurante da listagem...');
    await flow.startTimespan({ stepName: 'T4 · Abrir Detalhes (1º Restaurante)' });

    const firstCard = await page.$$('xpath/.//h3');
    await firstCard[0].click();

    // Aguarda a página de detalhes carregar
    await page.waitForSelector('xpath/.//button[contains(., "Voltar para a listagem")]');
    await new Promise(r => setTimeout(r, 1000));
    await flow.endTimespan();

    // 4.2 Ler as informações — scroll pela página de detalhes (Timespan)
    console.log('  📍 4.2 Lendo as informações do restaurante...');
    await flow.startTimespan({ stepName: 'T4 · Ler Informações do Restaurante' });

    await page.evaluate(async () => {
      const distance = 300;
      const delay = 200;
      while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
        document.scrollingElement.scrollBy(0, distance);
        await new Promise(r => setTimeout(r, delay));
      }
    });
    await new Promise(r => setTimeout(r, 1000));
    await flow.endTimespan();

    // 4.3 Voltar para a listagem (Timespan)
    console.log('  📍 4.3 Voltando para a listagem de restaurantes...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 300));

    await flow.startTimespan({ stepName: 'T4 · Voltar para Listagem' });

    const btnBack2 = await page.$$('xpath/.//button[contains(., "Voltar para a listagem")]');
    await btnBack2[0].click();

    // Aguarda a listagem reaparecer
    await page.waitForSelector('xpath/.//h3');
    await new Promise(r => setTimeout(r, 1000));
    await flow.endTimespan();

    // =========================================================================
    // Relatório final
    // =========================================================================
    console.log('\n📄 Gerando e salvando os relatórios...');
    
    // Relatório HTML
    const report = await flow.generateReport();
    const htmlFileName = `${OUTPUT_DIR}/user-flow-versao-${version}.html`;
    fs.writeFileSync(htmlFileName, report);
    
    // Relatório JSON para leitura programática (INP, CLS)
    const flowResult = await flow.createFlowResult();
    const jsonFileName = `${OUTPUT_DIR}/user-flow-versao-${version}.json`;
    fs.writeFileSync(jsonFileName, JSON.stringify(flowResult, null, 2));
    
    console.log(`✅ Relatórios salvos em: ${OUTPUT_DIR}/user-flow-versao-${version}.(html|json)`);

    // Feedback Visual Direto
    console.log(`\n📊 Resumo de Performance e Core Web Vitals - Versão ${version.toUpperCase()}:`);
    const rows = [];
    if (flowResult.steps) {
      flowResult.steps.forEach(step => {
        const title = step.name;
        const getAudit = (id) => step.lhr.audits[id]?.numericValue;
        
        // Métricas extraídas das auditorias do Lighthouse
        const lcp = getAudit('largest-contentful-paint'); // LCP
        const inp = getAudit('interaction-to-next-paint'); // INP
        const cls = getAudit('cumulative-layout-shift'); // CLS
        
        const fcp = getAudit('first-contentful-paint'); // FCP
        const tti = getAudit('interactive'); // Time to Interactive (Tempo de Carga percebida)
        const tbt = getAudit('total-blocking-time'); // Total Blocking Time
        
        let reportStr = `  - ${title}:\n    ↳ `;
        const metrics = [];

        if (lcp !== undefined) metrics.push(`LCP: ${(lcp/1000).toFixed(2)}s`);
        if (fcp !== undefined) metrics.push(`FCP: ${(fcp/1000).toFixed(2)}s`);
        if (tti !== undefined) metrics.push(`TTI: ${(tti/1000).toFixed(2)}s`);
        if (tbt !== undefined) metrics.push(`TBT: ${(tbt/1000).toFixed(3)}s`);
        if (inp !== undefined) metrics.push(`INP: ${inp.toFixed(0)}ms`);
        if (cls !== undefined) metrics.push(`CLS: ${cls.toFixed(3)}`);
        
        reportStr += metrics.join(' | ');
        console.log(reportStr);

        // Monta descrição da etapa para o CSV:
        // Ex: "Navigation report (http://localhost:4173/b/restaurants) - Tarefa 1"
        const gatherMode = step.lhr.gatherMode; // "navigation" | "timespan" | "snapshot"
        const modeLabel = gatherMode === 'navigation' ? 'Navigation report' : 'Timespan report';
        const stepUrl = step.lhr.requestedUrl || step.lhr.finalDisplayedUrl || '';
        const taskNumber = title.match(/^T(\d+)/)?.[1] ?? '?';
        const etapaLabel = `${modeLabel} (${stepUrl}) - Tarefa ${taskNumber}`;
        const lcpStr = lcp !== undefined ? (lcp/1000).toFixed(3) : "";
        const fcpStr = fcp !== undefined ? (fcp/1000).toFixed(3) : "";
        const ttiStr = tti !== undefined ? (tti/1000).toFixed(3) : "";
        const tbtStr = tbt !== undefined ? (tbt/1000).toFixed(3) : "";
        const inpStr = inp !== undefined ? inp.toFixed(0) : "";
        const clsStr = cls !== undefined ? cls.toFixed(3) : "";
        
        rows.push([
          version.toUpperCase() === 'A' ? 'Versao A (useEffect)' : 'Versao B (Tanstack Query)',
          `"${etapaLabel}"`,
          lcpStr,
          fcpStr,
          ttiStr,
          tbtStr,
          inpStr,
          clsStr
        ].join(','));
      });
    }
    
    return rows;
  } catch (error) {
    console.error(`❌ Erro durante o fluxo da versão ${version}:`, error);
    return [];
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log('🏁 Iniciando testes automáticos de Fluxo de Usuário (User Flows)\n');
  
  // Chama o fluxo da Versão A e aguarda terminar antes da Versão B
  const rowsA = await captureFlow('a', 'Sem Tanstack Query (useEffect)');
  const rowsB = await captureFlow('b', 'Com Tanstack Query (Cache Ativo)');
  
  // Gera CSV Consolidado
  const allRows = [...(rowsA || []), ...(rowsB || [])];
  if (allRows.length > 0) {
    const headers = "Versao,Etapa,LCP (segundos),FCP (segundos),TTI (segundos),TBT (segundos),INP (milisegundos),CLS (sem unidade)";
    const csvData = [headers, ...allRows].join('\n');
    const csvFileName = `${OUTPUT_DIR}/resultados-flows-consolidados.csv`;
    fs.writeFileSync(csvFileName, csvData);
    console.log(`\n📄 CSV Consolidado salvo em: ${csvFileName}`);
  }

  console.log('\n🎉 Todos os testes de fluxo foram finalizados com sucesso!');
}

main().catch(console.error);
