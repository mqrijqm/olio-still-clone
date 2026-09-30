"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LangToggle, useT } from "@/i18n/LocaleProvider";
import { useCart } from "./cart/CartProvider";
import { Icon } from "./Icon";

export function Logo({ className = "", dot = "#8d906e" }: { className?: string; dot?: string }) {
  return (
    <span className={`font-wordmark font-[900] tracking-[-0.03em] leading-none inline-flex items-baseline ${className}`}>
      OLIO
      <span aria-hidden="true" className="inline-block w-[0.26em] h-[0.26em] ml-[0.06em]" style={{ backgroundColor: dot }} />
    </span>
  );
}

export function Nav() {
  const t = useT();
  const nav = t.nav;
  const lenis = useLenis();
  const { count, setOpen } = useCart();
  const [visible, setVisible] = useState(false);
  const [menu, setMenu] = useState(false);

  // Nav se pojavljuje tek kad hero prođe (kao u referenci)
  useEffect(() => {
    // ScrollTrigger umesto scroll listenera: bez merenja layouta na svakom frejmu
    const st = ScrollTrigger.create({
      trigger: "#hero-end",
      start: "top top+=1",
      onToggle: (self) => setVisible(self.isActive),
      endTrigger: "html",
      refreshPriority: -1, // računa se posle pinova koji su iznad njega
      end: "bottom bottom",
    });
    return () => st.kill();
  }, []);

  const go = (href: string) => {
    setMenu(false);
    const el = document.querySelector(href) as HTMLElement | null;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { duration: 1.6 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-[transform,background-color] duration-[400ms] ease-out"
        style={{
          height: "var(--nav-h)",
          transform: visible || menu ? "translateY(0)" : "translateY(-100%)",
          backgroundColor: "rgba(239,237,230,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(133,131,111,0.4)",
        }}
      >
        <div className="mx-auto h-full max-w-[1440px] flex items-center px-5 md:px-8">
          <div className="flex-1">
            <a href="#top" onClick={(e) => { e.preventDefault(); lenis?.scrollTo(0, { duration: 1.8 }); }} aria-label="OLIO home" className="text-olive-900">
              <Logo className="text-[26px]" />
            </a>
          </div>
          <ul className="hidden md:flex items-center gap-11">
            {nav.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  onClick={(e) => { e.preventDefault(); go(n.href); }}
                  className="group relative text-[15px] tracking-[0.02em] text-olive-900/70 hover:text-olive-900 transition-colors"
                >
                  {n.label}
                  <span className="absolute left-0 -bottom-1 h-px w-full bg-olive origin-right scale-x-0 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
          <div className="flex-1 flex items-center justify-end gap-6 md:gap-8">
            <LangToggle className="hidden md:flex" />
            <a
              href="#shop"
              onClick={(e) => { e.preventDefault(); go("#shop"); }}
              className="hidden md:inline-flex items-center gap-1.5 text-[15px] font-[600] text-olive-900 group"
            >
              {t.ui.shop}
              <Icon name="arrow" size={18} strokeWidth={2.2} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <button type="button" onClick={() => setOpen(true)} className="relative text-olive-900" aria-label={`${t.ui.openCart}, ${count} ${t.ui.items}`}>
              <Icon name="cart" size={28} strokeWidth={1.8} />
              {count > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[17px] h-[17px] px-1 rounded-full bg-olive text-bone text-[10px] font-[600] flex items-center justify-center tabular-nums">
                  {count}
                </span>
              )}
            </button>
            <button type="button" className="md:hidden w-8 h-8 flex flex-col justify-center gap-[6px]" aria-label={t.ui.openMenu} onClick={() => setMenu(true)}>
              <span className="block h-px w-6 bg-olive-900" />
              <span className="block h-px w-6 bg-olive-900" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobilni meni */}
      <div
        className="fixed inset-0 z-[60] bg-bone transition-opacity duration-300 flex flex-col"
        style={{ opacity: menu ? 1 : 0, pointerEvents: menu ? "auto" : "none" }}
        aria-hidden={!menu}
      >
        <button type="button" className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center text-olive-900" aria-label={t.ui.closeMenu} onClick={() => setMenu(false)}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 5 L19 19 M19 5 L5 19" />
          </svg>
        </button>
        <ul className="flex-1 flex flex-col justify-center gap-4 px-8">
          {[...nav, { label: t.ui.shop, href: "#shop" }].map((n, i) => (
            <li key={n.href} className="overflow-hidden">
              <a
                href={n.href}
                onClick={(e) => { e.preventDefault(); go(n.href); }}
                className="block font-display font-[300] text-[48px] leading-[1.1] tracking-[-0.02em] text-olive-900 transition-transform duration-500"
                style={{ transform: menu ? "translateY(0)" : "translateY(100%)", transitionDelay: `${menu ? 80 + i * 60 : 0}ms` }}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="px-8 pb-10 flex items-center justify-between">
          <p className="text-[11px] tracking-[0.24em] uppercase text-mist">{t.ui.pressedIn}</p>
          <LangToggle />
        </div>
      </div>
    </>
  );
}
