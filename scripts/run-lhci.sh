#!/usr/bin/env bash

# Este script executa o Lighthouse CI utilizando as configurações do lighthouserc.cjs.
# Ele executa o build da aplicação antes para garantir que a versão testada
# é a versão otimizada de produção.

echo "Iniciando build de produção da aplicação..."
pnpm run build

echo "Executando o Lighthouse CI..."
# O comando autorun do lhci lê o arquivo lighthouserc.cjs, inicia o servidor,
# coleta as métricas 5 vezes para cada URL e salva os resultados.
pnpm exec lhci autorun

echo "Auditoria via Lighthouse CI concluída com sucesso!"
echo "Os relatórios (JSON e HTML) foram gerados no diretório ./lighthouse-results/lhci_reports"

echo "===================================================="
echo "Executando o consolidador de métricas..."
node ./scripts/consolidate-results.js
