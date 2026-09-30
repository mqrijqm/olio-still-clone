import type { Metadata, Viewport } from "next";
import { Archivo, Newsreader, Inter_Tight } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Nav } from "@/components/Nav";
import { Cursor } from "@/components/Cursor";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import "./globals.css";

// Archivo (wdth 125) = zamena za Söhne Breit — wordmark i veliki naslovi
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin", "latin-ext"], axes: ["wdth"] });
// Newsreader = zamena za Tiempos Headline/Text — serif naslovi i kurziv
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});
// Inter Tight = zamena za Söhne — tekst i UI
const inter = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "OLIO. Sporo cijeđeno. Svaki dan na stolu.",
  description: "Grčko ekstra djevičansko maslinovo ulje iz jednog maslinjaka. Masline sorte koroneiki, cijeđene u roku od četiri sata od berbe.",
  openGraph: {
    title: "OLIO. Pressed slow. Poured daily.",
    description: "Single-origin Greek extra virgin olive oil. Koroneiki olives, pressed within four hours of picking.",
    images: ["/images/tins/tin-trio.webp"],
  },
};

export const viewport: Viewport = { themeColor: "#efede6" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bs" className={`${archivo.variable} ${newsreader.variable} ${inter.variable} antialiased`}>
      <body>
        <LocaleProvider>
        <CartProvider>
          <SmoothScroll>
            <Nav />
            <main id="top">{children}</main>
            <CartDrawer />
          </SmoothScroll>
          <Cursor />
          <div className="grain-overlay" aria-hidden="true" />
        </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
