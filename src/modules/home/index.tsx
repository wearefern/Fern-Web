'use client';

import { createContext, useContext } from 'react';

import { Content } from '~lib/content/provider';
import { ImageItem } from '~lib/images/provider';

import { HomeHeader } from '~modules/home/home-header';
import { AboutSection } from '~modules/home/home-sections/about-section/about-section';
import { DigitalContributionsKnowledgeSharing } from '~modules/home/home-sections/digital-contributions-knowledge-sharing-section';
import { DigitalContributionsProjects } from '~modules/home/home-sections/digital-contributions-projects-section';
import { HeroSection } from '~modules/home/home-sections/hero-section';

import { GsapReveal } from '~ui/atoms/gsap-reveal';

import { cn } from '~utils/style';

/* -------------------------------------------------------------------------------------------------
 * Home
 * -----------------------------------------------------------------------------------------------*/

interface HomeContextProps {
  blogContent: Content[];
  authorPortraits: ImageItem[];
}

const HomeContext = createContext<HomeContextProps>({
  blogContent: [],
  authorPortraits: [],
});

const useHomeContext = () => {
  const context = useContext(HomeContext);

  return context;
};

/* -----------------------------------------------------------------------------------------------*/

interface HomeProps {
  blogContent: Content[];
  className?: string;
}

const Home = ({ blogContent, className }: HomeProps) => {
  return (
    <HomeContext.Provider value={{ blogContent, authorPortraits: [] }}>
      <main className={cn('min-h-screen space-y-6', className)}>
        <HomeHeader />

        <div className='w-full space-y-section-sm sm:space-y-section'>
          <HeroSection />

          <div>
            <DigitalContributionsProjects />

            <GsapReveal delay={0.05}>
              <AboutSection />
            </GsapReveal>
          </div>

          <GsapReveal delay={0.08}>
            <DigitalContributionsKnowledgeSharing />
          </GsapReveal>
        </div>
      </main>
    </HomeContext.Provider>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { Home, useHomeContext };
export type { HomeProps };
