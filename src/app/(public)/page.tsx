import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { PropertyListing } from "@/components/sections/property-listing";
import { Experience } from "@/components/sections/experience";
import { FeaturedProperty } from "@/components/sections/featured-property";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { FinalCta } from "@/components/sections/final-cta";

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const quartos = (Array.isArray(params.quartos) ? params.quartos : params.quartos ? [params.quartos] : [])
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value));

  const garagemParam = Array.isArray(params.garagem) ? params.garagem[0] : params.garagem;
  const temGaragem = garagemParam === "com" ? true : garagemParam === "sem" ? false : undefined;

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <PropertyListing quartos={quartos} temGaragem={temGaragem} />
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
