'use client';

import { createContext, useContext, useMemo } from 'react';

import { PluginsHeader } from '~modules/plugins/plugins-header';
import { PluginsSection } from '~modules/plugins/plugins-sections/plugins-section';

import { GsapReveal } from '~ui/atoms/gsap-reveal';

import { cn } from '~utils/style';

/* -------------------------------------------------------------------------------------------------
 * Plugins
 * -----------------------------------------------------------------------------------------------*/

interface PluginsContextProps {
  // Add any context props if needed in the future
}

const PluginsContext = createContext<PluginsContextProps>({});

const usePluginsContext = () => {
  const context = useContext(PluginsContext);
  return context;
};

/* -----------------------------------------------------------------------------------------------*/

interface PluginsProps {
  className?: string;
}

const Plugins = ({ className }: PluginsProps) => {
  const contextValue = useMemo(() => ({}), []);

  return (
    <PluginsContext.Provider value={contextValue}>
      <main className={cn('min-h-screen space-y-6', className)}>
        <PluginsHeader />

        <div className='w-full space-y-section-sm sm:space-y-section'>
          <GsapReveal>
            <PluginsSection />
          </GsapReveal>
        </div>
      </main>
    </PluginsContext.Provider>
  );
};

Plugins.displayName = 'Plugins';

/* -----------------------------------------------------------------------------------------------*/

export { Plugins, usePluginsContext };
export type { PluginsProps };
