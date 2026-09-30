"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { prefersReduced } from "@/lib/motion";
import { useLocale, useT } from "@/i18n/LocaleProvider";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/** "02 / Three harvests" oznaka sekcije */
export function Eyebrow({
  n,
  label,
  sep = "/",
  className = "",
  dark = false,
}: {
  n: string;
  label: string;
  sep?: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={`font-sans text-[12px] tracking-[0.2em] uppercase ${dark ? "text-bone/60" : "text-mist"} ${className}`}>
      <span className={dark ? "text-bone" : "text-olive-900"}>{n}</span>
      <span className={`mx-2 ${dark ? "text-bone/40" : "text-mist/50"}`}>{sep}</span>
      {label}
    </div>
  );
}

/** Naslov koji se otkriva slovo po slovo kad uđe u ekran (kao u referenci) */
export function SplitReveal({
  as: Tag = "h2",
  children,
  className = "",
  style,
  type = "chars",
  start = "top 85%",
}: {
  as?: "h1" | "h2" | "h3" | "p" | "div";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  type?: "chars" | "words" | "lines";
  start?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { locale } = useLocale();
  // SplitText menja DOM naslova; pri promeni jezika naslov se ponovo montira (key) bez animacije
  const [firstLocale] = useState(locale);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReduced() || locale !== firstLocale) return;
      // split + tween se prave tek kad naslov uđe u ekran — ne sve odjednom na loadu
      let split: SplitText | null = null;
      const st = ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () => {
          split = SplitText.create(el, { type: type === "lines" ? "lines" : `words,${type}`, mask: type === "lines" ? "lines" : "words" });
          const targets = type === "chars" ? split.chars : type === "words" ? split.words : split.lines;
          gsap.from(targets, { yPercent: 110, duration: type === "lines" ? 1.1 : 0.9, ease: "expo.out", stagger: type === "chars" ? 0.018 : 0.06 });
        },
      });
      return () => {
        st.kill();
        split?.revert();
      };
    },
    { scope: ref, dependencies: [locale] }
  );
  return (
    <Tag key={locale} ref={ref as React.Ref<HTMLHeadingElement>} className={className} style={style}>
      {children}
    </Tag>
  );
}

/** Blok koji isplovi (fade + pomeraj) kad uđe u ekran */
export function Reveal({ children, className = "", delay = 0, y = 24 }: { children: React.ReactNode; className?: string; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!ref.current || prefersReduced()) return;
      gsap.from(ref.current, {
        y,
        opacity: 0,
        duration: 1,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
      });
    },
    { scope: ref }
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Ilustracija sa OLIO etikete (Codex crtež → potrace SVG).
 * Koristi se kao CSS maska pa boja dolazi iz `color` (currentColor) — bilo koja maslinasta nijansa.
 */
export function Ill({
  name,
  className = "",
  color = "currentColor",
  style,
}: {
  name: "branch" | "olives" | "tree" | "village";
  className?: string;
  color?: string;
  style?: React.CSSProperties;
}) {
  const url = `url(/illustrations/ill-${name}.svg)`;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      style={{
        backgroundColor: color,
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        ...style,
      }}
    />
  );
}

/**
 * Scroll indikator u obliku masline: kontura masline sa peteljkom i listićem,
 * unutra tačka koja klizi nadole; "Scroll" ispod.
 */
export function ScrollHint({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  const t = useT();
  const line = dark ? "rgba(239,237,230,0.45)" : "rgba(47,49,36,0.38)";
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`} aria-hidden="true">
      <svg width="30" height="50" viewBox="0 0 30 50" fill="none" stroke={line} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="overflow-visible">
        {/* peteljka i list */}
        <path d="M15 12 C15.4 8.6 16.6 5.6 18.6 3" />
        <path d="M17.4 5.2 C20.6 3.4 24.4 3.2 27.4 4.6 C24.6 7.2 20.8 7.6 17.4 5.2 Z" />
        {/* plod masline, blago asimetričan */}
        <path d="M15 12.2 C8.6 12.4 5.2 19.6 5.4 28.4 C5.6 38.2 9.6 45.6 15.2 45.6 C21 45.6 24.8 38.4 24.6 28.6 C24.4 19.4 21.2 12 15 12.2 Z" />
        <circle className="olive-dot" cx="15" cy="21" r="2.2" fill="#b5ba92" stroke="none" />
      </svg>
      <span className={`font-sans text-[11px] uppercase tracking-[0.28em] ${dark ? "text-bone/55" : "text-mist"}`}>{t.ui.scroll}</span>
    </div>
  );
}
