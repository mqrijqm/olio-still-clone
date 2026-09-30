"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReduced } from "@/lib/motion";
import { useT } from "@/i18n/LocaleProvider";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const shots = [
  { src: "/images/detail/detail-cap.webp", cls: "md:col-span-4 aspect-square", speed: -8 },
  { src: "/images/detail/detail-pour.webp", cls: "md:col-span-8 aspect-[16/9]", speed: 6 },
  { src: "/images/detail/detail-label.webp", cls: "md:col-span-5 md:col-start-6 aspect-square", speed: -5 },
];

// Close-up detalji limenke — mala editorijalna galerija sa paralaksom
export function Details() {
  const { details } = useT();
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReduced()) return;
      gsap.utils.toArray<HTMLElement>("[data-par]").forEach((el) => {
        const s = Number(el.dataset.par);
        gsap.fromTo(el, { yPercent: -s }, { yPercent: s, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
        gsap.fromTo(el, { clipPath: "inset(18% 12% 18% 12%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%", end: "top 40%", scrub: 0.6 } });
      });
    },
    { scope: root }
  );
  return (
    <section ref={root} className="relative w-full bg-bone pb-28 md:pb-40">
      <div className="mx-auto max-w-[1440px] px-6 md:px-[clamp(24px,7vw,140px)] grid md:grid-cols-12 gap-x-8 gap-y-14 md:gap-y-24">
        {shots.map((s, i) => (
          <figure key={s.src} className={s.cls.split(" ").filter((c) => c.startsWith("md:col")).join(" ")}>
            <div data-clip className={`relative overflow-hidden bg-bone-2 ${s.cls.split(" ").filter((c) => c.startsWith("aspect")).join(" ")}`}>
              <div data-par={s.speed} className="absolute inset-[-10%]">
                <Image src={s.src} alt={details.figs[i]} fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover" />
              </div>
            </div>
            <figcaption className="mt-4 flex gap-3 text-[11px] tracking-[0.2em] uppercase text-mist">
              <span className="mt-[5px] w-[6px] h-[6px] shrink-0 bg-olive" />
              {details.figs[i]}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
