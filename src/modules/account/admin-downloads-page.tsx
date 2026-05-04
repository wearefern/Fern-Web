'use client';

import { useEffect, useState } from 'react';

import { AccountShell } from './account-shell';

interface AdminDownloadRecord {
  id: string;
  customerName: string | null;
  customerEmail: string | null;
  productType: 'Plugin' | 'Tool';
  productName: string | null;
  productSlugOrId: string | null;
  priceCents: number | null;
  paymentStatus: string | null;
  purchaseOrDownloadStatus: string | null;
  stripeId: string | null;
  createdAt: string;
}

const formatPrice = (priceCents: number | null) => {
  if (typeof priceCents !== 'number') {
    return 'N/A';
  }

  return `$${(priceCents / 100).toFixed(2)}`;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

export function AdminDownloadsPage() {
  const [rows, setRows] = useState<AdminDownloadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/admin/downloads', { cache: 'no-store' });
        const data = (await response.json().catch(() => null)) as
          | AdminDownloadRecord[]
          | { error?: string }
          | null;

        if (!response.ok) {
          setError((data as { error?: string } | null)?.error ?? 'Unable to load total downloads.');
          setRows([]);
          return;
        }

        setRows(Array.isArray(data) ? data : []);
      } catch (loadError) {
        console.error(loadError);
        setError('Unable to load total downloads.');
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <AccountShell
      title='Total Downloads'
      subtitle='Combined plugin and tool purchases/download activity.'
    >
      {loading ? <p className='text-gray-600'>Loading downloads...</p> : null}
      {error ? <p className='text-sm text-red-600'>{error}</p> : null}

      {!loading && !error && rows.length === 0 ? (
        <div className='rounded-lg border border-gray-200 bg-gray-50/40 py-12 text-center'>
          <p className='text-gray-600'>No downloads or purchases found.</p>
        </div>
      ) : null}

      {!loading && !error && rows.length > 0 ? (
        <div className='overflow-x-auto rounded-lg border border-gray-200 bg-white'>
          <table className='min-w-full divide-y divide-gray-200 text-sm'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-3 text-left font-semibold text-gray-700'>Customer name</th>
                <th className='px-4 py-3 text-left font-semibold text-gray-700'>Customer email</th>
                <th className='px-4 py-3 text-left font-semibold text-gray-700'>Product type</th>
                <th className='px-4 py-3 text-left font-semibold text-gray-700'>Product name</th>
                <th className='px-4 py-3 text-left font-semibold text-gray-700'>Product slug/id</th>
                <th className='px-4 py-3 text-left font-semibold text-gray-700'>Price</th>
                <th className='px-4 py-3 text-left font-semibold text-gray-700'>Order/payment status</th>
                <th className='px-4 py-3 text-left font-semibold text-gray-700'>Purchase/download status</th>
                <th className='px-4 py-3 text-left font-semibold text-gray-700'>Stripe ID</th>
                <th className='px-4 py-3 text-left font-semibold text-gray-700'>Created date</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {rows.map((row) => (
                <tr key={row.id} className='align-top'>
                  <td className='px-4 py-3 text-gray-900'>{row.customerName ?? 'N/A'}</td>
                  <td className='px-4 py-3 text-gray-700'>{row.customerEmail ?? 'N/A'}</td>
                  <td className='px-4 py-3 text-gray-700'>{row.productType}</td>
                  <td className='px-4 py-3 text-gray-900'>{row.productName ?? 'N/A'}</td>
                  <td className='px-4 py-3 text-gray-700'>{row.productSlugOrId ?? 'N/A'}</td>
                  <td className='px-4 py-3 text-gray-700'>{formatPrice(row.priceCents)}</td>
                  <td className='px-4 py-3 text-gray-700'>{row.paymentStatus ?? 'N/A'}</td>
                  <td className='px-4 py-3 text-gray-700'>{row.purchaseOrDownloadStatus ?? 'N/A'}</td>
                  <td className='px-4 py-3 text-gray-700 break-all'>{row.stripeId ?? 'N/A'}</td>
                  <td className='px-4 py-3 text-gray-700 whitespace-nowrap'>{formatDate(row.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </AccountShell>
  );
}
