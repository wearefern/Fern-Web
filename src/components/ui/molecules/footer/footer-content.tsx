'use client';

import Link from 'next/link';

/* -------------------------------------------------------------------------------------------------
 * Footer Content - Clean 4-column layout
 * -----------------------------------------------------------------------------------------------*/

const GET_IN_TOUCH_LINKS = [
  { label: 'Software systems businesses rely on.', href: null, isDescription: true },
  { label: 'hello@wearefern.co', href: 'mailto:hello@wearefern.co', isDescription: false },
];

const EXPLORE_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Process', href: '/process' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
];

const PRODUCT_LINKS = [
  { label: 'Products by Fern', href: '/products' },
  { label: 'Marketplace', href: '/marketplace' },
];

const INFO_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Support', href: '/support' },
];

interface ColumnProps {
  title: string;
  links: Array<{ label: string; href: string | null; isDescription?: boolean }>;
}

const FooterColumn = ({ title, links }: ColumnProps) => {
  return (
    <div className='flex flex-col gap-4'>
      <h3
        className='text-[11px] font-medium uppercase tracking-[0.18em] text-[#7A7A7A]'
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {title}
      </h3>
      <ul className='flex flex-col gap-3'>
        {links.map((link, index) => (
          <li key={index}>
            {link.isDescription ? (
              <span
                className='text-[18px] font-normal leading-relaxed text-[#9A9A9A]'
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {link.label}
              </span>
            ) : link.href ? (
              <Link
                href={link.href}
                className='text-[18px] font-normal text-[#F5F5F5] transition-opacity duration-200 hover:opacity-60'
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {link.label}
              </Link>
            ) : (
              <span
                className='text-[18px] font-normal text-[#F5F5F5]'
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {link.label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const FooterContent = () => {
  return (
    <section
      className='w-full'
      style={{ backgroundColor: '#000000' }}
    >
      <div className='mx-auto w-full max-w-[1600px] px-8 py-[72px] sm:px-12 md:px-16 lg:px-[64px]'>
        {/* 4-column grid */}
        <div className='grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-16'>
          <FooterColumn title='GET IN TOUCH' links={GET_IN_TOUCH_LINKS} />
          <FooterColumn title='EXPLORE' links={EXPLORE_LINKS} />
          <FooterColumn title='PRODUCTS' links={PRODUCT_LINKS} />
          <FooterColumn title='INFORMATION' links={INFO_LINKS} />
        </div>

        {/* Divider */}
        <div
          className='my-[72px] h-px w-full'
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
        />

        {/* Meta row */}
        <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
          <p
            className='text-[14px] text-[#9A9A9A] opacity-70'
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Made with <span className='text-red-400'>❤️</span> and a lot of{' '}
            <span>☕</span>
          </p>
          <p
            className='text-[14px] text-[#9A9A9A] opacity-70'
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            All rights reserved © Fern 2026
          </p>
        </div>
      </div>
    </section>
  );
};

FooterContent.displayName = 'FooterContent';

/* -----------------------------------------------------------------------------------------------*/

export { FooterContent };
