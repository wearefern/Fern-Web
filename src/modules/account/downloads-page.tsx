'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { type Plugin } from '../plugins/plugin-types';
import { AppleLogo, WindowsLogo } from '../../components/ui/atoms/platform-logos';
import { AccountShell } from './account-shell';

export const DownloadsPage = () => {
  const [purchasedPluginDetails, setPurchasedPluginDetails] = useState<Plugin[]>([]);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    const loadDownloads = async () => {
      try {
        const response = await fetch('/api/downloads', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to load downloads');
        }
        const data = (await response.json()) as { plugin: Plugin }[];
        setPurchasedPluginDetails(data.map((item) => item.plugin));
      } catch (error) {
        console.error(error);
        setPurchasedPluginDetails([]);
      }
    };

    void loadDownloads();
  }, []);

  const handleDownload = async (pluginId: string, platform: 'MAC' | 'WINDOWS') => {
    setDownloadError(null);
    try {
      const res = await fetch(`/api/downloads/${pluginId}/generate-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platform }),
      });

      const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;

      if (!res.ok) {
        console.error('Download failed', data);
        setDownloadError('Unable to generate download link.');
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error('Download failed', data);
        setDownloadError('Unable to generate download link.');
      }
    } catch (error) {
      console.error('Unable to generate download link.', error);
      setDownloadError('Unable to generate download link.');
    }
  };

  return (
    <AccountShell
      title='Your Downloads'
      subtitle='Download your purchased plugins'
    >
      {purchasedPluginDetails.length === 0 ? (
        <div className='rounded-lg border border-gray-200 bg-gray-50/40 py-12 text-center'>
          <p className='text-gray-600 mb-6'>No downloads available yet</p>
          <Link
            href='/plugins'
            className='inline-flex h-11 items-center justify-center rounded-lg bg-black px-6 text-white transition-opacity duration-200 ease-in-out hover:opacity-90'
          >
            Browse Plugins
          </Link>
        </div>
      ) : (
        <div className='space-y-6'>
          {downloadError ? <p className='text-sm text-red-600'>{downloadError}</p> : null}
          {purchasedPluginDetails.map((plugin) => (
            <div key={plugin.id} className='rounded-lg border border-gray-200 bg-gray-50/40 p-6'>
              <div className='mb-5 flex items-start justify-between gap-6'>
                <div className='min-w-0'>
                  <h3 className='text-lg font-semibold text-black mb-1'>
                    {plugin.name}
                  </h3>
                  <p className='text-gray-600 text-sm'>{plugin.description}</p>
                  <div className='mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500'>
                    <span>Version {plugin.version}</span>
                    <span>{plugin.fileSize}</span>
                    <span>{plugin.format}</span>
                    <span className='inline-flex items-center gap-2'>
                      <AppleLogo />
                      <WindowsLogo />
                    </span>
                  </div>
                </div>
                <div className='shrink-0 text-right'>
                  <span className='text-lg font-bold text-black'>{plugin.price}</span>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
                <button
                  type='button'
                  onClick={() => {
                    void handleDownload(plugin.id, 'MAC');
                  }}
                  className='inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white transition-opacity duration-200 ease-in-out hover:opacity-90'
                >
                  Download for Mac
                </button>
                <button
                  type='button'
                  onClick={() => {
                    void handleDownload(plugin.id, 'WINDOWS');
                  }}
                  className='inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-black transition-colors duration-200 ease-in-out hover:border-gray-400'
                >
                  Download for Windows
                </button>
                <Link
                  href={`/plugins/${plugin.slug}`}
                  className='inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-black transition-colors duration-200 ease-in-out hover:border-gray-400'
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </AccountShell>
  );
};
