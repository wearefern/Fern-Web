'use client';

import Link from 'next/link';
import { useCart } from '../../context/cart-context';
import { PluginsHeader } from '../plugins/plugins-header';

export const CartPage = () => {
  const { items, removeFromCart, getTotalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className='min-h-screen bg-white'>
        <PluginsHeader />
        
        <main className='w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-black mb-4'>Your Cart</h1>
            <p className='text-gray-600 mb-8'>Your cart is empty</p>
            <Link
              href='/plugins'
              className='inline-block px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200'
            >
              Browse Plugins
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      <PluginsHeader />
      
      <main className='w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-black mb-2'>Your Cart</h1>
          <p className='text-gray-600'>{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>

        {/* Cart Items */}
        <div className='space-y-4 mb-8'>
          {items.map((item) => (
            <div key={item.plugin.id} className='bg-white border border-gray-300 rounded-lg p-6'>
              <div className='flex justify-between items-start'>
                <div className='flex-1'>
                  <Link href={`/plugins/${item.plugin.slug}`} className='text-lg font-medium text-black hover:underline mb-2 block'>
                    {item.plugin.name}
                  </Link>
                  <p className='text-gray-600 text-sm mb-2'>{item.plugin.description}</p>
                  <p className='text-black font-medium'>{item.plugin.price}</p>
                </div>
                
                <div className='flex items-center gap-4 ml-6'>
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.plugin.id)}
                    className='text-gray-500 hover:text-red-600 text-sm'
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className='bg-gray-50 rounded-lg p-6 mb-8'>
          <div className='flex justify-between items-center mb-4'>
            <span className='text-lg font-medium text-black'>Total</span>
            <span className='text-2xl font-bold text-black'>{getTotalPrice()}</span>
          </div>
          
          <div className='flex gap-4'>
            <button
              onClick={clearCart}
              className='px-4 py-2 text-gray-600 hover:text-gray-800 text-sm'
            >
              Clear Cart
            </button>
            <Link
              href='/checkout'
              className='flex-1 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 text-center'
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className='text-center'>
          <Link
            href='/plugins'
            className='text-gray-600 hover:text-black text-sm'
          >
            Continue shopping
          </Link>
        </div>
      </main>
    </div>
  );
};
