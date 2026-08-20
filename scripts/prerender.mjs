import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const DIST_HTML = resolve("dist/index.html");
const SSR_ENTRY = resolve("dist-ssr/entry-server.js");
const ROOT_DIV = '<div id="root"></div>';

const { render } = await import(pathToFileURL(SSR_ENTRY).href);

const appHtml = render();
if (!appHtml || appHtml.length < 500) {
  throw new Error(
    `Pré-render devolveu ${appHtml?.length ?? 0} caracteres — algo quebrou no render do App.`
  );
}

const html = await readFile(DIST_HTML, "utf8");
if (!html.includes(ROOT_DIV)) {
  throw new Error(`Não achei ${ROOT_DIV} em dist/index.html — o alvo da injeção mudou.`);
}

await writeFile(DIST_HTML, html.replace(ROOT_DIV, `<div id="root">${appHtml}</div>`), "utf8");

console.log(`prerender: ${appHtml.length.toLocaleString("pt-BR")} caracteres injetados em dist/index.html`);
