import dotenv from 'dotenv';
dotenv.config();

function require_env(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Variável de ambiente obrigatória não definida: ${key}`);
  return val;
}

export const config = {
  anthropic: {
    apiKey: require_env('ANTHROPIC_API_KEY'),
  },
  octadesk: {
    apiKey:     require_env('OCTADESK_API_KEY'),
    agentEmail: require_env('OCTADESK_AGENT_EMAIL'),
    baseUrl:    process.env.OCTADESK_BASE_URL ?? 'https://o195367-23c.api001.octadesk.services',
  },
  salesbud: {
    apiKey:  process.env.SALESBUD_API_KEY ?? '',
    baseUrl: process.env.SALESBUD_BASE_URL ?? '',
  },
  webhook: {
    secret: process.env.WEBHOOK_SECRET ?? '',
    port:   Number(process.env.WEBHOOK_PORT ?? 3000),
  },
  n1: {
    autoReplyEnabled:    process.env.N1_AUTO_REPLY_ENABLED === 'true',
    confidenceThreshold: Number(process.env.N1_CONFIDENCE_THRESHOLD ?? 0.85),
  },
};
