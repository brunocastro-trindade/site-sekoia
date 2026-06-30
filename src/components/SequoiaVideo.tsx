import { useEffect, useRef } from "react";

/**
 * Reproduz /sequoia.mp4 substituindo o fundo cinza dessaturado por BRANCO em
 * tempo real (chroma key por canvas). O canvas opaco cobre o vídeo de origem;
 * numa página branca o retângulo branco "some", deixando o vídeo integrado à
 * página, sem caixa/placeholder. O recorte preserva o enquadramento "cover".
 *
 * Performance: processa em resolução interna reduzida (escalada por CSS),
 * limita a taxa de quadros e pausa o processamento quando sai da tela.
 */
export function SequoiaVideo({
  className,
  width = 469,
  height = 430,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const FRAME_MS = 1000 / 24;

    let raf = 0;
    let last = 0;
    let visible = true;

    function coverRect(vw: number, vh: number) {
      const scale = Math.max(W / vw, H / vh);
      const sw = W / scale;
      const sh = H / scale;
      return { sx: (vw - sw) / 2, sy: (vh - sh) / 2, sw, sh };
    }

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible || video.readyState < 2 || !video.videoWidth) return;
      if (t - last < FRAME_MS) return;
      last = t;

      const { sx, sy, sw, sh } = coverRect(video.videoWidth, video.videoHeight);
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, W, H);

      const frame = ctx.getImageData(0, 0, W, H);
      const d = frame.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i];
        const g = d[i + 1];
        const b = d[i + 2];
        const max = r > g ? (r > b ? r : b) : g > b ? g : b;
        const min = r < g ? (r < b ? r : b) : g < b ? g : b;
        const sat = max - min; // baixa => cinza/neutro
        const lum = (r + g + b) / 3; // alta => claro

        // Fundo = neutro (baixa saturação) e claro -> mistura para branco,
        // com fade suave (feather) para não deixar bordas duras no sujeito.
        if (sat < 24 && lum > 130) {
          const aSat = sat <= 14 ? 1 : (24 - sat) / 10;
          const aLum = lum >= 160 ? 1 : (lum - 130) / 30;
          const k = Math.min(1, aSat < aLum ? aSat : aLum); // 0..1 (1 = branco)
          d[i] = Math.round(r + (255 - r) * k);
          d[i + 1] = Math.round(g + (255 - g) * k);
          d[i + 2] = Math.round(b + (255 - b) * k);
        }
      }
      ctx.putImageData(frame, 0, 0);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) video.play().catch(() => {});
      },
      { threshold: 0.01 },
    );
    io.observe(canvas);

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <div className={className} style={{ overflow: "hidden" }}>
      <video
        ref={videoRef}
        src="/sequoia.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <canvas
        ref={canvasRef}
        width={Math.round(width / 2)}
        height={Math.round(height / 2)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          background: "#fff",
        }}
      />
    </div>
  );
}
