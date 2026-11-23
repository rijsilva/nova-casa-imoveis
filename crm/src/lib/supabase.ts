// Preencher após criar o projeto no Supabase.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string || "";
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string || "";

type Opts = { method?: string; body?: unknown };

export async function api(path: string, opts: Opts = {}): Promise<unknown> {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("Supabase não configurado");
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: opts.method ?? "GET",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!r.ok) throw new Error(await r.text());
  return r.status === 204 ? null : r.json();
}

export async function rpc(fn: string, params: Record<string, unknown>): Promise<unknown> {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("Supabase não configurado");
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
