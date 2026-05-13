'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '~utils/style';

/* -------------------------------------------------------------------------------------------------
 * ProductsFloatingButton
 * -----------------------------------------------------------------------------------------------*/

export const ProductsFloatingButton = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const threshold = 100;

      // Hide when near top (header area)
      const isNearTop = scrollY < threshold;

      // Hide when near footer (last 200px of page)
      const isNearBottom = scrollY + windowHeight > documentHeight - threshold;

      setIsVisible(!isNearTop && !isNearBottom);
      setIsNearFooter(isNearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Exclude button from marketplace pages
  const isMarketplacePage = pathname?.startsWith('/products') ||
                            pathname?.startsWith('/plugins') ||
                            pathname?.startsWith('/tools') ||
                            pathname?.startsWith('/cart') ||
                            pathname?.startsWith('/account');

  if (isMarketplacePage) {
    return null;
  }

  return (
    <Link
      href='/products'
      aria-label='Open Products by Fern marketplace'
      className={cn(
        'fixed right-6 z-40 transition-opacity duration-500',
        'hidden sm:block',
        isVisible && !isNearFooter ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      style={{
        top: '50%',
        transform: 'translateY(-50%)',
      }}
    >
      <div className='relative group products-cd'>
        <svg
          width='160'
          height='160'
          viewBox='0 0 160 160'
          className={cn(
            'animate-[spin_14s_linear_infinite]',
            'transition-all duration-300'
          )}
        >
          <defs>
            <path
              id='products-circle-path-top'
              d='M 32 80 A 48 48 0 0 1 128 80'
            />
            <path
              id='products-circle-path-bottom'
              d='M 128 80 A 48 48 0 0 1 32 80'
            />
          </defs>

          {/* Outer circle */}
          <circle
            cx='80'
            cy='80'
            r='58'
            fill='#ffffff'
            stroke='#000000'
            strokeWidth='2'
          />

          {/* Text on circular paths */}
          <text
            fill='#000000'
            fontSize='9.5'
            fontFamily='"Albert Sans"'
            fontWeight='800'
            letterSpacing='0.2'
            textAnchor='middle'
          >
            <textPath href='#products-circle-path-top' startOffset='50%'>
              Products By fern.
            </textPath>
            <textPath href='#products-circle-path-bottom' startOffset='50%'>
              Products By fern.
            </textPath>
          </text>

          {/* Center dot */}
          <circle
            cx='80'
            cy='80'
            r='5'
            fill='#000000'
          />
        </svg>
      </div>
    </Link>
  );
};

ProductsFloatingButton.displayName = 'ProductsFloatingButton';
