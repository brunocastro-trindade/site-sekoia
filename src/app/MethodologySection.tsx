import BackgroundShadow from "../imports/BackgroundShadow-1";
import Group272 from "../imports/Group272-1";
import Group273 from "../imports/Group273-1";
import Group274 from "../imports/Group274-1";
import Group275 from "../imports/Group275-1";

const font = {
  bold: { fontFamily: "'Gotham:Bold', 'Montserrat', sans-serif", fontWeight: 700 } as React.CSSProperties,
  book: { fontFamily: "'Gotham:Book', 'Montserrat', sans-serif", fontWeight: 400 } as React.CSSProperties,
};

export default function MethodologySection() {
  return (
    <div className="w-full flex justify-center px-[20px] py-[50px] bg-white">
      {/*
       * Outer: relative container — BackgroundShadow fills it as the
       * dark-green rounded rect with drop-shadow; content sits on top.
       */}
      <div className="relative w-full" style={{ maxWidth: 1160 }}>

        {/* ── Dark green shadow background ── */}
        <div className="absolute inset-0 z-0">
          <BackgroundShadow />
        </div>

        {/* ── Content row (z-index above bg) ── */}
        <div className="relative z-10 flex items-stretch gap-[16px] px-[28px] py-[20px]">

          {/* Left: heading text directly on dark green */}
          <div
            className="shrink-0 flex items-center"
            style={{ width: 230 }}
          >
            <h2
              className="text-white text-[22px] leading-[1.35]"
              style={font.bold}
            >
              Conheça a metodologia que vamos aplicar no seu negócio!
            </h2>
          </div>

          {/* ── Phase 1 — large card ── */}
          <div
            className="flex-1 flex flex-col justify-between rounded-[15px] bg-[#f7f7f7] border border-[#c5c5c5] overflow-hidden px-6 py-5"
          >
            {/* top content */}
            <div className="flex flex-col gap-[6px]">
              <p
                className="text-[#39471D] text-[18px] leading-[1.3]"
                style={font.bold}
              >
                1ª fase do Tráfego pago na Sekoia
              </p>
              <p
                className="text-[#39471D] text-[13px] leading-[1.55]"
                style={font.book}
              >
                Na primeira fase, chamada Setup Estratégico, realizamos toda a
                estruturação necessária para construir suas campanhas:
              </p>
              <ul
                className="text-[#39471D] text-[13px] leading-[1.55] list-none p-0 m-0 flex flex-col gap-0"
                style={font.book}
              >
                <li>• Diagnóstico completo do negócio e mercado;</li>
                <li>• Definição dos públicos-alvo e segmentações;</li>
                <li>• Estudo da concorrência e oportunidades de mercado;</li>
                <li>• Estruturação das campanhas e conjuntos de anúncios;</li>
                <li>• Configuração de pixels, eventos e conversões;</li>
                <li>• Planejamento da estratégia de mídia e investimento.</li>
              </ul>
            </div>

            {/* bottom: star + label + badge */}
            <div className="flex items-center gap-[10px] mt-4">
              {/* star icon */}
              <div className="size-[30px] shrink-0">
                <Group273 />
              </div>
              {/* label */}
              <span
                className="text-[#39471D] text-[13px] whitespace-nowrap"
                style={font.bold}
              >
                Planejamento estratégico
              </span>
              {/* badge — Group272 uses `contents` outer div + absolute children,
                  so we give it an explicit relative wrapper with its native size */}
              <div className="relative shrink-0" style={{ width: 157, height: 31 }}>
                <Group272 />
              </div>
            </div>
          </div>

          {/* ── Phase 2 — narrow card ── */}
          <div
            className="flex flex-col justify-between rounded-[15px] bg-[#f7f7f7] border border-[#c5c5c5] overflow-hidden px-5 py-5 shrink-0"
            style={{ width: 128 }}
          >
            <p
              className="text-[#39471D] text-[18px] leading-[1.3]"
              style={font.bold}
            >
              2ª fase
            </p>
            <div className="size-[30px]">
              <Group274 />
            </div>
          </div>

          {/* ── Phase 3 — narrow card ── */}
          <div
            className="flex flex-col justify-between rounded-[15px] bg-[#f7f7f7] border border-[#c5c5c5] overflow-hidden px-5 py-5 shrink-0"
            style={{ width: 128 }}
          >
            <p
              className="text-[#39471D] text-[18px] leading-[1.3]"
              style={font.bold}
            >
              3ª fase
            </p>
            <div className="size-[30px]">
              <Group275 />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
