# AprovaAí Redesign - Filosofia de Design

## Referência: Primer CSS (GitHub Design System)

O Primer CSS é o sistema de design do GitHub, conhecido por sua **abordagem minimalista, profissional e funcional**. Ele prioriza:

- **Clareza e legibilidade** acima de tudo
- **Espaçamento consistente** e previsível
- **Paleta de cores neutra** com acentos estratégicos
- **Componentes simples e reutilizáveis**
- **Foco em acessibilidade** e usabilidade
- **Tipografia hierárquica** clara

## Aplicação ao AprovaAí

### 1. Paleta de Cores

**Cores Primárias:**
- `#0969da` - Azul primário (ações, links, botões principais)
- `#1f6feb` - Azul escuro (hover, ativo)
- `#388bfd` - Azul claro (backgrounds, estados)

**Cores Neutras:**
- `#ffffff` - Branco (backgrounds)
- `#f6f8fa` - Cinza muito claro (backgrounds secundários)
- `#eaeef2` - Cinza claro (borders, separadores)
- `#57606a` - Cinza médio (texto secundário)
- `#24292f` - Cinza escuro (texto principal)

**Cores de Status:**
- `#1a7f37` - Verde (sucesso, aprovado)
- `#d1242f` - Vermelho (erro, rejeitado)
- `#9e6a03` - Amarelo (aviso, pendente)

### 2. Tipografia

**Fontes:**
- Display: `Segoe UI`, `Helvetica Neue`, sans-serif (bold, 24-32px)
- Body: `Segoe UI`, `Helvetica Neue`, sans-serif (regular, 14-16px)
- Mono: `SF Mono`, `Monaco`, `Courier New`, monospace (código)

**Hierarquia:**
- H1: 32px, 600 weight
- H2: 24px, 600 weight
- H3: 20px, 600 weight
- Body: 14px, 400 weight
- Small: 12px, 400 weight

### 3. Espaçamento

Usar escala consistente:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

### 4. Componentes Principais

**Botões:**
- Primary: Azul sólido com texto branco
- Secondary: Borda cinza com fundo branco
- Danger: Vermelho para ações destrutivas

**Cards:**
- Borda cinza clara (1px)
- Padding: 16px
- Border-radius: 6px
- Shadow leve em hover

**Inputs:**
- Borda cinza clara
- Padding: 8px 12px
- Focus: borda azul com shadow

**Dividers:**
- Linha cinza clara (1px)
- Margin: 16px 0

### 5. Princípios de Layout

- **Grid 12 colunas** para responsividade
- **Sidebar esquerda** para navegação (em dashboards)
- **Header fixo** com logo e navegação
- **Conteúdo centralizado** com max-width 1280px
- **Padding consistente** em todos os containers

### 6. Interações

- **Transições suaves**: 150-200ms
- **Hover states** claros em elementos interativos
- **Focus rings** visíveis para acessibilidade
- **Loading states** com spinners
- **Feedback visual** em ações

## Páginas a Redesenhar

1. **Home** - Landing page com apresentação
2. **Login** - Formulário limpo e profissional
3. **Dashboard** - Visão geral com cards e gráficos
4. **Clientes** - Tabela com listagem
5. **Entregáveis** - Upload e gerenciamento
6. **Calendário** - Visualização de eventos
7. **Aprovações** - Workflow de aprovação

## Implementação

Usar **Tailwind CSS 4** com customizações do Primer CSS para manter consistência e velocidade de desenvolvimento.
