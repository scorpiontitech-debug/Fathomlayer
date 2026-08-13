import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

// O módulo do Matter (Em um cenário real, este estaria compartilhado como um pacote interno. 
// Para a Edge Function Deno, nós abstrairemos a lógica do dispatcher via fetch HTTP para o Hub local)
async function triggerMatterMitigation(userId: string) {
  console.log(`[Anticipatory Design] Disparando mitigação IoT Matter para ${userId}`);
  // Lógica de túnel segura omitida aqui
  return true;
}

serve(async (req) => {
  // Autenticação Zero-Trust: Apenas a infraestrutura interna/cron pode engatilhar
  const authHeader = req.headers.get('Authorization');
  if (authHeader !== `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized. Internal service only.' }), { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }), { status: 400 });
    }

    // 1. Coleta das Telemetrias Críticas das últimas 24 horas (HRV, Glucose)
    const { data: telemetry, error: telemetryError } = await supabase
      .from('biometric_telemetry')
      .select('metric_type, metric_value')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(100);

    if (telemetryError) throw telemetryError;

    // 2. Simulação Algorítmica do Digital Twin
    // Simples modelo heurístico: Baixo HRV + Alta variância na Glicose = Pico de Estresse Adrenérgico iminente
    let hrvDropCount = 0;
    let glucoseSpikeCount = 0;

    for (const t of (telemetry || [])) {
      if (t.metric_type === 'hrv' && t.metric_value < 40) hrvDropCount++;
      if (t.metric_type === 'glucose' && t.metric_value > 140) glucoseSpikeCount++;
    }

    // Calcula o Fator de Estresse Projetado
    const projectedStress = Math.min((hrvDropCount * 0.1) + (glucoseSpikeCount * 0.15), 1.0);
    const requiresIntervention = projectedStress >= 0.5;

    // 3. Atualiza o Estado do Gêmeo Digital
    await supabase.from('digital_twins').upsert({
      user_id: userId,
      stress_threshold: projectedStress,
      last_simulation_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

    console.log(`[Digital Twin] Usuário ${userId} | Stress Projetado: ${projectedStress.toFixed(2)}`);

    // 4. Ativação do Design Antecipatório (Mitigação Phygital)
    if (requiresIntervention) {
      console.log(`[Digital Twin] ⚠️ Limiar Crítico detectado! Acionando mitigação IoT...`);
      await triggerMatterMitigation(userId);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        projectedStress, 
        interventionTriggered: requiresIntervention 
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error('Edge Function Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
})
