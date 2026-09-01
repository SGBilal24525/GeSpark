import { Hero } from '@/components/sections/hero';
import { ToolsSection } from '@/components/sections/tools-section';
import { About } from '@/components/sections/about';
import { WhyChooseUs } from '@/components/sections/why-choose-us';
import { AnimatedSection } from '@/components/animated-section';

export default function Home() {
  return (
    <>
      <Hero />
      <AnimatedSection>
        <ToolsSection />
      </AnimatedSection>
      <AnimatedSection>
        <About />
      </AnimatedSection>
      <AnimatedSection>
        <WhyChooseUs />
      </AnimatedSection>
    </>
  );
}
