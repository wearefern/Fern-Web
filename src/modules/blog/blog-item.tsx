import Image from 'next/image';
import Link, { LinkProps } from 'next/link';

import { Content } from '~lib/content/provider';

import { Typography } from '~ui/atoms/typography';
import { ContentIcon } from '~ui/molecules/content-icon';
import { TagsList } from '~ui/organisms/tags-list';

import { dayMonthNameAndYearDate, readingTime } from '~utils/string';
import { cn } from '~utils/style';

/* -------------------------------------------------------------------------------------------------
 * BlogItem
 * -----------------------------------------------------------------------------------------------*/

interface BlogItemProps extends Partial<LinkProps> {
  content: Content;
  className?: string;
}

const BlogItem = ({ content, className, ...rest }: BlogItemProps) => {
  return (
    <Link
      className={cn(
        'group flex w-full cursor-pointer border-t border-ctx-primary-fg-decorative py-8 transition-opacity hover:opacity-80',
        className
      )}
      key={content.slug}
      href={`/blog/${content.slug}`}
      {...rest}
    >
      <article className='flex w-full flex-col' key={content.slug}>
        <div className='grid w-full gap-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-x-10 lg:grid-cols-[11rem_minmax(0,1fr)]'>
          <div className='flex flex-wrap items-center gap-3 self-start sm:block'>
            <Typography
              className='uppercase'
              variant='sm'
              weight='bold'
              color='secondary'
            >
              {content.type.replace('-', ' ')}
            </Typography>

            <Typography
              className='whitespace-nowrap sm:mt-3'
              variant='body-sm'
              weight='normal'
              color='hint'
            >
              {dayMonthNameAndYearDate(new Date(content.date))}
            </Typography>
          </div>

          <div className='grid gap-5 md:grid-cols-[minmax(0,1fr)_10rem] md:gap-8'>
            <div>
              <Typography
                className='inline-block text-xl leading-7 underline-offset-4 group-hover:underline sm:text-2xl sm:leading-8'
                asChild
                prose={false}
                balance
              >
                <h3>
                  <ContentIcon
                    className='mr-2 inline align-middle'
                    contentType={content.type}
                  />
                  {content.title}
                </h3>
              </Typography>

              <Typography
                className='mt-4 max-w-3xl'
                variant='body-sm'
                color='secondary'
                weight='normal'
              >
                {content.description}
              </Typography>

              <div className='mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6'>
                <Typography variant='sm' color='hint' weight='normal'>
                  {readingTime(content.body)}
                </Typography>

                <TagsList tags={content.tags} />
              </div>
            </div>

            <ItemThumbnail className='hidden md:flex' content={content} />
          </div>
        </div>
      </article>
    </Link>
  );
};

/* -------------------------------------------------------------------------------------------------
 * BlogFeatureItem
 * -----------------------------------------------------------------------------------------------*/

const BlogFeatureItem = ({ content, className, ...rest }: BlogItemProps) => {
  return (
    <Link
      className={cn(
        'group grid w-full cursor-pointer gap-6 rounded-2xl border border-ctx-primary-fg-hint bg-ctx-primary p-4 transition-colors hover:border-ctx-primary-fg-secondary sm:grid-cols-[minmax(0,1fr)_18rem] sm:p-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-10',
        className
      )}
      key={content.slug}
      href={`/blog/${content.slug}`}
      {...rest}
    >
      <article className='flex min-w-0 flex-col justify-center'>
        <Typography
          className='uppercase'
          variant='sm'
          color='secondary'
          weight='bold'
        >
          Featured {content.type.replace('-', ' ')}
        </Typography>

        <Typography
          className='mt-4 text-2xl leading-8 underline-offset-4 group-hover:underline sm:text-3xl sm:leading-10'
          asChild
          prose={false}
          balance
        >
          <h3>
            <ContentIcon
              className='mr-2 inline align-middle'
              contentType={content.type}
            />
            {content.title}
          </h3>
        </Typography>

        <Typography
          className='mt-5 max-w-3xl'
          color='secondary'
          weight='normal'
        >
          {content.description}
        </Typography>

        <div className='mt-6 flex flex-col gap-3 border-t border-ctx-primary-fg-decorative pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6'>
          <Typography variant='body-sm' color='hint' weight='normal'>
            {dayMonthNameAndYearDate(new Date(content.date))}
          </Typography>

          <Typography variant='sm' color='hint' weight='normal'>
            {readingTime(content.body)}
          </Typography>

          <TagsList tags={content.tags} />
        </div>
      </article>

      <ItemThumbnail className='min-h-48 sm:min-h-full' content={content} />
    </Link>
  );
};

/* -------------------------------------------------------------------------------------------------
 * BlogSecondaryItem
 * -----------------------------------------------------------------------------------------------*/

const BlogSecondaryItem = ({ content, className, ...rest }: BlogItemProps) => {
  return (
    <Link
      className={cn(
        'group flex h-full flex-col rounded-2xl border border-ctx-primary-fg-hint bg-ctx-primary p-4 transition-colors hover:border-ctx-primary-fg-secondary sm:p-5',
        className
      )}
      key={content.slug}
      href={`/blog/${content.slug}`}
      {...rest}
    >
      <article className='flex h-full flex-col'>
        <Typography
          className='uppercase'
          variant='sm'
          color='secondary'
          weight='bold'
        >
          {content.type.replace('-', ' ')}
        </Typography>

        <Typography
          className='mt-3 text-lg leading-7 underline-offset-4 group-hover:underline'
          asChild
          prose={false}
          balance
        >
          <h3>{content.title}</h3>
        </Typography>

        <Typography
          className='mt-3 line-clamp-3'
          variant='body-sm'
          color='secondary'
          weight='normal'
        >
          {content.description}
        </Typography>

        <div className='mt-auto flex flex-col gap-3 pt-5'>
          <Typography variant='sm' color='hint' weight='normal'>
            {dayMonthNameAndYearDate(new Date(content.date))}
          </Typography>

          <TagsList tags={content.tags} />
        </div>
      </article>
    </Link>
  );
};

/* -------------------------------------------------------------------------------------------------
 * ItemThumbnail
 * -----------------------------------------------------------------------------------------------*/

interface ItemThumbnailProps {
  content: Content;
  className?: string;
}

const ItemThumbnail = ({ content, className }: ItemThumbnailProps) => {
  return (
    <div
      className={cn(
        'relative flex aspect-video h-min w-full flex-initial flex-col items-center justify-center overflow-hidden rounded-xl bg-ctx-secondary',
        className
      )}
    >
      {content.thumbnail ? (
        <Image
          fill
          priority
          sizes='100%'
          className='object-cover'
          src={content.thumbnail}
          alt={content.description}
        />
      ) : (
        <Typography
          className='uppercase'
          variant='sm'
          color='secondary'
          weight='bold'
        >
          Soon
        </Typography>
      )}
    </div>
  );
};

ItemThumbnail.displayName = 'ItemThumbnail';

/* -----------------------------------------------------------------------------------------------*/

export { BlogFeatureItem, BlogItem, BlogSecondaryItem };
export type { BlogItemProps };
