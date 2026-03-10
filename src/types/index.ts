// ─── Octadesk ─────────────────────────────────────────────────────────────────

export interface OctaTicket {
  id: string;
  number: number;
  summary: string;
  status: { id: string; name: string };
  priority: { id: string; name: string };
  requester: { id: string; name: string; email: string };
  assignee?: { id: string; name: string; email: string };
  tags: string[];
  channel: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface OctaInteraction {
  id: string;
  ticketNumber: number;
  type: 'message' | 'note' | 'status_change';
  body: string;
  isPublic: boolean;
  author: { id: string; name: string; email: string };
  createdAt: string;
}

export interface OctaContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: { id: string; name: string };
  createdAt: string;
}

export interface OctaChatMessage {
  id: string;
  body: string;
  author: { id: string; name: string };
  createdAt: string;
  type: 'text' | 'image' | 'file';
}

// ─── Salesbud ─────────────────────────────────────────────────────────────────

export interface SalesBudMeeting {
  id: string;
  title: string;
  startedAt: string;
  durationSeconds: number;
  participants: { name: string; email: string }[];
  summaryUrl?: string;
  transcriptUrl?: string;
}

export interface SalesBudTranscript {
  meetingId: string;
  segments: {
    speaker: string;
    text: string;
    startSeconds: number;
  }[];
}

// ─── Agente N1 ────────────────────────────────────────────────────────────────

export type TicketCategory = 'simples' | 'medio' | 'complexo' | 'urgente';

export interface N1Classification {
  category: TicketCategory;
  confidence: number;
  reasoning: string;
  suggestedAction: 'auto_reply' | 'draft_and_escalate' | 'escalate_immediately';
  escalationReason?: string;
}

export interface N1Context {
  ticket: OctaTicket;
  interactions: OctaInteraction[];
  contact: OctaContact | null;
  recentTickets: OctaTicket[];
  recentMeetings: SalesBudMeeting[];
}
