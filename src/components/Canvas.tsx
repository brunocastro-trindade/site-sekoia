import { useEffect, useState, type ReactNode } from "react";

const CANVAS_WIDTH = 1440;
const CANVAS_HEIGHT = 4259;

// Piso de escala: em telas pequenas o canvas não encolhe além disto (evita
// conteúdo microscópico). Teto: em telas largas (ex.: Macs 16"/monitores) o
// canvas ESCALA PARA CIMA e preenche a largura em vez de ficar 1440px centralizado
// com faixas brancas nas laterais — mas não passa do teto, para não ficar gigante.
const MIN_SCALE = 0.5;
const MAX_SCALE = 1.5;

/**
 * Escala o canvas de 1440px para preencher o viewport.
 * - entre ~720px e ~2160px: escala para caber/preencher a largura (fit-to-width).
 * - < 720px: trava no piso MIN_SCALE (rolagem horizontal / pinch-zoom).
 * - > ~2160px: trava no teto MAX_SCALE e centraliza (margens pequenas).
 */
export function Canvas({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const fit = window.innerWidth / CANVAS_WIDTH;
      setScale(Math.min(MAX_SCALE, Math.max(fit, MIN_SCALE)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const visualW = CANVAS_WIDTH * scale;
  const visualH = CANVAS_HEIGHT * scale;
  // "pisado" só quando MIN_SCALE segura a escala (mobile < 720px).
  const floored =
    typeof window !== "undefined" && visualW > window.innerWidth + 0.5;

  return (
    <div
      style={{
        width: "100%",
        overflowX: floored ? "auto" : "hidden",
        overflowY: "hidden",
      }}
    >
      <div
        style={{
          width: visualW,
          height: visualH,
          overflow: "hidden",
          position: "relative",
          margin: "0 auto",
        }}
      >
        <div
          className="relative bg-white"
          style={{
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            transform: scale !== 1 ? `scale(${scale})` : undefined,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
