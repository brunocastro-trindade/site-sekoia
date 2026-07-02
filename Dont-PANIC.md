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
