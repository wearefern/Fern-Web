'use client';

import Link from 'next/link';

import { ButtonWithVideo } from '~ui/atoms/button';
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
    <AppHeader innerClassName='flex gap-x-2 justify-between'>
      <PluginsLogo />

      <nav className='flex items-center gap-x-2'>
        <ButtonWithVideo videoFileName='header-button-cart' asChild>
          <Link href='/cart'>
            View Cart{cartCount > 0 && ` (${cartCount})`}
          </Link>
        </ButtonWithVideo>

        <ButtonWithVideo videoFileName='header-button-account' asChild>
          <div>
            <AuthNavControls showUserButton={false} />
          </div>
        </ButtonWithVideo>
        <AuthNavControls showAccountLink={false} />
        <ThemeToggle />
      </nav>
    </AppHeader>
  );
};

PluginsHeader.displayName = 'PluginsHeader';

/* -----------------------------------------------------------------------------------------------*/

export { PluginsHeader };
