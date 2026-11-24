import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Modal } from "@/components/ui";

export function ExcluirFicha({ id: _id, nome, onExcluir }: { id: string; nome: string; onExcluir: () => Promise<boolean> }) {
  const [aberto, setAberto] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  async function confirmar() {
    setExcluindo(true);
    const ok = await onExcluir();
    setExcluindo(false);
    if (ok) setAberto(false);
  }

  return (
    <>
      <button type="button" className="btn-ghost text-red-500" onClick={() => setAberto(true)}><Trash2 className="h-4 w-4" /> Excluir</button>
      {aberto && (
        <Modal aberto onFechar={() => setAberto(false)} titulo="Excluir imóvel"
          rodape={<><button type="button" className="btn-secondary" onClick={() => setAberto(false)}>Cancelar</button>
            <button type="button" className="btn-primary bg-red-500 hover:bg-red-600" disabled={excluindo} onClick={confirmar}>{excluindo ? "Excluindo..." : "Excluir definitivamente"}</button></>}>
          <p><strong>{nome || "Este imóvel"}</strong> será apagado do CRM e do site. Esta ação não pode ser desfeita.</p>
        </Modal>
      )}
    </>
  );
}
