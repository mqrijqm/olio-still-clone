import { Hero } from "@/components/sections/Hero";
import { Flavors } from "@/components/sections/Flavors";
import { Inside } from "@/components/sections/Inside";
import { Story } from "@/components/sections/Story";
import { Details } from "@/components/sections/Details";
import { Press } from "@/components/sections/Press";
import { Shop } from "@/components/sections/Shop";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Flavors />
      <Inside />
      <Story />
      <Details />
      <Press />
      <Shop />
      <Footer />
    </>
  );
}
