'use client';

import Link from 'next/link';

import { Button } from '~ui/atoms/button';
import { ThemeToggle } from '~ui/atoms/theme/theme-toggle';
import { AppHeader } from '~ui/molecules/app-header';
import { useCart } from '../../context/cart-context';
import { AuthNavControls } from '../../components/auth/auth-nav-controls';
import { PluginsLogo } from './plugins-logo';

/* -------------------------------------------------------------------------------------------------
 * PluginsHeader
 * -----------------------------------------------------------------------------------------------*/

const PluginsHeader = () => {
  const { getItemCount } = useCart();
  const cartCount = getItemCount();

  return (
    <AppHeader innerClassName='flex gap-x-2 justify-between py-0.5'>
      <PluginsLogo />

      <nav className='flex items-center gap-x-1.5 sm:gap-x-2'>
        <Button className='px-2.5 py-1 text-xs sm:text-sm' asChild>
          <Link href='/plugins'>
            Products
          </Link>
        </Button>

        <Button className='px-2.5 py-1 text-xs sm:text-sm' asChild>
          <Link href='/tools'>
            Tools
          </Link>
        </Button>

        <Button className='px-2.5 py-1 text-xs sm:text-sm' asChild>
          <Link href='/cart'>
            View Cart{cartCount > 0 && ` (${cartCount})`}
          </Link>
        </Button>

        <Button className='px-2.5 py-1 text-xs sm:text-sm' asChild>
          <div>
            <AuthNavControls showUserButton={false} />
          </div>
        </Button>
        <AuthNavControls showAccountLink={false} />
        <ThemeToggle />
      </nav>
    </AppHeader>
  );
};

PluginsHeader.displayName = 'PluginsHeader';

/* -----------------------------------------------------------------------------------------------*/

export { PluginsHeader };
