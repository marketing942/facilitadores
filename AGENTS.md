<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Projeto: Utilitários CPPEM (para IAs e programadores)

Leia o [README.md](README.md) antes de mexer: ele tem o mapa de grupos, abas, rotas e arquivos de dados.

- O menu, a página inicial e o tutorial saem de `config/tools.tsx`. Para criar ou mover uma aba, edite só ele (e crie `app/<rota>/page.tsx`).
- Conteúdo editável (textos, links, horários, listas) fica em `config/`. Não espalhe dados pelas páginas.
- Textos da interface em português do Brasil, no tom da marca. Identidade preto e dourado: use os tokens de `app/globals.css`.
- Toda tela nova: teste em 320, 375, 414 e 768px (sem rolagem lateral, toques de 40px+, modais dentro da tela).
- Mantenha os atributos `data-tour` do menu e da página inicial: o tutorial (`components/tour.tsx`) depende deles.
- Não traga para o código PDFs de terceiros, vídeos ou senhas do Notion: o sistema abre sem login. Use link para o Notion.
- Antes de subir: `npx eslint . && npx tsc --noEmit && npm run build`, e um backup (branch `backup/pre-...` + tag) do estado anterior.
