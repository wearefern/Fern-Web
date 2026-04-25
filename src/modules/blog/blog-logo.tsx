import { HTMLMotionProps, motion } from 'framer-motion';
import { Logo } from '~ui/widgets/logo';

import { cn } from '~utils/style';

/* -------------------------------------------------------------------------------------------------
 * BlogLogo
 * -----------------------------------------------------------------------------------------------*/

interface BlogLogoProps extends HTMLMotionProps<'div'> {}

const BlogLogo = ({ className, ...rest }: BlogLogoProps) => {
  return (
    <motion.div className={cn('flex items-center', className)} {...rest}>
      <Logo />
    </motion.div>
  );
};

BlogLogo.displayName = 'BlogLogo';

/* -----------------------------------------------------------------------------------------------*/

export { BlogLogo };
export type { BlogLogoProps };
