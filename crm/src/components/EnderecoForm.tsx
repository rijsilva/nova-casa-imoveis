import { useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";
import { Campo } from "./ui";
import { soDigitos } from "@/lib/format";
import type { Endereco } from "@/lib/types";

export const enderecoVazio = (): Endereco => ({ cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", uf: "" });

const UFS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

const mascaraCep = (v: string) => { const d = soDigitos(v).slice(0, 8); return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d; };

export async function buscarCep(cep: string): Promise<Partial<Endereco> | null> {
  const d = soDigitos(cep);
  if (d.length !== 8) return null;
  try {
    const r = await fetch(`https://viacep.com.br/ws/${d}/json/`);
    const j = await r.json();
    if (j.erro) return null;
    return { logradouro: j.logradouro ?? "", bairro: j.bairro ?? "", cidade: j.localidade ?? "", uf: j.uf ?? "" };
  } catch {
    const r = await fetch(`https://brasilapi.com.br/api/cep/v2/${d}`);
    if (!r.ok) return null;
    const j = await r.json();
    return { logradouro: j.street ?? "", bairro: j.neighborhood ?? "", cidade: j.city ?? "", uf: j.state ?? "" };
  }
}

export function EnderecoForm({ valor, onChange, erros = {} }: { valor: Endereco; onChange: (e: Endereco) => void; erros?: Partial<Record<keyof Endereco, string>> }) {
  const [estado, setEstado] = useState<"ocioso" | "buscando" | "ok" | "erro">(valor.cidade ? "ok" : "ocioso");
  const [manual, setManual] = useState(false);
  const set = <K extends keyof Endereco>(k: K, v: Endereco[K]) => onChange({ ...valor, [k]: v });

  async function consultar(cep = valor.cep) {
    if (soDigitos(cep).length !== 8) { setEstado("erro"); return; }
    setEstado("buscando");
    try {
      const r = await buscarCep(cep);
      if (!r) { setEstado("erro"); return; }
      onChange({ ...valor, cep: soDigitos(cep), ...r });
      setEstado("ok");
    } catch {
      setEstado("erro");
    }
  }

  const travado = !manual;
  const erroCep = estado === "erro" ? "CEP não encontrado. Confira os números ou preencha manualmente." : erros.cep;

  return (
    <div className="grid gap-4 sm:grid-cols-6">
      <Campo label="CEP *" className="sm:col-span-2" dica={erroCep ? <span className="text-red-500">{erroCep}</span> : "Preenche o endereço automaticamente."}>
        <div className="flex gap-2">
          <input
            className={`field tabular ${erroCep ? "border-red-500" : ""}`} inputMode="numeric" placeholder="00000-000"
            value={mascaraCep(valor.cep)}
            onChange={(e) => {
              const d = soDigitos(e.target.value).slice(0, 8);
              set("cep", d);
              if (d.length === 8) consultar(d);
              else if (estado === "erro") setEstado("ocioso");
            }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); consultar(); } }}
          />
          <button type="button" className="btn-secondary px-3" onClick={() => consultar()} disabled={estado === "buscando"} aria-label="Buscar CEP">
            {estado === "buscando" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </button>
        </div>
      </Campo>
      <div className="flex items-end pb-2 sm:col-span-4">
        <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" rel="noopener" className="text-xs font-medium text-ink-500 underline hover:text-ink">Não sei o CEP</a>
      </div>

      <Campo label="Logradouro *" className="sm:col-span-4" dica={erros.logradouro && <span className="text-red-500">{erros.logradouro}</span>}>
        <input className="field" value={valor.logradouro} onChange={(e) => set("logradouro", e.target.value)} placeholder="Rua, avenida..." />
      </Campo>
      <Campo label="Número *" className="sm:col-span-2" dica={erros.numero && <span className="text-red-500">{erros.numero}</span>}>
        <input className="field" value={valor.numero} onChange={(e) => set("numero", e.target.value)} placeholder="Ex.: 238 ou S/N" />
      </Campo>
      <Campo label="Complemento" className="sm:col-span-2"><input className="field" value={valor.complemento ?? ""} onChange={(e) => set("complemento", e.target.value)} placeholder="Apto, bloco, sala" /></Campo>
      <Campo label="Bairro *" className="sm:col-span-4" dica={erros.bairro && <span className="text-red-500">{erros.bairro}</span>}>
        <input className="field" value={valor.bairro} onChange={(e) => set("bairro", e.target.value)} />
      </Campo>
      <Campo label="Cidade *" className="sm:col-span-4" dica={erros.cidade && <span className="text-red-500">{erros.cidade}</span>}>
        <input className="field" value={valor.cidade} readOnly={travado} disabled={travado} onChange={(e) => set("cidade", e.target.value)} />
      </Campo>
      <Campo label="UF *" className="sm:col-span-2" dica={erros.uf && <span className="text-red-500">{erros.uf}</span>}>
        <select className="field" value={valor.uf} disabled={travado} onChange={(e) => set("uf", e.target.value)}>
          <option value="" />
          {UFS.map((u) => <option key={u}>{u}</option>)}
        </select>
      </Campo>
      <div className="flex items-center gap-2 text-xs text-ink-500 sm:col-span-6">
        <MapPin className="h-3.5 w-3.5" />
        {travado
          ? <span>Cidade e UF vêm do CEP para manter a busca do site padronizada. <button type="button" className="font-semibold underline" onClick={() => setManual(true)}>Editar manualmente</button></span>
          : <span>Edição manual liberada. Prefira o nome oficial da cidade, sem abreviações.</span>}
      </div>
    </div>
  );
}

export function validarEndereco(e: Endereco): Partial<Record<keyof Endereco, string>> {
  const r: Partial<Record<keyof Endereco, string>> = {};
  if (soDigitos(e.cep).length !== 8) r.cep = "CEP deve ter 8 números";
  if (!e.logradouro.trim()) r.logradouro = "Informe o logradouro";
  if (!e.numero.trim()) r.numero = "Informe o número (ou S/N)";
  if (!e.bairro.trim()) r.bairro = "Informe o bairro";
  if (!e.cidade.trim()) r.cidade = "Informe a cidade (busque pelo CEP)";
  if (!/^[A-Z]{2}$/.test(e.uf)) r.uf = "Selecione a UF";
  return r;
}
