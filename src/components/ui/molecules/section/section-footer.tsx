'use client';

import Link from 'next/link';
import { useState } from 'react';

import { CoffeeEmoji } from '~ui/atoms/emojis';
import { HeartButton } from '~ui/molecules/buttons/heart-button';

/* -------------------------------------------------------------------------------------------------
 * SectionFooter
 * -----------------------------------------------------------------------------------------------*/

const SectionFooter = () => {
  const [heartPhase, setHeartPhase] = useState<'last' | number>('last');

  return (
    <footer className='w-full bg-[#000] text-white'>
      <div className='mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
        {/* Oversized Fern Wordmark */}
        <div className='mb-8 sm:mb-10'>
          <Link href='/' className='block'>
            <h1 className='text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tighter text-white hover:opacity-80 transition-opacity leading-none'>
              fern.
            </h1>
          </Link>
        </div>

        {/* Footer Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 mb-8'>
          {/* Newsletter/Contact Block - Left */}
          <div className='lg:col-span-1 flex flex-col gap-4'>
            <h3 className='text-sm font-semibold uppercase tracking-widest text-[#a1a1a1]'>
              Get in touch
            </h3>
            <p className='text-sm text-[#8a8a8a] leading-relaxed max-w-sm'>
              Software systems businesses rely on.
            </p>
            <a
              href='mailto:hello@wearefern.co'
              className='text-base text-white hover:underline underline-offset-4 transition-all font-medium'
            >
              hello@wearefern.co
            </a>
          </div>

          {/* Link Columns - Right */}
          <div className='lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8'>
            {/* Explore */}
            <div className='flex flex-col gap-3'>
              <h3 className='text-xs font-semibold uppercase tracking-widest text-[#8a8a8a]'>
                Explore
              </h3>
              <nav className='flex flex-col gap-2'>
                <Link
                  href='/#projects'
                  className='text-sm text-white hover:opacity-60 transition-opacity'
                >
                  Services
                </Link>
                <Link
                  href='/#process'
                  className='text-sm text-white hover:opacity-60 transition-opacity'
                >
                  Process
                </Link>
                <Link
                  href='/insights'
                  className='text-sm text-white hover:opacity-60 transition-opacity'
                >
                  Insights
                </Link>
                <Link
                  href='/contact'
                  className='text-sm text-white hover:opacity-60 transition-opacity'
                >
                  Contact
                </Link>
              </nav>
            </div>

            {/* Products */}
            <div className='flex flex-col gap-3'>
              <h3 className='text-xs font-semibold uppercase tracking-widest text-[#8a8a8a]'>
                Products
              </h3>
              <nav className='flex flex-col gap-2'>
                <Link
                  href='/products'
                  className='text-sm text-white hover:opacity-60 transition-opacity'
                >
                  Products by Fern
                </Link>
                <Link
                  href='/products'
                  className='text-sm text-white hover:opacity-60 transition-opacity'
                >
                  Marketplace
                </Link>
              </nav>
            </div>

            {/* Information */}
            <div className='flex flex-col gap-3'>
              <h3 className='text-xs font-semibold uppercase tracking-widest text-[#8a8a8a]'>
                Information
              </h3>
              <nav className='flex flex-col gap-2'>
                <Link
                  href='/privacy'
                  className='text-sm text-white hover:opacity-60 transition-opacity'
                >
                  Privacy Policy
                </Link>
                <Link
                  href='/terms'
                  className='text-sm text-white hover:opacity-60 transition-opacity'
                >
                  Terms
                </Link>
                <Link
                  href='/support'
                  className='text-sm text-white hover:opacity-60 transition-opacity'
                >
                  Support
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className='border-t border-[#222] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-2 text-sm text-[#8a8a8a]'>
            <span>Made with</span>
            <HeartButton
              size='xs'
              onClick={(phase: number, phasesLength: number) =>
                setHeartPhase((phase + 1) % phasesLength)
              }
              phase={heartPhase}
            />
            <span>and a lot of</span>
            <CoffeeEmoji className='w-4 h-4' />
          </div>
          <div className='text-sm text-[#8a8a8a]'>
            All rights reserved © Fern 2026
          </div>
        </div>
      </div>
    </footer>
  );
};

SectionFooter.displayName = 'SectionFooter';

/* -----------------------------------------------------------------------------------------------*/

export { SectionFooter };
