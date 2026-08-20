import { SplitText } from "../components/ui/SplitText";
import { ServiceRow } from "../components/ui/ServiceRow";
import { openWhatsApp } from "../lib/contact";

const HEADING = "Acompanhamento digital completo pra sua empresa crescer";

const SERVICES = [
  {
    index: "01",
    title: "Tráfego pago",
    description:
      "Google Ads e Meta Ads geridos de ponta a ponta estratégia, criativos, otimização diária e relatórios que mostram onde o investimento virou venda.",
  },
  {
    index: "02",
    title: "Social Media",
    description:
      "Gestão das suas redes sociais com planejamento de conteúdo, produção e publicação consistente presença digital que sustenta a marca entre uma campanha e outra.",
  },
  {
    index: "03",
    title: "Criação de sites",
    description:
      "Sites e landing pages pensados pra converter a base que recebe o tráfego (pago ou orgânico) e transforma visita em oportunidade de negócio.",
  },
];

function ScrollRevealHeading({ text }: { text: string }) {
  return (
    <div className="reveal-scope relative" style={{ height: "220vh" }}>
      <div className="sticky top-0 flex h-screen items-center justify-center px-5 md:px-8">
        <h2 className="max-w-5xl text-center text-[32px] font-bold leading-[1.15] md:text-6xl lg:text-7xl">
          <SplitText
            text={text}
            rangeStart={27}
            rangeEnd={73}
            wordClassName={(word) =>
              word === "Acompanhamento" || word === "crescer"
                ? "accent-serif text-accent-bright"
                : undefined
            }
          />
        </h2>
      </div>
    </div>
  );
}

export function TrafficPitch() {
  return (
    <section className="relative">
      <ScrollRevealHeading text={HEADING} />
      <div className="border-t border-accent-bright/10">
        {SERVICES.map((service) => (
          <ServiceRow
            key={service.index}
            index={service.index}
            title={service.title}
            description={service.description}
            onClick={() =>
              openWhatsApp(`Olá! Vim pelo site da Sekoia e quero saber mais sobre ${service.title}.`)
            }
          />
        ))}
      </div>
    </section>
  );
}
