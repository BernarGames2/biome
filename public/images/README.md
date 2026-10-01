# Imagens — Bioma Evidence

Todas as fotos devem ser **reais e autorizadas** (Instagram @biomaevidence ou ensaio próprio).
Não gerar logos, textos ou UI com IA. Tratamento: cores naturais, luz suave, verdes e dourados em harmonia, sem filtros pesados.

Enquanto um arquivo não existir, o site mostra uma **arte botânica em linha** no lugar (nunca um quadro com nome de arquivo em produção).
Depois de colocar o arquivo, abra `data/site.ts` e mude `available: false` → `true` no slot correspondente.

Formato recomendado: **JPG ou WebP** (qualidade ~80), sRGB. Exporte também AVIF/WebP se quiser (o `next/image` está em modo `unoptimized` por causa da exportação estática, então envie os arquivos já otimizados).

| Arquivo | Proporção | Tamanho sugerido | Peso máx. | Onde aparece |
|---|---|---|---|---|
| `hero/hero.jpg` | 3:2 (paisagem) — o recorte central precisa funcionar em retrato no celular | 2400×1600 | 350 KB | Fundo do hero (LCP, `priority`) |
| `hero/hero-cutout.png` | igual ao `hero.jpg`, **mesmo enquadramento**, pessoa/planta **sem fundo** (PNG transparente) | 2400×1600 | 500 KB | Camada à frente do título (modo “recorte”) |
| `hero/hero.webm` + `hero/hero.mp4` | 16:9, mudo, loop curto (6–12 s) | 1920×1080 | 2,5 MB cada | Vídeo opcional de fundo (desligado em reduced-motion/economia de dados) |
| `habitats/cabelo.jpg` | 4:5 (retrato) | 1200×1500 | 220 KB | Habitat I — Cabelo e saúde capilar |
| `habitats/pele.jpg` | 4:5 | 1200×1500 | 220 KB | Habitat II — Pele e laserterapia |
| `habitats/corpo.jpg` | 4:5 | 1200×1500 | 220 KB | Habitat III — Corpo e massagens |
| `habitats/maos.jpg` | 4:5 | 1200×1500 | 220 KB | Habitat IV — Mãos e manicure |
| `habitats/espaco.jpg` | 4:5 | 1200×1500 | 220 KB | Habitat V — Espaço e Comunidade |
| `editorial/saude-capilar.jpg` | 4:5 (preenche metade da tela no desktop; recorte central) | 1200×1500 | 250 KB | Seção Saúde capilar |
| `editorial/espaco.jpg` | 4:5 | 1600×2000 | 300 KB | Seção A Bioma (máscara orgânica) |
| `editorial/comunidade-1.jpg` | 4:5 | 1200×1500 | 200 KB | Galeria Experiência e Comunidade (arco) |
| `editorial/comunidade-2.jpg` | 1:1 | 1200×1200 | 180 KB | Galeria (quadro arredondado) |
| `editorial/comunidade-3.jpg` | 4:5 | 1200×1500 | 200 KB | Galeria (forma orgânica) |
| `team/<nome>.jpg` | 3:4 | 900×1200 | 160 KB | Equipe (só aparece se `team` tiver itens) |
| `editorial/antes-<id>.jpg` / `editorial/depois-<id>.jpg` | 4:5, **mesmo enquadramento** nas duas | 1200×1500 | 200 KB | Comparador antes/depois (só com autorização) |
| `decorations/*` | livre (PNG/SVG de folhas/girassóis recortados) | — | 150 KB | Uso futuro em decorações |

Alt text: já está escrito em `data/site.ts` para cada slot. Revise-o para descrever a foto real.
