import { useEffect, useState, type ReactNode } from "react";

const CANVAS_WIDTH = 1440;
const CANVAS_HEIGHT = 4259;

/**
 * Escala o canvas de 1440px para caber em qualquer viewport.
 * Em telas maiores (≥ 1440px) exibe em tamanho real centrado.
 * Elementos absolutamente posicionados mais largos que o canvas
 * (ex: faixas de ticker de 6000px) ficam visíveis até as bordas do viewport.
 */
export function Canvas({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setScale(w < CANVAS_WIDTH ? w / CANVAS_WIDTH : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: CANVAS_HEIGHT * scale,
        overflow: "hidden",
      }}
    >
      <div
        className="relative bg-white"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: "top left",
          margin: scale >= 1 ? "0 auto" : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}
