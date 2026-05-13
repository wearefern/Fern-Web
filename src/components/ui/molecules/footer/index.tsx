'use client';

import { FooterContent } from './footer-content';
import { FooterLogoCanvas } from './footer-logo-canvas';

/* -------------------------------------------------------------------------------------------------
 * Footer - Premium black footer with dot matrix logo
 * -----------------------------------------------------------------------------------------------*/

const Footer = () => {
  return (
    <footer
      className='w-full'
      style={{
        backgroundColor: '#000000',
        color: '#F5F5F5',
        isolation: 'isolate',
      }}
    >
      <FooterContent />
      <section className="relative h-[520px] w-full overflow-hidden bg-black">
        <FooterLogoCanvas />
      </section>
    </footer>
  );
};

Footer.displayName = 'Footer';

/* -----------------------------------------------------------------------------------------------*/

export { Footer };
