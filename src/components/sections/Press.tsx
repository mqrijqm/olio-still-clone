"use client";

import { Eyebrow, Ill, Reveal, SplitReveal } from "@/components/ui";
import { useT } from "@/i18n/LocaleProvider";

function Row({ dim = false, dir = "l" }: { dim?: boolean; dir?: "l" | "r" }) {
  const { press } = useT();
  const names = [...press.names, ...press.names];
  return (
    <div className="overflow-hidden">
      <div className={`flex w-max ${dir === "l" ? "marquee-l" : "marquee-r"}`}>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0" aria-hidden={k === 1}>
            {names.map((n, i) => (
              <span
                key={`${k}-${i}`}
                className={`font-display whitespace-nowrap px-[clamp(16px,2.2vw,32px)] leading-[1.25] ${dim ? "text-bone/25" : "text-bone"}`}
                style={{ fontSize: "clamp(28px, 3vw, 44px)" }}
              >
                {n}
                <span className="ml-[clamp(16px,2.2vw,32px)] text-bone/40">·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Press() {
  const { press } = useT();
  return (
    <section id="press" className="relative w-full bg-olive-900 text-bone overflow-hidden pt-24 md:pt-[140px]">
      <Ill name="tree" className="absolute right-[-6vw] top-[-4vw] w-[44vw] h-[44vw] opacity-[0.05] hidden md:block" color="#efede6" />
      <div className="relative mx-auto max-w-[1440px] px-6 md:px-[clamp(24px,7vw,140px)]">
        <Eyebrow n={press.eyebrow[0]} label={press.eyebrow[1]} dark />
        <SplitReveal className="mt-5 font-wordmark font-[900] uppercase tracking-[-0.02em] leading-[0.95]" style={{ fontSize: "clamp(40px, 4.4vw, 72px)" }}>
          {press.title}
        </SplitReveal>
        <div className="mt-14 md:mt-16 grid md:grid-cols-3 gap-12 md:gap-10">
          {press.quotes.map((q, i) => (
            <Reveal key={q.source} delay={i * 0.1}>
              <blockquote>
                <p className="font-display italic text-[21px] md:text-[23px] leading-[1.35] text-bone/95">“{q.text}”</p>
                <footer className="mt-5 text-[11px] tracking-[0.24em] uppercase text-bone/50">{q.source}</footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
      <div className="relative mt-20 md:mt-24 border-t border-bone/12 py-8 md:py-10 space-y-2">
        <Row />
        <Row dim dir="r" />
      </div>
    </section>
  );
}
