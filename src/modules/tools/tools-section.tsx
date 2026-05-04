'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { PluginsHeader } from '~modules/plugins/plugins-header';
import { ToolCard } from './tool-card';
import { type Tool } from './tool-types';

const categories = ['All', 'Operations', 'Client', 'Finance', 'Engineering', 'Marketing'];

export const ToolsSection = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [actionError, setActionError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [checkoutCancelled, setCheckoutCancelled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    setCheckoutCancelled(params.get('cancelled') === '1');
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/tools', { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch tools');
        const data = (await response.json()) as Tool[];
        setTools(data);
      } catch (error) {
        console.error(error);
        setTools([]);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const filtered = useMemo(
    () => (selectedCategory === 'All' ? tools : tools.filter((tool) => tool.category === selectedCategory)),
    [selectedCategory, tools]
  );

  const handleAction = async (tool: Tool) => {
    setActionError(null);
    if (tool.status === 'coming_soon') return;

    setSubmittingId(tool.id);
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
      if (!response.ok || !data?.url) throw new Error(data?.error ?? 'Unable to create checkout session');
      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      setActionError('Unable to continue. Please try again.');
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className='min-h-screen bg-white'>
      <PluginsHeader />
      <section className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24'>
        <div className='text-center mb-16'>
          <div className='mb-6'>
            <span className='text-xs font-medium uppercase tracking-wider text-gray-400'>FERN TOOLS</span>
          </div>
          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight'>
            Practical Digital Tools
          </h1>
          <p className='text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed'>
            Download ready-to-use templates, checklists, and starter kits for your product and operations workflows.
          </p>
          {checkoutCancelled ? <p className='text-sm text-gray-600 mt-4'>Checkout cancelled.</p> : null}
        </div>

        <div className='flex flex-wrap justify-center gap-2 mb-16'>
          {categories.map((category) => (
            <button
              key={category}
              type='button'
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                selectedCategory === category
                  ? 'bg-black border-black text-white'
                  : 'bg-white border-gray-300 text-black hover:border-gray-400'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? <p className='text-gray-600 text-center'>Loading tools...</p> : null}
        {actionError ? <p className='mb-4 text-sm text-red-600 text-center'>{actionError}</p> : null}

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {filtered.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onPrimaryAction={(selectedTool) => {
                void handleAction(selectedTool);
              }}
              actionLoading={submittingId === tool.id}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
