import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";

/**
 * Recalcula os hashes SHA-256 (formato CSP 'sha256-...') de todo <script>
 * inline em dist/index.html — necessário sempre que o conteúdo de um script
 * inline mudar: o snippet do GTM/Meta Pixel/Clarity em index.html, o script
 * de tema injetado pelo next-themes, ou qualquer JSON-LD renderizado no
 * pré-render (schema.org da empresa, FAQ).
 *
 * Uso: rode `npm run build` primeiro, depois `node scripts/csp-hashes.mjs`,
 * e cole a lista de hashes no script-src de vercel.json
 * (Content-Security-Policy-Report-Only). Se a CSP já estiver em modo
 * enforcing e um hash não bater, o script correspondente simplesmente para
 * de rodar — sem erro visível para quem não abrir o console do navegador.
 */

const DIST_HTML = resolve("dist/index.html");

const html = await readFile(DIST_HTML, "utf8");
const pattern = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;

const hashes = [];
let match;
while ((match = pattern.exec(html))) {
  const content = match[1];
  const digest = createHash("sha256").update(content, "utf8").digest("base64");
  hashes.push(`'sha256-${digest}'`);
}

if (hashes.length === 0) {
  console.error("Nenhum <script> inline encontrado em dist/index.html — build rodou certo?");
  process.exit(1);
}

console.log(`${hashes.length} script(s) inline encontrados em dist/index.html:\n`);
console.log(hashes.join(" "));
