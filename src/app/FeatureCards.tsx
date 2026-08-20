import { openWhatsApp } from "../lib/contact";
import { ScrollDissolveImage } from "../components/ui/ScrollDissolveImage";

const CARDS = [
  {
    index: "01",
    titleBold: "Diagnóstico",
    titleItalic: "certeiro",
    description:
      "Diagnóstico completo do seu negócio e mercado para construir uma estratégia de mídia paga que realmente converte.",
    image: "/cards/card-estrategia.jpg",
    focus: [0.5, 0.75] as [number, number],
    zoom: 1.18,
  },
  {
    index: "02",
    titleBold: "Dados",
    titleItalic: "reais",
    description:
      "Acompanhamento diário de métricas reais CPL, conversão, ROAS para saber exatamente onde o investimento virou venda.",
    image: "/cards/card-performance.jpg",
    focus: [0.15, 0.45] as [number, number],
    zoom: 1.6,
  },
  {
    index: "03",
    titleBold: "Escala",
    titleItalic: "sustentável",
    description:
      "Testamos públicos, criativos e ofertas continuamente para escalar o que funciona sem desperdiçar orçamento.",
    image: "/cards/card-escala.jpg",
    focus: [0.3, 0.35] as [number, number],
    zoom: 1.1,
  },
  {
    index: "04",
    titleBold: "Inteligência",
    titleItalic: "aplicada",
    description:
      "Cada ajuste de campanha nasce de dados de conversão reais, coletados e lidos todos os dias não de achismo.",
    image: "/cards/card-inteligencia.jpg",
    focus: [0.6, 0.55] as [number, number],
    zoom: 1.1,
  },
];

export function FeatureCards() {
  return (
    <section className="py-10 md:py-14">
      <div className="relative overflow-hidden border-y border-accent-bright/10 py-3">
        <div className="sek-ticker">
          {Array.from({ length: 2 }).map((_, i) => (
            <span
              key={i}
              aria-hidden={i === 1}
              className="whitespace-nowrap px-4 text-[13px] uppercase tracking-[0.25em] text-muted-foreground"
            >
              {Array(8).fill("Como trabalhamos").join("   ·   ")}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-16 px-5 md:mt-20 md:gap-24 md:px-8">
        {CARDS.map(({ index, titleBold, titleItalic, description, image, focus, zoom }, i) => (
          <div
            key={index}
            className="sek-card grid grid-cols-1 items-center gap-8 md:grid-cols-[1.1fr_1fr] md:gap-14"
            style={{ "--i": i } as React.CSSProperties}
          >
            <ScrollDissolveImage
              src={image}
              alt={`${titleBold} ${titleItalic}`}
              aspectRatio="6 / 5"
              focus={focus}
              zoom={zoom}
              className={i % 2 === 1 ? "md:order-2" : ""}
              onClick={() =>
                openWhatsApp(`Olá! Vim pelo site da Sekoia e quero saber mais sobre "${titleBold} ${titleItalic}".`)
              }
            />
            <div className={i % 2 === 1 ? "md:order-1" : ""}>
              <span className="section-index text-xl">{index}</span>
              <h3 className="mt-4 text-4xl leading-[1.05] text-foreground md:text-6xl">
                <span className="font-semibold">{titleBold}</span>
                <br />
                <span className="accent-serif text-accent-bright">{titleItalic}</span>
              </h3>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground">{description}</p>

              <button
                type="button"
                onClick={() =>
                  openWhatsApp(`Olá! Vim pelo site da Sekoia e quero saber mais sobre "${titleBold} ${titleItalic}".`)
                }
                className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent-bright"
              >
                Saiba mais
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
