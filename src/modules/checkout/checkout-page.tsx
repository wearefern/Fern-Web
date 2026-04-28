'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/cart-context';
import { useUser } from '../../context/user-context';
import { PluginsHeader } from '../plugins/plugins-header';

export const CheckoutPage = () => {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const { addOrder } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create order
    const order = {
      id: `order-${Date.now()}`,
      date: new Date().toISOString(),
      items: items.map(item => ({
        plugin: item.plugin,
        quantity: item.quantity,
        price: item.plugin.price,
      })),
      total: getTotalPrice(),
      status: 'completed' as const,
    };

    // Add order to user context
    addOrder(order);

    // Clear cart
    clearCart();

    // Redirect to account/downloads
    router.push('/account/downloads');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className='min-h-screen bg-white'>
      <PluginsHeader />
      
      <main className='w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-black mb-2'>Checkout</h1>
          <p className='text-gray-600'>Complete your purchase</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Order Details */}
          <div className='lg:col-span-2'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* User Details */}
              <div className='bg-white border border-gray-300 rounded-lg p-6'>
                <h2 className='text-lg font-semibold text-black mb-4'>Your Information</h2>
                
                <div className='space-y-4'>
                  <div>
                    <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                      Full Name
                    </label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black'
                      placeholder='John Doe'
                    />
                  </div>
                  
                  <div>
                    <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
                      Email Address
                    </label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black'
                      placeholder='john@example.com'
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className='bg-white border border-gray-300 rounded-lg p-6'>
                <h2 className='text-lg font-semibold text-black mb-4'>Payment</h2>
                <p className='text-gray-600 text-sm mb-4'>
                  This is a demo checkout. In production, this would integrate with a payment processor.
                </p>
                <div className='bg-gray-50 border border-gray-200 rounded-md p-4 text-center'>
                  <p className='text-gray-700 font-medium'>Demo Payment Gateway</p>
                  <p className='text-gray-600 text-sm'>Click "Complete Purchase" to simulate payment</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={isProcessing || !formData.name || !formData.email}
                className='w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed'
              >
                {isProcessing ? 'Processing...' : 'Complete Purchase'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-gray-50 rounded-lg p-6 sticky top-8'>
              <h2 className='text-lg font-semibold text-black mb-4'>Order Summary</h2>
              
              <div className='space-y-3 mb-4'>
                {items.map((item) => (
                  <div key={item.plugin.id} className='flex justify-between text-sm'>
                    <span className='text-gray-700'>
                      {item.plugin.name} × {item.quantity}
                    </span>
                    <span className='text-black font-medium'>
                      {item.plugin.price}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className='border-t border-gray-300 pt-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-lg font-semibold text-black'>Total</span>
                  <span className='text-xl font-bold text-black'>{getTotalPrice()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
