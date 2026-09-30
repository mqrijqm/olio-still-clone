"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useCart } from "./CartProvider";

export function CartDrawer() {
  const { items, open, setOpen, total, setQty, checkout, setCheckout } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setCheckout(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen, setCheckout]);

  return (
    <>
      <div
        className="fixed inset-0 z-[70] transition-opacity duration-[400ms] ease-out"
        style={{ backgroundColor: "rgba(34,36,25,0.32)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-label="Cart"
        aria-hidden={!open}
        data-lenis-prevent
        className="fixed top-0 right-0 z-[71] h-full flex flex-col bg-bone transition-transform duration-[450ms] ease-out"
        style={{
          width: "min(420px, 100vw)",
          borderLeft: "1px solid rgba(133,131,111,0.4)",
          boxShadow: "-16px 0 48px rgba(34,36,25,0.1)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="flex items-center justify-between px-6 pt-7 pb-5 border-b border-olive-900/10">
          <div className="font-sans text-[12px] tracking-[0.2em] uppercase text-mist">
            Your cart <span className="text-olive-900 tabular-nums">({items.reduce((s, i) => s + i.qty, 0)})</span>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="w-9 h-9 flex items-center justify-center text-olive-900" aria-label="Close cart">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 5 L19 19 M19 5 L5 19" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3">
              <p className="font-display text-[26px] font-[300] text-olive-900">Your cart is empty.</p>
              <p className="text-[14px] text-mist">A tin of good oil is a good place to start.</p>
            </div>
          ) : (
            <ul>
              {items.map((i) => (
                <li key={i.key} className="flex gap-4 py-5 border-b border-olive-900/10">
                  <div className="relative w-[76px] h-[92px] bg-bone-2 shrink-0 overflow-hidden">
                    <Image src={i.image} alt="" fill sizes="76px" className="object-contain mix-blend-multiply scale-110" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between gap-3">
                      <p className="font-wordmark font-[800] text-[13px] tracking-[-0.01em] uppercase">{i.title}</p>
                      <p className="font-display text-[17px] tabular-nums">€{i.price * i.qty}</p>
                    </div>
                    <p className="mt-1 text-[11px] tracking-[0.2em] uppercase text-mist">{i.size}</p>
                    <div className="mt-auto flex items-center gap-3">
                      <button type="button" aria-label="Decrease" onClick={() => setQty(i.key, i.qty - 1)} className="w-7 h-7 rounded-full border border-olive-900/25 text-[14px] leading-none">
                        −
                      </button>
                      <span className="tabular-nums text-[14px] w-4 text-center">{i.qty}</span>
                      <button type="button" aria-label="Increase" onClick={() => setQty(i.key, i.qty + 1)} className="w-7 h-7 rounded-full border border-olive-900/25 text-[14px] leading-none">
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="px-6 pt-5 pb-7 border-t border-olive-900/10">
          <div className="flex items-baseline justify-between mb-5">
            <span className="text-[12px] tracking-[0.2em] uppercase text-mist">Subtotal</span>
            <span className="font-wordmark font-[900] text-[26px] tabular-nums">
              €{total} <span className="font-sans font-normal text-[14px] text-mist">EUR</span>
            </span>
          </div>
          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => setCheckout(true)}
            className="w-full h-[56px] bg-olive text-bone font-sans font-[600] text-[14px] tracking-[0.3em] uppercase transition-colors hover:bg-olive-700 disabled:opacity-40"
          >
            Checkout
          </button>
        </div>
      </aside>

      {/* Demo checkout — kao u referenci, bez prave naplate */}
      <div
        className="fixed inset-0 z-[80] flex items-center justify-center px-5 transition-opacity duration-300"
        style={{ backgroundColor: "rgba(34,36,25,0.4)", opacity: checkout ? 1 : 0, pointerEvents: checkout ? "auto" : "none" }}
        aria-hidden={!checkout}
        onClick={() => setCheckout(false)}
      >
        <div
          role="dialog"
          aria-label="Demo checkout"
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[440px] bg-bone text-center px-8 py-12 transition-transform duration-300"
          style={{ border: "1px solid rgba(133,131,111,0.4)", boxShadow: "0 24px 64px rgba(34,36,25,0.18)", transform: checkout ? "translateY(0)" : "translateY(16px)" }}
        >
          <div className="text-[11px] tracking-[0.28em] uppercase text-mist">Demo store</div>
          <p className="mt-4 font-display font-[300] text-[34px] leading-[1.05] tracking-[-0.01em]">Thank you. This is where the oil would ship.</p>
          <p className="mt-4 text-[15px] leading-[1.6] text-olive-900/75">
            OLIO is a design case study. No payment was taken and nothing will be sent.
          </p>
          <button
            type="button"
            onClick={() => {
              setCheckout(false);
              setOpen(false);
            }}
            className="mt-8 h-[48px] px-8 bg-olive text-bone text-[13px] tracking-[0.3em] uppercase hover:bg-olive-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
