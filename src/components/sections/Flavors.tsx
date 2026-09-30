"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import TinLazy, { type TinControl } from "@/components/webgl/TinLazy";
import { Eyebrow, Ill } from "@/components/ui";
import { products, type Product } from "@/content/site";
import { prefersReduced } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ILL = { "01": "branch", "02": "village", "03": "tree" } as const;

// Svedeno: veliki sans kod proizvoda + jedan kratak opis
function ProductText({ p, big = true }: { p: Product; big?: boolean }) {
  return (
    <div>
      <h3
        data-fl-name
        aria-label={`${p.code} ${p.name}`}
        className="font-wordmark font-[900] uppercase leading-[0.86] tracking-[-0.035em] text-olive-900 whitespace-nowrap"
        style={{ fontSize: big ? "clamp(56px, min(7.2vw, 14vh), 128px)" : "clamp(48px, 15vw, 84px)" }}
      >
        OLIO {p.id}
        <span aria-hidden="true" className="inline-block w-[0.16em] h-[0.16em] ml-[0.05em]" style={{ backgroundColor: p.accent }} />
      </h3>
      <p data-fl-item className="mt-8 text-[18px] md:text-[20px] leading-[1.55] text-olive-900/80 max-w-[34ch]">
        {p.desc}
      </p>
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

          <div className="flex-1 grid grid-cols-[minmax(0,43%)_1fr] gap-10 items-center min-h-0 pb-[clamp(16px,4vh,48px)]">
            <div key={p.id}>
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
              <TinLazy control={control} index={active} variants={[0, 1, 2]} afterIntro defer={200} className="absolute inset-0" zoom={0.82} />
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
