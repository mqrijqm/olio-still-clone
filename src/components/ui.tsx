"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { prefersReduced } from "@/lib/motion";

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
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReduced()) return;
      const split = SplitText.create(el, { type: type === "lines" ? "lines" : `words,${type}`, mask: type === "lines" ? "lines" : "words" });
      const targets = type === "chars" ? split.chars : type === "words" ? split.words : split.lines;
      gsap.from(targets, {
        yPercent: 110,
        duration: type === "lines" ? 1.1 : 0.9,
        ease: "expo.out",
        stagger: type === "chars" ? 0.018 : 0.06,
        scrollTrigger: { trigger: el, start, once: true },
      });
      return () => split.revert();
    },
    { scope: ref }
  );
  return (
    <Tag ref={ref as React.Ref<HTMLHeadingElement>} className={className} style={style}>
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
