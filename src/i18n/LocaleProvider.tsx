"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bs } from "@/content/bs";
import { en, type Dict } from "@/content/site";

export type Locale = "bs" | "en";
const DICTS: Record<Locale, Dict> = { bs, en };
const KEY = "olio-lang";
const DEFAULT: Locale = "bs"; // bosanski je primarni jezik

// jezik se čuva u localStorage; useSyncExternalStore da server (bs) i browser ne budu u sukobu
const listeners = new Set<() => void>();
function read(): Locale {
  try {
    return localStorage.getItem(KEY) === "en" ? "en" : DEFAULT;
  } catch {
    return DEFAULT;
  }
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

type Ctx = { locale: Locale; setLocale: (l: Locale) => void; t: Dict };
const LocaleCtx = createContext<Ctx | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, read, () => DEFAULT);

  const setLocale = useCallback((l: Locale) => {
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* privatni prozor — jezik važi samo za ovu posjetu */
    }
    listeners.forEach((cb) => cb());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    // drugačija dužina teksta može pomjeriti pinovane sekcije → preračunaj
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t: DICTS[locale] }), [locale, setLocale]);
  return <LocaleCtx.Provider value={value}>{children}</LocaleCtx.Provider>;
}

export function useLocale() {
  const c = useContext(LocaleCtx);
  if (!c) throw new Error("useLocale must be used inside LocaleProvider");
  return c;
}

export const useT = () => useLocale().t;

/** BS / EN prekidač */
export function LangToggle({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  const { locale, setLocale, t } = useLocale();
  const on = dark ? "text-bone" : "text-olive-900";
  const off = dark ? "text-bone/45 hover:text-bone" : "text-mist hover:text-olive-900";
  return (
    <div role="group" aria-label={t.ui.language} className={`flex items-center gap-1.5 text-[12px] font-[600] tracking-[0.2em] ${className}`}>
      {(["bs", "en"] as const).map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i > 0 && <span className={dark ? "text-bone/30" : "text-mist/50"}>/</span>}
          <button type="button" aria-pressed={locale === l} onClick={() => setLocale(l)} className={`uppercase transition-colors ${locale === l ? on : off}`}>
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
