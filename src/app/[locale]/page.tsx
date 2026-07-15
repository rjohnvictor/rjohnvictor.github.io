import { getDictionary } from './dictionaries';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Achievements from '@/components/Achievements';
import Education from '@/components/Education';
import FeaturedWork from '@/components/FeaturedWork';
import TechnicalContributions from '@/components/TechnicalContributions';
import Manifesto from '@/components/Manifesto';
import Philosophy from '@/components/Philosophy';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ScrollNavigator from '@/components/ScrollNavigator';

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
                <Achievements dict={dict} />
                <Education dict={dict} />
                <FeaturedWork dict={dict} />
                <TechnicalContributions dict={dict} />
                <Manifesto dict={dict} />
                <Philosophy dict={dict} />
                <Contact dict={dict} />
            </main>
            <ScrollNavigator />
            <Footer dict={dict} />
        </>
    );
}
