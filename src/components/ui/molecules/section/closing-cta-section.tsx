'use client';

import Link from 'next/link';

/* -------------------------------------------------------------------------------------------------
 * ClosingCtaSection - Premium white closing CTA above footer
 * -----------------------------------------------------------------------------------------------*/

const ClosingCtaSection = () => {
  return (
    <section className="w-full bg-white py-24 sm:py-32 lg:py-40">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Main white container with border */}
        <div className="relative rounded-2xl border border-[#d4d4d4] bg-white px-8 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24">
          {/* Content container */}
          <div className="mx-auto max-w-4xl text-center">
            {/* Main headline */}
            <p className="mb-8 text-xl font-normal leading-relaxed text-black sm:text-2xl lg:text-3xl">
              Fern builds software with modern web architecture, strong UX foundations, and
              production-ready engineering practices.
            </p>

            {/* Second sentence */}
            <p className="mb-16 text-lg font-normal leading-relaxed text-[#6F6F6F] sm:text-xl lg:text-2xl">
              Fern partners with startups, operations teams, product teams, and enterprise leaders to turn ideas into maintainable, production-ready software.
            </p>
          </div>

          {/* Bottom row with logo and CTA */}
          <div className="flex items-end justify-between">
            {/* Small fern. logo at bottom-left */}
            <Link
              href="/"
              className="text-sm font-bold tracking-tight text-black transition-opacity hover:opacity-60"
            >
              fern.
            </Link>

            {/* Get in touch button at bottom-right */}
            <Link
              href="/contact"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#000000";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderColor = "#000000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.color = "#000000";
                e.currentTarget.style.borderColor = "#000000";
              }}
              className="inline-flex items-center rounded-full border px-6 py-3 text-sm font-medium transition-colors duration-200 ease-out"
              style={{
                backgroundColor: "#ffffff",
                color: "#000000",
                borderColor: "#000000",
              }}
            >
              Get in touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

ClosingCtaSection.displayName = 'ClosingCtaSection';

/* -----------------------------------------------------------------------------------------------*/

export { ClosingCtaSection };
