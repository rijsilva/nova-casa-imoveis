import Link from "next/link";

export function Logo({ variant = "color", className = "h-10 w-auto" }: { variant?: "color" | "white"; className?: string }) {
  return (
    <Link href="/" aria-label="Nova Casa Imóveis — página inicial" className="inline-flex shrink-0 items-center gap-2.5">
      <HouseIcon variant={variant} />
      <span className={`font-display font-bold tracking-tight leading-none ${variant === "white" ? "text-white" : "text-brand"}`} style={{ fontSize: "clamp(0.9rem, 2vw, 1.1rem)", lineHeight: 1.15 }}>
        Nova Casa<br /><span className={`text-xs font-semibold tracking-widest uppercase ${variant === "white" ? "text-white/70" : "text-gold"}`}>Imóveis</span>
      </span>
    </Link>
  );
}

function HouseIcon({ variant }: { variant: "color" | "white" }) {
  const brand = variant === "white" ? "#ffffff" : "#7b4f2e";
  const gold  = variant === "white" ? "rgba(255,255,255,0.55)" : "#c9972b";
  return (
    <svg width="42" height="38" viewBox="0 0 42 38" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      {/* Linhas diagonais do telhado (referência) */}
      <line x1="4"  y1="17" x2="21" y2="2"  stroke={gold}  strokeWidth="2.2" strokeLinecap="round" />
      <line x1="8"  y1="20" x2="21" y2="6"  stroke={brand} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="12" y1="23" x2="21" y2="10" stroke={gold}  strokeWidth="1.6" strokeLinecap="round" />

      {/* Silhueta da casa */}
      <path
        d="M21 3 L38 18 H34 V32 H24 V24 H18 V32 H8 V18 H4 L21 3Z"
        fill="none"
        stroke={brand}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Janela / quadrado central */}
      <rect x="17.5" y="10" width="7" height="6" rx="1" fill={gold} />

      {/* Curva suave embaixo (referência) */}
      <path
        d="M6 35 Q21 29 36 35"
        stroke={brand}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
