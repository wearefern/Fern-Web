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
    <footer className='w-full bg-black text-white'
      style={{
        backgroundColor: '#000000',
        color: '#ffffff',
        width: '100%'
      }}
    >
      <div className='mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-20 py-12 sm:py-16'>
        {/* Footer Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-20 mb-8'>
          {/* Column 1: Get in touch */}
          <div className='flex flex-col gap-4'>
            <h3 className='text-sm font-semibold uppercase tracking-widest text-gray-400'>
              GET IN TOUCH
            </h3>
            <p className='text-sm text-gray-500 leading-relaxed max-w-sm'>
              Software systems businesses rely on.
            </p>
            <a
              href='mailto:hello@wearefern.co'
              className='text-base text-white hover:underline underline-offset-4 transition-all font-medium'
              style={{ color: '#ffffff' }}
            >
              hello@wearefern.co
            </a>
          </div>

          {/* Column 2: Explore */}
          <div className='flex flex-col gap-4'>
            <h3 className='text-xs font-semibold uppercase tracking-widest text-gray-400'>
              EXPLORE
            </h3>
            <nav className='flex flex-col gap-2'>
              <Link
                href='/#projects'
                className='text-sm text-white hover:opacity-60 transition-opacity'
                style={{ color: '#ffffff' }}
              >
                Services
              </Link>
              <Link
                href='/#process'
                className='text-sm text-white hover:opacity-60 transition-opacity'
                style={{ color: '#ffffff' }}
              >
                Process
              </Link>
              <Link
                href='/insights'
                className='text-sm text-white hover:opacity-60 transition-opacity'
                style={{ color: '#ffffff' }}
              >
                Insights
              </Link>
              <Link
                href='/contact'
                className='text-sm text-white hover:opacity-60 transition-opacity'
                style={{ color: '#ffffff' }}
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Column 3: Products */}
          <div className='flex flex-col gap-4'>
            <h3 className='text-xs font-semibold uppercase tracking-widest text-gray-400'>
              PRODUCTS
            </h3>
            <nav className='flex flex-col gap-2'>
              <Link
                href='/products'
                className='text-sm text-white hover:opacity-60 transition-opacity'
                style={{ color: '#ffffff' }}
              >
                Products by Fern
              </Link>
              <Link
                href='/products'
                className='text-sm text-white hover:opacity-60 transition-opacity'
                style={{ color: '#ffffff' }}
              >
                Marketplace
              </Link>
            </nav>
          </div>

          {/* Column 4: Information */}
          <div className='flex flex-col gap-4'>
            <h3 className='text-xs font-semibold uppercase tracking-widest text-gray-400'>
              INFORMATION
            </h3>
            <nav className='flex flex-col gap-2'>
              <Link
                href='/privacy'
                className='text-sm text-white hover:opacity-60 transition-opacity'
                style={{ color: '#ffffff' }}
              >
                Privacy Policy
              </Link>
              <Link
                href='/terms'
                className='text-sm text-white hover:opacity-60 transition-opacity'
                style={{ color: '#ffffff' }}
              >
                Terms
              </Link>
              <Link
                href='/support'
                className='text-sm text-white hover:opacity-60 transition-opacity'
                style={{ color: '#ffffff' }}
              >
                Support
              </Link>
            </nav>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className='border-t border-gray-800 pt-8 pb-12'>
          {/* Massive Outlined Logo */}
          <div className='text-center mb-8 footer-logo-wrap'>
            <Link 
              href='/' 
              className='block'
            >
              <h1 
                className='footer-logo-text'
                style={{
                  fontSize: 'clamp(190px, 24vw, 440px)',
                  lineHeight: 1
                }}
              >
                fern.
              </h1>
            </Link>
          </div>

          {/* Bottom Meta */}
          <div className='flex items-center justify-between gap-4'>
            {/* Left: Made with */}
            <div className='flex items-center gap-2 text-sm text-gray-400'>
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

            {/* Right: Copyright */}
            <div className='text-sm text-gray-400'>
              All rights reserved © Fern 2026
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

SectionFooter.displayName = 'SectionFooter';

/* -----------------------------------------------------------------------------------------------*/

export { SectionFooter };
