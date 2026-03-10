import 'dotenv/config';
import { octadesk } from './client.js';

async function testConnection() {
  console.log('🔍 Testando conexão com Octadesk...');
  console.log(`   URL: ${process.env.OCTADESK_BASE_URL}`);
  console.log(`   Agent: ${process.env.OCTADESK_AGENT_EMAIL}`);

  try {
    // Testa listando tickets (1 resultado)
    const res = await octadesk.get('/tickets', { params: { limit: 1 } });
    const items = Array.isArray(res.data) ? res.data : (res.data?.items ?? []);
    console.log(`\n✅ Conexão OK! Tickets retornados: ${items.length}`);

    if (items.length > 0) {
      const t = items[0];
      console.log(`   Ticket de exemplo: #${t.number} — ${t.summary ?? t.title}`);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`\n❌ Erro na conexão: ${msg}`);
    process.exit(1);
  }
}

testConnection();
