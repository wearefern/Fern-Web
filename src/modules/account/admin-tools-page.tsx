'use client';

import { useEffect, useState } from 'react';

import { AccountShell } from './account-shell';

interface AdminTool {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priceCents: number;
  status: string;
  category: string | null;
  previewImageUrl: string | null;
  fileKey: string | null;
  createdAt: string;
  updatedAt: string;
}

export function AdminToolsPage() {
  const [tools, setTools] = useState<AdminTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newTool, setNewTool] = useState<Partial<AdminTool>>({
    name: '',
    slug: '',
    description: '',
    priceCents: 0,
    status: 'active',
    category: '',
    previewImageUrl: '',
    fileKey: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/admin/tools', { cache: 'no-store' });
        if (!response.ok) return;
        const data = (await response.json()) as AdminTool[];
        setTools(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const updateTool = async (tool: AdminTool) => {
    try {
      await fetch(`/api/admin/tools/${tool.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tool.name,
          slug: tool.slug,
          description: tool.description,
          priceCents: tool.priceCents,
          status: tool.status,
          category: tool.category,
          previewImageUrl: tool.previewImageUrl,
          fileKey: tool.fileKey,
        }),
      });
    } catch (error) {
      console.error('Failed to update tool:', error);
    }
  };

  const deleteTool = async (toolId: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;
    
    try {
      await fetch(`/api/admin/tools/${toolId}`, {
        method: 'DELETE',
      });
      setTools(prev => prev.filter(tool => tool.id !== toolId));
    } catch (error) {
      console.error('Failed to delete tool:', error);
    }
  };

  const createTool = async () => {
    if (!newTool.name || !newTool.slug) {
      alert('Name and slug are required');
      return;
    }

    try {
      const response = await fetch('/api/admin/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTool),
      });

      if (response.ok) {
        const createdTool = await response.json() as AdminTool;
        setTools(prev => [...prev, createdTool]);
        setNewTool({
          name: '',
          slug: '',
          description: '',
          priceCents: 0,
          status: 'active',
          category: '',
          previewImageUrl: '',
          fileKey: '',
        });
      }
    } catch (error) {
      console.error('Failed to create tool:', error);
    }
  };

  const handleFileUpload = async (toolId: string, file: File) => {
    setUploading(true);
    try {
      console.log('ADMIN UPLOAD START: toolId:', toolId, 'file:', file.name);

      // Step 1: Get signed upload URL from R2
      const urlResponse = await fetch('/api/admin/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          fileType: 'tool',
        }),
      } as RequestInit);

      if (!urlResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const data: { uploadUrl: string; fileKey: string } = await urlResponse.json();
      const { uploadUrl, fileKey } = data;
      console.log('ADMIN UPLOAD: Got fileKey:', fileKey);

      // Step 2: Upload file directly to R2
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      } as RequestInit);

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }
      console.log('ADMIN UPLOAD: File uploaded to R2 successfully');

      // Step 3: Update tool record with fileKey
      const patchResponse = await fetch(`/api/admin/tools/${toolId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileKey }),
      });

      if (!patchResponse.ok) {
        const errorText = await patchResponse.text();
        console.error('ADMIN UPLOAD FILEKEY SAVE FAILED:', errorText);
        throw new Error('Failed to save fileKey to database');
      }

      console.log('ADMIN UPLOAD FILEKEY SAVED: toolId:', toolId, 'fileKey:', fileKey);

      // Reload tools from server to verify persistence
      const reloadResponse = await fetch('/api/admin/tools', { cache: 'no-store' });
      if (reloadResponse.ok) {
        const reloadedData = (await reloadResponse.json()) as AdminTool[];
        setTools(reloadedData);
        console.log('ADMIN UPLOAD: Reloaded tools from server, fileKey persisted');
      }
    } catch (error) {
      console.error('ADMIN UPLOAD ERROR:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AccountShell
      title='Admin Tools'
      subtitle='Manage tool catalog and downloads.'
    >
      {loading ? <p className='text-gray-600'>Loading tools...</p> : null}
      
      {/* Create New Tool */}
      <div className='mb-8 rounded-lg border border-gray-200 bg-white p-6'>
        <h3 className='font-semibold text-lg mb-4'>Create New Tool</h3>
        <div className='grid gap-3 sm:grid-cols-2'>
          <input 
            className='border border-gray-300 rounded px-3 py-2' 
            placeholder='Tool Name'
            value={newTool.name || ''} 
            onChange={(e) => setNewTool(prev => ({ ...prev, name: e.target.value }))} 
          />
          <input 
            className='border border-gray-300 rounded px-3 py-2' 
            placeholder='Tool Slug'
            value={newTool.slug || ''} 
            onChange={(e) => setNewTool(prev => ({ ...prev, slug: e.target.value }))} 
          />
          <input 
            className='border border-gray-300 rounded px-3 py-2' 
            placeholder='Category'
            value={newTool.category || ''} 
            onChange={(e) => setNewTool(prev => ({ ...prev, category: e.target.value }))} 
          />
          <input 
            className='border border-gray-300 rounded px-3 py-2' 
            placeholder='Status (active/inactive)'
            value={newTool.status || 'active'} 
            onChange={(e) => setNewTool(prev => ({ ...prev, status: e.target.value }))} 
          />
          <input 
            className='border border-gray-300 rounded px-3 py-2' 
            type='number' 
            placeholder='Price in cents'
            value={newTool.priceCents || 0} 
            onChange={(e) => setNewTool(prev => ({ ...prev, priceCents: Number(e.target.value) }))} 
          />
          <input 
            className='border border-gray-300 rounded px-3 py-2' 
            placeholder='Preview Image URL'
            value={newTool.previewImageUrl || ''} 
            onChange={(e) => setNewTool(prev => ({ ...prev, previewImageUrl: e.target.value }))} 
          />
        </div>
        <textarea 
          className='mt-3 w-full border border-gray-300 rounded px-3 py-2' 
          placeholder='Description'
          value={newTool.description || ''} 
          onChange={(e) => setNewTool(prev => ({ ...prev, description: e.target.value }))} 
        />
        <input 
          className='mt-3 w-full border border-gray-300 rounded px-3 py-2' 
          placeholder='File Key (for ZIP files)'
          value={newTool.fileKey || ''} 
          onChange={(e) => setNewTool(prev => ({ ...prev, fileKey: e.target.value }))} 
        />
        <button
          type='button'
          onClick={() => void createTool()}
          className='mt-4 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700'
        >
          Create Tool
        </button>
      </div>

      {/* Existing Tools */}
      <div className='space-y-6'>
        {tools.map((tool) => (
          <div key={tool.id} className='rounded-lg border border-gray-200 bg-white p-6'>
            <div className='flex justify-between items-start mb-4'>
              <h3 className='font-semibold text-lg'>
                {tool.name} ({tool.slug})
              </h3>
              <button
                type='button'
                onClick={() => void deleteTool(tool.id)}
                className='rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700'
              >
                Delete
              </button>
            </div>
            
            <div className='grid gap-3 sm:grid-cols-2'>
              <input 
                className='border border-gray-300 rounded px-3 py-2' 
                value={tool.name} 
                onChange={(e) => setTools((prev) => prev.map((item) => item.id === tool.id ? { ...item, name: e.target.value } : item))} 
              />
              <input 
                className='border border-gray-300 rounded px-3 py-2' 
                value={tool.slug} 
                onChange={(e) => setTools((prev) => prev.map((item) => item.id === tool.id ? { ...item, slug: e.target.value } : item))} 
              />
              <input 
                className='border border-gray-300 rounded px-3 py-2' 
                value={tool.status} 
                onChange={(e) => setTools((prev) => prev.map((item) => item.id === tool.id ? { ...item, status: e.target.value } : item))} 
              />
              <input 
                className='border border-gray-300 rounded px-3 py-2' 
                value={tool.category || ''} 
                onChange={(e) => setTools((prev) => prev.map((item) => item.id === tool.id ? { ...item, category: e.target.value } : item))} 
              />
              <input 
                className='border border-gray-300 rounded px-3 py-2' 
                type='number' 
                value={tool.priceCents} 
                onChange={(e) => setTools((prev) => prev.map((item) => item.id === tool.id ? { ...item, priceCents: Number(e.target.value) } : item))} 
              />
              <input 
                className='border border-gray-300 rounded px-3 py-2' 
                placeholder='Preview Image URL'
                value={tool.previewImageUrl || ''} 
                onChange={(e) => setTools((prev) => prev.map((item) => item.id === tool.id ? { ...item, previewImageUrl: e.target.value } : item))} 
              />
            </div>
            
            <textarea 
              className='mt-3 w-full border border-gray-300 rounded px-3 py-2' 
              value={tool.description || ''} 
              onChange={(e) => setTools((prev) => prev.map((item) => item.id === tool.id ? { ...item, description: e.target.value } : item))} 
            />
            
            <input 
              className='mt-3 w-full border border-gray-300 rounded px-3 py-2' 
              placeholder='File Key (for ZIP files)'
              value={tool.fileKey || ''} 
              onChange={(e) => setTools((prev) => prev.map((item) => item.id === tool.id ? { ...item, fileKey: e.target.value } : item))} 
            />
            <div className='mt-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Upload ZIP File:</label>
              <input
                type='file'
                accept='.zip'
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    void handleFileUpload(tool.id, file);
                  }
                }}
                className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-700'
              />
              {uploading && <p className='mt-1 text-sm text-gray-600'>Uploading...</p>}
            </div>

            <div className='mt-3 text-sm text-gray-500'>
              Created: {new Date(tool.createdAt).toLocaleDateString()} | 
              Updated: {new Date(tool.updatedAt).toLocaleDateString()}
            </div>

            <button
              type='button'
              onClick={() => void updateTool(tool)}
              className='mt-4 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90'
            >
              Save Tool
            </button>
          </div>
        ))}
      </div>
    </AccountShell>
  );
}
