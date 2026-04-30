'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/cart-context';
import { PluginsHeader } from '../plugins/plugins-header';

export const CheckoutPage = () => {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompletingPurchase, setIsCompletingPurchase] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  useEffect(() => {
    if (items.length === 0 && !isCompletingPurchase) {
      router.push('/cart');
    }
  }, [items.length, isCompletingPurchase, router]);

  if (items.length === 0 && !isCompletingPurchase) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((item) => ({
          pluginId: item.plugin.id,
          quantity: item.quantity,
        })),
      }),
    });

    if (!response.ok) {
      setIsProcessing(false);
      return;
    }

    setIsCompletingPurchase(true);

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
            <form
              onSubmit={(event) => {
                void handleSubmit(event);
              }}
              className='space-y-6'
            >
              {/* User Details */}
              <div className='rounded-lg border border-gray-200 bg-gray-50/40 p-6'>
                <h2 className='text-lg font-semibold text-black mb-4'>Contact Information</h2>
                
                <div className='space-y-4'>
                  <div>
                    <label htmlFor='name' className='mb-2 block text-sm font-medium text-gray-700'>
                      Full Name
                    </label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className='h-11 w-full rounded-md border border-gray-300 px-4 text-black transition-colors duration-200 ease-in-out focus:border-gray-500 focus:outline-none'
                      placeholder='John Doe'
                    />
                  </div>
                  
                  <div>
                    <label htmlFor='email' className='mb-2 block text-sm font-medium text-gray-700'>
                      Email Address
                    </label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className='h-11 w-full rounded-md border border-gray-300 px-4 text-black transition-colors duration-200 ease-in-out focus:border-gray-500 focus:outline-none'
                      placeholder='john@example.com'
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className='rounded-lg border border-gray-200 bg-gray-50/40 p-6'>
                <h2 className='text-lg font-semibold text-black mb-4'>Payment Method</h2>
                <div className='mb-4 border-t border-gray-200' />
                <p className='text-gray-600 text-sm mb-4'>
                  This is a demo checkout. In production, this would integrate with a payment processor.
                </p>
                <div className='space-y-4'>
                  <div>
                    <label htmlFor='cardNumber' className='mb-2 block text-sm font-medium text-gray-700'>
                      Card Number
                    </label>
                    <input
                      type='text'
                      id='cardNumber'
                      name='cardNumber'
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                      className='h-11 w-full rounded-md border border-gray-300 px-4 text-black transition-colors duration-200 ease-in-out focus:border-gray-500 focus:outline-none'
                      placeholder='1234 1234 1234 1234'
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label htmlFor='expiry' className='mb-2 block text-sm font-medium text-gray-700'>
                        Expiry
                      </label>
                      <input
                        type='text'
                        id='expiry'
                        name='expiry'
                        value={formData.expiry}
                        onChange={handleInputChange}
                        required
                        className='h-11 w-full rounded-md border border-gray-300 px-4 text-black transition-colors duration-200 ease-in-out focus:border-gray-500 focus:outline-none'
                        placeholder='MM/YY'
                      />
                    </div>
                    <div>
                      <label htmlFor='cvc' className='mb-2 block text-sm font-medium text-gray-700'>
                        CVC
                      </label>
                      <input
                        type='text'
                        id='cvc'
                        name='cvc'
                        value={formData.cvc}
                        onChange={handleInputChange}
                        required
                        className='h-11 w-full rounded-md border border-gray-300 px-4 text-black transition-colors duration-200 ease-in-out focus:border-gray-500 focus:outline-none'
                        placeholder='123'
                      />
                    </div>
                  </div>
                </div>
                <div className='mt-4 rounded-md border border-gray-200 bg-white px-4 py-5 text-center'>
                  <p className='text-gray-700 font-medium'>Demo Payment Gateway</p>
                  <p className='mt-1 text-xs text-gray-500'>Click &quot;Complete Purchase&quot; to simulate payment</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={
                  isProcessing ||
                  !formData.name ||
                  !formData.email ||
                  !formData.cardNumber ||
                  !formData.expiry ||
                  !formData.cvc
                }
                className='flex h-11 w-full items-center justify-center rounded-lg bg-black px-6 text-white transition-opacity duration-200 ease-in-out hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-100'
              >
                {isProcessing ? 'Processing...' : 'Complete Purchase'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <div className='sticky top-8 rounded-lg border border-gray-200 bg-gray-50/40 p-6'>
              <h2 className='text-lg font-semibold text-black mb-4'>Order Summary</h2>
              
              <div className='space-y-3 mb-4'>
                {items.map((item) => (
                  <div key={item.plugin.id} className='flex justify-between text-sm'>
                    <span className='font-medium text-gray-700'>
                      {item.plugin.name} × {item.quantity}
                    </span>
                    <span className='text-right font-medium text-black'>
                      {item.plugin.price}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className='border-t border-gray-200 pt-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-lg font-bold text-black'>Total</span>
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
