import { useStore } from "./store";

export type Permissao = "editarCatalogo" | "verTodosLeads";

export function usePode(_p: Permissao): boolean {
  const sessaoId = useStore((s) => s.sessaoId);
  // Enquanto não há sistema de papéis implementado, qualquer usuário logado pode tudo
  return sessaoId !== null;
}
