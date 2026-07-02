import { useEffect, useRef } from "react";

const TREE_VIDEO_URL = "/tree.mp4";

/**
 * Vídeo da árvore em reprodução CONTÍNUA (autoplay em loop, mudo) — sem controle
 * por rolagem. Só toca enquanto está visível na tela (economia de CPU).
 */
export function TreeVideo({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      src={TREE_VIDEO_URL}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      className={className}
      style={{ objectFit: "cover", display: "block", width: "100%", height: "100%" }}
    />
  );
}
