'use client';

export const PluginsSection = () => {
  return (
    <section className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24'>
      {/* Hero Header */}
      <div className='text-center mb-16'>
        <div className='mb-6'>
          <span className='text-xs font-medium uppercase tracking-wider text-gray-400'>
            FERN-NATIVE PLUGINS
          </span>
        </div>

        <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight'>
          Professional Audio Plugins
        </h1>

        <p className='text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed'>
          Premium audio plugins designed for modern music production with signature Wavemaker technology for pristine sound quality.
        </p>
      </div>

      {/* Empty State */}
      <div className='text-center py-16'>
        <p className='text-sm text-gray-400'>
          New products are currently being prepared.
        </p>
      </div>
    </section>
  );
};

PluginsSection.displayName = 'PluginsSection';
