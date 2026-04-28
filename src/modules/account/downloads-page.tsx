'use client';

import Link from 'next/link';
import { useUser } from '../../context/user-context';
import { getAllPlugins } from '../../data/plugins-data';
import { PluginsHeader } from '../plugins/plugins-header';

export const DownloadsPage = () => {
  const { purchasedPlugins } = useUser();
  const allPlugins = getAllPlugins();
  
  // Filter plugins that have been purchased
  const purchasedPluginDetails = allPlugins.filter(plugin => 
    purchasedPlugins.includes(plugin.id)
  );

  return (
    <div className='min-h-screen bg-white'>
      <PluginsHeader />
      
      <main className='w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-black mb-2'>Your Downloads</h1>
          <p className='text-gray-600'>Download your purchased plugins</p>
        </div>

        {purchasedPluginDetails.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-600 mb-6'>You haven't purchased any plugins yet</p>
            <Link
              href='/plugins'
              className='inline-block px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200'
            >
              Browse Plugins
            </Link>
          </div>
        ) : (
          <div className='space-y-6'>
            {purchasedPluginDetails.map((plugin) => (
              <div key={plugin.id} className='bg-white border border-gray-300 rounded-lg p-6'>
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h3 className='text-lg font-semibold text-black mb-1'>
                      {plugin.name}
                    </h3>
                    <p className='text-gray-600 text-sm'>{plugin.description}</p>
                    <div className='flex items-center gap-4 mt-2'>
                      <span className='text-sm text-gray-500'>{plugin.version}</span>
                      <span className='text-sm text-gray-500'>{plugin.fileSize}</span>
                      <span className='text-sm text-gray-500'>{plugin.format}</span>
                    </div>
                  </div>
                  <div className='text-right'>
                    <span className='text-lg font-bold text-black'>{plugin.price}</span>
                  </div>
                </div>

                <div className='flex gap-4'>
                  <Link
                    href={`/plugins/${plugin.slug}/download`}
                    className='px-4 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors duration-200'
                  >
                    Go to Download
                  </Link>
                  <Link
                    href={`/plugins/${plugin.slug}`}
                    className='px-4 py-2 bg-white border border-gray-300 text-black font-medium rounded-md hover:border-gray-400 transition-colors duration-200'
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
