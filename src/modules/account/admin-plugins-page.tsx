'use client';

import { useEffect, useState } from 'react';

import { AccountShell } from './account-shell';
import { getPluginDemoControls, parseDemoControls } from '~modules/plugins/demo-controls';

interface AdminPlugin {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priceCents: number;
  status: string;
  previewUrl: string | null;
  fileKey: string | null;
  demoControls: unknown;
}

export function AdminPluginsPage() {
  const [plugins, setPlugins] = useState<AdminPlugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [controlErrors, setControlErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/admin/plugins', { cache: 'no-store' });
        if (!response.ok) return;
        const data = (await response.json()) as AdminPlugin[];
        setPlugins(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const updatePlugin = async (plugin: AdminPlugin) => {
    await fetch(`/api/admin/plugins/${plugin.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: plugin.name,
        slug: plugin.slug,
        description: plugin.description,
        priceCents: plugin.priceCents,
        status: plugin.status,
        previewUrl: plugin.previewUrl,
        fileKey: plugin.fileKey,
      }),
    });
  };

  const updateDemoControls = async (plugin: AdminPlugin) => {
    const text = (plugin.demoControls as string) ?? '';
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(text);
    } catch (error) {
      console.error(error);
      setControlErrors((prev) => ({ ...prev, [plugin.id]: 'Invalid JSON.' }));
      return;
    }

    const parsed = parseDemoControls(parsedJson);
    if (!parsed) {
      setControlErrors((prev) => ({
        ...prev,
        [plugin.id]: 'Expected demoControls.controls with valid key/label/min/max/default values.',
      }));
      return;
    }

    setControlErrors((prev) => ({ ...prev, [plugin.id]: '' }));
    const response = await fetch(`/api/admin/plugins/${plugin.id}/demo-controls`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demoControls: parsed }),
    });

    if (!response.ok) {
      setControlErrors((prev) => ({ ...prev, [plugin.id]: 'Unable to save demo controls.' }));
    }
  };

  return (
    <AccountShell
      title='Admin Plugins'
      subtitle='Manage plugin catalog and demo defaults.'
    >
      {loading ? <p className='text-gray-600'>Loading plugins...</p> : null}
      <div className='space-y-6'>
        {plugins.map((plugin) => (
          <div key={plugin.id} className='rounded-lg border border-gray-200 bg-white p-6'>

            <h3 className='font-semibold text-lg'>
              {plugin.name} ({plugin.slug})
            </h3>
            <div className='grid gap-3 sm:grid-cols-2'>
              <input className='border border-gray-300 rounded px-3 py-2' value={plugin.name} onChange={(e) => setPlugins((prev) => prev.map((item) => item.id === plugin.id ? { ...item, name: e.target.value } : item))} />
              <input className='border border-gray-300 rounded px-3 py-2' value={plugin.slug} onChange={(e) => setPlugins((prev) => prev.map((item) => item.id === plugin.id ? { ...item, slug: e.target.value } : item))} />
              <input className='border border-gray-300 rounded px-3 py-2' value={plugin.status} onChange={(e) => setPlugins((prev) => prev.map((item) => item.id === plugin.id ? { ...item, status: e.target.value } : item))} />
              <input className='border border-gray-300 rounded px-3 py-2' type='number' value={plugin.priceCents} onChange={(e) => setPlugins((prev) => prev.map((item) => item.id === plugin.id ? { ...item, priceCents: Number(e.target.value) } : item))} />
              <input className='border border-gray-300 rounded px-3 py-2' placeholder='/audio/baby.mp3 (no public prefix)' value={plugin.previewUrl ?? ''} onChange={(e) => setPlugins((prev) => prev.map((item) => item.id === plugin.id ? { ...item, previewUrl: e.target.value } : item))} />
              <input className='border border-gray-300 rounded px-3 py-2' placeholder='File key' value={plugin.fileKey ?? ''} onChange={(e) => setPlugins((prev) => prev.map((item) => item.id === plugin.id ? { ...item, fileKey: e.target.value } : item))} />
            </div>
            <textarea className='mt-3 w-full border border-gray-300 rounded px-3 py-2' value={plugin.description ?? ''} onChange={(e) => setPlugins((prev) => prev.map((item) => item.id === plugin.id ? { ...item, description: e.target.value } : item))} />
            <textarea
              className='mt-3 w-full border border-gray-300 rounded px-3 py-2 font-mono text-sm'
              rows={8}
              value={
                typeof plugin.demoControls === 'string'
                  ? plugin.demoControls
                  : JSON.stringify(
                      getPluginDemoControls(plugin.slug, plugin.demoControls) ?? { controls: [] },
                      null,
                      2
                    )
              }
              onChange={(e) =>
                setPlugins((prev) =>
                  prev.map((item) =>
                    item.id === plugin.id
                      ? {
                          ...item,
                          demoControls: e.target.value,
                        }
                      : item
                  )
                )
              }
            />
            {controlErrors[plugin.id] ? (
              <p className='mt-2 text-sm text-red-600'>{controlErrors[plugin.id]}</p>
            ) : null}
            <button
              type='button'
              onClick={() => void updatePlugin(plugin)}
              className='mt-4 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90'
            >
              Save Plugin
            </button>
            <button
              type='button'
              onClick={() => void updateDemoControls(plugin)}
              className='mt-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-black hover:border-gray-400'
            >
              Save Demo Controls
            </button>
          </div>
        ))}
      </div>
    </AccountShell>
  );
}
