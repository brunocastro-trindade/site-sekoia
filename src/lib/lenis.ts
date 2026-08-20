import Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function initLenis(): Lenis {
  if (lenisInstance) return lenisInstance;

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenisInstance = lenis;
  return lenis;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function scrollToEl(target: string | HTMLElement, offset = 0) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { offset });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
}
