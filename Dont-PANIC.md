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
