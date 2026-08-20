import { ArrowUpRight } from "lucide-react";

/**
 * <ServiceRow /> — uma linha de lista de serviço, tema escuro por padrão e
 * que inverte pra claro no hover (fundo `foreground`, texto `background`).
 * Cada serviço na seção é uma instância independente deste componente.
 */
export interface ServiceRowProps {
  index: string;
  title: string;
  description: string;
  onClick?: () => void;
}

export function ServiceRow({ index, title, description, onClick }: ServiceRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative block w-full border-b border-accent-bright/10 px-5 py-8 text-left transition-colors duration-300 hover:bg-foreground md:px-8 md:py-10"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6">
        <div>
          <span className="section-index text-sm transition-colors duration-300 group-hover:text-background">
            {index}
          </span>
          <h3 className="mt-1 text-3xl font-semibold text-foreground transition-colors duration-300 group-hover:text-background md:text-5xl">
            {title}
          </h3>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-background/70 md:text-base">
            {description}
          </p>
        </div>

        <ArrowUpRight
          className="size-7 shrink-0 -translate-x-2 text-accent-bright opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-background group-hover:opacity-100 md:size-9"
          aria-hidden="true"
        />
      </div>
    </button>
  );
}

export default ServiceRow;
