import { ArrowDown } from "lucide-react";
import { GlowyWavesHero } from "../components/ui/glowy-waves-hero-shadcnui";
import GradientWaves from "../components/GradientWaves";
import { openWhatsApp } from "../lib/contact";

export function Hero() {
  return (
    <>
      <div className="relative">
        <GlowyWavesHero
          id="solucoes"
          className="pt-28"
          align="left"
          eyebrow={null}
          heading={
            <>
              Mais vendas,
              <br />
              mais previsibilidade,
              <br />
              <span className="accent-serif text-accent-bright">mais escala.</span>
            </>
          }
          description="Agência de acompanhamento digital completo tráfego pago, social media e criação de sites para marcas que querem crescer com previsibilidade."
          primaryCta={{
            label: "Falar com um especialista",
            onClick: () => openWhatsApp(),
          }}
          pills={[]}
          stats={[]}
          showCanvas={false}
          backdrop={
            <GradientWaves
              horizonColor="#0a0d06"
              waveColor="#1a2410"
              crestColor="#c6ff4d"
              speed={0.4}
              amplitude={2.5}
              waveScale={0.6}
              waveRatio={0.9}
              swell={35}
              turbulence={20}
              tilt={1.11}
              zoom={1}
              height={5.5}
              fogDepth={15}
              detail="medium"
              brightness={1}
              opacity={1}
              mouseInteraction
              parallaxStrength={0.5}
              grain
              grainIntensity={0.05}
            />
          }
        />
        <div className="pointer-events-none absolute bottom-8 left-6 hidden md:block lg:left-8">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-foreground/50">
            Scroll
            <ArrowDown className="size-3.5" />
          </span>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-48 bg-gradient-to-b from-transparent to-background" />
      </div>
      <div className="relative overflow-hidden border-b border-accent-bright/10 bg-background py-6 md:py-8">
        <div className="sek-ticker">
          {Array.from({ length: 2 }).map((_, i) => (
            <span
              key={i}
              aria-hidden={i === 1}
              className="accent-serif whitespace-nowrap px-6 text-5xl font-semibold uppercase text-foreground md:text-7xl"
            >
              {Array(4).fill("Tráfego pago  ·  Social Media  ·  Sites").join("  ·  ")}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
