import { useEffect, useState, type ReactNode } from "react";

const CANVAS_WIDTH = 1440;
const CANVAS_HEIGHT = 4259;

// Piso de escala: em telas pequenas o canvas não encolhe além disto, para o
// conteúdo não ficar microscópico. Quando o piso "segura" a escala, o conteúdo
// fica mais largo que a tela e habilitamos rolagem horizontal + pinch-zoom.
const MIN_SCALE = 0.5;

/**
 * Escala o canvas de 1440px para caber no viewport.
 * - ≥ 1440px: tamanho real, centralizado.
 * - entre ~720px e 1440px: escala para caber na largura (sem rolagem horizontal).
 * - < 720px (celular): trava no piso MIN_SCALE; o conteúdo fica maior que a tela
 *   e pode ser rolado horizontalmente / ampliado com pinch-zoom.
 */
export function Canvas({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const fit = w / CANVAS_WIDTH;
      setScale(w >= CANVAS_WIDTH ? 1 : Math.max(fit, MIN_SCALE));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const visualW = CANVAS_WIDTH * scale;
  const visualH = CANVAS_HEIGHT * scale;
  // Está "pisado" quando a largura visual passou da largura da tela.
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
      {/* Sizer com as dimensões VISUAIS reais: recorta as faixas largas (tickers)
          e define a área de rolagem horizontal correta. */}
      <div
        style={{
          width: visualW,
          height: visualH,
          overflow: "hidden",
          position: "relative",
          margin: scale >= 1 ? "0 auto" : undefined,
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
