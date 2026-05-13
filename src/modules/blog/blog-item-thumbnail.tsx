'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Content } from '~lib/content/provider';

import { Typography } from '~ui/atoms/typography';

import { cn } from '~utils/style';

interface BlogItemThumbnailProps {
  content: Content;
  className?: string;
}

export const BlogItemThumbnail = ({
  content,
  className,
}: BlogItemThumbnailProps) => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div
      className={cn(
        'relative flex aspect-[16/9] min-h-[9rem] w-full flex-initial items-center justify-center overflow-hidden rounded-xl border border-ctx-primary-fg-decorative/70 bg-gradient-to-br from-ctx-secondary to-ctx-primary',
        className
      )}
    >
      {content.thumbnail && !imageFailed ? (
        <Image
          fill
          priority
          sizes='(max-width: 768px) 100vw, 40vw'
          className='object-cover'
          src={content.thumbnail}
          alt={content.description}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <Typography
          className='px-4 text-center uppercase tracking-[0.08em]'
          variant='sm'
          color='secondary'
          weight='bold'
        >
          Insight Preview
        </Typography>
      )}
    </div>
  );
};
