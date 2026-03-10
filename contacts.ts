import { z } from 'zod';
import { octadesk } from './client.js';
import type { OctaContact, OctaChatMessage } from '../../types/index.js';

// ─── get_contact ──────────────────────────────────────────────────────────────
export const getContactSchema = z.object({
  email: z.string().email().optional().describe('Email do contato'),
  id:    z.string().optional().describe('ID do contato'),
});

export async function getContact({ email, id }: z.infer<typeof getContactSchema>): Promise<OctaContact | null> {
  if (id) {
    const res = await octadesk.get(`/contacts/${id}`);
    return res.data;
  }
  if (email) {
    const res = await octadesk.get('/contacts', { params: { email } });
    const items = res.data?.items ?? res.data ?? [];
    return items[0] ?? null;
  }
  throw new Error('Informe email ou id do contato');
}

// ─── get_chat_messages ────────────────────────────────────────────────────────
export const getChatMessagesSchema = z.object({
  chatId: z.string().describe('ID da conversa de chat'),
  limit:  z.number().min(1).max(100).default(20),
});

export async function getChatMessages({ chatId, limit }: z.infer<typeof getChatMessagesSchema>): Promise<OctaChatMessage[]> {
  const res = await octadesk.get(`/chat/${chatId}/messages`, { params: { limit } });
  return res.data?.items ?? res.data ?? [];
}

// ─── send_chat_message ────────────────────────────────────────────────────────
export const sendChatMessageSchema = z.object({
  chatId:  z.string().describe('ID da conversa de chat'),
  message: z.string().describe('Mensagem a enviar'),
});

export async function sendChatMessage({ chatId, message }: z.infer<typeof sendChatMessageSchema>) {
  const res = await octadesk.post(`/chat/${chatId}/messages`, { body: message });
  return res.data;
}
