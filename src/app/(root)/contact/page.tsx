import { SOCIALS } from '~constants/index';

import { HomeHeader } from '~modules/home/home-header';

import { Button } from '~ui/atoms/button';
import { Typography } from '~ui/atoms/typography';

/* -------------------------------------------------------------------------------------------------
 * ContactPage
 * -----------------------------------------------------------------------------------------------*/

const inputClassName =
  'h-16 w-full rounded-2xl border border-ctx-primary-fg-decorative bg-transparent px-5 text-lg text-ctx-primary-fg-primary outline-none transition-colors duration-300 placeholder:text-ctx-primary-fg-hint focus:border-ctx-primary-fg-solid';

export default function ContactPage() {
  return (
    <main className='min-h-screen bg-ctx-primary'>
      <HomeHeader />

      <section className='layout-width-limiter layout-padding flex min-h-screen w-full flex-col items-center pt-[22vh] pb-16 sm:pb-20'>
        <div className='w-full max-w-[68rem]'>
          <div className='mx-auto max-w-[58rem] text-center'>
            <Typography
              variant='hero'
              weight='medium'
              prose={false}
              className='text-pretty text-[4rem] leading-[0.92] tracking-[-0.07em] sm:text-[5.75rem] lg:text-[7rem] xl:text-[7.5rem]'
            >
              Contact our team
            </Typography>

            <Typography
              color='secondary'
              className='mx-auto mt-4 max-w-3xl text-base leading-8 sm:text-xl'
            >
              Got an idea or just want to talk? We&apos;d love to hear from you.
            </Typography>
          </div>

          <div className='mx-auto mt-16 grid max-w-[40rem] gap-7 sm:mt-20'>
            <label className='block'>
              <Typography
                variant='body'
                weight='medium'
                prose={false}
                className='mb-3 text-[1.05rem]'
              >
                Name
              </Typography>
              <input
                type='text'
                name='name'
                placeholder='Enter your name'
                className={inputClassName}
              />
            </label>

            <label className='block'>
              <Typography
                variant='body'
                weight='medium'
                prose={false}
                className='mb-3 text-[1.05rem]'
              >
                Email
              </Typography>
              <input
                type='email'
                name='email'
                placeholder='Enter your email'
                className={inputClassName}
              />
            </label>

            <label className='block'>
              <Typography
                variant='body'
                weight='medium'
                prose={false}
                className='mb-3 text-[1.05rem]'
              >
                Mobile Number
              </Typography>
              <input
                type='tel'
                name='mobile'
                placeholder='Enter your mobile number'
                className={inputClassName}
              />
            </label>

            <label className='block'>
              <Typography
                variant='body'
                weight='medium'
                prose={false}
                className='mb-3 text-[1.05rem]'
              >
                Message
              </Typography>
              <textarea
                name='brief'
                rows={6}
                placeholder='Hi Fern,'
                className='w-full rounded-2xl border border-ctx-primary-fg-decorative bg-transparent px-5 py-4 text-lg text-ctx-primary-fg-primary outline-none transition-colors duration-300 placeholder:text-ctx-primary-fg-hint focus:border-ctx-primary-fg-solid'
              />
            </label>

            <div className='pt-2'>
              <Button className='rounded-xl px-6 py-4 text-sm font-medium'>
                <a href={`mailto:${SOCIALS.mail.url}`}>Send message</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
