import { Metadata } from 'next';

import '~styles/highlight-js/style.css';

export const metadata: Metadata = {
  title: 'Insights',
  description:
    'Insights from Fern on software strategy, architecture, delivery, and product engineering.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className='flex h-full w-full flex-col'>{children}</main>
    </>
  );
}
