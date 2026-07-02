import { useEffect, useRef } from "react";

// Vídeo reencodado all-intra (keyframe em todo frame) para scrub suave.
const TREE_VIDEO_URL = "/tree.mp4";

/**
 * Vídeo da árvore controlado pela ROLAGEM (scroll-scrubbing): conforme a seção
 * passa pela tela, o tempo do vídeo avança — a semente cai e a árvore cresce,
 * como uma animação em cascata.
 *
 * No desktop faz o scrub. No mobile (toque/tela pequena), onde o scrub é
 * instável, cai para um fallback: autoplay em loop ao entrar na tela.
 */
export function TreeScrollVideo({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isMobile =
      window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 900;

    // ── Fallback mobile: toca em loop quando aparece ──
    if (isMobile) {
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) video.play().catch(() => {});
          else video.pause();
        },
        { threshold: 0.2 },
      );
      io.observe(video);
      return () => io.disconnect();
    }

    // ── Desktop: scrub por rolagem ──
    let raf = 0;
    let pending = false;
    let duration = 0;

    const onMeta = () => {
      duration = video.duration || 0;
    };
    video.addEventListener("loadedmetadata", onMeta);
    if (video.readyState >= 1) onMeta();

    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

    const update = () => {
      pending = false;
      if (!duration) return;
      const rect = video.getBoundingClientRect(); // já em coords de tela (com a escala do Canvas)
      const vh = window.innerHeight;
      // 0 quando o topo entra pela base da tela; 1 quando a base sai pelo topo.
      const total = vh + rect.height;
      const scrolled = vh - rect.top;
      const progress = clamp(scrolled / total, 0, 1);
      const t = progress * (duration - 0.05);
      if (Math.abs(video.currentTime - t) > 0.015) {
        try {
          video.currentTime = t;
        } catch {
          /* seek pode falhar antes de estar pronto */
        }
      }
    };

    const onScroll = () => {
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll(); // sincroniza no início

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      video.removeEventListener("loadedmetadata", onMeta);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={TREE_VIDEO_URL}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      className={className}
      style={{ objectFit: "cover", display: "block", width: "100%", height: "100%" }}
    />
  );
}
