"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import TinLazy, { type TinControl } from "@/components/webgl/TinLazy";
import { Icon } from "@/components/Icon";
import { Ill } from "@/components/ui";
import { inside } from "@/content/site";
import { prefersReduced } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const GLOWS = ["141,144,110", "201,179,94", "181,186,146", "220,201,160"];
const n = inside.items.length;

export function Inside() {
  const root = useRef<HTMLElement>(null);
  const detail = useRef<HTMLDivElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const control = useRef<TinControl>({ rotY: 0, spin: 0, float: 1, tiltX: 0 });
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      if (prefersReduced()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        st.current = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: `+=${n * 100}%`,
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => {
            // limenka se okreće kroz sve četiri strane dok skroluješ
            control.current.rotY = self.progress * Math.PI * 2;
            const i = Math.min(n - 1, Math.floor(self.progress * n * 0.999));
            if (i !== activeRef.current) {
              activeRef.current = i;
              setActive(i);
            }
          },
        });
        return () => st.current?.kill();
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  // promena stavke: tekst ulazi, broj broji, traka se puni
  useGSAP(
    () => {
      const it = inside.items[active];
      if (counter.current) {
        const o = { v: 0 };
        gsap.to(o, { v: it.value, duration: 1.1, ease: "power3.out", onUpdate: () => counter.current && (counter.current.textContent = Math.round(o.v).toLocaleString("en")) });
      }
      if (bar.current) gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: it.value / it.max, duration: 1.1, ease: "power3.out" });
      if (!detail.current || prefersReduced()) return;
      const q = gsap.utils.selector(root);
      gsap.fromTo(q("[data-in-item]"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.05, overwrite: true });
      gsap.fromTo(q("[data-in-name]"), { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: "expo.out", overwrite: true });
    },
    { dependencies: [active], scope: root }
  );

  const pick = (i: number) => {
    const s = st.current;
    if (s && lenis) lenis.scrollTo(s.start + (s.end - s.start) * ((i + 0.5) / n), { duration: 1.2 });
    else setActive(i);
  };

  const it = inside.items[active];

  return (
    <section id="inside" ref={root} className="relative w-full bg-olive-900 text-bone overflow-hidden md:h-[100svh] flex flex-col pt-24 pb-10 md:pt-[calc(var(--nav-h)+20px)] md:pb-6">
      {/* glow po stavci */}
      {GLOWS.map((g, i) => (
        <div
          key={g}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
          style={{ opacity: i === active ? 1 : 0, background: `radial-gradient(45% 55% at 50% 55%, rgba(${g},0.22) 0%, rgba(${g},0.06) 45%, transparent 70%)` }}
        />
      ))}
      {/* ilustracija masline, krem na tamnom */}
      <Ill name="olives" className="absolute -left-[4vw] bottom-[-6vh] w-[34vw] h-[34vw] opacity-[0.06] hidden md:block" color="#efede6" />
      <Ill name="branch" className="absolute -right-[6vw] top-[8vh] w-[30vw] h-[30vw] opacity-[0.05] rotate-[160deg] hidden md:block" color="#efede6" />

      <div className="relative z-10 text-center px-5">
        <div className="text-[12px] tracking-[0.4em] uppercase text-bone/60">
          <span className="text-bone">{inside.eyebrow[0]}</span>
          <span className="mx-3 text-bone/30">·</span>
          {inside.eyebrow[1]}
        </div>
        <h2 className="mt-3 font-display italic font-[400] tracking-[-0.03em] leading-none" style={{ fontSize: "clamp(52px, min(6vw, 9vh), 88px)" }}>
          {inside.title}
        </h2>
        <div role="tablist" aria-label="Inside the tin" className="mt-6 md:mt-8 flex gap-3 md:gap-4 justify-start md:justify-center overflow-x-auto no-scrollbar -mx-5 px-5">
          {inside.items.map((x, i) => (
            <button
              key={x.tab}
              role="tab"
              aria-selected={i === active}
              onClick={() => pick(i)}
              className={`shrink-0 h-[46px] md:h-[52px] px-6 md:px-8 rounded-full border text-[12px] md:text-[13px] font-[600] tracking-[0.3em] uppercase transition-colors duration-300 ${
                i === active ? "bg-bone text-olive-900 border-bone" : "border-bone/25 text-bone/70 hover:border-bone/60 hover:text-bone"
              }`}
            >
              {x.tab}
            </button>
          ))}
        </div>
      </div>

      <div ref={detail} className="relative z-10 flex-1 min-h-0 mx-auto w-full max-w-[1440px] px-6 md:px-[clamp(24px,4vw,64px)] grid md:grid-cols-[1fr_1.1fr_1fr] items-center gap-8 md:gap-6 mt-8 md:mt-0">
        <div className="order-2 md:order-1">
          <h3 data-in-name className="font-wordmark font-[900] uppercase leading-[0.9] tracking-[-0.02em]" style={{ fontSize: "clamp(34px, 3.2vw, 56px)" }}>
            {it.name}
          </h3>
          <div data-in-item className="mt-7 flex items-center gap-6 text-bone/75">
            <Icon name={it.icon} size={56} strokeWidth={1.1} />
            <span className="font-display italic text-[22px] md:text-[24px]">{it.latin}</span>
          </div>
        </div>

        <div className="order-1 md:order-2 relative h-[46vh] md:h-full min-h-[300px]">
          <TinLazy control={control} index={0} variants={[0]} afterIntro defer={1200} className="absolute inset-0" zoom={0.8} />
        </div>

        <div className="order-3">
          <div data-in-item className="text-[13px] tracking-[0.3em] text-bone/55 tabular-nums">
            {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </div>
          <p data-in-item className="mt-5 text-[18px] md:text-[20px] leading-[1.55] text-bone/95 max-w-[40ch]">
            {it.body}
          </p>
          <dl className="mt-8">
            {[
              ["Source", it.source],
              ["Role", it.role],
            ].map(([k, v]) => (
              <div data-in-item key={k} className="flex items-baseline justify-between py-5 border-t border-bone/15">
                <dt className="text-[12px] tracking-[0.2em] uppercase text-bone/55">{k}</dt>
                <dd className="text-[16px]">{v}</dd>
              </div>
            ))}
            <div data-in-item className="relative flex items-baseline justify-between py-5 border-y border-bone/15">
              <dt className="text-[12px] tracking-[0.2em] uppercase text-bone/55">Level</dt>
              <dd>
                <span ref={counter} className="font-display text-[24px] tabular-nums">
                  {it.value}
                </span>{" "}
                <span className="text-[12px] tracking-[0.16em] uppercase text-bone/55">{it.unit}</span>
              </dd>
              <div ref={bar} className="absolute left-0 -bottom-px h-[2px] w-full bg-olive-300 origin-left" style={{ transform: `scaleX(${it.value / it.max})` }} />
            </div>
          </dl>
        </div>
      </div>

      <p className="relative z-10 mt-8 md:mt-2 text-center px-6 text-[12px] md:text-[15px] font-[600] tracking-[0.42em] uppercase text-bone/55">{inside.footer}</p>
    </section>
  );
}
