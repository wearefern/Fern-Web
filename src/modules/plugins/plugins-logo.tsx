import Link from 'next/link';
import { HTMLMotionProps, motion } from 'framer-motion';
import { Logo } from '~ui/widgets/logo';

import { cn } from '~utils/style';

/* -------------------------------------------------------------------------------------------------
 * PluginsLogo
 * -----------------------------------------------------------------------------------------------*/

interface PluginsLogoProps extends HTMLMotionProps<'div'> {}

const PluginsLogo = ({ className, ...rest }: PluginsLogoProps) => {
  return (
    <motion.div className={cn('flex items-center', className)} {...rest}>
      <Link href='/' title='Fern'>
        <Logo />
      </Link>
    </motion.div>
  );
};

PluginsLogo.displayName = 'PluginsLogo';

/* -----------------------------------------------------------------------------------------------*/

export { PluginsLogo };
export type { PluginsLogoProps };
