import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Inicialização segura do cliente Supabase (Service Role)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Zod Schema para validação estrita dos dados vitais vindos da ROOK API.
 * Bloqueia payloads malformados antes de tocarem no banco de dados.
 */
const RookPayloadSchema = z.object({
  user_id: z.string().uuid(),
  source: z.string(), // Ex: 'abbott_lingo'
  data: z.array(z.object({
    metric: z.string(),
    value: z.any(),
    timestamp: z.string().datetime(),
  }))
});

export type RookPayload = z.infer<typeof RookPayloadSchema>;

export class RookWearableClient {
  /**
   * Processa o Webhook recebido da ROOK API (B2B Health Data).
   * Normaliza os dados e injeta com segurança (Row Level Security respeitado).
   */
  public async processWebhook(rawPayload: unknown): Promise<boolean> {
    try {
      // 1. Validação Estrutural (Segurança e Qualidade)
      const payload = RookPayloadSchema.parse(rawPayload);

      const rowsToInsert = payload.data.map(d => ({
        user_id: payload.user_id,
        source_device: payload.source,
        metric_type: d.metric,
        metric_value: d.value,
        recorded_at: d.timestamp
      }));

      // 2. Inserção no banco via Service Role 
      // (O Service Role bypassa o RLS para INSERIR os dados oriundos de webhook B2B,
      // mas os usuários só conseguirão ler seus próprios dados via RLS).
      const { error } = await supabase
        .from('biometric_telemetry')
        .insert(rowsToInsert);

      if (error) {
        console.error('[RookClient] Falha na persistência biométrica:', error.message);
        return false;
      }

      // IMPORTANTE: Por conformidade com HIPAA, NUNCA logar valores vitais no console.
      console.log(`[RookClient] Sincronização de ${rowsToInsert.length} métricas concluída para usuário anônimo.`);
      
      return true;
    } catch (err) {
      console.error('[RookClient] Rejeitado por anomalia de Payload (Zod Validation Failed).');
      return false;
    }
  }
}

export const rookClient = new RookWearableClient();
