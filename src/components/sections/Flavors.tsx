"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import TinLazy, { type TinControl } from "@/components/webgl/TinLazy";
import { Eyebrow, Ill, SplitReveal } from "@/components/ui";
import { products, type Product } from "@/content/site";
import { prefersReduced } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ILL = { "01": "branch", "02": "village", "03": "tree" } as const;

function ProductText({ p, big = true }: { p: Product; big?: boolean }) {
  return (
    <div>
      <div data-fl-item className="flex items-center justify-between">
        <span className="font-wordmark font-[900] text-[17px] md:text-[19px] tracking-[-0.02em] text-olive-900">{p.code}</span>
        <span className="text-[11px] md:text-[12px] tracking-[0.2em] uppercase text-mist">{p.tag}</span>
      </div>
      <h3
        data-fl-name
        className="mt-3 font-display font-[300] leading-[0.95] tracking-[-0.035em] text-olive-900"
        style={{ fontSize: big ? "clamp(64px, min(9vw, 15vh), 136px)" : "clamp(56px, 16vw, 88px)" }}
      >
        {p.name}
        <span style={{ color: p.accent }}>.</span>
      </h3>
      <p data-fl-item className="mt-3 font-display italic text-[19px] md:text-[21px] text-mist">
        {p.notes}
      </p>
      <p data-fl-item className="mt-5 text-[16px] md:text-[17px] leading-[1.6] text-olive-900/90 max-w-[46ch]">
        {p.body}
      </p>
      <div data-fl-item className="mt-7 h-px w-[72px]" style={{ backgroundColor: p.accent }} />
      <ul className="mt-6 space-y-[6px] max-w-[480px]">
        {p.profile.map((r, i) => (
          <li data-fl-item key={r.label} className="flex items-baseline gap-4">
            <span className={`font-display tabular-nums text-[20px] w-[64px] ${i === 0 ? "text-olive-900" : "text-olive-900/70"}`}>{r.value}</span>
            <span className="text-[10px] tracking-[0.12em] uppercase text-mist w-[48px]">{r.unit}</span>
            <span className={`text-[15px] ${i === 0 ? "text-olive-900" : "text-olive-900/65"}`}>{r.label}</span>
            {i === 0 && <span className="ml-auto text-[11px] tracking-[0.2em] uppercase text-mist">Lead</span>}
          </li>
        ))}
      </ul>
      <div data-fl-item className="mt-5 pt-4 border-t border-olive-900/15 flex items-baseline justify-between max-w-[480px]">
        <span className="text-[11px] tracking-[0.2em] uppercase text-mist">{p.total.label}</span>
        <span>
          <span className="font-display text-[22px] tabular-nums">{p.total.value}</span>{" "}
          <span className="text-[11px] tracking-[0.14em] uppercase text-mist">{p.total.unit}</span>
        </span>
      </div>
    </div>
  );
}

export function Flavors() {
  const root = useRef<HTMLElement>(null);
  const pinEl = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const st = useRef<ScrollTrigger | null>(null);
  const control = useRef<TinControl>({ rotY: 0, spin: 0, float: 1, tiltX: 0 });
  const lenis = useLenis();

  // pin + mapiranje progresa na aktivni proizvod (samo desktop)
  useGSAP(
    () => {
      if (prefersReduced()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        st.current = ScrollTrigger.create({
          trigger: pinEl.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          onUpdate: (self) => {
            const i = Math.min(products.length - 1, Math.floor(self.progress * products.length * 0.999));
            control.current.rotY = self.progress * 0.8;
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

  // ulazna animacija teksta kad se promeni proizvod
  useGSAP(
    () => {
      if (!text.current || prefersReduced()) return;
      const q = gsap.utils.selector(text);
      gsap.fromTo(q("[data-fl-item]"), { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.035, overwrite: true });
      gsap.fromTo(q("[data-fl-name]"), { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: "expo.out", overwrite: true });
      gsap.fromTo(q("[data-fl-num]"), { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 1.2, ease: "expo.out", overwrite: true });
      gsap.fromTo(q("[data-fl-ill]"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.4, ease: "power3.out", overwrite: true });
    },
    { dependencies: [active], scope: root }
  );

  const goTo = (i: number) => {
    const s = st.current;
    if (!s || !lenis) return;
    lenis.scrollTo(s.start + (s.end - s.start) * ((i + 0.5) / products.length), { duration: 1.4 });
  };

  const p = products[active];

  return (
    <section id="harvests" ref={root} className="relative w-full bg-bone overflow-hidden">
      {/* ---------- desktop: pinovano ---------- */}
      <div ref={pinEl} className="relative h-[100svh] hidden md:flex flex-col">
        {products.map((pr, i) => (
          <div
            key={pr.id}
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
            style={{
              opacity: i === active ? 1 : 0,
              background: `radial-gradient(72% 85% at 66% 52%, ${pr.accent}40 0%, ${pr.accent}18 42%, transparent 72%)`,
            }}
          />
        ))}
        <div ref={text} className="relative z-10 mx-auto w-full max-w-[1440px] h-full flex flex-col px-[clamp(24px,6vw,120px)]" style={{ paddingTop: "calc(var(--nav-h) + clamp(12px, 3vh, 40px))" }}>
          <div className="flex items-baseline justify-between gap-6 mb-3">
            <Eyebrow n="02" label="Three harvests" />
            <div className="text-[12px] tracking-[0.2em] uppercase text-mist tabular-nums">
              {active + 1} / {products.length}
            </div>
          </div>
          <SplitReveal className="font-display font-[300] leading-[1] tracking-[-0.02em] text-olive-900 whitespace-nowrap" style={{ fontSize: "clamp(32px, min(4.6vw, 6.5vh), 64px)" }}>
            Three pressings.
          </SplitReveal>

          <div className="flex-1 grid grid-cols-[minmax(0,43%)_1fr] gap-10 items-center min-h-0 pb-[clamp(16px,4vh,48px)]">
            <div key={p.id} className="max-w-[560px]">
              <ProductText p={p} />
            </div>

            <div className="relative h-full min-h-[380px]">
              {/* ilustracija sa etikete proizvoda, bledo u pozadini */}
              <div key={`ill-${p.id}`} data-fl-ill className="absolute left-[8%] right-[-4%] bottom-[4%] h-[46%]">
                <Ill name={ILL[p.id]} className="absolute inset-0" color="rgba(92,95,71,0.16)" />
              </div>
              <div
                key={`n-${p.id}`}
                data-fl-num
                aria-hidden="true"
                className="absolute right-0 top-1/2 -translate-y-1/2 font-wordmark font-[900] leading-none outline-num select-none"
                style={{ fontSize: "min(30vw, 62vh)", letterSpacing: "-0.06em" }}
              >
                {p.id}
              </div>
              <div aria-hidden="true" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-olive-900/10" style={{ width: "min(44vh, 30vw)", height: "min(44vh, 30vw)" }} />
              <TinLazy control={control} index={active} className="absolute inset-0" zoom={0.92} />
            </div>
          </div>
        </div>

        <div className="absolute right-[clamp(24px,6vw,120px)] bottom-[clamp(16px,3.5vh,40px)] z-20 flex gap-6">
          {products.map((pr, i) => (
            <button
              key={pr.id}
              type="button"
              onClick={() => goTo(i)}
              className={`text-[13px] tracking-[0.2em] tabular-nums transition-colors ${i === active ? "text-olive-900" : "text-mist/70 hover:text-olive-900"}`}
              aria-label={`Show ${pr.code} ${pr.name}`}
            >
              {pr.id}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- mobilni: složeno jedno ispod drugog, PNG umesto 3D ---------- */}
      <div className="md:hidden px-6 pt-24 pb-10">
        <Eyebrow n="02" label="Three harvests" />
        <SplitReveal className="mt-3 font-display font-[300] leading-[1] tracking-[-0.02em] text-[40px]">Three pressings.</SplitReveal>
        {products.map((pr) => (
          <article key={pr.id} className="relative mt-14">
            <div className="relative aspect-[4/5] -mx-6 overflow-hidden" style={{ background: `radial-gradient(60% 60% at 50% 50%, ${pr.accent}55, transparent 75%)` }}>
              <div aria-hidden="true" className="absolute right-2 top-1/2 -translate-y-1/2 font-wordmark font-[900] leading-none outline-num" style={{ fontSize: "70vw" }}>
                {pr.id}
              </div>
              <Image src={pr.tin} alt={`${pr.code} ${pr.name} tin`} fill sizes="100vw" className="object-contain mix-blend-multiply scale-[0.85]" />
            </div>
            <div className="mt-6">
              <ProductText p={pr} big={false} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
