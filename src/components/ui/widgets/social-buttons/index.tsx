import { ComponentPropsWithoutRef } from 'react';

import { SOCIALS } from '~constants/index';

import { Button } from '~ui/atoms/button';
import { IconProps } from '~ui/atoms/icon';
import { IconLink } from '~ui/atoms/icon-link';

import { cn } from '~utils/style';

interface SocialEntry {
  id: string;
  title: string;
  name: IconProps['name'];
  href: string;
}
const socials: SocialEntry[] = [
  {
    id: 'github',
    title: 'Follow Fern on GitHub',
    name: 'github',
    href: SOCIALS.github.url,
  },
  {
    id: 'linkedin',
    title: 'Connect with Fern on LinkedIn',
    name: 'linkedin',
    href: SOCIALS.linkedin.url,
  },
  {
    id: 'twitter',
    title: 'Follow Fern on X',
    name: 'twitter',
    href: SOCIALS.twitter.url,
  },
  {
    id: 'mail',
    title: 'Send Fern an email',
    name: 'mail',
    href: `mailto:${SOCIALS.mail.url}`,
  },
];

export interface SocialButtonsProps extends ComponentPropsWithoutRef<'div'> {}

export const SocialButtons = ({ className, ...rest }: SocialButtonsProps) => {
  return (
    <div className={cn('flex gap-x-1', className)} {...rest}>
      {socials.map((entry) => (
        <Button key={entry.id} size='icon' variant='ghost' asChild>
          <IconLink
            iconProps={{ name: entry.name }}
            accessibleLabel={entry.title}
            href={entry.href}
          />
        </Button>
      ))}
    </div>
  );
};
