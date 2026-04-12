module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:4173/a/restaurants',
        'http://localhost:4173/a/restaurants/poke-house',
        'http://localhost:4173/b/restaurants',
        'http://localhost:4173/b/restaurants/poke-house'
      ],
      startServerCommand: 'pnpm run preview',
      numberOfRuns: 30,
      settings: {
        disableStorageReset: false, // Habilitado o reset de cache entre rodadas como definido
        formFactor: 'mobile',     // Dispositivo simulado
        throttlingMethod: 'devtools', // Simulação de CPU e Rede pelo devtools
        throttling: {
          // Throttling de Rede: "Slow 4G" recomendado pelo Google
          rttMs: 150,
          throughputKbps: 1638.4,
          requestLatencyMs: 150,
          downloadThroughputKbps: 1638.4,
          uploadThroughputKbps: 675,
          // Throttling de CPU: Recomendado para simular dispositivos intermediários
          cpuSlowdownMultiplier: 4,
        },
        screenEmulation: {
          mobile: true,
          width: 360,
          height: 640,
          deviceScaleFactor: 2,
          disabled: false,
        },
        // Modo headless é o padrão ao executar dentro do Lighthouse CI
        chromeFlags: '--headless'
      }
    },
    upload: {
      target: 'filesystem',
      outputDir: './lighthouse-results/lhci_reports'
    }
  }
};
