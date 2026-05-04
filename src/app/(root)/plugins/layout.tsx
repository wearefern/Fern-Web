import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plugins',
  description:
    'Fern-Native Plugins - Professional audio plugins designed for modern music production with signature Wavemaker technology.',
};

export default function PluginsLayout({
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
