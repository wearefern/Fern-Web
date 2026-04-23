import { HTMLMotionProps, motion } from 'framer-motion';

import { cn } from '~utils/style';

interface LogoProps extends Partial<HTMLMotionProps<"img">> {
  width?: number;
  height?: number;
  variant?: 'dark' | 'light';
}

const Logo = ({ width = 85, height, variant = 'dark', className, ...rest }: LogoProps) => {
  return (
    <motion.img
      src="/fern-logo.png"
      width={width}
      height={height}
      alt="Fern Logo"
      className={cn(
        "object-contain",
        variant === 'light' ? 'invert' : 'dark:invert',
        className
      )}
      {...rest}
    />
  );
};

Logo.displayName = 'Logo';

export { Logo };
export type { LogoProps };
