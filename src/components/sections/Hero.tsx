"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TinLazy, { type TinControl } from "@/components/webgl/TinLazy";
import { brand, heroSupport } from "@/content/site";
import { prefersReduced } from "@/lib/motion";
import { ScrollHint } from "@/components/ui";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ACCENT = "#b5ba92";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const circle = useRef<HTMLDivElement>(null);
  const control = useRef<TinControl>({ rotY: 0, spin: 0, float: 1, tiltX: 0 });
  // razrešava se kad je hero limenka spremna (teksture na GPU, shaderi kompajlirani)
  const [tinGate] = useState(() => {
    let resolve: () => void = () => {};
    const promise = new Promise<void>((r) => (resolve = r));
    return { promise, resolve };
  });

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const clip = circle.current!;
      const reduced = prefersReduced();
      const lens = q("[data-lens]")[0] as HTMLElement;
      const small = () => Math.min(window.innerHeight * 0.26, window.innerWidth * 0.42);
      const big = () => Math.hypot(window.innerWidth, window.innerHeight);
      const easeIn = gsap.parseEase("power2.in");
      // krug i sočivo zavise od DVA nezavisna napretka: intro (0→1) i skrol (0→1).
      // Tako se intro animacija i skrol-timeline nikad ne bore oko iste vrednosti.
      const st = { intro: 0, scroll: 0 };
      const render = () => {
        const r0 = st.intro * small();
        const k = easeIn(st.scroll);
        clip.style.clipPath = `circle(${r0 + (big() - r0) * k}px at 50% 48%)`;
        lens.style.opacity = String(st.intro * (1 - k));
        lens.style.transform = `translate(-50%, -50%) scale(${(0.6 + 0.4 * st.intro) * (1 + 5 * k)})`;
      };

      // 1) intro: slova ulaze, zatim se krug otvara
      const done = () => {
        (window as Window & { __olioIntroDone?: boolean }).__olioIntroDone = true;
        window.dispatchEvent(new Event("olio:intro-done"));
      };
      // intro je pauziran dok se teški posao (fontovi, 3D) ne završi — inače se takmiče za iste frejmove
      const intro = gsap.timeline({ paused: true, onComplete: done });
      intro
        // y: 0 poništava početni inline translateY(105%) koji GSAP inače pročita kao piksele
        .fromTo(q("[data-letter]"), { yPercent: 105, y: 0 }, { yPercent: 0, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.07 })
        .fromTo(q("[data-dot]"), { yPercent: 400, y: 0, opacity: 0 }, { yPercent: 0, y: 0, opacity: 1, duration: 1, ease: "expo.out" }, 0.35)
        .fromTo(q("[data-hero-foot]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 }, "-=0.7")
        .to(st, { intro: 1, duration: 1.2, ease: "expo.out", onUpdate: render }, "-=0.6");

      const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
      let cancelled = false;
      Promise.race([Promise.all([document.fonts?.ready ?? Promise.resolve(), tinGate.promise]), wait(2200)])
        .then(() => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))))
        .then(() => {
          if (!cancelled) intro.delay(0.1).play();
        });

      if (reduced) {
        intro.progress(1);
        return () => {
          cancelled = true;
        };
      }

      // 2) scroll: krug se širi preko celog ekrana, pa se pojavljuje tekst
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=120%",
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          // premotaj intro samo ako korisnik stvarno skroluje pre kraja (onEnter bi okinuo već na y=0)
          onUpdate: (self) => {
            if (self.progress > 0.01 && intro.progress() < 1) intro.progress(1);
          },
        },
      });
      tl.to(st, { scroll: 1, ease: "none", duration: 0.5, onUpdate: render }, 0)
        .to(q("[data-scroll-hint]"), { opacity: 0, duration: 0.1 }, 0)
        .to(q("[data-glow]"), { scale: 1.35, duration: 0.5 }, 0)
        .to(q("[data-tin-wrap]"), { scale: 1.09, xPercent: 6, duration: 0.5 }, 0.2)
        .from(q("[data-support-item]"), { opacity: 0, y: 26, stagger: 0.05, duration: 0.2 }, 0.48)
        .from(q("[data-support-rule]"), { scaleX: 0, transformOrigin: "0% 50%", duration: 0.2 }, 0.55)
        .to({}, { duration: 0.25 });

      const onResize = () => render();
      window.addEventListener("resize", onResize);
      tl.eventCallback("onUpdate", () => {
        control.current.rotY = tl.progress() * 0.9;
      });
      return () => {
        cancelled = true;
        window.removeEventListener("resize", onResize);
      };
    },
    { scope: root }
  );

  return (
    <>
      <section id="hero" ref={root} className="relative w-full h-[100svh] min-h-[560px] overflow-hidden bg-olive-900">
        {/* bone sloj sa wordmarkom (ispod kruga) */}
        <div className="absolute inset-0 z-10 bg-bone pointer-events-none flex flex-col">
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <h1
              className="font-wordmark font-[900] leading-[0.78] tracking-[-0.035em] whitespace-nowrap text-olive select-none"
              style={{ fontSize: "min(27vw, 58vh)" }}
            >
              <span className="sr-only">OLIO.</span>
              <span aria-hidden="true" className="inline-flex items-end overflow-hidden pb-[0.02em]">
                {"OLIO".split("").map((l, i) => (
                  <span key={i} data-letter className="inline-block" style={{ transform: "translateY(105%)" }}>
                    {l}
                  </span>
                ))}
                <span data-dot className="inline-block w-[0.2em] h-[0.2em] ml-[0.03em] mb-[0.005em]" style={{ backgroundColor: ACCENT, opacity: 0, transform: "translateY(400%)" }} />
              </span>
            </h1>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-[clamp(20px,4vw,64px)] pb-[clamp(20px,4vh,44px)]">
            <p data-hero-foot style={{ opacity: 0 }} className="font-display font-[300] text-olive-900 leading-[1.15] tracking-[-0.01em] text-[clamp(17px,1.5vw,24px)]">
              {brand.tagline[0]}
              <br />
              {brand.tagline[1]}
            </p>
            <div data-hero-foot style={{ opacity: 0 }} className="hidden sm:block">
              <div data-scroll-hint>
                <ScrollHint />
              </div>
            </div>
            <p data-hero-foot className="font-sans uppercase text-mist text-right" style={{ fontSize: 11, letterSpacing: "0.24em", lineHeight: 1.8, opacity: 0 }}>
              {brand.meta[0]}
              <br />
              {brand.meta[1]}
            </p>
          </div>
        </div>

        {/* tamni sloj otkriven kružnom maskom */}
        <div ref={circle} className="absolute inset-0 z-20 bg-olive-900" style={{ clipPath: "circle(0px at 50% 48%)" }}>
          <div
            data-glow
            aria-hidden="true"
            className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              width: "70vh",
              height: "70vh",
              background: `radial-gradient(circle, rgba(181,186,146,0.55) 0%, rgba(181,186,146,0.28) 30%, rgba(141,144,110,0.1) 55%, rgba(141,144,110,0) 72%)`,
            }}
          />
          <div data-tin-wrap className="absolute inset-0">
            <TinLazy control={control} index={0} onReady={tinGate.resolve} className="absolute inset-0" zoom={0.5} />
          </div>
          <div className="absolute inset-y-0 left-0 z-10 hidden md:flex flex-col justify-center pl-[clamp(24px,7vw,120px)] pointer-events-none" style={{ width: "min(100%, 36vw)" }}>
            <div data-support-item className="font-sans text-[12px] tracking-[0.2em] uppercase text-bone/60">
              <span className="text-bone">{heroSupport.eyebrow[0]}</span>
              <span className="mx-2 text-bone/40">/</span>
              {heroSupport.eyebrow[1]}
            </div>
            <h2 data-support-item className="mt-5 font-display font-[300] leading-[1.08] tracking-[-0.01em] text-bone" style={{ fontSize: "clamp(28px,2.8vw,44px)" }}>
              {heroSupport.title}
            </h2>
            <div data-support-rule className="mt-7 h-px w-[72px]" style={{ backgroundColor: ACCENT }} />
            <p data-support-item className="mt-7 text-[16px] leading-[1.65] text-bone/80 max-w-[42ch]">
              {heroSupport.body}
            </p>
            <div data-support-item className="mt-8 flex items-baseline gap-6 font-sans text-[13px] text-bone/60">
              {heroSupport.stats.map((s, i) => (
                <span key={s.unit} className="flex items-baseline gap-6">
                  {i > 0 && <span className="text-bone/40">·</span>}
                  <span>
                    <span className="font-display text-bone text-[17px] tabular-nums">{s.value}</span> {s.unit}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* "sočivo" prsten oko kruga */}
        <div
          data-lens
          aria-hidden="true"
          className="absolute left-1/2 top-[48%] z-30 pointer-events-none rounded-full"
          style={{
            width: "min(58vh, 72vw)",
            height: "min(58vh, 72vw)",
            background: "radial-gradient(circle, transparent 56%, rgba(47,49,36,0.12) 70%, transparent 84%)",
            opacity: 0,
            transform: "translate(-50%, -50%) scale(0.6)",
          }}
        />
      </section>
      <div id="hero-end" aria-hidden="true" />
    </>
  );
}
