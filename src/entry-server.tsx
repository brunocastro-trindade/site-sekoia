import { renderToString } from "react-dom/server";
import App from "./app/App";

/**
 * Entrada usada só no build (`vite build --ssr`), nunca no navegador.
 *
 * O site é um SPA: o HTML publicado tinha apenas <div id="root"></div>, então
 * crawlers que não executam JavaScript — ChatGPT-User, PerplexityBot e a maior
 * parte dos fetchers de IA — viam uma página vazia. Este render gera o HTML do
 * conteúdo em tempo de build para que ele exista na resposta inicial.
 *
 * Importante: no servidor não há `window`, então o `useIsMobile()` do App.tsx
 * começa `false` e o que se pré-renderiza é a variante DESKTOP. É por isso que
 * os headings semânticos do export do Figma (h1/h2) importam — sem eles o HTML
 * pré-renderizado sairia sem estrutura nenhuma.
 *
 * O cliente ainda usa `createRoot()` (não `hydrateRoot`), ou seja, o React
 * descarta esta marcação e re-renderiza no mount. Isso é intencional: evita erro
 * de hidratação por causa da troca desktop/mobile, ao custo de um repaint.
 */
export function render(): string {
  return renderToString(<App />);
}
