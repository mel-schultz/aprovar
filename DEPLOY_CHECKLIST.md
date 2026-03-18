# Checklist de Deploy - eKyte Clone

Este documento contém um checklist completo para preparar a aplicação para deploy em produção.

## ✅ Pré-Deploy

### Código e Qualidade

- [ ] Executar `pnpm check` para verificar erros de TypeScript
- [ ] Executar `pnpm build` para verificar se o build é bem-sucedido
- [ ] Revisar todos os arquivos `.tsx` para erros de sintaxe
- [ ] Remover `console.log()` e `console.error()` desnecessários
- [ ] Verificar se todas as variáveis de ambiente estão documentadas
- [ ] Revisar as políticas de RLS no Supabase
- [ ] Testar a autenticação com diferentes perfis (admin, atendimento, designer)

### Banco de Dados

- [ ] Executar o script `supabase/init.sql` no Supabase
- [ ] Verificar se todas as tabelas foram criadas corretamente
- [ ] Verificar se os índices foram criados
- [ ] Verificar se as políticas RLS estão ativas
- [ ] Criar usuário de teste para cada perfil
- [ ] Testar as permissões de cada perfil

### Segurança

- [ ] Verificar se não há chaves de API expostas no código
- [ ] Usar apenas a chave **anon public** no frontend
- [ ] Configurar CORS corretamente no Supabase
- [ ] Revisar as políticas de segurança do Supabase
- [ ] Configurar rate limiting (se disponível)
- [ ] Ativar HTTPS em produção

### Testes

- [ ] Testar login com credenciais válidas
- [ ] Testar login com credenciais inválidas
- [ ] Testar criação de projetos
- [ ] Testar criação de tarefas
- [ ] Testar criação de tickets
- [ ] Testar filtros e buscas
- [ ] Testar navegação entre páginas
- [ ] Testar responsividade em dispositivos móveis
- [ ] Testar em diferentes navegadores (Chrome, Firefox, Safari, Edge)

### Performance

- [ ] Verificar o tamanho do bundle: `pnpm build`
- [ ] Otimizar imagens se necessário
- [ ] Verificar se há código não utilizado
- [ ] Ativar compressão Gzip no servidor
- [ ] Configurar cache HTTP apropriadamente

## 🚀 Deploy na Vercel

### Preparação

- [ ] Criar repositório no GitHub
- [ ] Fazer push de todo o código
- [ ] Criar arquivo `.env.local` com variáveis de ambiente
- [ ] Verificar se o `package.json` está correto
- [ ] Verificar se o `vercel.json` está configurado

### Configuração na Vercel

- [ ] Criar conta na Vercel
- [ ] Conectar repositório GitHub
- [ ] Importar projeto
- [ ] Configurar variáveis de ambiente:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Configurar domínio customizado (se aplicável)
- [ ] Ativar deploy automático na branch `main`

### Deploy Inicial

- [ ] Fazer primeiro deploy
- [ ] Verificar se o build foi bem-sucedido
- [ ] Verificar se a aplicação está acessível
- [ ] Testar todas as funcionalidades em produção
- [ ] Verificar os logs de erro

## 📊 Pós-Deploy

### Monitoramento

- [ ] Ativar analytics na Vercel
- [ ] Configurar alertas de erro
- [ ] Monitorar performance
- [ ] Verificar logs regularmente
- [ ] Acompanhar uso de banda

### Manutenção

- [ ] Fazer backup do banco de dados Supabase
- [ ] Revisar logs de segurança
- [ ] Atualizar dependências regularmente
- [ ] Manter documentação atualizada
- [ ] Planejar atualizações futuras

### Suporte

- [ ] Documentar processo de deploy
- [ ] Criar guia de troubleshooting
- [ ] Preparar plano de recuperação de desastres
- [ ] Configurar alertas de downtime

## 🔧 Variáveis de Ambiente

Certifique-se de que as seguintes variáveis estão configuradas na Vercel:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima do Supabase | `eyJhbGc...` |

## 🚨 Troubleshooting Comum

### Build falha

**Erro**: `Build failed`

**Solução**:
1. Verifique os logs de build
2. Execute `pnpm check` localmente
3. Verifique se todas as dependências estão instaladas
4. Limpe o cache: `vercel env pull`

### Aplicação em branco

**Erro**: Página branca ou erro 404

**Solução**:
1. Verifique se o build foi bem-sucedido
2. Verifique as variáveis de ambiente
3. Abra o console do navegador (F12) e procure por erros
4. Verifique os logs da Vercel

### Erro de autenticação

**Erro**: "Invalid API Key" ou "Unauthorized"

**Solução**:
1. Verifique se as variáveis de ambiente estão corretas
2. Certifique-se de estar usando a chave **anon public**
3. Verifique se o Supabase está acessível
4. Verifique as políticas RLS

### Dados não aparecem

**Erro**: Tabelas vazias ou dados não carregam

**Solução**:
1. Verifique se o script `init.sql` foi executado
2. Verifique se as políticas RLS estão permitindo leitura
3. Verifique se o usuário está autenticado
4. Verifique os logs do Supabase

## 📝 Documentação Necessária

Certifique-se de que a seguinte documentação está atualizada:

- [ ] README.md
- [ ] SUPABASE_SETUP.md
- [ ] VERCEL_DEPLOY.md
- [ ] GUIA_USO.md
- [ ] Este checklist

## 🔐 Segurança em Produção

Antes de fazer deploy, verifique:

- [ ] Não há chaves de API expostas
- [ ] Não há dados sensíveis no código
- [ ] HTTPS está ativado
- [ ] CORS está configurado corretamente
- [ ] Rate limiting está ativo
- [ ] Logs de auditoria estão habilitados
- [ ] Backups automáticos estão configurados

## 📞 Contatos de Suporte

- **Supabase**: https://supabase.com/docs
- **Vercel**: https://vercel.com/docs
- **GitHub**: https://github.com

## ✨ Próximos Passos Após Deploy

1. Monitorar performance e erros
2. Coletar feedback dos usuários
3. Planejar melhorias futuras
4. Manter documentação atualizada
5. Realizar atualizações de segurança regularmente

---

**Última atualização**: 2026-03-18

**Status**: ✅ Pronto para deploy
