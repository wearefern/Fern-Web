'use client';

import Link from 'next/link';

import { PLUGINS_PATH } from '~constants/index';

import { ButtonWithVideo } from '~ui/atoms/button';
import { ThemeToggle } from '~ui/atoms/theme/theme-toggle';
import { AppHeader } from '~ui/molecules/app-header';
import { FernLogo } from '../../components/ui/atoms/fern-logo';
import { useCart } from '../../context/cart-context';
import { PluginsLogo } from './plugins-logo';

/* -------------------------------------------------------------------------------------------------
 * PluginsHeader
 * -----------------------------------------------------------------------------------------------*/

const PluginsHeader = () => {
  const { getItemCount } = useCart();
  const cartCount = getItemCount();

  return (
    <AppHeader innerClassName='flex gap-x-2 justify-between'>
      <Link title='Fern' href='/'>
        <PluginsLogo />
      </Link>

      <nav className='flex items-center gap-x-2'>
        <ButtonWithVideo videoFileName='header-button-cart' asChild>
          <Link href='/cart'>
            View Cart{cartCount > 0 && ` (${cartCount})`}
          </Link>
        </ButtonWithVideo>

        <ButtonWithVideo videoFileName='header-button-account' asChild>
          <Link href='/account/downloads'>Account</Link>
        </ButtonWithVideo>

        <ThemeToggle />
      </nav>
    </AppHeader>
  );
};

PluginsHeader.displayName = 'PluginsHeader';

/* -----------------------------------------------------------------------------------------------*/

export { PluginsHeader };
