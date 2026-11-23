import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-nc flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-6xl font-extrabold text-brand">404</p>
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <p className="text-ink-500">O endereço que você acessou não existe ou foi removido.</p>
      <Link href="/" className="btn-primary mt-4">Voltar para o início</Link>
    </div>
  );
}
