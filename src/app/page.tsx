import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { FeaturedProperties } from "@/components/sections/featured-properties";
import { Experience } from "@/components/sections/experience";
import { FeaturedProperty } from "@/components/sections/featured-property";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { FinalCta } from "@/components/sections/final-cta";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <FeaturedProperties />
        <Experience />
        <FeaturedProperty />
        <About />
        <Contact />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
