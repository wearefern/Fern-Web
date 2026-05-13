'use client';

import { SignUp } from '@clerk/nextjs';

import { PluginsHeader } from '~modules/plugins/plugins-header';

export default function SignUpPage() {
  return (
    <div className='min-h-screen bg-white'>
      <PluginsHeader />

      <main className='w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24'>
        <div className='mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-gray-50/40 p-6 sm:p-8'>
          <h1 className='text-3xl font-bold text-black mb-2'>Fern</h1>
          <p className='text-gray-600 mb-6'>Create your account</p>

          <SignUp
            routing='path'
            path='/sign-up'
            signInUrl='/sign-in'
            appearance={{
              elements: {
                card: 'shadow-none border border-gray-200 rounded-xl bg-white',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton:
                  'border border-gray-200 text-black hover:bg-gray-50',
                formButtonPrimary: 'bg-black text-white hover:bg-gray-800 shadow-none',
                footerActionLink: 'text-black underline',
                formFieldInput: 'border-gray-300 focus:border-gray-500 focus:ring-0',
              },
            }}
          />
        </div>
      </main>
    </div>
  );
}
