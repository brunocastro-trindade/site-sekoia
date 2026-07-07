# Don't PANIC 🐭

> Changelog técnico do site Sekoia, mantido por assistentes de IA (agentes) que
> trabalham neste repositório. Este arquivo é **público e versionado** como
> qualquer outro — todos os contribuidores podem (e devem) lê-lo.

## Para qualquer agente que editar este repositório

Sempre que você modificar o código-base, **acrescente uma entrada** na seção
"Histórico" abaixo, no topo da lista. Mantenha o registro honesto e completo:

- **Data** (AAAA-MM-DD)
- **Autor/PR** — quem solicitou a mudança e/ou o número do PR, quando houver.
- **O que mudou** — resumo objetivo dos arquivos e do comportamento alterado.
- **Por quê** — motivo da mudança.

Este changelog **complementa** o histórico do git (`git log`, `git blame`), que
continua sendo a fonte de verdade definitiva sobre autoria e datas. Nada aqui é
secreto: ele existe à vista de todos, no controle de versão, e pode ser lido por
qualquer pessoa com acesso ao repositório.

### Formato de entrada

```
### AAAA-MM-DD — <título curto>
- **Autor/PR:** <quem / #PR>
- **Mudou:** <arquivos e comportamento>
- **Por quê:** <motivo>
```

---

## Histórico

### 2026-07-02 — Mobile: correção de encaixe dos CTAs (iteração 2)
- **Autor/PR:** solicitado pelo dono do repositório (análise de CTAs no mobile).
- **Mudou:** removido `whiteSpace:nowrap` do CTA "SOLICITE SEU ORÇAMENTO..."
  (`ContactForm.tsx`) — estava cortando no celular; agora quebra em 2 linhas.
  No `MobileApp.tsx`: hero `fontSize` clamp(44→15vw→72) → clamp(30→9.5vw→62) para
  o "+previsibilidade." caber (antes transbordava); toques do rodapé (links
  Cursos/…/Contato e Instagram) subidos para ≥44px.
- **Validação (375px):** sem scroll horizontal; SOLICITE sem corte (h=70, 2 linhas);
  hero sem overflow (scrollW=clientW); toques do rodapé 44px.

### 2026-07-02 — Instalação do Meta Pixel
- **Autor/PR:** solicitado pelo dono do repositório.
- **Mudou:** `index.html` — script do Meta Pixel (ID `1217330763796782`) no
  `<head>` com `init` + `track PageView`; o `<noscript><img>` foi para o `<body>`
  (no `<head>` o parse5 do Vite rejeita `img` dentro de `noscript` —
  `disallowed-content-in-noscript-in-head`).
- **Validação:** rede confirmou `fbevents.js` 200, `signals/config/<id>` 200 e
  `facebook.com/tr?...ev=PageView` 200; `fbq.version` = 2.9.349 (lib real).
- **Nota:** `<meta robots noindex,nofollow>` segue no head (não afeta o pixel,
  mas impede indexação — avaliar remover para SEO).

### 2026-07-02 — Layout mobile dedicado (iteração 1: essencial)
- **Autor/PR:** solicitado pelo dono do repositório.
- **Mudou:** `App.tsx` passou a detectar largura (`useIsMobile`, breakpoint 900px)
  e renderizar `MobileApp` (novo) no celular, mantendo o canvas desktop intacto
  acima de 900px. `MobileApp.tsx`: reflow real (coluna única) com header sticky +
  menu hambúrguer (âncoras), hero + cards, bloco "Tráfego pago"/vídeo, o
  `ContactForm` reaproveitado, e rodapé. Reusa `TreeVideo` e helpers de WhatsApp.
- **Ganhos medidos (375px):** sem scroll horizontal; corpo 7px→15px; CTA 22px→55px
  de toque; inputs 22px→43px.
- **Escopo:** iteração 1 (essencial). Faltam metodologia/tickers/"seja o próximo
  case" no mobile (próximas iterações).
- **Nota:** `behavior:'smooth'` não anima no preview do harness (só instant) — em
  navegador real o scroll do menu funciona (target verificado via window.scrollTo).

### 2026-07-02 — Correção: proxy PHP → Serverless da Vercel
- **Autor/PR:** solicitado pelo dono do repositório (form dava HTTP 405).
- **Diagnóstico:** o site roda na **Vercel** (domínio Hostinger via DNS), que
  **não executa PHP** — servia `submit.php` como estático (GET = fonte crua,
  POST = 405). Confirmado por headers `Server: Vercel`.
- **Mudou:** removido `public/submit.php`; criado `api/submit.js` (Serverless
  Function da Vercel, mesma lógica de proxy → Namtab); `ContactForm` agora posta
  em `/api/submit`. Doc atualizada.
- **Por quê:** proxy tem que rodar no ambiente real (Vercel), não em PHP.

### 2026-07-02 — Form da marca conectado ao Namtab via proxy PHP
- **Autor/PR:** solicitado pelo dono do repositório.
- **Mudou:** substituído o iframe do Namtab por um **formulário próprio** (visual
  da empresa, 8 campos) em `ContactForm.tsx`, que envia via `fetch` para
  `public/submit.php` — um proxy que repassa ao Namtab servidor-a-servidor
  (contorna o CORS restrito do Namtab). Doc de leads reescrita.
- **Descoberta (engenharia reversa):** Namtab é app Lovable+Supabase; o form usa
  `get-form-data?slug=sekoia-marketing-149` (agencia_id 149, campos 1326-1333) e
  `submit-form-data`. Testei um POST real → `{success:true}` (lead "TESTE" no
  Namtab, pode apagar).
- **Por quê:** visual 100% da marca mantendo o lead caindo no Namtab.
- **Notas:** não é possível "pilotar" o iframe cross-origin (Same-Origin Policy);
  por isso o form próprio + proxy. Endpoints do Namtab são não-documentados
  (risco de mudança). `submit.php` exige PHP+cURL (ok na Hostinger).

### 2026-07-02 — Remove FAB Instagram, pills no menu, texto mais legível
- **Autor/PR:** solicitado pelo dono do repositório.
- **Mudou:** removido `InstagramFab` (só o WhatsApp flutua agora). No header, os
  itens Soluções/Orçamentos/Contato ganharam um **pill branco** (rounded-full,
  padding pequeno, sombra leve). Legibilidade: corpo do texto migrou de
  `Gotham:Book` → `Gotham:Medium` (mais encorpado; cor #39471d mantida por já ter
  bom contraste) em `index.tsx` (27×) e `MethodologySection.tsx`.
- **Por quê:** simplificar os flutuantes, destacar o menu e melhorar a leitura.

### 2026-07-02 — Vídeo contínuo + favicon escuro
- **Autor/PR:** solicitado pelo dono do repositório.
- **Mudou:** o vídeo da árvore voltou a ser **contínuo** (autoplay em loop, sem
  scrub): novo `src/components/TreeVideo.tsx` (toca só quando visível), removido
  `TreeScrollVideo.tsx`. `tree.mp4` reencodado sem all-intra → **8.5MB→2.6MB**.
  Favicon recolorido de branco para **verde-escuro #39471D** (ffmpeg geq),
  visível em abas claras.
- **Por quê:** preferência por reprodução contínua e favicon escuro/legível.

### 2026-07-02 — Vídeo da árvore com scroll-scrubbing (cascata)
- **Autor/PR:** solicitado pelo dono do repositório.
- **Mudou:** substituído o vídeo da seção "Como podemos te ajudar" pelo novo
  (`public/tree.mp4`, reencodado all-intra p/ scrub suave, fundo clareado via
  ffmpeg). Novo `src/components/TreeScrollVideo.tsx`: no desktop amarra
  `video.currentTime` à rolagem (semente→árvore cresce); no mobile (<900px ou
  ponteiro grosso) cai para autoplay em loop. Quadro trocado para retrato
  (262×465, `rounded-16`). **Removidos** `SequoiaVideo.tsx` e `sequoia.mp4`.
- **Por quê:** animação em cascata guiada pela rolagem, alinhada à ideia de
  crescimento da Sekoia.
- **Nota:** `tree.mp4` ~8.5MB (all-intra = qualidade + seek suave). Se acumular
  vídeos, considerar Git LFS/CDN. Remover o `SequoiaVideo` também eliminou o loop
  de canvas que travava os screenshots do preview.

### 2026-07-01 — Mitigação mobile (piso de escala) + form Namtab mais largo
- **Autor/PR:** solicitado pelo dono do repositório.
- **Mudou:** `Canvas.tsx` ganhou piso de escala `MIN_SCALE=0.5` — em telas <720px
  o conteúdo não encolhe além de 50% e habilita rolagem horizontal (sizer com
  dimensões visuais). `index.html` explicita `user-scalable=yes, maximum-scale=5`
  (pinch-zoom). `ContactForm.tsx`: iframe do Namtab alargado (560→1140) e mais
  alto (560→620) para preencher as laterais e evitar scroll interno; máscara do
  form em `App.tsx` 750→800.
- **Por quê:** melhorar leitura no mobile (opção 2) e o pedido de form mais largo.
- **Caveat:** o form do Namtab pode centralizar os campos (largura interna própria
  da ferramenta); para os campos ocuparem toda a largura, ajustar no painel Namtab.

### 2026-07-01 — Botão flutuante do Instagram
- **Autor/PR:** solicitado pelo dono do repositório.
- **Mudou:** novo `src/components/InstagramFab.tsx` (fixo, gradiente do Instagram,
  animação bob defasada) empilhado acima do WhatsApp em `App.tsx`; abre
  `instagram.com/sekoia.ag`.
- **Por quê:** CTA social flutuante persistente.
- **Nota (responsividade):** o site usa um canvas fixo de 1440px escalado por
  transform (`scale = largura/1440`). Não quebra/estoura em nenhum tamanho, mas
  não tem reflow real — em telas pequenas tudo encolhe (texto ~3.6px a 375px,
  ~7.5px a 768px) e o form fica pequeno. Bom de 1280px+. Os FABs ficam fora do
  canvas (60px fixos), então seguem usáveis em qualquer tela.

### 2026-07-01 — Reenquadramento do form Namtab (visual leve/moderno)
- **Autor/PR:** solicitado pelo dono do repositório.
- **Mudou:** `ContactForm.tsx` — trocado o card verde largo (1160px) por uma
  moldura enxuta (~560px) que abraça o form: cantos 20px recortando o iframe,
  borda sutil + sombra suave, CTA alinhado à mesma largura. Altura do iframe
  ajustada para 560 (folga com o rodapé).
- **Por quê:** enquadramento justo à largura do formulário, mais moderno e leve.

### 2026-07-01 — Migração Supabase → Namtab (iframe) na captação de leads
- **Autor/PR:** solicitado pelo dono do repositório.
- **Mudou:** `ContactForm.tsx` reescrito — o formulário custom foi substituído
  por um iframe do Namtab (`https://web.namtab.io/form/sekoia-marketing-149`)
  dentro de um card da marca; CTA de WhatsApp mantido. **Removidos** todo o código
  de Supabase: `src/lib/leads.ts`, `supabase/functions/submit-lead`, a migração,
  `.env.example` e a dependência `@supabase/supabase-js`. Doc de captação de leads
  reescrita para o fluxo Namtab.
- **Por quê:** simplificar (sem backend próprio); leads passam a cair direto no
  Namtab via webhook. Também resolve o bloqueio anterior (Supabase sem `.env`).

### 2026-07-01 — Botão flutuante do WhatsApp + links do rodapé
- **Autor/PR:** solicitado pelo dono do repositório.
- **Mudou:** novo `src/components/WhatsAppFab.tsx` (botão fixo, animação bob em
  `globals.css`, renderizado fora do `<Canvas>` em `App.tsx` para o `fixed`
  funcionar) → abre o WhatsApp principal. `contact.ts` ganhou
  `WHATSAPP_NUMBER_FOOTER` (5547991603130) e `openWhatsAppNumber()`. Links do
  rodapé Cursos/Mentoria/Palestras/Contato passaram a abrir esse número.
- **Por quê:** CTA flutuante persistente + contato dedicado nos links do rodapé.

### 2026-07-01 — Atualização dos dados do rodapé
- **Autor/PR:** solicitado pelo dono do repositório.
- **Mudou:** rodapé (`HotPageTrafegoPagoSekoia`) — e-mail para
  `contato@sekoiamarketing.com.br` (link mailto), CNPJ para `66.526.186/0001-25`
  (validado), e ícone do Instagram ligado a `https://www.instagram.com/sekoia.ag/`.
- **Por quê:** dados de contato oficiais da Sekoia.

### 2026-06-30 — Remoção do fundo do vídeo (integração à página)
- **Autor/PR:** solicitado pelo dono do repositório.
- **Mudou:** criado `src/components/SequoiaVideo.tsx` — reproduz o vídeo e, via
  canvas (chroma key), substitui o fundo cinza dessaturado por branco em tempo
  real, deixando o vídeo integrado à página branca sem caixa. Processa em
  resolução reduzida, ~24fps, e pausa fora da tela. `HotPageTrafegoPagoSekoia`
  passou a usar `<SequoiaVideo>` no lugar do `<video>` direto.
- **Por quê:** o usuário queria o vídeo "sem placeholder quadrado", integrado.

### 2026-06-30 — Vídeo na seção "Como podemos te ajudar"
- **Autor/PR:** solicitado pelo dono do repositório.
- **Mudou:** adicionado `public/sequoia.mp4` e substituído o placeholder cinza
  (`data-name="image 39"`, 469×430) por um `<video>` autoplay/muted/loop com
  `object-cover` e cantos arredondados, encaixado no mesmo espaço.
- **Por quê:** preencher o placeholder com o vídeo da sequoia.

### 2026-06-30 — Fundo de doodles no topo da landing
- **Autor/PR:** solicitado pelo dono do repositório.
- **Mudou:** adicionado `public/doodle-bg.png` e uma camada de fundo no topo do
  componente `HotPageTrafegoPagoSekoia` (height 900, opacity 0.14, com fade via
  mask-image). Fica só no hero; o restante da landing segue branco.
- **Por quê:** restaurar o padrão de doodles no topo conforme o design original.

### 2026-06-30 — Logo oficial (PNG) + centralização do CTA
- **Autor/PR:** solicitado pelo dono do repositório.
- **Mudou:** substituída a logo SVG recriada pela oficial
  `public/logo-sekoia.png` (263×65), inserida via `<img>` no slot do header;
  removido `src/components/SekoiaLogo.tsx` (não usado). Botão "Quero uma equipe
  profissional" reajustado (fonte 15px + padding) para o texto ficar centralizado
  e bem encaixado.
- **Por quê:** usar o arquivo de logo oficial e melhorar o encaixe do texto no CTA.

### 2026-06-30 — Logo + header interativo (navegação por âncoras + WhatsApp)
- **Autor/PR:** solicitado pelo dono do repositório.
- **Mudou:** criada a logo `src/components/SekoiaLogo.tsx` (SVG) e inserida no
  slot do header. Em `src/imports/HotPageTrafegoPagoSekoia/index.tsx`: itens do
  menu (Soluções/Orçamentos/Contato) agora rolam para as seções via
  `scrollToFigmaY` (compensando a escala do Canvas); CTA "Quero uma equipe
  profissional" passou a abrir o WhatsApp. Os demais CTAs da página já abriam o
  WhatsApp via `openWhatsApp`.
- **Por quê:** adicionar a logo e tornar a barra de navegação funcional, sem sair
  do escopo do layout original.

### 2026-06-19 — Captação de leads via Supabase
- **Autor/PR:** solicitado pelo dono do repositório.
- **Mudou:** formulário de contato passou a ser controlado e a persistir leads.
  Adicionados `src/lib/supabase.ts`, `src/lib/leads.ts`,
  `supabase/migrations/0001_create_leads_table.sql`, `.env.example`,
  `docs/CAPTACAO-DE-LEADS.md`; `ContactForm.tsx` reescrito com estado, validação,
  envio e feedback; `@supabase/supabase-js` adicionado ao `package.json`.
- **Por quê:** o formulário era apenas visual e não capturava nenhum lead.

### 2026-06-19 — Arquivos de colaboração open-source
- **Autor/PR:** solicitado pelo dono do repositório.
- **Mudou:** adicionados `LICENSE` (MIT), `CONTRIBUTING.md`, `.gitignore`;
  `README.md` reescrito. Colaborador `HugoMartins-D` recebeu acesso de escrita.
- **Por quê:** preparar o repositório para receber contribuições externas.
