# Instalação das fontes

Este projeto usa duas fontes comerciais que **não estão incluídas no repositório**.
Você precisa adquiri-las e colocar os arquivos nesta pasta (`src/fonts/`).

---

## IvyPresto Headline
**Fornecedora**: [Ivy Foundry](https://www.ivyfoundry.com)  
Arquivos esperados (renomeie conforme necessário):

| Arquivo | Peso | Estilo |
|---------|------|--------|
| `IvyPrestoHeadline-Regular.woff2` | 400 | Normal |
| `IvyPrestoHeadline-Regular.woff`  | 400 | Normal |
| `IvyPrestoHeadline-SemiBold.woff2`| 600 | Normal |
| `IvyPrestoHeadline-SemiBold.woff` | 600 | Normal |
| `IvyPrestoHeadline-Bold.woff2`    | 700 | Normal |
| `IvyPrestoHeadline-Bold.woff`     | 700 | Normal |
| `IvyPrestoHeadline-Italic.woff2`  | 400 | Italic |
| `IvyPrestoHeadline-Italic.woff`   | 400 | Italic |

**Uso no sistema**: headlines (`h1`–`h5`), logotipo, títulos de cards, números de métricas.

---

## Peridot PE Variable
**Fornecedora**: [Monotype / Fonts.com](https://www.fonts.com) ou Adobe Fonts  
Arquivos esperados:

| Arquivo | Eixo variável | Estilo |
|---------|---------------|--------|
| `PeridotPEVariable.woff2`        | wght 100–900 | Normal |
| `PeridotPEVariable-Italic.woff2` | wght 100–900 | Italic |

**Uso no sistema**: corpo de texto, botões, labels, inputs, navegação, badges.

> **Dica**: A variante variable (`woff2-variations`) é preferida pois cobre todos
> os pesos com um único download. Se você tiver apenas arquivos estáticos, duplique
> os blocos `@font-face` em `src/index.css` para cada peso necessário
> (300 Light, 400 Regular, 500 Medium, 600 SemiBold).

---

## Fallbacks (sem as fontes instaladas)
O sistema continua funcional com os fallbacks definidos em `src/index.css`:
- Headlines → `Georgia` (serif)
- Corpo/botões → `Helvetica Neue, Arial` (sans-serif)
