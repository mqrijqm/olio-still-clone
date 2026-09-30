"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type CartItem = {
  key: string; // id + size
  id: string;
  title: string;
  size: "500 ml" | "3 L";
  price: number;
  qty: number;
  image: string;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  open: boolean;
  checkout: boolean;
  setOpen: (v: boolean) => void;
  setCheckout: (v: boolean) => void;
  add: (item: Omit<CartItem, "qty" | "key">) => void;
  setQty: (key: string, qty: number) => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);

  const add = useCallback((item: Omit<CartItem, "qty" | "key">) => {
    const key = `${item.id}-${item.size}`;
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...item, key, qty: 1 }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) => (qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i))));
  }, []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      total: items.reduce((s, i) => s + i.qty * i.price, 0),
      open,
      checkout,
      setOpen,
      setCheckout,
      add,
      setQty,
    }),
    [items, open, checkout, add, setQty]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
