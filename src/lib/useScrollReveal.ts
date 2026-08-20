import { useEffect } from "react";

/**
 * Observa todos os elementos `.sek-card` da página e adiciona `.is-visible`
 * quando entram na viewport (efeito de entrada em cascata + hover lift,
 * ver `globals.css`). Chamar uma única vez no topo da árvore.
 */
export function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".sek-card");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
