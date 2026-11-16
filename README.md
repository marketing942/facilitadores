# Utilitários CPPEM

Sistema interno da equipe CPPEM: links, calculadoras, Wi-Fi, dados da empresa, estudo e benefícios,
num só lugar. Feito em **Next.js 16 (App Router) + React 19 + Tailwind CSS 4**, em TypeScript.

- Repositório: https://github.com/marketing942/facilitadores (branch `main`)
- Publicação: projeto `ferramentas-comercial` na Vercel. Cada push na `main` publica sozinho.

## Como o sistema está organizado

O menu tem **5 grupos**, e cada grupo tem **abas**. Tudo isso sai de um único arquivo,
[`config/tools.tsx`](config/tools.tsx): o menu do topo, a barra de baixo do celular, os cartões da
página inicial e os textos do tutorial guiado se montam sozinhos a partir dele.

| Grupo | Aba | Rota | Dados |
| --- | --- | --- | --- |
| Geral | Wi-Fi | `/wifi` | banco · `/admin/wifi` |
| Geral | Dados da empresa | `/empresa` | banco · `/admin/empresa` |
| Geral | Livro dos Recordes | link externo | `config/tools.tsx` |
| Geral | Redes sociais | `/redes-sociais` | banco · `/admin/redes` |
| Comercial | Atendimento | `/atendimento` | banco · `/admin/atendimento` |
| Comercial | Links Guru | `/links` | API da Guru (`lib/guru.ts`, `lib/catalog.ts`) |
| Comercial | Guru + Stone | `/calculadora` | `components/CalculadoraStone.tsx` |
| Comercial | TON | `/calculadora-ton` | `components/CalculadoraTon.tsx` |
| Comercial | Comissões | `/comissoes` | `config/comissoes.ts` (regras) + `lib/comissoes.ts` (cálculos) |
| Comercial | Cancelamento | `/cancelamento` | `components/CalculadoraCancelamento.tsx` |
| Estudo | Como estudar | `/como-estudar` | na própria página |
| Estudo | Trilhas G4 Skills | `/trilhas` | banco · `/admin/trilhas-g4` |
| Estudo | Trilhas Internas | `/trilhas-internas` | banco · `/admin/trilhas-internas` |
| Estudo | Biblioteca | `/biblioteca` | banco · `/admin/biblioteca` (capas em `public/biblioteca/` ou por endereço) |
| Serviços | Food Service | `/food-service` | `config/food.ts` |
| Serviços | Academia | `/academia` | `config/academia.ts` + `public/selfit-unidades.json` |
| Serviços | Saúde | link externo | `config/tools.tsx` |
| Serviços | Autoescola | `/autoescola` | `config/autoescola.ts` + `public/servicos/dirija-logo.jpg` |
| Serviços | Transporte | `/transporte` | `config/transporte.ts` |
| Serviços | Finanças | `/financas` | na própria página |
| Serviços | Metas e organização | `/metas` | na própria página |
| Serviços | Educação | `/educacao` | na própria página |
| Serviços | Parceiros | link externo | `config/tools.tsx` |
| Ferramentas | Sistemas e links | `/ferramentas` | banco · `/admin/ferramentas` |

Endereços antigos que continuam funcionando (`next.config.ts`): `/acessos` → `/ferramentas` e
`/parceiros` → site de parceiros.

## Banco de dados (Supabase) e painel administrativo

As abas Wi-Fi, Dados da empresa, Redes sociais, Atendimento, Sistemas e links, Biblioteca e Trilhas (G4 e Internas)
leem do **Postgres do Supabase** e são editadas em **`/admin`**, sem mexer no código. Food Service, Academia, Autoescola,
Transporte, Finanças, Metas, Educação, as calculadoras e a Guru **não** usam o banco (a Guru continua vindo da API).

- **Conexão:** `lib/db.ts` usa `DATABASE_URL` (pooler do Supabase, porta 6543). Só o servidor acessa o banco: todas as tabelas
  têm RLS ligado e nenhuma policy, então a chave pública do Supabase não lê nem grava nada.
- **Tabelas:** `supabase/migrations/*.sql`. Para aplicar: `npm run db:migrate`.
- **Leitura:** `lib/data.ts`, com cache por tag. Ao salvar no painel a tag é invalidada e o site já mostra o dado novo.
- **Painel:** `app/admin/`. Os formulários saem de `lib/admin-schema.ts`; para um campo novo, crie a coluna numa migração
  e acrescente o campo ali. As ações estão em `app/admin/actions.ts`.
- **Senhas:** duas, guardadas só como hash scrypt na tabela `settings`: a do **painel** e a da **equipe** (libera as senhas do
  Wi-Fi interno em `/wifi`). As duas se trocam em `/admin/seguranca`. Sessões em cookie httpOnly, com bloqueio após 5 erros em 15 min.
- **Capas e fotos:** não há upload. Use um caminho em `public/` ou o endereço completo da imagem.

## Pastas

```
app/            uma pasta por aba (a rota é o nome da pasta); page.tsx é a página
  layout.tsx    casca comum: fontes, menu, mira do mouse e tutorial
  globals.css   cores da marca (tokens), classes comuns (gold-button, ghost-button, eyebrow...) e impressão
config/         tipos e constantes das abas, e os DADOS das abas que não usam o banco (Food Service, Academia...)
lib/db.ts, lib/data.ts, lib/auth.ts, lib/admin-schema.ts   banco, leitura com cache, senhas e formulários do painel
supabase/       migrações SQL do banco
components/     peças reutilizadas por várias abas (menu, botões, filtros, calculadoras, tutorial)
lib/            lógica sem tela: API da Guru, catálogo, relógio de Recife
hooks/          hooks de React (localStorage das calculadoras)
public/         imagens e arquivos estáticos (capas, logos, unidades da Selfit)
```

## Como fazer as mudanças mais comuns

**Trocar um texto, link, telefone ou senha das abas ligadas ao banco:** entre em `/admin`. As demais abas (Food Service, Academia, Autoescola, Transporte) ainda se editam no arquivo de `config/`.
Cada arquivo explica no topo o que guarda.

**Criar uma aba nova num grupo:**
1. Crie `app/<rota>/page.tsx`. Use `PageHeader` (`components/page-header.tsx`) para a trilha e o título,
   e copie a estrutura de uma aba parecida (ex.: `app/financas/page.tsx` para uma aba de app,
   `app/food-service/page.tsx` para uma com banner).
2. Acrescente a aba no grupo certo em `config/tools.tsx` (`href`, `label`, `title`, `description`, `icon`).
   Pronto: menu, página inicial e tutorial já mostram.
3. Se os dados forem mudar com frequência, ponha-os num arquivo novo em `config/`.

**Aba que só abre um site de fora:** em `config/tools.tsx`, use a URL completa no `href` e `externo: true`
(veja Parceiros, Saúde e Livro dos Recordes). Ela abre em nova aba e ganha a setinha ↗.

**Novo grupo:** acrescente em `GROUPS` (`config/tools.tsx`). A barra de baixo do celular comporta
5 grupos em 320px; um sexto exige rever `components/Navbar.tsx`.

**Livro da Biblioteca:** capa em `public/biblioteca/<slug>.jpg` e uma entrada em `config/biblioteca.ts`.

**Unidades da Selfit:** `public/selfit-unidades.json` foi baixado do site da Selfit
(`/unidades/listar`). Baixe de novo quando abrirem unidades. As de Caruaru ficam também em `config/academia.ts`.

## Regras que valem para o sistema todo

- **Identidade visual:** preto e dourado. Use as cores do tema (`gold`, `gold-light`, `surface`,
  `line`...), definidas em `app/globals.css`. Não use cores novas nos botões das abas.
- **Celular primeiro:** toda tela nova precisa funcionar em 320, 375, 414 e 768px, sem rolagem para
  o lado, com botões de pelo menos 40px de altura e modais dentro da tela.
- **Tutorial guiado** (`components/tour.tsx`): abre no primeiro acesso de cada navegador e pelo botão
  "?" do topo. Os passos apontam para elementos com `data-tour="..."` no menu e na página inicial;
  não remova esses atributos.
- **Conteúdo de terceiros:** a Biblioteca e as Trilhas Internas só têm catálogo e link para o Notion.
  PDFs de livros, vídeos e senhas que estão no Notion **não** vêm para cá: o sistema abre sem login.
- **Selo "Provavelmente ativa"** (Food Service): calculado no navegador, no fuso de Recife
  (`lib/horario.ts`), a partir das janelas de horário em `config/food.ts`.
- **Mira do mouse** (`components/crosshair.tsx`): só com mouse; em toque nada muda.

## Links de pagamento Guru

Os dados vêm direto da API do Digital Manager Guru, sem planilha nem cadastro manual: toda oferta
ativa aparece sozinha.

1. `lib/guru.ts` lê `/products` e `/products/{id}/offers` (~280 chamadas por sincronização).
   Acompanha `x-ratelimit-remaining` e pausa antes de estourar a cota de 360 chamadas/minuto.
2. `lib/catalog.ts` monta a lista da tela (marca, valor, parcelas, destaque) e guarda em cache por
   10 minutos (`unstable_cache`). Produtos em destaque: `config/destaques.ts`.
3. O botão **Atualizar agora** (`app/links/actions.ts`) limpa o cache e busca a Guru de novo.
4. `GET /api/links` devolve o mesmo catálogo em JSON.

As calculadoras não usam banco nem API: cada pessoa calcula no próprio navegador, e os últimos valores
ficam no `localStorage` dela (`hooks/useLocalStorage.ts`).

## Rodar localmente

```bash
npm install
cp .env.example .env.local   # GURU_API_TOKEN (Links Guru) e DATABASE_URL (Supabase)
npm run dev                  # http://localhost:3000
npx eslint . && npx tsc --noEmit && npm run build   # antes de subir
```

## Publicar

A `main` publica sozinha na Vercel. As variáveis `DATABASE_URL` e `GURU_API_TOKEN` precisam estar cadastradas na Vercel. Antes de cada envio, guarde um backup do estado anterior
(branch `backup/pre-<assunto>-<data>` e tag com o mesmo nome) para poder voltar se precisar.
