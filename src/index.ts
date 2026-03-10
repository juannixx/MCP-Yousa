import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

import {
  getTicket, getTicketSchema,
  listTickets, listTicketsSchema,
  getTicketHistory, getTicketHistorySchema,
  searchTickets, searchTicketsSchema,
  sendTicketReply, sendTicketReplySchema,
  addInternalNote, addInternalNoteSchema,
  updateTicketStatus, updateTicketStatusSchema,
} from './tools/octadesk/tickets.js';

import {
  getContact, getContactSchema,
  getChatMessages, getChatMessagesSchema,
  sendChatMessage, sendChatMessageSchema,
} from './tools/octadesk/contacts.js';

// ─── Definição das tools ──────────────────────────────────────────────────────
const TOOLS: Tool[] = [
  {
    name: 'get_ticket',
    description: 'Busca um ticket do Octadesk pelo número. Retorna dados completos incluindo status, prioridade, tags e solicitante.',
    inputSchema: { type: 'object', properties: { number: { type: 'number', description: 'Número do ticket' } }, required: ['number'] },
  },
  {
    name: 'list_tickets',
    description: 'Lista tickets do Octadesk com filtros opcionais por email do cliente e status.',
    inputSchema: {
      type: 'object',
      properties: {
        contactEmail: { type: 'string', description: 'Email do cliente para filtrar' },
        status:       { type: 'string', description: 'Status: open, pending, resolved, closed' },
        limit:        { type: 'number', description: 'Quantidade (máx 50)', default: 10 },
        page:         { type: 'number', description: 'Página', default: 1 },
      },
    },
  },
  {
    name: 'get_ticket_history',
    description: 'Retorna o histórico completo de interações de um ticket (mensagens públicas e notas internas).',
    inputSchema: { type: 'object', properties: { number: { type: 'number' } }, required: ['number'] },
  },
  {
    name: 'search_tickets',
    description: 'Busca tickets por texto livre no Octadesk.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Termo de busca' },
        limit: { type: 'number', default: 5 },
      },
      required: ['query'],
    },
  },
  {
    name: 'send_ticket_reply',
    description: 'Envia uma resposta pública a um ticket. O cliente receberá a mensagem.',
    inputSchema: {
      type: 'object',
      properties: {
        number:  { type: 'number', description: 'Número do ticket' },
        message: { type: 'string', description: 'Mensagem a enviar ao cliente' },
      },
      required: ['number', 'message'],
    },
  },
  {
    name: 'add_internal_note',
    description: 'Adiciona uma nota interna ao ticket. Visível apenas para a equipe, não para o cliente.',
    inputSchema: {
      type: 'object',
      properties: {
        number: { type: 'number' },
        note:   { type: 'string', description: 'Conteúdo da nota interna' },
      },
      required: ['number', 'note'],
    },
  },
  {
    name: 'update_ticket_status',
    description: 'Atualiza o status de um ticket.',
    inputSchema: {
      type: 'object',
      properties: {
        number: { type: 'number' },
        status: { type: 'string', enum: ['open', 'pending', 'resolved', 'closed'] },
      },
      required: ['number', 'status'],
    },
  },
  {
    name: 'get_contact',
    description: 'Busca dados de um contato/cliente pelo email ou ID.',
    inputSchema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'Email do contato' },
        id:    { type: 'string', description: 'ID do contato' },
      },
    },
  },
  {
    name: 'get_chat_messages',
    description: 'Lista mensagens de uma conversa de chat do Octadesk.',
    inputSchema: {
      type: 'object',
      properties: {
        chatId: { type: 'string' },
        limit:  { type: 'number', default: 20 },
      },
      required: ['chatId'],
    },
  },
  {
    name: 'send_chat_message',
    description: 'Envia uma mensagem em uma conversa de chat do Octadesk.',
    inputSchema: {
      type: 'object',
      properties: {
        chatId:  { type: 'string' },
        message: { type: 'string' },
      },
      required: ['chatId', 'message'],
    },
  },
];

// ─── Handler de execução ──────────────────────────────────────────────────────
async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'get_ticket':            return getTicket(getTicketSchema.parse(args));
    case 'list_tickets':          return listTickets(listTicketsSchema.parse(args));
    case 'get_ticket_history':    return getTicketHistory(getTicketHistorySchema.parse(args));
    case 'search_tickets':        return searchTickets(searchTicketsSchema.parse(args));
    case 'send_ticket_reply':     return sendTicketReply(sendTicketReplySchema.parse(args));
    case 'add_internal_note':     return addInternalNote(addInternalNoteSchema.parse(args));
    case 'update_ticket_status':  return updateTicketStatus(updateTicketStatusSchema.parse(args));
    case 'get_contact':           return getContact(getContactSchema.parse(args));
    case 'get_chat_messages':     return getChatMessages(getChatMessagesSchema.parse(args));
    case 'send_chat_message':     return sendChatMessage(sendChatMessageSchema.parse(args));
    default: throw new Error(`Tool desconhecida: ${name}`);
  }
}

// ─── Server MCP ───────────────────────────────────────────────────────────────
async function main() {
  const server = new Server(
    { name: 'yousa-mcp', version: '1.0.0' },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;
    try {
      const result = await callTool(name, args as Record<string, unknown>);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: 'text', text: `Erro ao executar ${name}: ${message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('✅ yousa-mcp server iniciado');
}

main().catch((err) => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});
