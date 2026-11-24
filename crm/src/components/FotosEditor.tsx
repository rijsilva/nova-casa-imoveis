import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import clsx from "clsx";
import { enviarArquivo, enviarVarios } from "@/lib/cloudinary";

const LIMITE = 10 * 1024 * 1024;

export function FotosEditor({ fotos, onChange, somenteLeitura }: { fotos: string[]; onChange: (f: string[]) => void; somenteLeitura?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [enviando, setEnviando] = useState(0);
  const [erro, setErro] = useState<string | null>(null);

  async function enviar(files: FileList | null) {
    if (!files?.length) return;
    const lista = [...files];
    const recusados: string[] = [];
    const validos = lista.filter((f) => {
      if (!f.type.startsWith("image/")) { recusados.push(`${f.name} (não é imagem)`); return false; }
      if (f.size > LIMITE) { recusados.push(`${f.name} (maior que 10 MB)`); return false; }
      return true;
    });
    setErro(null);
    setEnviando(validos.length);
    const res = await enviarVarios(validos, (f) => enviarArquivo(f, "image"));
    setEnviando(0);
    const urls: string[] = [];
    res.forEach((r, i) => r.status === "fulfilled" ? urls.push(r.value.url) : recusados.push(`${validos[i].name} (${(r.reason as Error)?.message ?? "erro"})`));
    if (urls.length) onChange([...fotos, ...urls]);
    if (recusados.length) setErro(`Não enviadas: ${recusados.join(", ")}`);
  }

  const mover = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= fotos.length) return;
    const f = [...fotos];
    [f[i], f[j]] = [f[j], f[i]];
    onChange(f);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {fotos.map((f, i) => (
          <figure key={f + i} className={clsx("group relative aspect-[4/3] overflow-hidden rounded-lg border bg-sand", i === 0 ? "border-ink" : "border-line")}>
            <img src={f} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
            {i === 0 && <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-ink px-2 py-0.5 text-[11px] font-semibold text-white"><Star className="h-3 w-3" />Capa</span>}
            {!somenteLeitura && (
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-ink/70 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                <div className="flex gap-1">
                  <button type="button" onClick={() => mover(i, -1)} className="rounded bg-white/90 p-1" aria-label="Mover para a esquerda"><ArrowLeft className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => mover(i, 1)} className="rounded bg-white/90 p-1" aria-label="Mover para a direita"><ArrowRight className="h-3.5 w-3.5" /></button>
                </div>
                <button type="button" onClick={() => onChange(fotos.filter((_, j) => j !== i))} className="rounded bg-white/90 p-1 text-red-500" aria-label="Remover foto"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            )}
          </figure>
        ))}
        {!somenteLeitura && (
          <button type="button" onClick={() => input.current?.click()} disabled={enviando > 0}
            onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); enviar(e.dataTransfer.files); }}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-ink-300 text-ink-500 transition hover:border-ink hover:text-ink disabled:cursor-wait">
            {enviando > 0
              ? <><Loader2 className="h-5 w-5 animate-spin" /><span className="text-xs font-semibold">Enviando {enviando} {enviando === 1 ? "foto" : "fotos"}...</span></>
              : <><ImagePlus className="h-5 w-5" /><span className="text-xs font-semibold">Adicionar fotos</span></>}
          </button>
        )}
      </div>
      {!somenteLeitura && (
        <>
          <input ref={input} type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => { enviar(e.target.files); e.target.value = ""; }} />
          {erro && <p className="mt-2 text-sm text-red-500">{erro}</p>}
          <div className="mt-3 flex gap-2">
            <input className="field" placeholder="Ou cole a URL de uma imagem" value={url} onChange={(e) => setUrl(e.target.value)} />
            <button type="button" className="btn-secondary" disabled={!url.trim()} onClick={() => { onChange([...fotos, url.trim()]); setUrl(""); }}>Adicionar</button>
          </div>
          <p className="mt-1.5 text-xs text-ink-400">A primeira foto é a capa no site. Arraste ou clique para enviar (até 10 MB por foto).</p>
        </>
      )}
    </div>
  );
}
