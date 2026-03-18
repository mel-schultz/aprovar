# Guia de Deploy na Vercel

Este documento descreve como fazer o deploy da aplicação eKyte Clone na Vercel.

## 📋 Pré-requisitos

- Projeto Git (GitHub, GitLab ou Bitbucket)
- Conta na [Vercel](https://vercel.com)
- Credenciais do Supabase (URL e chave anônima)

## 🚀 Opção 1: Deploy via GitHub (Recomendado)

### Passo 1: Fazer Push do Código para GitHub

1. Crie um repositório no GitHub
2. Faça push do código:

```bash
git remote add origin https://github.com/seu-usuario/ekyte-clone.git
git branch -M main
git push -u origin main
```

### Passo 2: Conectar ao Vercel

1. Acesse [Vercel](https://vercel.com)
2. Clique em "New Project"
3. Selecione "Import Git Repository"
4. Conecte sua conta GitHub
5. Selecione o repositório `ekyte-clone`
6. Clique em "Import"

### Passo 3: Configurar Variáveis de Ambiente

1. Na página de configuração do projeto, vá para **Environment Variables**
2. Adicione as seguintes variáveis:

| Variável | Valor |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Sua chave anônima do Supabase |

3. Clique em "Save"

### Passo 4: Deploy

1. Clique em "Deploy"
2. Aguarde o build completar (geralmente leva 2-5 minutos)
3. Quando terminar, você verá a URL do seu projeto

## 🚀 Opção 2: Deploy via CLI Vercel

### Passo 1: Instalar Vercel CLI

```bash
npm i -g vercel
```

### Passo 2: Fazer Login

```bash
vercel login
```

### Passo 3: Fazer Deploy

```bash
vercel
```

### Passo 4: Configurar Variáveis

Quando solicitado, configure as variáveis de ambiente:

```
? Set up and deploy "~/ekyte-clone"? [Y/n] y
? Which scope do you want to deploy to? [Your Account]
? Link to existing project? [y/N] n
? What's your project's name? ekyte-clone
? In which directory is your code located? ./
? Want to modify these settings? [y/N] n
```

Depois, adicione as variáveis de ambiente:

```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### Passo 5: Deploy em Produção

```bash
vercel --prod
```

## 🔧 Configurações do Vercel

### Build Settings

As configurações de build já estão definidas em `vercel.json`:

- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

### Environment Variables

Certifique-se de que as variáveis estão configuradas para:
- Production
- Preview
- Development

## 📊 Monitorar Deploy

1. Acesse o dashboard da Vercel
2. Selecione seu projeto `ekyte-clone`
3. Vá para **Deployments** para ver o histórico
4. Clique em um deployment para ver detalhes
5. Verifique os logs em **Logs** se houver erros

## 🔄 Configurar Deploy Automático

Para fazer deploy automático a cada push:

1. No dashboard da Vercel, vá para **Settings** → **Git**
2. Selecione a branch para deploy automático (geralmente `main`)
3. Configure a branch de preview (geralmente `develop`)
4. Salve as configurações

Agora, cada vez que você fazer push para `main`, um novo deploy será criado automaticamente.

## 🌐 Configurar Domínio Customizado

### Usar Domínio Vercel

1. No dashboard, vá para **Settings** → **Domains**
2. Você verá um domínio padrão como `ekyte-clone.vercel.app`

### Usar Domínio Customizado

1. Vá para **Settings** → **Domains**
2. Clique em "Add"
3. Digite seu domínio (ex: `ekyte-clone.com`)
4. Siga as instruções para configurar os registros DNS
5. Aguarde a propagação do DNS (pode levar até 48 horas)

## 🔐 Variáveis de Ambiente em Produção

Certifique-se de que as variáveis de ambiente estão configuradas corretamente:

1. Vá para **Settings** → **Environment Variables**
2. Verifique se as variáveis estão definidas para **Production**
3. Se precisar atualizar, faça as alterações e redeploy

## 🧪 Testar o Deploy

1. Acesse a URL do seu projeto
2. Tente fazer login com as credenciais de teste
3. Navegue pelas páginas para verificar se tudo está funcionando
4. Verifique o console do navegador para erros

## 📈 Monitorar Performance

1. No dashboard da Vercel, vá para **Analytics**
2. Verifique:
   - Tempo de build
   - Tempo de resposta
   - Taxa de erro
   - Uso de bandwidth

## 🚨 Troubleshooting

### Erro: "Build failed"
1. Verifique os logs de build
2. Certifique-se de que todas as dependências estão instaladas
3. Verifique se há erros de TypeScript: `pnpm check`

### Erro: "Environment variables not found"
1. Verifique se as variáveis estão configuradas em **Settings** → **Environment Variables**
2. Certifique-se de que estão definidas para **Production**
3. Redeploy após adicionar as variáveis

### Erro: "Cannot find module"
1. Execute `pnpm install` localmente
2. Verifique se o `package.json` está correto
3. Limpe o cache: `vercel env pull` e `pnpm install`

### Aplicação em branco ou erro 404
1. Verifique se o build foi bem-sucedido
2. Verifique os logs do navegador (F12)
3. Verifique se as variáveis de ambiente estão corretas

## 🔄 Redeploy

Para fazer redeploy de uma versão anterior:

1. Vá para **Deployments**
2. Selecione o deployment desejado
3. Clique em "Redeploy"

## 🗑️ Deletar Projeto

Se precisar deletar o projeto:

1. Vá para **Settings** → **Advanced**
2. Clique em "Delete Project"
3. Confirme a exclusão

## 📚 Recursos Adicionais

- [Documentação Vercel](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Deployment Regions](https://vercel.com/docs/concepts/edge-network/regions)

## 💡 Dicas de Otimização

1. **Compressão**: Vercel comprime automaticamente os assets
2. **CDN**: Vercel usa CDN global para servir conteúdo rápido
3. **Cache**: Configure headers de cache para melhor performance
4. **Imagens**: Use formatos modernos (WebP) para imagens
5. **Code Splitting**: React faz isso automaticamente

## 🔐 Segurança em Produção

1. **Nunca** exponha a chave de serviço do Supabase
2. Use apenas a chave **anon public** no frontend
3. Mantenha as políticas RLS ativas no Supabase
4. Configure CORS adequadamente
5. Use HTTPS (Vercel faz isso automaticamente)

## 📞 Suporte

Se encontrar problemas:

1. Verifique a documentação da Vercel
2. Consulte os logs de deploy
3. Abra uma issue no repositório
4. Entre em contato com o suporte da Vercel
