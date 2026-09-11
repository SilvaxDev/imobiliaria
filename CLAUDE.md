@AGENTS.md

# Central Imóveis — Protótipo web

Este arquivo é a especificação principal do projeto. Qualquer trabalho
futuro (novas seções, ajustes visuais, novas animações) deve ser
consistente com o que está descrito aqui. Se uma decisão de design ou
copy não estiver coberta por este documento, prefira o caminho mais
sóbrio e editorial — não o mais chamativo.

## Objetivo

Protótipo visual/comercial (não o site definitivo) para apresentar uma
nova direção de marca da **Central Imóveis** (Instagram [@imobcim](https://instagram.com/imobcim)).

A experiência deve ler como um site editorial de arquitetura/imobiliário
premium — não como um template de imobiliária, não como um SaaS, não
como algo "tech demo". A sensação-alvo: sofisticada, confiável, elegante,
contemporânea, cinematográfica, humana, premium.

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

Avaliar Three.js/WebGL **apenas** se surgir uma necessidade visual real
e específica (ex.: um efeito de profundidade que scroll/CSS/GSAP puro
não resolvem bem). Não adicionar por adicionar.

## Arquitetura

```
src/
  app/
    layout.tsx          fontes, metadata, SmoothScrollProvider
    page.tsx             composição das seções da landing
    globals.css           design tokens (@theme) + estilos base
  components/
    layout/                chrome persistente (header, providers)
    sections/               uma seção da landing = um arquivo
    ui/                    peças pequenas e reutilizáveis (Mark, ScrollCue…)
  lib/
    animation/
      gsap.ts              registro único de plugins GSAP
      motion-tokens.ts       EASE / DURATION / STAGGER compartilhados
      use-reduced-motion.ts  hook de prefers-reduced-motion
  data/
    types.ts                 tipos de conteúdo (ex.: Property)
public/
  brand/                     logo oficial, favicon, quando chegarem
  images/                    fotografia (hero, imóveis…)
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
- Dados de conteúdo (imóveis, depoimentos etc.) vivem em `src/data/`,
  tipados. Componentes de seção importam de lá — não hardcoded inline
  quando o conteúdo for uma lista repetível.

## Estrutura da landing (8 seções)

1. Hero — **implementado**
2. Manifesto
3. Imóveis em destaque
4. Experiência
5. Imóvel em destaque
6. Sobre a Central
7. Contato/localização
8. CTA final

As seções 2–8 ainda não foram construídas. Não adicionar novas seções
sem autorização explícita — cada uma deve ser proposta e revisada antes
de virar código.

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

- Não copiar a estética de templates prontos de imobiliária (grid de
  cards com preço + badge + botão "Ver detalhes" repetido).
  A seção `page.tsx` reflete um pedaço da história, não um product grid.
- Não usar frases genéricas de IA na copy: "transformando sonhos em
  realidade", "seu sonho começa aqui", "conectamos você ao imóvel
  perfeito" e variações. Copy curta, editorial, comercial — ver o tom do
  Hero (`Endereços que permanecem.`) como referência.
- Não inventar dados comerciais reais (endereços, preços, número de
  imóveis vendidos, anos de mercado). Onde o protótipo precisar de
  conteúdo de exemplo, marcar claramente como demonstrativo.
- Não pintar seções inteiras de amarelo, nem usar o amarelo como cor de
  fundo dominante.
- Não adicionar Three.js/WebGL, bibliotecas de animação alternativas
  (Framer Motion, AOS etc.) ou qualquer dependência nova sem necessidade
  clara — a stack de animação é GSAP + ScrollTrigger + Lenis.
- Não avançar para as seções 2–8 da landing sem autorização explícita —
  cada seção é revisada antes de emendar a próxima.
