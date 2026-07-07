import { useEffect, useState, type ReactNode } from "react";

const CANVAS_WIDTH = 1440;
const CANVAS_HEIGHT = 4259;

// Piso de escala: em telas pequenas o canvas não encolhe além disto, para o
// conteúdo não ficar microscópico. Quando o piso "segura" a escala, o conteúdo
// fica mais largo que a tela e habilitamos rolagem horizontal + pinch-zoom.
const MIN_SCALE = 0.5;

/**
 * Escala o canvas de 1440px para caber no viewport.
 * - sempre escala para preencher a largura (sem margens laterais em branco).
 * - < 720px (celular): trava no piso MIN_SCALE; o conteúdo pode ser rolado
 *   horizontalmente / ampliado com pinch-zoom.
 */
export function Canvas({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const fit = window.innerWidth / CANVAS_WIDTH;
      setScale(Math.max(fit, MIN_SCALE));
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
