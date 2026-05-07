'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { type Plugin } from '../plugins/plugin-types';
import { AppleLogo, WindowsLogo } from '../../components/ui/atoms/platform-logos';
import { AccountShell } from './account-shell';
import { useCart } from '../../context/cart-context';

interface DownloadableItem {
  id: string;
  createdAt: string;
  type: 'plugin' | 'tool';
  plugin?: Plugin;
  tool?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    priceCents: number;
    fileKey: string | null;
    category: string | null;
  };
  fileKey?: string | null;
}

export const DownloadsPage = () => {
  const [downloadableItems, setDownloadableItems] = useState<DownloadableItem[]>([]);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();

  // Clear cart on successful checkout
  useEffect(() => {
    const checkoutStatus = searchParams.get('checkout');
    if (checkoutStatus === 'success') {
      clearCart();
      // Remove query param to prevent repeated clears
      router.replace('/account/downloads', { scroll: false });
    }
  }, [searchParams, clearCart, router]);

  useEffect(() => {
    const loadDownloads = async () => {
      try {
        const response = await fetch('/api/downloads', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to load downloads');
        }
        const data = (await response.json()) as DownloadableItem[];
        setDownloadableItems(data);
      } catch (error) {
        console.error(error);
        setDownloadableItems([]);
      }
    };

    void loadDownloads();
  }, []);

  const handlePluginDownload = async (pluginId: string, platform: 'MAC' | 'WINDOWS') => {
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
        setDownloadError(data?.error || 'Unable to generate download link.');
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

  const handleToolDownload = async (toolId: string) => {
    setDownloadError(null);
    try {
      const res = await fetch(`/api/tools/downloads/${toolId}/generate-link`, {
        method: 'POST',
      });

      const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;

      if (!res.ok) {
        console.error('Tool download failed', data);
        setDownloadError(data?.error || 'Unable to generate download link.');
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error('Tool download failed', data);
        setDownloadError('Unable to generate download link.');
      }
    } catch (error) {
      console.error('Unable to generate tool download link.', error);
      setDownloadError('Unable to generate download link.');
    }
  };

  const getItemDetails = (item: DownloadableItem) => {
    if (item.type === 'plugin' && item.plugin) {
      return {
        id: item.plugin.id,
        name: item.plugin.name,
        slug: item.plugin.slug,
        description: item.plugin.description,
        price: item.plugin.price,
        version: item.plugin.version,
        fileSize: item.plugin.fileSize,
        format: item.plugin.format,
        fileKey: item.fileKey,
      };
    } else if (item.type === 'tool' && item.tool) {
      const priceCents = item.tool.priceCents;
      return {
        id: item.tool.id,
        name: item.tool.name,
        slug: item.tool.slug,
        description: item.tool.description,
        price: `$${(priceCents / 100).toFixed(2)}`,
        version: '1.0.0',
        fileSize: 'N/A',
        format: 'ZIP',
        fileKey: item.tool.fileKey,
      };
    }
    return null;
  };

  return (
    <AccountShell
      title='Your Downloads'
      subtitle='Download your purchased plugins and tools'
    >
      {downloadableItems.length === 0 ? (
        <div className='rounded-lg border border-gray-200 bg-gray-50/40 py-12 text-center'>
          <p className='text-gray-600 mb-6'>No downloads available yet</p>
          <div className='flex gap-4 justify-center'>
            <Link
              href='/plugins'
              className='inline-flex h-11 items-center justify-center rounded-lg bg-black px-6 text-white transition-opacity duration-200 ease-in-out hover:opacity-90'
            >
              Browse Plugins
            </Link>
            <Link
              href='/tools'
              className='inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 text-black transition-colors duration-200 ease-in-out hover:border-gray-400'
            >
              Browse Tools
            </Link>
          </div>
        </div>
      ) : (
        <div className='space-y-6'>
          {downloadError ? <p className='text-sm text-red-600'>{downloadError}</p> : null}
          {downloadableItems.map((item) => {
            const details = getItemDetails(item);
            if (!details) return null;

            return (
              <div key={`${item.type}-${item.id}`} className='rounded-lg border border-gray-200 bg-gray-50/40 p-6'>
                <div className='mb-5 flex items-start justify-between gap-6'>
                  <div className='min-w-0'>
                    <div className='flex items-center gap-2 mb-1'>
                      <h3 className='text-lg font-semibold text-black'>
                        {details.name}
                      </h3>
                      <span className='text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600'>
                        {item.type === 'plugin' ? 'Plugin' : 'Tool'}
                      </span>
                    </div>
                    <p className='text-gray-600 text-sm'>{details.description}</p>
                    <div className='mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500'>
                      <span>Version {details.version}</span>
                      <span>{details.fileSize}</span>
                      <span>{details.format}</span>
                      {item.type === 'plugin' && (
                        <span className='inline-flex items-center gap-2'>
                          <AppleLogo />
                          <WindowsLogo />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='shrink-0 text-right'>
                    <span className='text-lg font-bold text-black'>{details.price}</span>
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
                  {item.type === 'plugin' ? (
                    <>
                      <button
                        type='button'
                        onClick={() => {
                          void handlePluginDownload(details.id, 'MAC');
                        }}
                        disabled={!details.fileKey}
                        className='inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white transition-opacity duration-200 ease-in-out hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        {details.fileKey ? 'Download for Mac' : 'Download unavailable'}
                      </button>
                      <button
                        type='button'
                        onClick={() => {
                          void handlePluginDownload(details.id, 'WINDOWS');
                        }}
                        disabled={!details.fileKey}
                        className='inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-black transition-colors duration-200 ease-in-out hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        {details.fileKey ? 'Download for Windows' : 'Download unavailable'}
                      </button>
                    </>
                  ) : (
                    <button
                      type='button'
                      onClick={() => {
                        void handleToolDownload(details.id);
                      }}
                      disabled={!details.fileKey}
                      className='inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white transition-opacity duration-200 ease-in-out hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {details.fileKey ? 'Download Tool' : 'Download unavailable'}
                    </button>
                  )}
                  <Link
                    href={`/${item.type === 'plugin' ? 'plugins' : 'tools'}/${details.slug}`}
                    className='inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-black transition-colors duration-200 ease-in-out hover:border-gray-400'
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AccountShell>
  );
};
