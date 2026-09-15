@AGENTS.md

# Central Imóveis — Site + Painel

Este arquivo é a especificação principal do projeto. Qualquer trabalho
futuro (novas seções, ajustes visuais, novas animações) deve ser
consistente com o que está descrito aqui. Se uma decisão de design ou
copy não estiver coberta por este documento, prefira o caminho mais
sóbrio e editorial — não o mais chamativo.

## Objetivo

Site real (não mais um protótipo descartável) para a **Central Imóveis**
(Instagram [@imobcim](https://instagram.com/imobcim)), com foco em
aluguel: site público com listagem/filtro de imóveis e painel
administrativo autenticado para o cliente gerenciar o próprio catálogo.
A direção visual editorial nasceu como protótipo de marca, mas agora é a
identidade real do site em produção — todas as regras de design, cores,
tipografia e animação abaixo continuam valendo integralmente, inclusive
para as telas funcionais (listagem, detalhe do imóvel, painel).

A experiência deve ler como um site editorial de arquitetura/imobiliário
premium — não como um template de imobiliária, não como um SaaS, não
como algo "tech demo". A sensação-alvo: sofisticada, confiável, elegante,
contemporânea, cinematográfica, humana, premium. Isso vale até para a
listagem de imóveis: cards sóbrios (foto grande, legenda mínima, sem
sombra/borda arredondada genérica), nunca o visual de "grid de imobiliária
com badge de preço".

O painel administrativo (`/painel/**`) é ferramenta interna — não precisa
seguir a mesma linguagem editorial da marca, só precisa ser funcional,
acessível e consistente com os tokens de cor (`ink`/`paper`/`gold`).

## Identidade visual

- **Preto** (`--color-ink #0a0a09`, `--color-ink-2 #141412`) — base de
  fundos escuros e blocos de alto contraste.
- **Branco quente** (`--color-paper #f8f6f1`, `--color-paper-2 #efeae0`)
  — base de fundos claros. Nunca branco puro (`#fff`) — foge do tom
  editorial/quente da marca.
- **Amarelo de marca** (`--color-gold #e2b426`, hover `--color-gold-dim
  #b8901d`, tinta suave `--color-gold-soft`) — **accent, não cor de
  fundo**. Usar em: eyebrows/labels, sublinhados, ícones ativos, detalhes
  de hover, uma palavra de destaque num título. Nunca em blocos grandes,
  nunca como fundo de seção inteira.
- Tokens completos em `src/app/globals.css` (`:root` + `@theme inline`).
  Qualquer nova cor entra ali, nunca como hex solto em componentes.
- **Tipografia**: `Fraunces` (serifada, editorial) para títulos e
  headlines de grande escala; `Inter` para corpo de texto, UI e labels.
  Variáveis já configuradas em `src/app/layout.tsx`
  (`--font-display`, `--font-sans`). Títulos grandes usam tamanhos fluidos
  via `clamp()` (ver exemplo em `Hero`), não a escala fixa padrão do
  Tailwind.
- **Logo**: a marca usa um logotipo circular. Ainda não recebemos o
  arquivo oficial — `src/components/ui/mark.tsx` é um placeholder
  (monograma "CI" num círculo). Substituir por SVG oficial quando
  disponível (ver "Regras para assets").

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 (config via `@theme inline` em `globals.css`, sem
  `tailwind.config.ts` — v4 detecta conteúdo automaticamente)
- GSAP + ScrollTrigger
- Lenis (smooth scroll)
- Lucide React (ícones)
- Prisma (ORM) + Postgres, com driver adapter (`@prisma/adapter-pg`) —
  ver "Dados e autenticação" abaixo para o porquê do adapter
- Autenticação própria e mínima: `bcryptjs` (hash de senha) + `jose`
  (sessão JWT em cookie httpOnly), seguindo o padrão documentado em
  `node_modules/next/dist/docs/01-app/02-guides/authentication.md`.
  Sem NextAuth/Auth.js: um único usuário admin, sem OAuth, sem
  múltiplos papéis — a biblioteca completa seria complexidade sem
  benefício aqui (ver "Painel administrativo").
- `zod` para validação de formulários (Server Actions)
- `@vercel/blob` para upload de fotos dos imóveis (ver "Dados e
  autenticação")

Avaliar Three.js/WebGL **apenas** se surgir uma necessidade visual real
e específica (ex.: um efeito de profundidade que scroll/CSS/GSAP puro
não resolvem bem). Não adicionar por adicionar.

### ⚠️ Este Next.js não é o que está no seu treinamento

Next 16 mudou convenções que quebram suposições comuns — **antes de usar
qualquer API do framework não confirmada neste projeto, confira
`node_modules/next/dist/docs/`** (ver `AGENTS.md`). Duas mudanças já
mordidas neste projeto:

- `middleware.ts` foi renomeado para **`proxy.ts`** (`export default
  function proxy(request)`), com a mesma função de sempre. O arquivo
  deste projeto é `src/proxy.ts`.
- Prisma 7 não lê mais `datasource.url` do `schema.prisma`: a URL de
  conexão para Migrate vive em `prisma7.config.ts`, e o `PrismaClient`
  em runtime recebe um **driver adapter** explícito (`@prisma/adapter-pg`
  neste projeto) em vez de ler `DATABASE_URL` sozinho. Ver
  `src/lib/prisma.ts`.

## Arquitetura

```
prisma/
  schema.prisma            modelos Imovel, Foto, User
  seed.ts                   cria/atualiza o usuário admin (via env vars)
prisma7.config.ts           config do Prisma CLI (migrations, DATABASE_URL)
src/
  app/
    layout.tsx               fontes, metadata, SmoothScrollProvider
    page.tsx                 composição das seções da landing (Home)
    globals.css               design tokens (@theme) + estilos base
    imovel/[id]/page.tsx       detalhe público de um imóvel
    painel/
      login/page.tsx           login (fora do route group protegido)
      (protected)/layout.tsx    verifySession() + chrome do painel
      (protected)/imoveis/       list / novo / [id]/editar
  components/
    layout/                 chrome persistente (header, footer, providers)
    sections/                uma seção da landing = um arquivo
    ui/                     peças pequenas e reutilizáveis (Mark, PropertyCard…)
    painel/                  peças específicas do admin (ImovelForm…)
  lib/
    animation/
      gsap.ts                registro único de plugins GSAP
      motion-tokens.ts        EASE / DURATION / STAGGER compartilhados
      use-reduced-motion.ts   hook de prefers-reduced-motion
    auth/
      session.ts               criptografia/gravação do cookie de sessão
      dal.ts                    verifySession() — Data Access Layer
      actions.ts                Server Actions de login/logout
    prisma.ts                 singleton do PrismaClient (com driver adapter)
    imoveis.ts                 camada de dados (queries Prisma) de Imovel/Foto
    imoveis-schema.ts          validação zod do formulário de imóvel
    imoveis-actions.ts         Server Actions de CRUD de imóvel/foto
    upload.ts                  upload de foto para o Vercel Blob
    whatsapp.ts                 monta a URL/mensagem de "Tenho interesse"
  generated/prisma/            Prisma Client gerado (gitignored, não editar)
public/
  brand/                      logo oficial, favicon, quando chegarem
  images/                     fotografia (hero…)
```

Regras de organização:

- **Uma seção da landing = um componente em `components/sections/`**,
  importado e composto em `app/page.tsx`. Nunca uma página monolítica.
- Componentes de `ui/` não sabem nada sobre GSAP/ScrollTrigger — recebem
  refs via `forwardRef` e deixam a seção-pai controlar a timeline. Isso
  mantém a animação de uma seção num único `gsap.context`, fácil de
  limpar.
- Toda a lógica de scroll/animação passa pelos utilitários de
  `lib/animation/` — não reimplementar registro de plugin, easings ou
  detecção de reduced-motion dentro de um componente de seção.
- Dados de imóveis vêm do banco (`src/lib/imoveis.ts`), nunca mockados
  em componente — o catálogo é gerenciado pelo cliente via `/painel`.

## Estrutura da landing (8 seções) — implementada

1. Hero
2. Manifesto
3. **Imóveis disponíveis** — listagem real (banco de dados), filtros
   combináveis (quartos + garagem), botão "Tenho interesse" por imóvel.
   Substituiu a antiga vitrine curada com 3 imóveis mockados.
4. Experiência
5. Imóvel em destaque
6. Sobre a Central
7. Contato/localização
8. CTA final

As 8 seções da landing existem. Mudanças de conteúdo/copy/visual nelas
continuam devendo ser consistentes com este documento; novas seções ou
reestruturações maiores ainda devem ser propostas antes de virar código.
Fora da landing, `/imovel/[id]` e `/painel/**` são rotas funcionais — ver
"Painel administrativo" e "Dados e autenticação" abaixo.

## Dados e autenticação

- **Modelos** (`prisma/schema.prisma`): `Imovel` (titulo, bairro, valor,
  taxas opcional, quartos, temGaragem, descricao, status ATIVO/INATIVO),
  `Foto` (url + ordem, N:1 com Imovel, `onDelete: Cascade`), `User`
  (email + passwordHash — um único registro, o admin do painel).
- **Sessão**: cookie `session` httpOnly/secure/sameSite=lax, JWT assinado
  com `SESSION_SECRET` (`src/lib/auth/session.ts`). Sem tabela de sessão
  no banco — stateless, 7 dias de validade.
- **Autorização em duas camadas**: `src/proxy.ts` faz o check
  otimista (cookie presente/ausente) e redireciona `/painel/**` não
  autenticado para `/painel/login`; `verifySession()`
  (`src/lib/auth/dal.ts`), chamado no layout do route group
  `painel/(protected)/`, é a checagem "de verdade" antes de qualquer
  leitura/escrita de dado administrativo.
- **Fotos**: upload vai para o Vercel Blob (`src/lib/upload.ts`), não
  para `public/` — o filesystem local não é gravável de forma persistente
  em produção (serverless). Requer `BLOB_READ_WRITE_TOKEN`.
- **WhatsApp**: `src/lib/whatsapp.ts` monta a URL `wa.me` com mensagem
  pré-preenchida a partir dos dados do imóvel — função pura, testada com
  `node --test` (`npm run test`). Depende de `WHATSAPP_PHONE`.

## Painel administrativo

- MVP de usuário único — sem múltiplos papéis, sem convite de usuário,
  sem billing/planos (isto não é um produto multi-tenant).
- CRUD de imóvel + fotos em `/painel/imoveis` (listar/criar/editar) e
  exclusão inline (com confirmação) na listagem.
- Visualmente é uma ferramenta interna: usa os tokens de cor da marca
  (`ink`/`paper`/`gold`) mas não precisa da mesma pompa editorial da
  landing (sem GSAP/ScrollTrigger no painel — não há necessidade).

## Regras de design

- Hierarquia visual forte: tipografia grande, espaço generoso,
  imagens grandes. Prefira menos elementos, maiores.
- Contraste entre seções claras (`paper`) e escuras (`ink`) para dar
  ritmo à rolagem — não deixar tudo no mesmo tom.
- Grids assimétricos e sobreposição controlada de elementos (texto sobre
  imagem, blocos que "vazam" a margem) são bem-vindos; grids de 3 colunas
  perfeitamente simétricas em todo lugar são o oposto do objetivo.
- **Não é permitido**: excesso de cards com sombra/borda arredondada
  genérica, gradientes decorativos sem função, glassmorphism, ícones
  soltos "decorando" texto, qualquer coisa que lembre um template pronto
  de imobiliária ou um dashboard SaaS.

## Regras de animação

- Vocabulário disponível: ScrollTrigger, parallax, scale, opacity,
  translate, clip-path, pinning, scroll horizontal, stagger, reveal,
  profundidade (camadas com velocidades diferentes). Reutilizar
  `EASE`/`DURATION`/`STAGGER` de `lib/animation/motion-tokens.ts` para
  manter o mesmo "peso" de movimento em todas as seções.
- Toda seção com scroll animation:
  1. registra plugins via `ensureGsapRegistered()`;
  2. cria as animações dentro de `gsap.context(() => {...}, ref)`;
  3. faz `return () => ctx.revert()` no cleanup do efeito;
  4. checa `useReducedMotion()` e, se `true`, pula para o estado final
     com `gsap.set(...)` em vez de animar.
- Movimento deve ser **contido e proposital**: entradas suaves, parallax
  sutil (poucos % de deslocamento), sem elementos "pulando", sem easing
  elástico/bounce, sem animação decorativa sem motivo de leitura.
- **Proibido**: animações exageradas, overshoot/bounce, efeitos
  aleatórios ou gerados por Math.random() visualmente perceptível,
  excesso de blur, excesso de glow, qualquer efeito que atrapalhe a
  leitura do texto ou a navegação (ex.: pinning que trava o scroll por
  tempo longo demais, parallax forte o suficiente para causar enjoo).

## Regras de performance

- Lazy loading de imagens fora do viewport inicial (`next/image` com
  `priority` **apenas** na imagem do Hero).
- Formatos modernos (WebP/AVIF) via `next/image` sempre que possível.
- Nunca animar propriedades que disparam layout/reflow (`width`,
  `height`, `top`, `left` soltos) — animar `transform`/`opacity`.
- `will-change` só nos elementos efetivamente animados, e só durante a
  animação (evitar deixá-lo permanente em elementos estáticos).
- ScrollTriggers e listeners do Lenis **sempre** têm cleanup (`ctx.revert()`,
  `trigger.kill()`, `lenis.destroy()`). Nenhuma seção deve vazar
  triggers ao desmontar.
- Evitar `useState`/re-render em loops de animação — preferir refs e
  manipulação direta do DOM via GSAP (ver `Header`, que usa
  `toggleClass` do ScrollTrigger em vez de estado React).

## Regras de acessibilidade

- HTML semântico (`header`, `main`, `section`, `h1`/`h2` em ordem
  lógica — cada seção tem exatamente um heading de nível apropriado).
- Navegável por teclado; `:focus-visible` já estilizado globalmente
  (anel `gold`) — não remover outline sem substituto visível.
- `prefers-reduced-motion` respeitado em todo componente animado (ver
  `use-reduced-motion.ts` e o padrão descrito em "Regras de animação").
  O `SmoothScrollProvider` já desativa o Lenis inteiro nesse caso.
- Contraste adequado: texto claro só sobre `ink`/imagens escurecidas com
  overlay; texto escuro só sobre `paper`. Nunca texto `gold` sobre
  `paper` para blocos de leitura (contraste insuficiente) — `gold` sobre
  fundo escuro é o par correto.
- `alt` descritivo em toda imagem de conteúdo; imagens puramente
  decorativas usam `alt=""` ou `aria-hidden`.
- `aria-label` em botões/links que dependem só de ícone (ex.: botão de
  menu no `Header`).

## Regras para assets

- Fotografia principal do Hero: arquitetônica/urbana (rua residencial,
  edifícios contemporâneos, luz de fim de tarde). **Nunca** praia, mar,
  litoral ou imagética de turismo.
- Enquanto a foto definitiva não for entregue, `Hero` usa um gradiente
  escuro como placeholder (marcado com `TODO(assets)` no componente) —
  não substituir por uma foto genérica de banco de imagens sem
  aprovação.
- Logo oficial (circular) entra em `public/brand/` quando disponível;
  até lá, `components/ui/mark.tsx` é o placeholder e deve continuar
  sendo o único lugar que "desenha" a marca — não duplicar o monograma
  em outros componentes.
- Todo asset de imagem passa por `next/image`; nada de `<img>` cru.
- Fotos de imóveis são reais, enviadas pelo cliente via `/painel` (Vercel
  Blob) — quando um imóvel não tem foto ainda, `PropertyPhoto` cai no
  mesmo placeholder em gradiente do `MediaFrame`, nunca uma foto de banco
  de imagens.

## Regras de responsividade

- Desktop e mobile são planejados como dois comportamentos, não um
  encolhimento automático do mesmo layout.
- Mobile: reduzir a intensidade/duração das animações pesadas (parallax
  mais discreto, sem pinning longo); scroll horizontal (quando usado em
  seções futuras) precisa de uma alternativa vertical ou gesto claro em
  telas pequenas — nunca obrigar scroll horizontal sem indicação visual.
- Sem overflow horizontal acidental: qualquer elemento que "vaza" a
  margem precisa de `overflow-hidden` no container correto, testado em
  ~375px de largura.
- Navegação mobile simples — o botão de menu no `Header` ainda é só
  visual; ao implementar o menu real, priorizar um overlay/drawer direto,
  não uma mega-navegação.

## O que NÃO fazer

- Evitar a estética genérica de template de imobiliária (badge de preço,
  botão "Ver detalhes", cards com sombra/borda arredondada padrão) mesmo
  na listagem funcional de imóveis — ver `PropertyCard`: foto grande,
  legenda mínima, sem sombra/borda, é o padrão a manter.
- Não usar frases genéricas de IA na copy: "transformando sonhos em
  realidade", "seu sonho começa aqui", "conectamos você ao imóvel
  perfeito" e variações. Copy curta, editorial, comercial — ver o tom do
  Hero (`Endereços que permanecem.`) como referência.
- Não inventar dados comerciais reais (endereços, preços, número de
  imóveis vendidos, anos de mercado) em copy estática. O catálogo de
  imóveis em si é real, cadastrado pelo cliente via `/painel` — não
  seed de imóveis fictícios em produção.
- Não pintar seções inteiras de amarelo, nem usar o amarelo como cor de
  fundo dominante.
- Não adicionar Three.js/WebGL, bibliotecas de animação alternativas
  (Framer Motion, AOS etc.) ou qualquer dependência nova sem necessidade
  clara — a stack de animação é GSAP + ScrollTrigger + Lenis.
- Não construir sistema de planos, cotas, múltiplos papéis de usuário ou
  qualquer coisa multi-tenant no painel — é uma ferramenta de uso único
  para a Central Imóveis, não um produto SaaS.
- Novas seções da landing (além das 8 já implementadas) ou mudanças
  estruturais grandes ainda devem ser propostas e revisadas antes de
  virar código.
