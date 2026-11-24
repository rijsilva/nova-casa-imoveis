import { useRef, useState } from "react";
import { Download, FileText, Loader2, Trash2, Upload } from "lucide-react";
import { enviarArquivo, enviarVarios } from "@/lib/cloudinary";
import { dataBR, novoId, tamanhoArquivo } from "@/lib/format";
import type { Documento } from "@/lib/types";

const LIMITE = 10 * 1024 * 1024;

export function DocumentosEditor({ documentos, onChange, somenteLeitura }: { documentos: Documento[]; onChange: (d: Documento[]) => void; somenteLeitura?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(0);

  async function adicionar(files: FileList | null) {
    if (!files?.length) return;
    const validos: File[] = [];
    const recusados: string[] = [];
    [...files].forEach((f) => {
      const pdf = f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
      if (!pdf) recusados.push(`${f.name} (não é PDF)`);
      else if (f.size > LIMITE) recusados.push(`${f.name} (maior que 10 MB)`);
      else validos.push(f);
    });
    setErro(null);
    setEnviando(validos.length);
    const res = await enviarVarios(validos, (f) => enviarArquivo(f, "raw"));
    setEnviando(0);
    const ok: Documento[] = [];
    res.forEach((r, i) => {
      const f = validos[i];
      if (r.status === "fulfilled") ok.push({ id: novoId(), nome: f.name, url: r.value.url, tamanho: r.value.bytes, enviadoEm: new Date().toISOString() });
      else recusados.push(`${f.name} (${(r.reason as Error)?.message ?? "erro"})`);
    });
    if (recusados.length) setErro(`Não enviados: ${recusados.join(", ")}`);
    if (ok.length) onChange([...documentos, ...ok]);
  }

  return (
    <div>
      {documentos.length > 0 && (
        <ul className="mb-3 divide-y divide-line rounded-lg border border-line">
          {documentos.map((d) => (
            <li key={d.id} className="flex items-center gap-3 px-3 py-2.5">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500"><FileText className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{d.nome}</p>
                <p className="text-xs text-ink-500">{tamanhoArquivo(d.tamanho)} · enviado em {dataBR(d.enviadoEm)}</p>
              </div>
              <a href={d.url} download={d.nome} target="_blank" rel="noopener" className="btn-secondary px-2.5 py-1.5 text-xs"><Download className="h-3.5 w-3.5" /> Baixar</a>
              {!somenteLeitura && (
                <button type="button" className="btn-ghost p-1.5 text-red-500" aria-label={`Remover ${d.nome}`} onClick={() => onChange(documentos.filter((x) => x.id !== d.id))}><Trash2 className="h-4 w-4" /></button>
              )}
            </li>
          ))}
        </ul>
      )}
      {!somenteLeitura && (
        <>
          <button type="button" onClick={() => input.current?.click()} disabled={enviando > 0}
            onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); adicionar(e.dataTransfer.files); }}
            className="flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-ink-300 px-4 py-6 text-ink-500 transition hover:border-ink hover:text-ink">
            {enviando > 0 ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
            <span className="text-sm font-semibold">{enviando > 0 ? `Enviando ${enviando} ${enviando === 1 ? "arquivo" : "arquivos"}...` : "Clique ou arraste PDFs aqui"}</span>
            <span className="text-xs">Somente PDF · até 10 MB por arquivo</span>
          </button>
          <input ref={input} type="file" accept="application/pdf,.pdf" multiple className="hidden" onChange={(e) => { adicionar(e.target.files); e.target.value = ""; }} />
          {erro && <p className="mt-2 text-sm text-red-500">{erro}</p>}
        </>
      )}
      {somenteLeitura && documentos.length === 0 && <p className="text-ink-500">Nenhum documento anexado.</p>}
    </div>
  );
}
