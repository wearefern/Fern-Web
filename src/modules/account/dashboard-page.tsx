'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useCart } from '../../context/cart-context';
import { type Plugin } from '../plugins/plugin-types';
import { AccountShell } from './account-shell';

export function DashboardPage() {
  const { getItemCount } = useCart();
  const [allPlugins, setAllPlugins] = useState<Plugin[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);

  const totalOrders = orders.length;
  const totalDownloads = downloads.length;
  const cartItems = getItemCount?.() ?? 0;
  const latestOrder = orders[0];

  useEffect(() => {
    const load = async () => {
      try {
        const ordersRes = await fetch('/api/orders');
        const downloadsRes = await fetch('/api/downloads');

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData || []);
        }

        if (downloadsRes.ok) {
          const downloadsData = await downloadsRes.json();
          setDownloads(downloadsData || []);
        }
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      }
    };

    load();
  }, []);

  useEffect(() => {
    void fetch('/api/account/me', { cache: 'no-store' }).catch((error) => {
      console.error(error);
    });
  }, []);

  useEffect(() => {
    const loadPlugins = async () => {
      try {
        const response = await fetch('/api/plugins', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to load plugins');
        }
        const data: Plugin[] = await response.json();
        setAllPlugins(data);
      } catch (error) {
        console.error(error);
      }
    };

    void loadPlugins();
  }, []);

  const recentDownloads = allPlugins
    .filter((plugin) => downloads.some((download) => download.plugin.id === plugin.id))
    .slice(0, 3);

  const recentActivity = latestOrder
    ? [
        {
          id: latestOrder.id,
          text: `Order #${latestOrder.id.split('-')[1]} completed`,
          date: new Date(latestOrder.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
        },
      ]
    : [];

  return (
    <AccountShell
      title='My Account'
      subtitle='Manage your orders, downloads, and account activity.'
    >
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8'>
        <div className='rounded-lg border border-gray-200 bg-gray-50/40 p-6'>
          <p className='text-sm text-gray-600 mb-2'>Total Orders</p>
          <p className='text-3xl font-bold text-black'>{totalOrders}</p>
        </div>
        <div className='rounded-lg border border-gray-200 bg-gray-50/40 p-6'>
          <p className='text-sm text-gray-600 mb-2'>Available Downloads</p>
          <p className='text-3xl font-bold text-black'>{totalDownloads}</p>
        </div>
        <div className='rounded-lg border border-gray-200 bg-gray-50/40 p-6'>
          <p className='text-sm text-gray-600 mb-2'>Cart Items</p>
          <p className='text-3xl font-bold text-black'>{cartItems}</p>
        </div>
      </div>

      {totalOrders === 0 || totalDownloads === 0 ? (
        <div className='mb-8 rounded-lg border border-gray-200 bg-gray-50/40 p-6'>
          <p className='text-gray-600'>
            {totalOrders === 0 ? 'No orders yet' : 'No downloads available yet'}
          </p>
        </div>
      ) : null}

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 mb-8'>
        <div className='rounded-lg border border-gray-200 bg-gray-50/40 p-6'>
          <h2 className='text-lg font-semibold text-black mb-4'>Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className='text-gray-600'>No recent activity yet</p>
          ) : (
            <div className='space-y-3'>
              {recentActivity.map((activity) => (
                <div key={activity.id} className='flex items-center justify-between gap-4'>
                  <p className='text-gray-700'>{activity.text}</p>
                  <span className='text-sm text-gray-500'>{activity.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='rounded-lg border border-gray-200 bg-gray-50/40 p-6'>
          <h2 className='text-lg font-semibold text-black mb-4'>Latest Order</h2>
          {!latestOrder ? (
            <p className='text-gray-600 mb-4'>No orders yet</p>
          ) : (
            <div className='space-y-2 mb-4'>
              <p className='text-gray-700'>Order #{latestOrder.id.split('-')[1]}</p>
              <p className='text-sm text-gray-500'>
                {new Date(latestOrder.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className='text-sm text-gray-700'>
                {latestOrder.items.length} item{latestOrder.items.length !== 1 ? 's' : ''} - {latestOrder.total}
              </p>
            </div>
          )}
          <Link
            href='/account/orders'
            className='inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-black transition-colors duration-200 ease-in-out hover:border-gray-400'
          >
            View Orders
          </Link>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 mb-8'>
        <div className='rounded-lg border border-gray-200 bg-gray-50/40 p-6'>
          <h2 className='text-lg font-semibold text-black mb-4'>Available Downloads</h2>
          {recentDownloads.length === 0 ? (
            <p className='text-gray-600 mb-4'>No downloads available yet</p>
          ) : (
            <div className='space-y-3 mb-4'>
              {recentDownloads.map((plugin) => (
                <div key={plugin.id} className='flex items-center justify-between gap-4'>
                  <p className='text-gray-700'>{plugin.name}</p>
                  <span className='text-sm text-gray-500'>v{plugin.version}</span>
                </div>
              ))}
            </div>
          )}
          <Link
            href='/account/downloads'
            className='inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white transition-opacity duration-200 ease-in-out hover:opacity-90'
          >
            View Downloads
          </Link>
        </div>

        <div className='rounded-lg border border-gray-200 bg-gray-50/40 p-6'>
          <h2 className='text-lg font-semibold text-black mb-4'>Account Status</h2>
          <div className='space-y-2 text-gray-700'>
            <p>Account type: Standard</p>
            <p>Payment status: Not connected</p>
            <p>Downloads access: Based on purchases</p>
          </div>
        </div>
      </div>

      <div className='rounded-lg border border-gray-200 bg-gray-50/40 p-6'>
        <h2 className='text-lg font-semibold text-black mb-4'>Settings Shortcut</h2>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-4'>
          <Link
            href='/account/profile'
            className='inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-black transition-colors duration-200 ease-in-out hover:border-gray-400'
          >
            Profile Settings
          </Link>
          <Link
            href='/account/settings'
            className='inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-black transition-colors duration-200 ease-in-out hover:border-gray-400'
          >
            Email Preferences
          </Link>
          <Link
            href='/account/billing'
            className='inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-black transition-colors duration-200 ease-in-out hover:border-gray-400'
          >
            Billing Details
          </Link>
          <Link
            href='/account/settings'
            className='inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-black transition-colors duration-200 ease-in-out hover:border-gray-400'
          >
            Security Settings
          </Link>
        </div>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
          <Link
            href='/account/downloads'
            className='inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white transition-opacity duration-200 ease-in-out hover:opacity-90'
          >
            View Downloads
          </Link>
          <Link
            href='/account/orders'
            className='inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-black transition-colors duration-200 ease-in-out hover:border-gray-400'
          >
            View Orders
          </Link>
          <Link
            href='/plugins'
            className='inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-black transition-colors duration-200 ease-in-out hover:border-gray-400'
          >
            Browse Plugins
          </Link>
        </div>
      </div>
    </AccountShell>
  );
}
