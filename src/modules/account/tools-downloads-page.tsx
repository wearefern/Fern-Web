'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { AccountShell } from './account-shell';
import { Tool, formatToolPrice } from '~modules/tools/tool-types';

export const ToolsDownloadsPage = () => {
  const [ownedTools, setOwnedTools] = useState<Tool[]>([]);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    const loadDownloads = async () => {
      try {
        const response = await fetch('/api/account/tools/downloads', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to load tool downloads');
        }
        const data = (await response.json()) as { tool: Tool }[];
        setOwnedTools(data.map((item) => item.tool));
      } catch (error) {
        console.error(error);
        setOwnedTools([]);
      }
    };

    void loadDownloads();
  }, []);

  const handleDownload = async (toolId: string) => {
    setDownloadError(null);
    try {
      const res = await fetch(`/api/tools/downloads/${toolId}/generate-link`, {
        method: 'POST',
      });

      const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;

      if (!res.ok || !data?.url) {
        setDownloadError(data?.error ?? 'Unable to generate download link.');
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      setDownloadError('Unable to generate download link.');
    }
  };

  return (
    <AccountShell
      title='Tool Downloads'
      subtitle='Download tools you have purchased or claimed.'
    >
      {ownedTools.length === 0 ? (
        <div className='rounded-lg border border-gray-200 bg-gray-50/40 py-12 text-center'>
          <p className='text-gray-600 mb-6'>No tool downloads available yet</p>
          <Link
            href='/tools'
            className='inline-flex h-11 items-center justify-center rounded-lg bg-black px-6 text-white transition-opacity duration-200 ease-in-out hover:opacity-90'
          >
            Browse Tools
          </Link>
        </div>
      ) : (
        <div className='space-y-6'>
          {downloadError ? <p className='text-sm text-red-600'>{downloadError}</p> : null}
          {ownedTools.map((tool) => (
            <div key={tool.id} className='rounded-lg border border-gray-200 bg-gray-50/40 p-6'>
              <div className='mb-5 flex items-start justify-between gap-6'>
                <div className='min-w-0'>
                  <h3 className='text-lg font-semibold text-black mb-1'>{tool.name}</h3>
                  <p className='text-gray-600 text-sm'>{tool.description}</p>
                  <div className='mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500'>
                    <span>{tool.category ?? 'General'}</span>
                    <span>Digital Download</span>
                  </div>
                </div>
                <div className='shrink-0 text-right'>
                  <span className='text-lg font-bold text-black'>{formatToolPrice(tool)}</span>
                </div>
              </div>
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                <button
                  type='button'
                  onClick={() => void handleDownload(tool.id)}
                  className='inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white transition-opacity duration-200 ease-in-out hover:opacity-90'
                >
                  Download
                </button>
                <Link
                  href={`/tools/${tool.slug}`}
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
