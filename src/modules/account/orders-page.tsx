'use client';

import Link from 'next/link';
import { useUser } from '../../context/user-context';
import { PluginsHeader } from '../plugins/plugins-header';

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
    <div className='min-h-screen bg-white'>
      <PluginsHeader />
      
      <main className='w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-black mb-2'>Your Orders</h1>
          <p className='text-gray-600'>View your purchase history</p>
        </div>

        {orders.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-600 mb-6'>You haven't placed any orders yet</p>
            <Link
              href='/plugins'
              className='inline-block px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200'
            >
              Browse Plugins
            </Link>
          </div>
        ) : (
          <div className='space-y-6'>
            {orders.map((order) => (
              <div key={order.id} className='bg-white border border-gray-300 rounded-lg p-6'>
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h3 className='text-lg font-semibold text-black mb-1'>
                      Order #{order.id.split('-')[1]}
                    </h3>
                    <p className='text-gray-600 text-sm'>{formatDate(order.date)}</p>
                  </div>
                  <div className='text-right'>
                    <span className='text-lg font-bold text-black'>{order.total}</span>
                    <p className='text-sm text-gray-600 capitalize'>{order.status}</p>
                  </div>
                </div>

                <div className='border-t border-gray-200 pt-4'>
                  <h4 className='font-medium text-black mb-3'>Items</h4>
                  <div className='space-y-2'>
                    {order.items.map((item, index) => (
                      <div key={index} className='flex justify-between items-center'>
                        <div>
                          <Link
                            href={`/plugins/${item.plugin.slug}`}
                            className='text-black hover:underline font-medium'
                          >
                            {item.plugin.name}
                          </Link>
                          <p className='text-gray-600 text-sm'>
                            {item.plugin.category} × {item.quantity}
                          </p>
                        </div>
                        <span className='text-black font-medium'>{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='mt-4 pt-4 border-t border-gray-200'>
                  <Link
                    href='/account/downloads'
                    className='text-black hover:underline text-sm font-medium'
                  >
                    View Downloads →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
