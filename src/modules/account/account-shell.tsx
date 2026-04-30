'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import { PluginsHeader } from '~modules/plugins/plugins-header';
import { cn } from '~utils/style';

interface AccountShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const navItems = [
  { href: '/account', label: 'Dashboard' },
  { href: '/account/orders', label: 'Orders' },
  { href: '/account/downloads', label: 'Downloads' },
  { href: '/account/settings', label: 'Settings' },
  { href: '/account/settings/profile', label: 'Profile' },
  { href: '/account/settings/billing', label: 'Billing' },
  { href: '/contact', label: 'Support' },
];

export const AccountShell = ({ title, subtitle, children }: AccountShellProps) => {
  const pathname = usePathname();

  return (
    <div className='min-h-screen bg-white'>
      <PluginsHeader />

      <main className='mx-auto w-full max-w-none px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]'>
          <aside className='md:border-r md:border-gray-200 md:pr-6'>
            <nav className='space-y-1'>
              {navItems.map((item) => {
                const isActive =
                  item.href === '/account'
                    ? pathname === '/account'
                    : item.href === '/account/settings'
                    ? pathname.startsWith('/account/settings')
                    : pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex h-10 items-center rounded-md px-3 text-sm transition-colors duration-200 ease-in-out',
                      isActive
                        ? 'bg-gray-100 font-semibold text-black'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <section className='w-full min-w-0'>
            <div className='mb-8'>
              <h1 className='text-3xl font-bold text-black mb-2'>{title}</h1>
              <p className='text-gray-600'>{subtitle}</p>
            </div>
            {children}
          </section>
        </div>
      </main>
    </div>
  );
};
