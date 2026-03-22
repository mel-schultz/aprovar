# 📱 Notificações via WhatsApp - Guia Completo

## 🎯 Visão Geral

Sistema de notificações automáticas que envia mensagens via WhatsApp quando:
- ✅ Um novo entregável chega para aprovação
- ✅ Um entregável é aprovado
- ✅ Um entregável é rejeitado
- ⏰ Lembretes de entregáveis pendentes

---

## 🚀 Como Configurar

### **Opção 1: Twilio (Recomendado)**

Twilio é a solução mais robusta e confiável para envio de mensagens WhatsApp.

#### 1. Criar conta Twilio

1. Acesse [twilio.com](https://www.twilio.com)
2. Clique em **"Sign up"**
3. Preencha seus dados
4. Verifique seu e-mail

#### 2. Habilitar WhatsApp Sandbox

1. No painel Twilio, vá para **Messaging > Try it out > Send an SMS**
2. Clique em **"WhatsApp"**
3. Clique em **"View Sandbox"**
4. Você verá um número de WhatsApp (ex: +1 415 523 8886)

#### 3. Configurar Credenciais

No seu `.env.local`:

```env
# Twilio
NEXT_PUBLIC_TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token
TWILIO_WHATSAPP_NUMBER=+1415523XXXX
WHATSAPP_SERVICE=twilio
```

**Onde encontrar:**
- **Account SID**: Painel Twilio > Dashboard
- **Auth Token**: Painel Twilio > Dashboard (next to Account SID)
- **WhatsApp Number**: Painel Twilio > Messaging > WhatsApp > Sandbox

#### 4. Testar

```javascript
// No navegador, abra o console
await fetch('/api/notifications/whatsapp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '+55 11 99999-9999', // Seu número
    message: 'Teste de notificação 🎉',
    type: 'test'
  })
})
```

---

### **Opção 2: Evolution API (Self-hosted)**

Evolution API é mais barata e oferece mais controle. Ideal se você quer hospedar seu próprio servidor.

#### 1. Instalar Evolution API

```bash
# Via Docker
docker pull atendimentocerto/evolution-api:latest

docker run -d \
  --name evolution-api \
  -p 8080:8080 \
  -e AUTHENTICATION_TYPE=apikey \
  -e AUTHENTICATION_API_KEY=sua-chave-secreta \
  atendimentocerto/evolution-api:latest
```

#### 2. Configurar Credenciais

No seu `.env.local`:

```env
# Evolution API
EVOLUTION_API_URL=http://seu-dominio:8080
EVOLUTION_API_KEY=sua-chave-secreta
EVOLUTION_INSTANCE_NAME=aprovar
WHATSAPP_SERVICE=evolution
```

#### 3. Conectar Instância WhatsApp

Via API:
```bash
curl -X POST http://seu-dominio:8080/instance/create \
  -H "apikey: sua-chave-secreta" \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "aprovar",
    "token": "seu-token"
  }'
```

---

### **Opção 3: Webhook Customizado**

Se você já tem um serviço de WhatsApp próprio, configure um webhook:

```env
# Webhook Customizado
WHATSAPP_WEBHOOK_URL=https://seu-dominio/webhook/whatsapp
WHATSAPP_WEBHOOK_KEY=sua-chave-secreta
WHATSAPP_SERVICE=webhook
```

Seu webhook receberá:
```json
{
  "phoneNumber": "+55 11 99999-9999",
  "message": "Mensagem a enviar",
  "type": "notification",
  "details": { ... },
  "timestamp": "2024-03-21T10:30:00Z"
}
```

---

## 📂 Arquivos Adicionados

### Banco de Dados
- `supabase-whatsapp-migrations.sql` - Tabelas e RLS

### APIs
- `app/api/notifications/whatsapp/route.js` - Enviar notificações
- `app/api/notifications/settings/route.js` - Gerenciar configurações

### Componentes
- `components/notifications/NotificationSettingsModal.js` - Interface de configuração

### Utilitários
- `lib/notifications/whatsapp.js` - Funções helper

---

## 🔧 Implementação

### 1. Executar Migrações SQL

```bash
# No Supabase SQL Editor, execute:
supabase-whatsapp-migrations.sql
```

Cria:
- Tabela `whatsapp_logs` (histórico de mensagens)
- Tabela `client_notification_settings` (configurações por cliente)
- Tabela `deliverable_notifications` (rastreamento)

### 2. Adicionar .env.local

```env
# Escolha uma opção:

# OPÇÃO 1: Twilio
WHATSAPP_SERVICE=twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_NUMBER=+1415523XXXX

# OPÇÃO 2: Evolution API
WHATSAPP_SERVICE=evolution
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=sua-chave
EVOLUTION_INSTANCE_NAME=aprovar

# OPÇÃO 3: Webhook
WHATSAPP_SERVICE=webhook
WHATSAPP_WEBHOOK_URL=https://seu-dominio/webhook
WHATSAPP_WEBHOOK_KEY=sua-chave

# Geral
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Integrar ao Componente de Aprovações

Na página de criação de entregável (ApprovalsClient.js ou similar):

```javascript
import { sendWhatsAppNotification } from '@/lib/notifications/whatsapp'

// Quando um entregável é criado
const handleCreateDeliverable = async (data) => {
  // ... salvar entregável no banco ...

  // Enviar notificação WhatsApp
  await sendWhatsAppNotification({
    phoneNumber: client.whatsapp,
    clientName: client.name,
    deliverableTitle: data.title,
    approvalLink: `${process.env.NEXT_PUBLIC_APP_URL}/approvals?deliverable=${deliverable.id}`,
    type: 'created'
  })
}
```

---

## 💬 Funções Disponíveis

### sendWhatsAppNotification

```javascript
import { sendWhatsAppNotification } from '@/lib/notifications/whatsapp'

await sendWhatsAppNotification({
  phoneNumber: '+55 11 99999-9999',
  clientName: 'Factum',
  deliverableTitle: 'Logo Redesign',
  approvalLink: 'https://aprovar.vercel.app/approvals?deliverable=123',
  type: 'created' // 'created', 'approved', 'rejected', 'reminder'
})
```

### sendNotificationToApprovers

```javascript
import { sendNotificationToApprovers } from '@/lib/notifications/whatsapp'

await sendNotificationToApprovers({
  clientId: client.id,
  clientName: 'Factum',
  deliverableTitle: 'Logo Redesign',
  deliverableId: deliverable.id,
  approvers: [
    { id: '1', name: 'João', phone_number: '+5511988888888' },
    { id: '2', name: 'Maria', phone_number: '+5511999999999' }
  ]
})
```

### getClientNotificationSettings

```javascript
import { getClientNotificationSettings } from '@/lib/notifications/whatsapp'

const settings = await getClientNotificationSettings(supabase, clientId)
// {
//   whatsapp_enabled: true,
//   whatsapp_phone: '+55 11 99999-9999',
//   notify_on_pending: true,
//   notify_on_approved: false,
//   notify_on_rejected: true
// }
```

---

## 🧪 Testar

### 1. Ativar Notificações no Cliente

1. Abra a página de **Clientes**
2. Clique no cliente
3. Procure por "Configurações de Notificação" ou ⚙️
4. Ative WhatsApp
5. Digite seu número (+55 11 99999-9999)
6. Salve

### 2. Criar Entregável de Teste

1. Vá para **Aprovações**
2. Crie um novo entregável
3. Você deve receber uma mensagem no WhatsApp! ✅

### 3. Verificar Histórico

```javascript
// No console do navegador
await fetch('/api/notifications/whatsapp').then(r => r.json())
```

---

## 📊 Estrutura do Banco

### whatsapp_logs
```sql
id (bigserial) - ID único
phone_number - Número do destinatário
message - Conteúdo da mensagem
type - 'notification', 'reminder', 'confirmation'
service - 'twilio', 'evolution', 'webhook'
status - 'pending', 'sent', 'failed', 'delivered'
external_id - ID da API externa (Twilio SID)
created_at
updated_at
```

### client_notification_settings
```sql
id (uuid)
client_id - Cliente
whatsapp_enabled - Ativo?
whatsapp_phone - Número
notify_on_pending - Notificar novo entregável?
notify_on_approved - Notificar aprovação?
notify_on_rejected - Notificar rejeição?
created_at
updated_at
```

### deliverable_notifications
```sql
id (uuid)
deliverable_id - Entregável
client_id - Cliente
notification_type - 'created', 'approved', 'rejected'
whatsapp_log_id - Referência ao log
sent_at
```

---

## 🔐 Segurança

✅ **Credenciais em .env** (nunca no código)
✅ **RLS no banco** (clientes veem apenas suas notificações)
✅ **Validação de telefone** (formato +55 11 99999-9999)
✅ **Log de todas as mensagens** (auditoria)
✅ **Proteção CSRF** (no webhook customizado)

---

## 🚀 Deploy no Vercel

1. Vá para **Vercel > Settings > Environment Variables**
2. Adicione suas credenciais:
   ```
   WHATSAPP_SERVICE=twilio
   TWILIO_ACCOUNT_SID=...
   TWILIO_AUTH_TOKEN=...
   TWILIO_WHATSAPP_NUMBER=...
   ```
3. Clique **Deploy**

---

## 💡 Dicas

### Testar sem Twilio Pago
- Twilio oferece **R$ 50 de crédito gratuito** por mês
- Use WhatsApp Sandbox para testes
- Sandbox só envia para números aprovados

### Aumentar Taxa de Entrega
- Use números verificados no Twilio
- Evie mensagens muito longas (>160 caracteres)
- Inclua links diretos de aprovação

### Monitorar Entregas
```javascript
// Ver logs de notificações
await fetch('/api/notifications/whatsapp?phone=%2B5511999999999').then(r => r.json())
```

---

## 🆘 Troubleshooting

### "Credenciais Twilio não configuradas"
- Adicione as variáveis no `.env.local`
- Reinicie o servidor (`npm run dev`)

### "Número de telefone inválido"
- Use formato: `+55 11 99999-9999`
- Inclua código do país

### "API Evolution não responde"
- Verifique se a instância está rodando
- Teste com `curl -H "apikey: KEY" https://url`

### "Webhook não recebe dados"
- Verifique se a URL é acessível
- Cheque os logs do seu webhook
- Valide o header `X-API-Key`

---

## 📞 Resumo

✅ **3 opções de integração** (Twilio, Evolution, Webhook)
✅ **Configuração por cliente** (cada um controla seu número)
✅ **Notificações automáticas** (quando entregável chega)
✅ **Histórico completo** (auditoria de mensagens)
✅ **Segurança** (RLS, validações, logs)

---

**Próximos passos:**
1. Escolher serviço (Twilio recomendado)
2. Executar migrações SQL
3. Configurar .env.local
4. Testar com cliente
5. Deploy em produção

Aproveite! 🚀
