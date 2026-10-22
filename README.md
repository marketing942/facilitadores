# Links de Pagamento · Grupo CPPEM

Página interna onde a equipe busca um produto e copia o link de pagamento.
Os dados vêm **direto da API do Digital Manager Guru** — sem webhook, sem planilha e sem
cadastro manual de link. Toda oferta ativa na Guru aparece aqui sozinha.

## Onde roda

- Produção: https://links-pagamento-guru.vercel.app (projeto Vercel `links-pagamento-guru`)
- Repositório: https://github.com/marketing942/links_guru — cada push na `main` publica sozinho.

## Como funciona

1. `lib/guru.ts` lê a API da Guru (`/products` e `/products/{id}/offers`). São ~280 chamadas
   por sincronização, cerca de 30 segundos.
2. `lib/catalog.ts` transforma isso em uma lista pronta para a tela (marca, valor, parcelas,
   assinatura, destaque) e guarda o resultado com `'use cache'`.
3. A página é pré-renderizada e **se atualiza sozinha a cada 10 minutos**, em segundo plano:
   quem acessa nunca espera a Guru.
4. O botão **Atualizar agora** derruba esse cache (`updateTag`) e recarrega na hora — use
   depois de criar ou alterar uma oferta na Guru.

### Cota da Guru

A API libera 360 chamadas por janela de ~60 segundos e uma sincronização usa ~280. Por isso
o cliente acompanha o `x-ratelimit-remaining` de cada resposta e **pausa** quando a cota está
acabando, em vez de falhar com 429. Duas sincronizações seguidas funcionam: a segunda espera
a janela virar (daí o "até 1 min" no botão).

## Rodando localmente

```bash
npm install
# .env.local com o token da Guru (veja .env.example)
npm run dev        # http://localhost:3000
npm run build && npm start
```

| Variável | Para que serve |
| --- | --- |
| `GURU_API_TOKEN` | Token da API do Digital Manager Guru (somente leitura) |

## Arquivos

| Arquivo | O que é |
| --- | --- |
| `lib/guru.ts` | Cliente da API da Guru: paginação, repetição e controle de cota |
| `lib/catalog.ts` | Monta o catálogo, calcula parcelas e aplica o cache de 10 min |
| `config/destaques.ts` | Ofertas fixadas em "Mais usados" (pelo final do link de checkout) |
| `app/page.tsx` | Página (servidor) |
| `app/links-explorer.tsx` | Busca, filtros, tabela, cópia e favoritos (cliente) |
| `app/actions.ts` | Ação "Atualizar agora" |
| `app/api/links/route.ts` | O mesmo catálogo em JSON, para n8n e outras ferramentas |

## Detalhes que valem saber

- **Marca** (CPPEM / Colégio / Unicive): vem do grupo ou do produtor do produto na Guru, com o
  domínio do checkout como reserva.
- **Parcelas**: calculadas com a regra da própria oferta (`interest_rate`, `max_with_interest`),
  igual ao que o checkout mostra — por isso aparece "18x" onde a oferta permite 18.
- **Ocultos**: produtos escondidos na Guru e ofertas inativas não aparecem.
- **Favoritos**: cada pessoa marca os seus, guardados no navegador dela (`localStorage`).
- **Destaques**: valem para todo mundo e ficam em `config/destaques.ts`.
- A página é `noindex`: é de uso interno, mas quem tiver o link acessa (não há login).
