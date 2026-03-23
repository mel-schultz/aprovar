# 🎯 AprovaAí Light

Versão simplificada e leve do sistema AprovaAí de gerenciamento de aprovações.

## ✨ Características

- ✅ Design moderno (Dribbble-style)
- ✅ Dark theme com glassmorphism
- ✅ Autenticação com Supabase
- ✅ Gerenciamento de clientes
- ✅ Controle de entregáveis
- ✅ Workflow de aprovações
- ✅ Responsivo
- ✅ Leve e rápido

## 🚀 Instalação

### 1. Clonar ou extrair o projeto

```bash
unzip aprovai-light.zip
cd aprovai-light
```

### 2. Instalar dependências

```bash
npm install --legacy-peer-deps
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Iniciar o projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## 📄 Páginas

- **Home** (`/`) - Landing page
- **Login** (`/login`) - Autenticação
- **Dashboard** (`/dashboard`) - Painel principal
- **Clientes** (`/clientes`) - Gerenciamento de clientes
- **Entregáveis** (`/entregaveis`) - Controle de projetos
- **Aprovações** (`/aprovacoes`) - Workflow de aprovações

## 🎨 Design System

### Cores

- **Primary:** #6366f1 (Índigo)
- **Secondary:** #8b5cf6 (Roxo)
- **Success:** #10b981 (Verde)
- **Danger:** #ef4444 (Vermelho)
- **Background:** #0f172a (Azul escuro)

### Efeitos

- Glassmorphism (blur + transparência)
- Gradientes em botões
- Hover effects dinâmicos
- Transições suaves

## 📦 Estrutura

```
aprovai-light/
├── app/
│   ├── login/
│   ├── dashboard/
│   ├── clientes/
│   ├── entregaveis/
│   ├── aprovacoes/
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── lib/
│   └── supabase-client.js
├── package.json
├── .env.example
└── README.md
```

## 🔧 Customização

### Adicionar nova página

1. Crie a pasta: `app/minha-pagina/`
2. Crie o arquivo: `app/minha-pagina/page.js`
3. Importe e use os componentes padrão

### Mudar cores

Edite `app/globals.css` e procure por valores hex de cores.

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático em cada push

### Outras plataformas

```bash
npm run build
npm start
```

## ⚠️ Notas Importantes

- Configure o Supabase antes de usar autenticação
- Usar `--legacy-peer-deps` é necessário para compatibilidade
- A versão light não inclui calendário ou admin avançado
- Design é responsivo mas otimizado para desktop

## 📞 Suporte

Para erros de build:

```bash
npm run build
```

Para limpador de cache:

```bash
rm -rf .next
npm run dev
```

## 📄 Licença

Projeto de código aberto.

---

**AprovaAí Light v1.0** - 2024
