# Contribuindo com o Site Sekoia

Obrigado pelo interesse em contribuir! Este guia explica como propor mudanças.

## Fluxo de contribuição (fork + pull request)

Qualquer pessoa pode contribuir, mesmo sem acesso de escrita ao repositório:

1. **Faça um fork** do repositório no GitHub (botão "Fork" no canto superior direito).
2. **Clone** o seu fork:
   ```bash
   git clone https://github.com/SEU_USUARIO/site-sekoia.git
   cd site-sekoia
   ```
3. **Instale as dependências e teste localmente:**
   ```bash
   npm install
   npm run dev
   ```
4. **Crie uma branch** para sua mudança:
   ```bash
   git checkout -b minha-mudanca
   ```
5. **Faça suas alterações** e confirme que o build funciona:
   ```bash
   npm run build
   ```
6. **Commit e push:**
   ```bash
   git add .
   git commit -m "Descreva sua mudança"
   git push origin minha-mudanca
   ```
7. **Abra um Pull Request** do seu fork para a branch `main` deste repositório.

## Colaboradores diretos

Quem tiver acesso de escrita pode trabalhar em uma branch diretamente neste repositório (sem fork) e abrir o Pull Request a partir dela. **Não faça push direto na `main`** — sempre use uma branch e Pull Request para que as mudanças possam ser revisadas.

## Boas práticas

- Mantenha cada Pull Request focado em uma mudança.
- Escreva mensagens de commit claras e descritivas.
- Garanta que `npm run build` passa antes de abrir o PR.
- Siga o estilo de código e os padrões já presentes no projeto (veja a pasta `guidelines/`).

## Dúvidas

Abra uma [issue](https://github.com/brunocastro-trindade/site-sekoia/issues) descrevendo o problema ou a sugestão.
