# yousa-mcp

MCP Server da Yousa Law — integração com Octadesk e Salesbud para agentes de suporte N1.

## Setup

```bash
npm install
cp .env.example .env
# preencha o .env com as credenciais
```

## Variáveis de ambiente (.env)

```env
ANTHROPIC_API_KEY=
OCTADESK_API_KEY=          # gerada em Configurações → API no Octadesk
OCTADESK_AGENT_EMAIL=      # email do agente associado à key
OCTADESK_BASE_URL=https://o195367-23c.api001.octadesk.services
SALESBUD_API_KEY=          # a preencher após contato com Salesbud
SALESBUD_BASE_URL=         # a preencher após contato com Salesbud
WEBHOOK_SECRET=            # secret para validar webhooks
WEBHOOK_PORT=3000
N1_AUTO_REPLY_ENABLED=false
N1_CONFIDENCE_THRESHOLD=0.85
```

## Desenvolvimento

```bash
# Testar conexão com Octadesk
npm run test:octadesk

# Rodar o MCP Server em modo dev
npm run dev

# Build para produção
npm run build && npm start
```

## Usar no Claude.ai

Após rodar `npm run build`, adicione no Claude.ai em Configurações → Integrações → MCP:

```json
{
  "mcpServers": {
    "yousa-mcp": {
      "command": "node",
      "args": ["/caminho/para/yousa-mcp/dist/index.js"],
      "env": {
        "OCTADESK_API_KEY": "...",
        "OCTADESK_AGENT_EMAIL": "...",
        "OCTADESK_BASE_URL": "https://o195367-23c.api001.octadesk.services"
      }
    }
  }
}
```

## Tools disponíveis

### Octadesk
| Tool | Descrição |
|------|-----------|
| `get_ticket` | Busca ticket pelo número |
| `list_tickets` | Lista tickets com filtros |
| `get_ticket_history` | Histórico completo de interações |
| `search_tickets` | Busca por texto livre |
| `send_ticket_reply` | Envia resposta pública ao cliente |
| `add_internal_note` | Adiciona nota interna (só equipe vê) |
| `update_ticket_status` | Altera status do ticket |
| `get_contact` | Busca dados do contato |
| `get_chat_messages` | Mensagens de uma conversa de chat |
| `send_chat_message` | Envia mensagem no chat |

### Salesbud *(em implementação)*
| Tool | Descrição |
|------|-----------|
| `search_meetings` | Busca reuniões por participante |
| `get_meeting_transcript` | Transcrição completa |
| `get_meeting_summary` | Resumo da reunião |

## Estrutura

```
src/
├── index.ts                    # MCP Server (entry point)
├── config/index.ts             # Configurações e env vars
├── types/index.ts              # Interfaces TypeScript
├── tools/
│   ├── octadesk/
│   │   ├── client.ts           # Cliente HTTP Octadesk
│   │   ├── tickets.ts          # Tools de tickets
│   │   ├── contacts.ts         # Tools de contatos e chat
│   │   └── test.ts             # Teste de conexão
│   └── salesbud/               # (em implementação)
└── agents/
    └── n1-support/             # (em implementação)
```
