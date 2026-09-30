"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Prsten 36px sa mix-blend difference, prati miš sa blagim kašnjenjem i raste nad interaktivnim elementima.
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const html = document.documentElement;
    html.classList.add("has-custom-cursor");
    const r = ring.current!;
    const d = dot.current!;
    const xr = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3.out" });
    const yr = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3.out" });
    const xd = gsap.quickTo(d, "x", { duration: 0.08 });
    const yd = gsap.quickTo(d, "y", { duration: 0.08 });

    const move = (e: PointerEvent) => {
      xr(e.clientX); yr(e.clientY); xd(e.clientX); yd(e.clientY);
      gsap.to([r, d], { opacity: 1, duration: 0.3, overwrite: "auto" });
      const t = e.target as HTMLElement;
      const hot = !!t.closest("a, button, [role=tab], input, label");
      gsap.to(r, { scale: hot ? 1.7 : 1, backgroundColor: hot ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0)", duration: 0.35, overwrite: "auto" });
      gsap.to(d, { scale: hot ? 0 : 1, duration: 0.25, overwrite: "auto" });
    };
    const leave = () => gsap.to([r, d], { opacity: 0, duration: 0.3 });
    const down = () => gsap.to(r, { scale: 0.8, duration: 0.2 });
    const up = () => gsap.to(r, { scale: 1, duration: 0.3 });

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      html.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-0 z-[200] pointer-events-none">
      <div
        ref={ring}
        className="absolute top-0 left-0 rounded-full border"
        style={{ width: 36, height: 36, marginLeft: -18, marginTop: -18, borderColor: "rgba(255,255,255,0.6)", mixBlendMode: "difference", opacity: 0, transform: "translate(-100px,-100px)" }}
      />
      <div
        ref={dot}
        className="absolute top-0 left-0 rounded-full bg-white"
        style={{ width: 4, height: 4, marginLeft: -2, marginTop: -2, mixBlendMode: "difference", opacity: 0, transform: "translate(-100px,-100px)" }}
      />
    </div>
  );
}
