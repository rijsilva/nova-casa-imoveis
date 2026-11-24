const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

export type Enviado = { url: string; bytes: number; largura?: number; altura?: number };

export async function enviarArquivo(file: File, tipo: "image" | "raw" = "image"): Promise<Enviado> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", PRESET);
  const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/${tipo}/upload`, { method: "POST", body: fd });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.secure_url) throw new Error(j?.error?.message || `Falha no envio (${r.status})`);
  const url: string = tipo === "image" ? String(j.secure_url).replace("/image/upload/", "/image/upload/f_auto,q_auto/") : j.secure_url;
  return { url, bytes: j.bytes ?? file.size, largura: j.width, altura: j.height };
}

export async function enviarVarios<T>(itens: File[], fn: (f: File) => Promise<T>, n = 3): Promise<PromiseSettledResult<T>[]> {
  const res: PromiseSettledResult<T>[] = new Array(itens.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, itens.length) }, async () => {
    while (i < itens.length) {
      const k = i++;
      try { res[k] = { status: "fulfilled", value: await fn(itens[k]) }; }
      catch (e) { res[k] = { status: "rejected", reason: e }; }
    }
  }));
  return res;
}
