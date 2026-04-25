'use client';

import { createContext, useContext } from 'react';

import { Content } from '~lib/content/provider';

import { HomeFooter } from '~modules/home/home-footer';
import { HomeHeader } from '~modules/home/home-header';
import { AboutSection } from '~modules/home/home-sections/about-section/about-section';
import { ContactSection } from '~modules/home/home-sections/contact-section';
import { DigitalContributionsKnowledgeSharing } from '~modules/home/home-sections/digital-contributions-knowledge-sharing-section';
import { DigitalContributionsProjects } from '~modules/home/home-sections/digital-contributions-projects-section';
import { HeroSection } from '~modules/home/home-sections/hero-section';

import { cn } from '~utils/style';

/* -------------------------------------------------------------------------------------------------
 * Home
 * -----------------------------------------------------------------------------------------------*/

interface HomeContextProps {
  blogContent: Content[];
}

const HomeContext = createContext<HomeContextProps>({
  blogContent: [],
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
    <HomeContext.Provider value={{ blogContent }}>
      <main className={cn('min-h-screen space-y-6', className)}>
        <HomeHeader />

        <div className='w-full space-y-section-sm sm:space-y-section'>
          <HeroSection />

          <DigitalContributionsProjects />

          <AboutSection />

          <DigitalContributionsKnowledgeSharing />

          <ContactSection />

          <HomeFooter />
        </div>
      </main>
    </HomeContext.Provider>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { Home, useHomeContext };
export type { HomeProps };
