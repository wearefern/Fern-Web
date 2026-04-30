'use client';

import Link from 'next/link';
import { type Plugin } from './plugin-types';
import { useUser } from '../../context/user-context';
import { PluginsHeader } from './plugins-header';
import { AppleLogo, WindowsLogo } from '../../components/ui/atoms/platform-logos';

interface PluginDownloadPageProps {
  plugin: Plugin;
}

export const PluginDownloadPage = ({ plugin }: PluginDownloadPageProps) => {
  const { isPluginPurchased } = useUser();
  const hasPurchased = isPluginPurchased(plugin.id);

  if (!hasPurchased) {
    return (
      <div className='min-h-screen bg-white'>
        <PluginsHeader />
        
        <main className='w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-black mb-4'>Download {plugin.name}</h1>
            
            <div className='bg-gray-50 border border-gray-300 rounded-lg p-8 mb-8 max-w-md mx-auto'>
              <p className='text-gray-600 mb-6'>
                You must purchase this plugin before downloading
              </p>
              
              <div className='space-y-4'>
                <Link
                  href={`/plugins/${plugin.slug}`}
                  className='block w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 text-center'
                >
                  Go to Plugin Page
                </Link>
                
                <Link
                  href='/account/downloads'
                  className='block w-full px-6 py-3 bg-white border border-gray-300 text-black font-medium rounded-lg hover:border-gray-400 transition-colors duration-200 text-center'
                >
                  View Your Downloads
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      <PluginsHeader />
      
      <main className='w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-black mb-2'>Download {plugin.name}</h1>
          <p className='text-gray-600'>Choose your platform to download the plugin.</p>
        </div>

        {/* Plugin Info */}
        <div className='bg-gray-50 border border-gray-300 rounded-lg p-6 mb-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <h3 className='font-semibold text-black mb-1'>Version</h3>
              <p className='text-gray-700'>{plugin.version}</p>
            </div>
            <div>
              <h3 className='font-semibold text-black mb-1'>File Size</h3>
              <p className='text-gray-700'>{plugin.fileSize}</p>
            </div>
            <div>
              <h3 className='font-semibold text-black mb-1'>Format</h3>
              <p className='text-gray-700'>{plugin.format}</p>
            </div>
            <div>
              <h3 className='font-semibold text-black mb-1'>Compatibility</h3>
              <p className='text-gray-700'>{plugin.compatibility}</p>
            </div>
          </div>
        </div>

        {/* Platform Download Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          {/* macOS Card */}
          <div className='bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors duration-200'>
            <div className='flex items-center gap-4'>
              {/* Platform Logo */}
              <div className='flex-shrink-0'>
                <AppleLogo />
              </div>
              
              {/* Platform Info */}
              <div className='flex-1'>
                <h3 className='text-lg font-semibold text-black mb-1'>macOS</h3>
                <p className='text-gray-600 text-sm mb-1'>VST3, AU</p>
                <p className='text-gray-500 text-sm'>{plugin.fileSize}</p>
                <p className='text-gray-500 text-xs mt-1'>{plugin.compatibility}</p>
              </div>
            </div>
            
            {/* Download Button */}
            <div className='mt-4'>
              <a
                href={plugin.macDownloadUrl}
                className='block w-full px-4 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors duration-200 text-center text-sm'
              >
                Download for macOS
              </a>
            </div>
          </div>

          {/* Windows Card */}
          <div className='bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors duration-200'>
            <div className='flex items-center gap-4'>
              {/* Platform Logo */}
              <div className='flex-shrink-0'>
                <WindowsLogo />
              </div>
              
              {/* Platform Info */}
              <div className='flex-1'>
                <h3 className='text-lg font-semibold text-black mb-1'>Windows</h3>
                <p className='text-gray-600 text-sm mb-1'>VST3</p>
                <p className='text-gray-500 text-sm'>{plugin.fileSize}</p>
                <p className='text-gray-500 text-xs mt-1'>{plugin.compatibility}</p>
              </div>
            </div>
            
            {/* Download Button */}
            <div className='mt-4'>
              <a
                href={plugin.windowsDownloadUrl}
                className='block w-full px-4 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors duration-200 text-center text-sm'
              >
                Download for Windows
              </a>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className='text-center'>
          <p className='text-gray-600 text-sm mb-4'>
            Need help? Check our installation guide or contact support.
          </p>
          <div className='space-x-4'>
            <Link
              href={`/plugins/${plugin.slug}`}
              className='text-black hover:underline text-sm'
            >
              Back to Plugin Details
            </Link>
            <Link
              href='/account/downloads'
              className='text-black hover:underline text-sm'
            >
              View All Downloads
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
