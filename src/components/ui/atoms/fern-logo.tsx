import Link from 'next/link';
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
      <Logo width={width} layoutId={layoutId} />
    </Link>
  );
};
