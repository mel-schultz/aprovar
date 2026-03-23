# Integração Phosphor Icons - AprovaAí

## O que foi feito
Adicionada a biblioteca `@phosphor-icons/react` ao projeto.

## Como aplicar

### 1. Instalar a dependência
```bash
npm install @phosphor-icons/react
```

### 2. Atualizar next.config.js
Veja o arquivo `next.config.js` nesta pasta e mescle com o seu.

### 3. Substituir emojis por ícones Phosphor
Substitua os componentes da página inicial conforme os arquivos neste patch.

### 4. Usar ícones em qualquer componente
```tsx
// Client Component
import { Bell, Check, User } from "@phosphor-icons/react";

// Server Component (Next.js App Router)
import { Bell } from "@phosphor-icons/react/ssr";
```

### Props disponíveis
| Prop | Tipo | Exemplo |
|------|------|---------|
| size | number | `size={24}` |
| color | string | `color="currentColor"` |
| weight | string | `weight="bold"` |

**weight** pode ser: `thin`, `light`, `regular`, `bold`, `fill`, `duotone`
