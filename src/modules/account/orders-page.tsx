'use client';

import Link from 'next/link';

import { useUser } from '../../context/user-context';
import { AccountShell } from './account-shell';

export const OrdersPage = () => {
  const { orders } = useUser();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <AccountShell
      title='Your Orders'
      subtitle='View your purchase history'
    >
      {orders.length === 0 ? (
        <div className='rounded-lg border border-gray-200 bg-gray-50/40 py-12 text-center'>
          <p className='text-gray-600 mb-6'>You haven&apos;t placed any orders yet</p>
          <Link
            href='/plugins'
            className='inline-flex h-11 items-center justify-center rounded-lg bg-black px-6 text-white transition-opacity duration-200 ease-in-out hover:opacity-90'
          >
            Browse Plugins
          </Link>
        </div>
      ) : (
        <div className='space-y-6'>
          {orders.map((order) => (
            <div key={order.id} className='rounded-lg border border-gray-200 bg-gray-50/40 p-6'>
              <div className='mb-4 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-start'>
                <div className='min-w-0'>
                  <h3 className='text-lg font-semibold text-black mb-1'>
                    Order #{order.id.split('-')[1]}
                  </h3>
                  <p className='text-gray-600 text-sm'>{formatDate(order.date)}</p>
                </div>
                <div className='text-left sm:text-right'>
                  <span className='text-lg font-bold text-black'>{order.total}</span>
                  <p className='text-sm text-gray-600 capitalize'>{order.status}</p>
                </div>
              </div>

              <div className='border-t border-gray-200 pt-4'>
                <h4 className='font-medium text-black mb-3'>Items</h4>
                <div className='space-y-3'>
                  {order.items.map((item, index) => (
                    <div key={index} className='flex items-center justify-between gap-4'>
                      <div className='min-w-0'>
                        <Link
                          href={`/plugins/${item.plugin.slug}`}
                          className='text-black hover:underline font-medium'
                        >
                          {item.plugin.name}
                        </Link>
                        <p className='text-gray-600 text-sm'>
                          {item.plugin.category} x {item.quantity}
                        </p>
                      </div>
                      <span className='shrink-0 text-right font-medium text-black'>{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className='mt-4 pt-4 border-t border-gray-200'>
                <Link
                  href='/account/downloads'
                  className='text-black hover:underline text-sm font-medium'
                >
                  View Downloads
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </AccountShell>
  );
};
