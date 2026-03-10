import { z } from 'zod';
import { octadesk } from './client.js';
import type { OctaTicket, OctaInteraction } from '../../types/index.js';

// ─── get_ticket ───────────────────────────────────────────────────────────────
export const getTicketSchema = z.object({
  number: z.number().describe('Número do ticket no Octadesk'),
});

export async function getTicket({ number }: z.infer<typeof getTicketSchema>): Promise<OctaTicket> {
  const res = await octadesk.get(`/tickets/${number}`);
  return res.data;
}

// ─── list_tickets ─────────────────────────────────────────────────────────────
export const listTicketsSchema = z.object({
  contactEmail: z.string().email().optional().describe('Filtrar por email do cliente'),
  status:       z.string().optional().describe('Filtrar por status (ex: open, resolved)'),
  limit:        z.number().min(1).max(50).default(10).describe('Quantidade de tickets'),
  page:         z.number().min(1).default(1).describe('Página'),
});

export async function listTickets(params: z.infer<typeof listTicketsSchema>): Promise<OctaTicket[]> {
  const res = await octadesk.get('/tickets', { params: {
    page:  params.page,
    limit: params.limit,
    ...(params.status       ? { status: params.status }             : {}),
    ...(params.contactEmail ? { 'requester.email': params.contactEmail } : {}),
  }});
  return res.data?.items ?? res.data ?? [];
}

// ─── get_ticket_history ───────────────────────────────────────────────────────
export const getTicketHistorySchema = z.object({
  number: z.number().describe('Número do ticket'),
});

export async function getTicketHistory({ number }: z.infer<typeof getTicketHistorySchema>): Promise<OctaInteraction[]> {
  const res = await octadesk.get(`/tickets/${number}/interactions`);
  return res.data?.items ?? res.data ?? [];
}

// ─── search_tickets ───────────────────────────────────────────────────────────
export const searchTicketsSchema = z.object({
  query: z.string().describe('Termo de busca livre'),
  limit: z.number().min(1).max(20).default(5),
});

export async function searchTickets({ query, limit }: z.infer<typeof searchTicketsSchema>): Promise<OctaTicket[]> {
  const res = await octadesk.get('/tickets', { params: { search: query, limit } });
  return res.data?.items ?? res.data ?? [];
}

// ─── send_ticket_reply ────────────────────────────────────────────────────────
export const sendTicketReplySchema = z.object({
  number:  z.number().describe('Número do ticket'),
  message: z.string().describe('Mensagem pública a enviar ao cliente'),
});

export async function sendTicketReply({ number, message }: z.infer<typeof sendTicketReplySchema>) {
  const res = await octadesk.post(`/tickets/${number}/interactions`, {
    body:     message,
    isPublic: true,
  });
  return res.data;
}

// ─── add_internal_note ────────────────────────────────────────────────────────
export const addInternalNoteSchema = z.object({
  number: z.number().describe('Número do ticket'),
  note:   z.string().describe('Nota interna (visível apenas para a equipe)'),
});

export async function addInternalNote({ number, note }: z.infer<typeof addInternalNoteSchema>) {
  const res = await octadesk.post(`/tickets/${number}/interactions`, {
    body:     note,
    isPublic: false,
  });
  return res.data;
}

// ─── update_ticket_status ─────────────────────────────────────────────────────
export const updateTicketStatusSchema = z.object({
  number: z.number().describe('Número do ticket'),
  status: z.enum(['open', 'pending', 'resolved', 'closed']).describe('Novo status'),
});

export async function updateTicketStatus({ number, status }: z.infer<typeof updateTicketStatusSchema>) {
  const res = await octadesk.patch(`/tickets/${number}`, { status: { name: status } });
  return res.data;
}
