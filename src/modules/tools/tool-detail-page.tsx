'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { PluginsHeader } from '~modules/plugins/plugins-header';
import { type Tool, formatToolPrice } from './tool-types';

interface ToolDetailPageProps {
  tool: Tool;
}

export const ToolDetailPage = ({ tool }: ToolDetailPageProps) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleAction = async () => {
    setError(null);
    if (tool.status === 'coming_soon') return;

    try {
      if (tool.status === 'free') {
        const response = await fetch('/api/tools/free-download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolId: tool.id }),
        });
        if (!response.ok) throw new Error('Unable to claim free tool');
        router.push('/account/tools/downloads');
        return;
      }

      const response = await fetch('/api/tools/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: tool.id }),
      });
      const data = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (!response.ok || !data?.url) throw new Error(data?.error ?? 'Unable to checkout');
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setError('Unable to continue right now. Please try again.');
    }
  };

  return (
    <div className='min-h-screen bg-white'>
      <PluginsHeader />
      <main className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24'>
        <div className='mb-16'>
          <div className='flex items-center gap-4 mb-6'>
            <span className='text-xs font-medium uppercase tracking-wider text-gray-400'>{tool.category ?? 'General'}</span>
            <span className='text-xs font-medium text-gray-500'>Digital Download</span>
          </div>

          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight'>{tool.name}</h1>
          <p className='text-lg text-gray-600 max-w-3xl leading-relaxed mb-8'>
            {tool.longDescription ?? tool.description}
          </p>

          <div className='flex items-center gap-6 mb-8'>
            <span className='text-3xl font-bold text-black'>{formatToolPrice(tool)}</span>
            <span className='text-sm text-gray-500'>Instant Access</span>
          </div>

          <button
            type='button'
            onClick={() => void handleAction()}
            disabled={tool.status === 'coming_soon'}
            className='px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {tool.status === 'free' ? 'Get Free' : tool.status === 'coming_soon' ? 'Coming Soon' : 'Buy Tool'}
          </button>
          {error ? <p className='text-sm text-red-600 mt-3'>{error}</p> : null}
        </div>
      </main>
    </div>
  );
};
