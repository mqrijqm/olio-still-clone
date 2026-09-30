"use client";

import { useState } from "react";
import { useLenis } from "lenis/react";
import { Logo } from "@/components/Nav";
import { Ill, SplitReveal } from "@/components/ui";
import { footer, newsletter } from "@/content/site";

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const lenis = useLenis();

  const go = (href: string) => {
    if (href === "#") return;
    const el = document.querySelector(href) as HTMLElement | null;
    if (el) lenis?.scrollTo(el, { duration: 1.6 });
  };

  return (
    <footer className="relative w-full bg-bone overflow-hidden border-t border-olive-900/10">
      <Ill name="tree" className="absolute right-[-8vw] bottom-[-6vw] w-[42vw] h-[42vw] opacity-[0.07] hidden md:block" color="#5c5f47" />
      <div className="relative mx-auto max-w-[1440px] px-6 md:px-[clamp(24px,6vw,120px)] pt-24 md:pt-[160px]">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-end pb-20 md:pb-24 border-b border-olive-900/15">
          <div>
            <p className="text-[12px] tracking-[0.24em] uppercase text-mist">{newsletter.eyebrow}</p>
            <SplitReveal type="words" className="mt-6 font-display font-[300] leading-[1.02] tracking-[-0.025em]" style={{ fontSize: "clamp(40px, 4.6vw, 72px)" }}>
              {newsletter.title}
            </SplitReveal>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) setDone(true);
            }}
            className="w-full"
          >
            <label htmlFor="nl-email" className="sr-only">
              Email address
            </label>
            <div className="flex items-end gap-6 border-b border-olive-900/40 pb-4 focus-within:border-olive-900 transition-colors">
              <input
                id="nl-email"
                type="email"
                required
                value={email}
                disabled={done}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={done ? "Thank you. We'll write when it ships." : "Email address"}
                className="flex-1 bg-transparent text-[20px] md:text-[24px] outline-none placeholder:text-mist"
              />
              <button type="submit" disabled={done} className="whitespace-nowrap text-[14px] md:text-[15px] font-[600] tracking-[0.2em] uppercase text-olive-900 hover:text-olive transition-colors">
                {done ? "Done" : "Sign up"}
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr] gap-12 py-16 md:py-20">
          <div className="col-span-2 md:col-span-1">
            <Logo className="text-[30px] text-olive-900" dot="#b5ba92" />
            <p className="mt-6 text-[16px] leading-[1.6] text-mist max-w-[34ch]">{footer.blurb}</p>
          </div>
          <div>
            <p className="text-[12px] tracking-[0.24em] uppercase text-mist">Site</p>
            <ul className="mt-6 space-y-4">
              {footer.site.map((l) => (
                <li key={l.label}>
                  <a href={l.href} onClick={(e) => { e.preventDefault(); go(l.href); }} className="text-[17px] hover:text-olive transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:justify-self-end">
            <p className="text-[12px] tracking-[0.24em] uppercase text-mist">Legal</p>
            <ul className="mt-6 space-y-4">
              {footer.legal.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-[17px] hover:text-olive transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 justify-between pb-10 text-[14px] text-mist">
          <span>{footer.copyright}</span>
          <span>{footer.made}</span>
        </div>
      </div>
    </footer>
  );
}
