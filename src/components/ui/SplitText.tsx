import type { CSSProperties } from "react";

export interface SplitTextProps {
  text: string;
  rangeStart?: number;
  rangeEnd?: number;
  overlap?: number;
  className?: string;
  wordClassName?: (word: string) => string | undefined;
}

export function SplitText({
  text,
  rangeStart = 0,
  rangeEnd = 100,
  overlap = 1.8,
  className = "",
  wordClassName,
}: SplitTextProps) {
  const words = text.split(" ");

  const totalChars = text.length;
  const span = rangeEnd - rangeStart;
  const slot = span / totalChars;

  let charIndex = 0;

  return (
    <span className={className}>
      {words.map((word, wi) => {
        const chars = word.split("");
        const wordSpan = (
          <span
            key={wi}
            className={`inline-block whitespace-nowrap ${wordClassName?.(word) ?? ""}`}
          >
            {chars.map((char, ci) => {
              const start = rangeStart + slot * charIndex;
              const end = Math.min(rangeEnd, start + slot * overlap);
              charIndex += 1;
              return (
                <span
                  key={ci}
                  className="reveal-word"
                  style={{ animationRange: `cover ${start}% cover ${end}%` } as CSSProperties}
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
        if (wi < words.length - 1) {
          const start = rangeStart + slot * charIndex;
          const end = Math.min(rangeEnd, start + slot * overlap);
          charIndex += 1;
          return (
            <span key={`${wi}-pair`}>
              {wordSpan}
              <span
                className="reveal-word"
                style={{ animationRange: `cover ${start}% cover ${end}%` } as CSSProperties}
              >
                {" "}
              </span>
            </span>
          );
        }
        return wordSpan;
      })}
    </span>
  );
}

export default SplitText;
