import { HTMLMotionProps, motion } from 'framer-motion';
import { FernLogo } from '~ui/atoms/fern-logo';

import { cn } from '~utils/style';

/* -------------------------------------------------------------------------------------------------
 * BlogLogo
 * -----------------------------------------------------------------------------------------------*/

interface BlogLogoProps extends HTMLMotionProps<'div'> {}

const BlogLogo = ({ className, ...rest }: BlogLogoProps) => {
  return (
    <motion.div className={cn('flex items-center', className)} {...rest}>
      <FernLogo title='Insights' />
    </motion.div>
  );
};

BlogLogo.displayName = 'BlogLogo';

/* -----------------------------------------------------------------------------------------------*/

export { BlogLogo };
export type { BlogLogoProps };
