'use client';

import { useState } from 'react';
import { type Plugin } from './plugin-types';
import { PluginsHeader } from './plugins-header';
import { AudioPreview } from './audio-preview';
import { useCart } from '../../context/cart-context';

interface PluginDetailPageProps {
  plugin: Plugin;
}

export const PluginDetailPage = ({ plugin }: PluginDetailPageProps) => {
  const [cartMessage, setCartMessage] = useState('');
  const [showCartMessage, setShowCartMessage] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const result = addToCart(plugin);
    setCartMessage(result.message);
    setShowCartMessage(true);
    setTimeout(() => setShowCartMessage(false), 2000);
  };

  return (
    <div className='min-h-screen bg-white'>
      <PluginsHeader />
      
      <main className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24'>
        {/* Plugin Header */}
        <div className='mb-16'>
          <div className='flex items-center gap-4 mb-6'>
            <span className='text-xs font-medium uppercase tracking-wider text-gray-400'>
              {plugin.category}
            </span>
            <span className='text-xs font-medium text-gray-500'>
              Version {plugin.version}
            </span>
          </div>
          
          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight'>
            {plugin.name}
          </h1>
          
          <p className='text-lg text-gray-600 max-w-3xl leading-relaxed mb-8'>
            {plugin.longDescription}
          </p>
          
          <div className='flex items-center gap-6 mb-8'>
            <span className='text-3xl font-bold text-black'>{plugin.price}</span>
            <span className='text-sm text-gray-500'>{plugin.fileSize}</span>
            <span className='text-sm text-gray-500'>{plugin.compatibility}</span>
          </div>

          <div className='flex items-center gap-4 mb-4'>
            <button
              onClick={() => {
                const element = document.getElementById('audio-preview');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className='px-6 py-3 bg-white border border-gray-300 text-black font-medium rounded-lg hover:border-gray-400 transition-colors duration-200'
            >
              Preview Audio
            </button>
            <button
              onClick={handleAddToCart}
              className='px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200'
            >
              Add to Cart
            </button>
          </div>

          {/* Cart Feedback */}
          {showCartMessage && (
            <div className={`${cartMessage.includes('already') ? 'text-orange-600' : 'text-green-600'} text-sm font-medium`}>
              {cartMessage}
            </div>
          )}
        </div>

        {/* Features Section */}
        <section className='mb-16'>
          <h2 className='text-2xl font-bold text-black mb-8'>Features</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {plugin.features.map((feature, index) => (
              <div key={index} className='flex items-start gap-3'>
                <div className='w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0' />
                <span className='text-gray-700'>{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* System Requirements */}
        <section className='mb-16'>
          <h2 className='text-2xl font-bold text-black mb-8'>System Requirements</h2>
          <div className='bg-gray-50 rounded-lg p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h3 className='font-semibold text-black mb-2'>Operating System</h3>
                <p className='text-gray-700'>{plugin.systemRequirements.os.join(', ')}</p>
              </div>
              <div>
                <h3 className='font-semibold text-black mb-2'>Processor</h3>
                <p className='text-gray-700'>{plugin.systemRequirements.cpu}</p>
              </div>
              <div>
                <h3 className='font-semibold text-black mb-2'>Memory</h3>
                <p className='text-gray-700'>{plugin.systemRequirements.ram}</p>
              </div>
              <div>
                <h3 className='font-semibold text-black mb-2'>Storage</h3>
                <p className='text-gray-700'>{plugin.systemRequirements.storage}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Included Items */}
        <section className='mb-16'>
          <h2 className='text-2xl font-bold text-black mb-8'>What's Included</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {plugin.includedItems.map((item, index) => (
              <div key={index} className='flex items-start gap-3'>
                <div className='w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0' />
                <span className='text-gray-700'>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* License */}
        <section className='mb-16'>
          <h2 className='text-2xl font-bold text-black mb-8'>License</h2>
          <div className='bg-gray-50 rounded-lg p-6'>
            <p className='text-gray-700'>{plugin.licenseText}</p>
          </div>
        </section>

        {/* Audio Preview Section */}
        <section className='mb-16' id='audio-preview'>
          <AudioPreview
            pluginName={plugin.name}
            audioUrl={plugin.audioUrl}
            duration={plugin.duration}
          />
        </section>

        </main>
    </div>
  );
};
