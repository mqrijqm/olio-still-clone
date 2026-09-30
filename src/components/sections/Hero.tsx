"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TinLazy, { type TinControl } from "@/components/webgl/TinLazy";
import { brand, heroSupport } from "@/content/site";
import { prefersReduced } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ACCENT = "#b5ba92";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const circle = useRef<HTMLDivElement>(null);
  const control = useRef<TinControl>({ rotY: 0, spin: 0, float: 1, tiltX: 0 });

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const clip = circle.current!;
      const reduced = prefersReduced();
      const state = { r: 0 }; // poluprečnik kruga u px
      const setClip = () => (clip.style.clipPath = `circle(${state.r}px at 50% 48%)`);
      const small = () => Math.min(window.innerHeight * 0.26, window.innerWidth * 0.42);
      const big = () => Math.hypot(window.innerWidth, window.innerHeight);

      // 1) intro: slova ulaze, zatim se krug otvara
      const intro = gsap.timeline({ delay: 0.2 });
      intro
        .from(q("[data-letter]"), { yPercent: 105, duration: 1.2, ease: "expo.out", stagger: 0.07 })
        .from(q("[data-hero-foot]"), { opacity: 0, y: 12, duration: 0.8, ease: "power3.out", stagger: 0.08 }, "-=0.7")
        .to(state, { r: small(), duration: 1.2, ease: "expo.out", onUpdate: setClip }, "-=0.6")
        .fromTo(q("[data-lens]"), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 1.2, ease: "expo.out" }, "<");

      if (reduced) {
        intro.progress(1);
        return;
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
          onEnter: () => intro.progress(1),
        },
      });
      tl.fromTo(state, { r: () => small() }, { r: () => big(), ease: "power2.in", duration: 0.5, onUpdate: setClip, immediateRender: false })
        .to(q("[data-lens]"), { scale: 6, opacity: 0, ease: "power2.in", duration: 0.5 }, 0)
        .to(q("[data-scroll-hint]"), { opacity: 0, duration: 0.1 }, 0)
        .to(q("[data-glow]"), { scale: 1.35, duration: 0.5 }, 0)
        .to(q("[data-tin-wrap]"), { scale: 1.09, xPercent: 6, duration: 0.5 }, 0.2)
        .from(q("[data-support-item]"), { opacity: 0, y: 26, stagger: 0.05, duration: 0.2 }, 0.48)
        .from(q("[data-support-rule]"), { scaleX: 0, transformOrigin: "0% 50%", duration: 0.2 }, 0.55)
        .to({}, { duration: 0.25 });

      tl.eventCallback("onUpdate", () => {
        control.current.rotY = tl.progress() * 0.9;
      });
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
                  <span key={i} data-letter className="inline-block">
                    {l}
                  </span>
                ))}
                <span data-letter className="inline-block w-[0.2em] h-[0.2em] ml-[0.03em] mb-[0.005em]" style={{ backgroundColor: ACCENT }} />
              </span>
            </h1>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-[clamp(20px,4vw,64px)] pb-[clamp(20px,4vh,44px)]">
            <p data-hero-foot className="font-display font-[300] text-olive-900 leading-[1.15] tracking-[-0.01em]" style={{ fontSize: "clamp(17px,1.5vw,24px)" }}>
              {brand.tagline[0]}
              <br />
              {brand.tagline[1]}
            </p>
            <div data-hero-foot className="hidden sm:block">
              <div data-scroll-hint className="flex flex-col items-center gap-3" aria-hidden="true">
                <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-mist">Scroll</span>
                <span className="relative block" style={{ width: 22, height: 38, border: "1px solid rgba(47,49,36,0.3)", borderRadius: 11 }}>
                  <span className="absolute left-1/2 -translate-x-1/2 top-[7px] w-[5px] h-[5px] animate-[scrolldot_1.8s_ease-in-out_infinite]" style={{ backgroundColor: ACCENT }} />
                </span>
              </div>
            </div>
            <p data-hero-foot className="font-sans uppercase text-mist text-right" style={{ fontSize: 11, letterSpacing: "0.24em", lineHeight: 1.8 }}>
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
              filter: "blur(8px)",
            }}
          />
          <div data-tin-wrap className="absolute inset-0">
            <TinLazy control={control} index={0} className="absolute inset-0" zoom={0.5} />
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
          className="absolute left-1/2 top-[48%] z-30 pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2 opacity-0"
          style={{
            width: "min(58vh, 72vw)",
            height: "min(58vh, 72vw)",
            background: "radial-gradient(circle, transparent 56%, rgba(47,49,36,0.12) 70%, transparent 84%)",
          }}
        />
      </section>
      <div id="hero-end" aria-hidden="true" />
    </>
  );
}
