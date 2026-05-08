import { Metadata } from 'next';
import Link from 'next/link';

import '~styles/highlight-js/style.css';

import { Button } from '~ui/atoms/button';

export const metadata: Metadata = {
  title: 'Insights',
  description:
    'Insights from Fern on software strategy, architecture, delivery, and product engineering.',
};

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='flex h-full w-full flex-col'>
      <div className='layout-width-limiter layout-padding pt-24 sm:pt-28'>
        <Button variant='outline' className='rounded-lg px-4 py-2 text-sm' asChild>
          <Link href='/'>Back to Home</Link>
        </Button>
      </div>
      {children}
    </main>
  );
}
