"use client";

import Image from "next/image";
import { useState } from "react";
import { Eyebrow, Ill, Reveal, SplitReveal } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { useCart } from "@/components/cart/CartProvider";
import { type Product } from "@/content/site";
import { useT } from "@/i18n/LocaleProvider";

function ProductCard({ p, i }: { p: Product; i: number }) {
  const t = useT().ui.product;
  const [size, setSize] = useState<"500 ml" | "3 L">("500 ml");
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const price = size === "500 ml" ? p.price.small : p.price.large;

  const onAdd = () => {
    add({ id: p.id, title: `${p.code} · ${p.name}`, size, price, image: p.tin });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <Reveal delay={i * 0.08} className="h-full">
      <article className="group h-full flex flex-col border border-olive-900/20 p-6 md:p-[clamp(24px,2.3vw,44px)] transition-colors duration-500 hover:border-olive-900/40">
        {/* slika: na hover se limenka zameni lifestyle fotografijom */}
        <div className="relative aspect-[1/1.08] overflow-hidden bg-bone-2">
          <Image src={p.tin} alt={`${p.code} ${p.name}, ${t.tin}`} fill sizes="(min-width: 768px) 30vw, 90vw" className="object-contain mix-blend-multiply scale-[0.92] transition-all duration-[900ms] ease-out group-hover:scale-100 group-hover:opacity-0" />
          <Image src={p.life} alt={`${p.code} ${p.name}, ${t.onTable}`} fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover opacity-0 scale-110 transition-all duration-[900ms] ease-out group-hover:opacity-100 group-hover:scale-100" />
          <span className="absolute left-4 top-4 text-[10px] tracking-[0.24em] uppercase text-mist group-hover:text-bone transition-colors duration-700">{p.tag}</span>
        </div>
        <h3 className="mt-7 flex items-baseline gap-2 flex-wrap">
          <span className="font-wordmark font-[900] text-[clamp(22px,2vw,30px)] tracking-[-0.02em]">{p.code}</span>
          <span className="text-mist">·</span>
          <span className="font-display text-[clamp(24px,2.1vw,32px)] font-[400] tracking-[-0.01em]">{p.name}</span>
        </h3>
        <p className="mt-3 text-[12px] font-[600] tracking-[0.24em] uppercase text-mist">{p.notes}</p>
        <p className="mt-4 text-[16px] leading-[1.55] text-olive-900/90 min-h-[3.1em]">{p.short}</p>

        <div className="mt-7 flex gap-3" role="radiogroup" aria-label={t.size}>
          {(["500 ml", "3 L"] as const).map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={size === s}
              onClick={() => setSize(s)}
              className={`h-[44px] px-6 rounded-full border text-[12px] font-[600] tracking-[0.24em] uppercase transition-colors duration-300 ${
                size === s ? "bg-olive text-bone border-olive" : "border-olive-900/60 text-olive-900 hover:bg-olive-900/5"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="mt-6 flex items-baseline gap-2">
          <span className="font-wordmark font-[900] text-[38px] tracking-[-0.02em] tabular-nums leading-none">€{price}</span>
          <span className="text-[16px] text-mist">EUR</span>
        </div>
        <p className="mt-2 font-display italic text-[16px] text-mist">{t.subscribeSave}</p>

        <button
          type="button"
          onClick={onAdd}
          className="mt-7 h-[60px] w-full bg-olive text-bone text-[14px] font-[600] tracking-[0.34em] uppercase transition-colors duration-300 hover:bg-olive-700"
        >
          {added ? t.added : t.add}
        </button>
        <button type="button" className="mt-4 self-start inline-flex items-center gap-2 text-[15px] text-olive-900/70 hover:text-olive-900 group/sub">
          {t.subscribeInstead}
          <Icon name="arrow" size={16} strokeWidth={2} className="transition-transform group-hover/sub:translate-x-1" />
        </button>
      </article>
    </Reveal>
  );
}

export function Shop() {
  const { products, stockists, ui } = useT();
  return (
    <section id="stockists" className="relative w-full bg-bone overflow-hidden pt-28 md:pt-[140px] pb-24 md:pb-[140px]">
      <div className="mx-auto max-w-[1440px] px-6 md:px-[clamp(24px,7vw,140px)]">
        <Eyebrow n={stockists.eyebrow[0]} label={stockists.eyebrow[1]} />
        <SplitReveal type="words" className="mt-5 font-wordmark font-[900] uppercase tracking-[-0.025em] leading-[0.95] max-w-[16ch]" style={{ fontSize: "clamp(38px, 4.6vw, 76px)" }}>
          {stockists.title}
        </SplitReveal>

        <div className="mt-16 md:mt-24 grid md:grid-cols-3 gap-14 md:gap-[clamp(32px,6vw,96px)]">
          {stockists.cities.map((c, ci) => (
            <Reveal key={c.city} delay={ci * 0.08}>
              <h3 className="text-[clamp(30px,2.6vw,42px)] font-[600] tracking-[-0.02em] pb-6 border-b border-olive-900/25 flex items-center justify-between">
                {c.city}
                <Icon name="origin" size={28} className="text-olive" />
              </h3>
              <ul>
                {c.stores.map((s) => (
                  <li key={s.name} className="group py-6 border-b border-olive-900/15">
                    <p className="text-[17px] font-[600] transition-transform duration-500 group-hover:translate-x-2">{s.name}</p>
                    <p className="mt-2 text-[15px] text-mist transition-transform duration-500 delay-[40ms] group-hover:translate-x-2">{s.address}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <div className="mt-24 md:mt-32 text-center">
          <p className="text-[13px] font-[600] tracking-[0.5em] uppercase text-mist">{ui.product.comingSoon}</p>
          <p className="mt-6 text-[20px] md:text-[26px] text-olive-900/80 flex flex-wrap justify-center gap-x-5 gap-y-2">
            {stockists.soon.map((c, i) => (
              <span key={c} className="flex items-center gap-5">
                {i > 0 && <span className="text-[14px]">·</span>}
                {c}
              </span>
            ))}
          </p>
        </div>

        <div id="shop" className="mt-28 md:mt-36 flex items-center justify-center gap-8">
          <span className="h-px w-[clamp(40px,8vw,112px)] bg-olive-900/40" />
          <span className="text-[13px] font-[600] tracking-[0.5em] uppercase text-mist">{ui.product.orderDirect}</span>
          <span className="h-px w-[clamp(40px,8vw,112px)] bg-olive-900/40" />
        </div>

        <div className="relative mt-16 grid md:grid-cols-3 gap-8 md:gap-[clamp(20px,3vw,48px)]">
          <Ill name="branch" className="absolute -left-[12vw] -bottom-[8vw] w-[26vw] h-[26vw] opacity-[0.1] -rotate-12 hidden md:block" color="#5c5f47" />
          {products.map((p, i) => (
            <ProductCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
