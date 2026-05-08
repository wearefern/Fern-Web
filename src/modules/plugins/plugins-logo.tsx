import { HTMLMotionProps, motion } from 'framer-motion';
import { FernLogo } from '~ui/atoms/fern-logo';

import { cn } from '~utils/style';

/* -------------------------------------------------------------------------------------------------
 * PluginsLogo
 * -----------------------------------------------------------------------------------------------*/

interface PluginsLogoProps extends HTMLMotionProps<'div'> {}

const PluginsLogo = ({ className, ...rest }: PluginsLogoProps) => {
  return (
    <motion.div className={cn('flex items-center', className)} {...rest}>
      <FernLogo />
    </motion.div>
  );
};

PluginsLogo.displayName = 'PluginsLogo';

/* -----------------------------------------------------------------------------------------------*/

export { PluginsLogo };
export type { PluginsLogoProps };
