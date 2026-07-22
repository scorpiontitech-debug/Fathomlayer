import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Leituras públicas: passam pela RLS, então só enxergam o que venceu os
// quality gates (status published + is_indexable). As páginas herdam a regra
// de negócio do banco sem reimplementá-la.
export function supabasePublic() {
  return createClient<Database>(url, publishableKey, {
    auth: { persistSession: false },
  });
}

// Escrita interna (tracking de cliques em /out, admin/review). Ignora RLS.
// Só pode ser importado em código de servidor — nunca em Client Component.
// Retorna null se a secret key ainda não foi configurada no ambiente.
export function supabaseAdmin() {
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret) return null;
  return createClient<Database>(url, secret, {
    auth: { persistSession: false },
  });
}
