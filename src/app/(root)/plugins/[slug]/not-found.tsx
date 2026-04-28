'use client';

import Link from 'next/link';
import { PluginsHeader } from '../../../../modules/plugins/plugins-header';

export default function PluginNotFound() {
  return (
    <div className='min-h-screen bg-white'>
      <PluginsHeader />
      
      <main className='w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center'>
        <div className='mb-8'>
          <h1 className='text-4xl sm:text-5xl font-bold text-black mb-6'>
            Plugin Not Found
          </h1>
          <p className='text-lg text-gray-600 mb-8'>
            The plugin you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className='space-y-4'>
          <Link
            href='/plugins'
            className='inline-block px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200'
          >
            Browse All Plugins
          </Link>
          
          <div className='text-gray-500'>
            <p>The plugin you're looking for doesn't exist.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
