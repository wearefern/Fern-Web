import Link from 'next/link';
import { Logo } from '~ui/widgets/logo';

interface FernLogoProps {
  className?: string;
  width?: number;
  layoutId?: string;
}

export const FernLogo = ({ className, width, layoutId, ...rest }: FernLogoProps) => {
  return (
    <Link href='/' title='Fern' className={className}>
      <Logo width={width} layoutId={layoutId} />
    </Link>
  );
};
