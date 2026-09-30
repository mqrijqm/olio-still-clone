"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { Eyebrow, Ill, Reveal, ScrollHint, SplitReveal } from "@/components/ui";
import { story as storyEn } from "@/content/site";
import { useT } from "@/i18n/LocaleProvider";

import { prefersReduced } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const n = storyEn.chapters.length;

export function Story() {
  const { story, ui } = useT();
  const root = useRef<HTMLElement>(null);
  const pinEl = useRef<HTMLDivElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const lenis = useLenis();

  useGSAP(
    () => {
      if (prefersReduced()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const q = gsap.utils.selector(pinEl);
        const ind = q("[data-tl-ind]")[0] as HTMLElement | undefined;
        st.current = ScrollTrigger.create({
          trigger: pinEl.current,
          start: "top top",
          end: `+=${n * 90}%`,
          pin: true,
          onUpdate: (self) => {
            if (ind) gsap.set(ind, { scaleY: Math.max(0.02, self.progress) });
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

  // prelaz između poglavlja
  useGSAP(
    () => {
      if (prefersReduced() || !pinEl.current) return;
      const q = gsap.utils.selector(pinEl);
      gsap.fromTo(q("[data-ch-item]"), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.06, overwrite: true });
      gsap.fromTo(q("[data-ch-rule]"), { scaleX: 0 }, { scaleX: 1, transformOrigin: "0% 50%", duration: 0.9, ease: "power3.out", delay: 0.15, overwrite: true });
      gsap.fromTo(q("[data-ch-img]"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.out", overwrite: true });
      gsap.fromTo(q("[data-ch-img] img"), { scale: 1.15 }, { scale: 1, duration: 1.6, ease: "expo.out", overwrite: true });
      gsap.fromTo(q("[data-ch-num]"), { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 1.4, ease: "expo.out", overwrite: true });
    },
    { dependencies: [active], scope: root }
  );

  const goTo = (i: number) => {
    const s = st.current;
    if (s && lenis) lenis.scrollTo(s.start + (s.end - s.start) * ((i + 0.5) / n), { duration: 1.4 });
  };

  const ch = story.chapters[active];

  return (
    <section id="story" ref={root} className="relative w-full bg-bone">
      {/* uvod */}
      <div className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <Ill name="village" className="absolute left-1/2 -translate-x-1/2 bottom-[4vh] w-[min(1400px,120vw)] h-[34vh] opacity-[0.14]" color="#5c5f47" />
        <Eyebrow n={story.eyebrow[0]} label={story.eyebrow[1]} className="!tracking-[0.4em]" />
        <SplitReveal className="mt-8 font-display font-[300] leading-[1.02] tracking-[-0.025em] max-w-[18ch] md:max-w-none" style={{ fontSize: "clamp(44px, 6vw, 96px)" }}>
          {story.title}
        </SplitReveal>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-[52ch] text-[17px] md:text-[20px] leading-[1.65] text-olive-900/90">{story.body}</p>
        </Reveal>
        <ScrollHint className="mt-12" />
      </div>

      {/* poglavlja — desktop, pinovano */}
      <div ref={pinEl} className="relative h-[100svh] hidden md:block overflow-hidden">
        <div
          key={`num-${ch.year}`}
          data-ch-num
          aria-hidden="true"
          className="absolute left-[18%] top-1/2 -translate-y-1/2 font-wordmark font-[900] leading-none outline-num select-none"
          style={{ fontSize: "min(48vw, 78vh)", letterSpacing: "-0.06em" }}
        >
          {ch.year.slice(2)}
        </div>

        <div className="relative z-10 mx-auto max-w-[1440px] h-full grid grid-cols-[1fr_minmax(0,39%)_72px] gap-10 items-center px-[clamp(24px,7vw,140px)]" style={{ paddingTop: "var(--nav-h)" }}>
          <div key={ch.year} className="max-w-[640px]">
            <div data-ch-item className="text-[12px] tracking-[0.24em] uppercase text-mist">
              {ui.story.chapter} {String(active + 1).padStart(2, "0")} <span className="mx-1.5 text-mist/60">·</span> <span className="text-olive-900">{ch.year}</span>
            </div>
            <h3 data-ch-item className="mt-5 font-display font-[300] leading-[1.05] tracking-[-0.025em]" style={{ fontSize: "clamp(36px, 3.6vw, 60px)" }}>
              {ch.title}
            </h3>
            <div data-ch-rule className="mt-7 h-px w-[92px] bg-olive-900/60" />
            <p data-ch-item className="mt-8 text-[17px] leading-[1.75] text-olive-900/90 max-w-[52ch]">
              {ch.body}
            </p>
          </div>

          <figure className="relative">
            <div key={`img-${ch.year}`} data-ch-img className="relative aspect-[4/5] w-full overflow-hidden border border-olive-900/15 bg-bone-2" style={{ maxHeight: "calc(100svh - var(--nav-h) - 140px)" }}>
              <Image src={ch.img} alt={ch.fig} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
            </div>
            <figcaption className="mt-4 flex gap-3 text-[11px] tracking-[0.2em] uppercase text-mist leading-[1.7]">
              <span className="mt-[6px] w-[6px] h-[6px] shrink-0 bg-olive" />
              {ch.fig}
            </figcaption>
          </figure>

          {/* timeline */}
          <div className="relative self-center">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-olive-900/15" />
            <div data-tl-ind className="absolute left-0 top-0 bottom-0 w-px bg-olive-900 origin-top" style={{ transform: "scaleY(0.02)" }} />
            <ul className="pl-5 space-y-6">
              {story.chapters.map((c, i) => (
                <li key={c.year}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    className={`text-[13px] tracking-[0.18em] tabular-nums transition-colors ${i === active ? "text-olive-900" : "text-mist/70 hover:text-olive-900"}`}
                  >
                    {c.year}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* poglavlja — mobilni */}
      <div className="md:hidden px-6 pb-20 space-y-20">
        {story.chapters.map((c, i) => (
          <article key={c.year}>
            <div className="relative aspect-[4/5] overflow-hidden bg-bone-2">
              <Image src={c.img} alt={c.fig} fill sizes="100vw" className="object-cover" />
            </div>
            <p className="mt-3 text-[10px] tracking-[0.2em] uppercase text-mist">{c.fig}</p>
            <div className="mt-8 text-[12px] tracking-[0.24em] uppercase text-mist">
              {ui.story.chapter} {String(i + 1).padStart(2, "0")} · <span className="text-olive-900">{c.year}</span>
            </div>
            <h3 className="mt-4 font-display font-[300] text-[38px] leading-[1.05] tracking-[-0.02em]">{c.title}</h3>
            <div className="mt-6 h-px w-[72px] bg-olive-900/60" />
            <p className="mt-6 text-[16px] leading-[1.7] text-olive-900/90">{c.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
