# Time Comercial · Grupo CPPEM

Sistema interno do time comercial, com três ferramentas escolhidas na página inicial:

| Rota | Ferramenta |
| --- | --- |
| `/links` | **Links de pagamento Guru** — busca o produto e copia o link (detalhes abaixo) |
| `/calculadora` | **Calculadora Guru + Stone** — parcelas, juros repassados e valor líquido recebido |
| `/calculadora-ton` | **Calculadora Maquineta TON** — taxas por plano (Super, Turbo, Max) |

As calculadoras não usam banco de dados nem a API da Guru: cada pessoa calcula no próprio navegador
(os últimos valores digitados ficam no `localStorage` dela). No computador, o cursor vira uma mira
(`components/crosshair.tsx`); em celular e tablet nada muda.

## Links de pagamento

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
| `app/page.tsx` | Página inicial: escolha da ferramenta |
| `app/links/page.tsx` | Página dos links (servidor) |
| `app/links/links-explorer.tsx` | Busca, filtros, tabela, cópia e favoritos (cliente) |
| `app/links/actions.ts` | Ação "Atualizar agora" |
| `app/api/links/route.ts` | O mesmo catálogo em JSON, para n8n e outras ferramentas |
| `components/CalculadoraStone.tsx` | Calculadora Guru + Stone (taxas no topo do arquivo) |
| `components/CalculadoraTon.tsx` | Calculadora da maquineta TON (taxas no topo do arquivo) |
| `hooks/useLocalStorage.ts` | Guarda no navegador os últimos valores digitados |

## Calculadora Guru + Stone

Taxas do demonstrativo "Taxas e prazos das suas transações" (Pagar.me / Stone, e-Commerce), emitido em
22/10/2026. Ficam em constantes no topo de `components/CalculadoraStone.tsx`:

- **Cartão de crédito**: percentual por quantidade de parcelas (1x a 18x), igual para Visa, Mastercard,
  Elo, Amex e Hipercard. Não se multiplica pelo número de parcelas.
- **Processamento**: R$ 0,30 por transação aprovada (crédito, boleto e Pix).
- **Antifraude**: R$ 0,20 por transação de crédito (só cartão).
- **Boleto**: R$ 2,39. **Pix**: 0,85% do valor.
- Líquido do crédito = total do cliente × (1 − taxa da parcela) − R$ 0,30 − R$ 0,20.
- Os juros repassados são simples: total = valor × (1 + juros mensal × parcelas). A faixa sugerida de
  juros (1,70% a 2,50%) é só um aviso na tela e não entra na conta.
- **Juros automático por faixa de valor** (`RATE_TIERS`): abaixo de R$ 1.000 → 2,10% · de R$ 1.000 a
  R$ 1.999,99 → 2,00% · a partir de R$ 2.000 → 1,90%. O campo se ajusta sozinho quando o vendedor muda o
  valor. Se ele editar o juros (negociação especial), o valor dele passa a valer, mesmo que o valor do
  produto mude depois, até clicar em "Voltar ao automático". Fica salvo no navegador (`calc_rate_manual`).

Quando a Stone mudar as taxas, é só atualizar essas constantes.

## Detalhes que valem saber

- **Marca** (CPPEM / Colégio / Unicive): vem do grupo ou do produtor do produto na Guru, com o
  domínio do checkout como reserva.
- **Parcelas**: calculadas com a regra da própria oferta (`interest_rate`, `max_with_interest`),
  igual ao que o checkout mostra — por isso aparece "18x" onde a oferta permite 18.
- **Ocultos**: produtos escondidos na Guru e ofertas inativas não aparecem.
- **Favoritos**: cada pessoa marca os seus, guardados no navegador dela (`localStorage`).
- **Destaques**: valem para todo mundo e ficam em `config/destaques.ts`.
- A página é `noindex`: é de uso interno, mas quem tiver o link acessa (não há login).
