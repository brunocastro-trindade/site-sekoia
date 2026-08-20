import { useEffect, useRef, useState } from "react";
import { Plus, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { openWhatsApp } from "../lib/contact";
import { scrollToEl } from "../lib/lenis";
import { siteConfig } from "../lib/siteConfig";

function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = !mounted || resolvedTheme !== "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      className={`flex size-9 shrink-0 items-center justify-center rounded-full text-foreground/75 transition-colors hover:bg-accent-bright/10 hover:text-foreground ${className}`}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 24);
      const goingDown = y > lastScrollY.current + 4;
      const goingUp = y < lastScrollY.current - 4;
      if (goingDown && y > 160) setHidden(true);
      else if (goingUp || y < 160) setHidden(false);
      lastScrollY.current = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => scrollToEl(`#${id}`), 60);
  };

  return (
    <header
      className={`absolute inset-x-0 top-6 z-50 px-5 transition-transform duration-500 ease-out md:px-8 ${
        hidden && !menuOpen ? "-translate-y-24" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div
          className={`flex items-center gap-2 rounded-full border border-accent-bright/15 bg-background/95 backdrop-blur-md transition-[padding] duration-300 ${
            scrolled ? "px-3 py-1.5" : "px-4 py-2"
          }`}
        >
          <img
            src="/logo-sekoia.png"
            alt={siteConfig.fullName}
            className={`w-auto brightness-0 transition-[height] duration-300 dark:invert ${scrolled ? "h-7" : "h-9"}`}
          />
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-accent-bright/10 bg-background/80 p-1.5 backdrop-blur-md md:flex">
          {siteConfig.nav.map(({ label, id }) => (
            <button
              key={id}
              type="button"
              onClick={() => go(id)}
              className="rounded-full px-4 py-2 text-sm text-foreground/75 transition-colors hover:bg-accent-bright/10 hover:text-foreground"
            >
              {label}
            </button>
          ))}
          <ThemeToggle className="mx-1" />
          <button
            type="button"
            onClick={() => openWhatsApp()}
            className="ml-1 flex items-center gap-2 rounded-full bg-accent-bright py-2 pl-4 pr-2 text-sm font-medium text-accent-foreground"
          >
            Falar agora
            <Plus className="size-3.5" strokeWidth={2.5} />
          </button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle className="border border-accent-bright/10 bg-background/80 backdrop-blur-md" />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            className="flex items-center gap-2 rounded-full border border-accent-bright/10 bg-background/80 px-4 py-2.5 text-sm text-foreground backdrop-blur-md"
          >
            Menu
            <Plus className={`size-3.5 transition-transform ${menuOpen ? "rotate-45" : ""}`} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-2xl border border-accent-bright/10 bg-background/95 p-2 backdrop-blur-md md:hidden">
          {siteConfig.nav.map(({ label, id }) => (
            <button
              key={id}
              type="button"
              onClick={() => go(id)}
              className="rounded-xl px-4 py-3 text-left text-[15px] text-foreground hover:bg-accent-bright/10"
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              openWhatsApp();
            }}
            className="rounded-xl bg-accent-bright px-4 py-3 text-[15px] font-semibold text-accent-foreground"
          >
            Falar agora
          </button>
        </nav>
      )}
    </header>
  );
}
