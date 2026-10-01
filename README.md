# Bioma Evidence: site

Site institucional do espaço de beleza natural e saúde capilar **Bioma Evidence** (Uberlândia/MG).
A proposta é uma revista botânica contemporânea: cada serviço é um *habitat* do Bioma.

**Stack:** Next.js 16 (App Router, exportação estática) · React 19 · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis. As microinterações (botões, links, cards, cursor) são feitas em CSS/React puro, sem Framer Motion, para economizar JS.
GSAP e Lenis são carregados por `import()` dinâmico, fora do caminho crítico: na primeira interação ou quando o navegador fica ocioso depois do `load`.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # gera o site estático em /out
npm run start      # serve /out localmente
npm run lint && npm run typecheck
```

## Onde editar

| O quê | Onde |
|---|---|
| **Todos os dados do negócio**: nome, telefones, endereço, horários, métricas, serviços (habitats), mensagens de WhatsApp, equipe, antes/depois, depoimentos, pendências | `data/site.ts` |
| Fotos | `public/images/…` (ver `public/images/README.md`) e `available: true` no slot em `data/site.ts` |
| Cores, tipografia, espaçamentos, raios, sombras, easing | `styles/globals.css` (bloco `:root`) |
| Seções | `components/sections/*` |
| Componentes de UI e motion | `components/ui/*` |
| SEO (title, description, OG) e JSON-LD | `app/layout.tsx`, `lib/schema.ts`, `app/opengraph-image.tsx` |

### Regras de conteúdo (não quebrar)
- **Não inventar** preços, notas, número de avaliações, depoimentos, parcerias ou anos de atuação. Os únicos números no site são os reais do Instagram (~12,5 mil seguidores, 4.223 publicações) e os horários.
- **Sem alegações de saúde** (cura, regenera, elimina…), principalmente em Laserterapia e Nutrição Detox. Fale em avaliação, cuidado, rotina e bem-estar.
- `testimonials` e `beforeAfter` **vazios ⇒ não renderizam em produção.** Em `npm run dev` aparece uma demonstração do comparador com arte botânica, marcada como DEV.
- `team` vazio ⇒ o bloco da equipe não aparece.

### Trocar fotos
1. Coloque o arquivo no caminho indicado em `public/images/README.md`.
2. Em `data/site.ts`, mude o `available` do slot para `true` e revise o `alt`.
3. Hero com recorte: com `images.heroCutout.available = true`, o hero passa para o modo "cutout" automaticamente (texto entre o fundo e o recorte). Sem recorte, o modo é "leaves" (folhas SVG em primeiro plano).
4. Vídeo do hero: `images.heroVideo.available = true` (webm + mp4, até ~2,5 MB). Ele não carrega com reduced-motion nem com economia de dados.

## Deploy na Vercel
1. Importe o repositório na Vercel (framework detectado: Next.js). Não precisa de configuração extra: `output: "export"` gera um site 100% estático.
2. Variáveis de ambiente (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_SITE_URL`: domínio final, sem barra no fim (canonical, sitemap, OG, JSON-LD).
   - `NEXT_PUBLIC_GA_ID`: opcional (Google Analytics 4, ex.: `G-XXXX`).
   - `NEXT_PUBLIC_META_PIXEL_ID`: opcional (Meta Pixel).
3. Configure o domínio.

### Analytics e LGPD
O analytics vem **desligado por padrão**. Com GA ou Pixel configurados, aparece um banner de cookies com "Aceitar" e "Recusar", e nada é carregado antes do aceite.
Os eventos ficam prontos em `lib/analytics.ts`, sem dados pessoais: `whatsapp_click` (com a seção de origem), `phone_click`, `directions_click` e `instagram_click`.

## Motion (resumo)
- **Hero:** a entrada por caractere é feita em CSS puro, para não depender de JS e não atrasar o LCP. Zoom 1,15→1, folhas em primeiro plano, caule que se desenha. Com GSAP vêm parallax no mouse (título ±12 px, imagem ±6 px, folhas por profundidade) e na rolagem (título mais lento que a imagem, imagem escala e escurece).
- **Marquee** em contorno, com velocidade e skew reagindo à rolagem e pausa fora da tela.
- **Manifesto:** as palavras acendem com scrub, de 50% a 100% de opacidade. O briefing pedia 20%, mas 50% é o mínimo que mantém contraste ≥ 3:1 em texto grande (AA).
- **Habitats:** pin com scroll horizontal no desktop. Clip-path nas máscaras orgânicas, painel ativo em escala 1 e os demais em 0,96, caule que percorre a seção e solta uma folha por habitat, fundo que muda de tom. No mobile, painéis verticais com stagger.
- Reveals por IntersectionObserver (sem reflow em cascata), clip-path nas imagens, contadores com os números reais, comparador antes/depois (pointer, teclado e ARIA, com balanço de convite), CTA magnético com ondulação, wordmark do footer reagindo ao hover, cursor customizado (só com `pointer: fine`), indicador de rolagem em forma de caule com contador.
- **prefers-reduced-motion:** sem Lenis, preloader, parallax, cursor, marquee, split e pin. Ficam só fades curtos, e o comparador continua funcional.
- **Preloader:** o B-folha se desenha com contagem 00→100 e uma cortina sobe. Aparece só na primeira visita da sessão, dura ~0,85 s e não bloqueia o LCP (o hero renderiza por baixo).

> O símbolo "B-folha" em `components/ui/Logo.tsx` é **provisório**, desenhado para o site. Substitua pelo arquivo oficial do logotipo.

## Verificação feita
- `npm run lint`, `npm run typecheck` e `npm run build` sem erros.
- Screenshots com Playwright em 390, 768, 1024, 1440 e 1920 (e 1440 com reduced-motion), sem scroll horizontal (`scrollWidth = viewport`).
- Lighthouse mobile (servidor local com gzip): **Acessibilidade 100 · Boas práticas 100 · SEO 100 · Performance ~80–89** (mediana ~87; LCP ~3,0–3,8 s simulado; CLS ≈ 0,003; TBT ~230–290 ms).
  - O que segura a Performance é a fonte de display: Fraunces variável com eixos `opsz` + `SOFT` (~120 KB, o serifado macio da marca). Para chegar a ≥ 95: tirar o eixo SOFT ou trocar por pesos estáticos (perde parte da maciez), ou servir a fonte auto-hospedada com subset reduzido. Na Vercel, cache e HTTP/2 também ajudam.

## Pendências do cliente
Também listadas em `data/site.ts → pending`.

- [ ] Autorização para usar as fotos do Instagram (clientes, espaço, equipe, antes e depois, plantas) e envio dos arquivos (ver `public/images/README.md`).
- [ ] Nome oficial no site: **Bioma Evidence** (usado hoje) ou "Evidence Cabelo e Pele". Logotipo em SVG ou PNG grande e cores exatas da marca.
- [ ] Confirmar que **(34) 99646-6468** é WhatsApp ativo e se o fixo **(34) 3212-6468** deve aparecer (hoje aparece no Contato).
- [ ] Lista exata de serviços e o que cada um inclui, sem alegações de saúde. Principalmente **Laserterapia** e **Nutrição Detox** (esta ainda não aparece no site). Os textos dos habitats II, III e IV estão marcados `confirmed: false`.
- [ ] Equipe: nomes, formações, fotos e autorização, incluindo a profissional da capa de revista.
- [ ] O que significa "Licenciado @lacesandhair" e se pode aparecer (`site.license.show`). O que é a "Linha Nutricare" e quais marcas de produto podem ser citadas.
- [ ] Depoimentos reais (prints do destaque "Feedback") com autorização. Nota e avaliações do Google, se houver.
- [ ] Preços (se quiser divulgar; hoje: "Valores sob consulta") e o conteúdo de sandwiche.me/oficialevidence.
- [ ] Domínio final (`NEXT_PUBLIC_SITE_URL`) e coordenadas do endereço (`site.address.geo`) para o JSON-LD.
- [ ] Validar a copy: frase do manifesto, textos dos habitats e da Saúde capilar (ex.: "orientação de cuidado para casa").
