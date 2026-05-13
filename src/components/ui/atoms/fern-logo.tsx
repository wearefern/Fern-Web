import Link from 'next/link';
import { FERN_LOGO_CLASSNAME, FERN_LOGO_WIDTH } from '~constants/logo';
import { Logo } from '~ui/widgets/logo';

interface FernLogoProps {
  className?: string;
  width?: number;
  layoutId?: string;
  href?: string;
  title?: string;
}

export const FernLogo = ({
  className,
  width,
  layoutId,
  href = '/',
  title = 'Fern',
}: FernLogoProps) => {
  return (
    <Link href={href} title={title} className={className}>
      <Logo
        width={width ?? FERN_LOGO_WIDTH}
        className={FERN_LOGO_CLASSNAME}
        layoutId={layoutId}
      />
    </Link>
  );
};
