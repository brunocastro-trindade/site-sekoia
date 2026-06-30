// Logo horizontal da Sekoia recriada em SVG (ícone da árvore + wordmark).
// `color` permite usá-la em fundo claro (#39471d) ou escuro (#ffffff).

export function SekoiaLogo({
  color = "#39471d",
  height = 52,
  showTagline = true,
}: {
  color?: string;
  height?: number;
  showTagline?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, color }}>
      {/* Ícone: árvore Sekoia dentro de quadrado arredondado */}
      <svg
        width={height}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
        style={{ flex: "none" }}
      >
        <rect x="4.5" y="4.5" width="91" height="91" rx="27" stroke={color} strokeWidth="6" />
        <g stroke={color} strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M34 40 L50 24 L66 40" />
          <path d="M30 56 L50 39 L70 56" />
          <path d="M26 72 L50 55 L74 72" />
        </g>
        <path d="M45.5 71 L54.5 71 L50 85 Z" fill={color} />
      </svg>

      {/* Wordmark */}
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            fontFamily: "'Gotham:Bold', 'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: Math.round(height * 0.52),
            letterSpacing: "-0.5px",
          }}
        >
          sekoia
        </span>
        {showTagline && (
          <span
            style={{
              fontFamily: "'Gotham:Book', 'Montserrat', sans-serif",
              fontSize: Math.max(8, Math.round(height * 0.17)),
              letterSpacing: "3px",
              marginTop: 4,
              opacity: 0.85,
            }}
          >
            GROWTH MARKETING
          </span>
        )}
      </div>
    </div>
  );
}
