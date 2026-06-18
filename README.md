# Site Sekoia

Site da Sekoia construído com **React + Vite + Tailwind CSS + shadcn/ui**. O projeto foi originado a partir de um arquivo do Figma Make e é mantido de forma aberta — contribuições são bem-vindas.

## Tecnologias

- [React 18](https://react.dev/)
- [Vite 6](https://vitejs.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)

## Rodando localmente

Pré-requisito: [Node.js](https://nodejs.org/) 18+.

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o servidor de desenvolvimento
npm run dev
```

O Vite mostrará a URL local (normalmente `http://localhost:5173`).

Para gerar o build de produção:

```bash
npm run build
```

## Estrutura

```
src/
  app/          # componentes e páginas da aplicação
  imports/      # ativos e componentes exportados do Figma
  styles/       # estilos globais
index.html      # ponto de entrada
vite.config.ts  # configuração do Vite
```

## Como contribuir

Este repositório é aberto a contribuições. Veja o [CONTRIBUTING.md](CONTRIBUTING.md) para o passo a passo (fork, branch, pull request).

## Licença

Distribuído sob a licença [MIT](LICENSE). Veja [ATTRIBUTIONS.md](ATTRIBUTIONS.md) para créditos de componentes e imagens de terceiros.
