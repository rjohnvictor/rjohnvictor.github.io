import { getDictionary } from "./dictionaries";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Manifesto from "@/components/Manifesto";
import Philosophy from "@/components/Philosophy";
import TechStack from "@/components/TechStack";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <>
      <Navbar dict={dict} locale={locale} />
      <main>
        <Hero dict={dict} />
        <About dict={dict} />
        <Skills dict={dict} />
        <Experience dict={dict} />
        <Projects dict={dict} />
        <Manifesto dict={dict} />
        <Philosophy dict={dict} />
        <TechStack dict={dict} />
        <Contact dict={dict} />
      </main>
      <Footer dict={dict} />
    </>
  );
}
