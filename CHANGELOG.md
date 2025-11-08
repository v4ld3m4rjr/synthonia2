# Changelog

## 2025-11-08

- Corrige falha crítica em `MultiLineChart.tsx` que retornava JSX dentro de `useEffect`, causando tela em branco e erros de módulo durante HMR.
- Implementa desenho completo das séries (linhas, pontos, grade e legenda) no canvas do `MultiLineChart`.
- Aplica lazy loading com `React.lazy` e `Suspense` para `LineChart`, `BarChart` e `MultiLineChart` em `AnalyticsView` e `TrainingChart`, reduzindo abortos de rede (`net::ERR_ABORTED`) durante recarregamentos.
- Mantém CSP de desenvolvimento em `vite.config.ts` permitindo `'unsafe-inline'` no `script-src` para que o preâmbulo do React Refresh funcione corretamente (commit anterior).
- Validação local: servidor em `http://localhost:5178/` sem erros no preview, gráficos renderizando e HMR funcional.

## Notas

- A alteração de CSP aplica-se apenas ao desenvolvimento/preview; o build de produção permanece sem `unsafe-inline`.
- Caso o preview apresente novamente abortos de rede, isso normalmente indica recarregamentos do HMR, não falhas de import. O lazy loading e os guards de efeitos foram adicionados para estabilizar o fluxo.