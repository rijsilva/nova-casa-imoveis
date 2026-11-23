// Autenticação com Supabase Auth — conectar após configurar o projeto.
export type Papel = "admin" | "corretor";

export function pode(papel: Papel, permissao: "verTodosLeads" | "editarImoveis" | "verPainel"): boolean {
  if (papel === "admin") return true;
  const perms: Record<string, Papel[]> = {
    verTodosLeads: ["admin"],
    editarImoveis: ["admin"],
    verPainel: ["admin", "corretor"],
  };
  return (perms[permissao] ?? []).includes(papel);
}
