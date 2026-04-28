'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

import { cn } from '~utils/style';
import { pluginsData, type Plugin } from '../../../data/plugins-data';

/* -------------------------------------------------------------------------------------------------
 * Minimal Waveform Player Component
 * -----------------------------------------------------------------------------------------------*/

interface MinimalPlayerProps {
  audioUrl: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onTimeUpdate: (currentTime: number) => void;
  currentTime: number;
  duration: number;
  isActive: boolean;
}

const MinimalPlayer = ({
  audioUrl,
  isPlaying,
  onPlayPause,
  onTimeUpdate,
  currentTime,
  duration,
  isActive,
}: MinimalPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      onTimeUpdate(audio.currentTime);
    };

    const handleEnded = () => {
      onPlayPause();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onTimeUpdate, onPlayPause]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && isActive) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying, isActive]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='relative'>
      <audio ref={audioRef} src={audioUrl} preload='metadata' />
      
      {/* Waveform Row */}
      <div className='relative w-full' style={{ marginTop: '28px', marginBottom: '24px' }}>
        <div 
          className='flex items-center justify-center gap-1' 
          style={{ 
            width: '100%', 
            minHeight: '40px',
            display: 'flex'
          }}
        >
          {Array.from({ length: 32 }, (_, i) => (
            <div
              key={i}
              className={cn(
                'transition-all duration-200',
                isActive && isPlaying ? 'bg-gray-800' : 'bg-gray-500'
              )}
              style={{
                width: '3px',
                height: `${Math.random() * 20 + 8}px`,
                backgroundColor: isActive && isPlaying ? '#8A8A8A' : '#8A8A8A',
                borderRadius: '999px',
                display: 'block',
                opacity: '0.65'
              }}
            />
          ))}
        </div>
      </div>

      {/* Player Controls Row */}
      <div className='flex items-center' style={{ marginTop: '8px' }}>
        {/* Play Button */}
        <button
          onClick={onPlayPause}
          className={cn(
            'w-9 h-9 rounded-full transition-all duration-200',
            'flex items-center justify-center',
            isActive && isPlaying 
              ? 'bg-black' 
              : 'bg-white border border-gray-400 hover:border-gray-600'
          )}
          style={{ width: '36px', height: '36px' }}
        >
          {/* Play/Pause Icon */}
          <div className={cn(
            'w-0 h-0 transition-all duration-200',
            isPlaying && isActive 
              ? 'border-l-[6px] border-y-[4px] border-l-white border-y-transparent' 
              : 'border-l-[10px] border-y-[6px] border-l-black border-y-transparent'
          )} />
        </button>
        
        {/* Progress Dot */}
        <div
          className='transition-all duration-100'
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: '#111111',
            borderRadius: '50%',
            marginLeft: '12px',
            flexShrink: '0'
          }}
        />
        
        {/* Progress Line Container */}
        <div className='flex-1' style={{ marginLeft: '12px' }}>
          {/* Progress Line */}
          <div 
            className='transition-all duration-100'
            style={{
              width: '100%',
              height: '2px',
              backgroundColor: '#E5E5E5',
              position: 'relative'
            }}
          >
            <div 
              className='transition-all duration-100'
              style={{
                width: `${progress}%`,
                height: '2px',
                backgroundColor: '#111111'
              }}
            />
          </div>
        </div>

        {/* Time Display */}
        <div className='text-sm' style={{ color: '#8A8A8A', marginLeft: '16px' }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Minimal Plugin Card Component
 * -----------------------------------------------------------------------------------------------*/

interface MinimalPluginCardProps {
  plugin: Plugin;
  isPlaying: boolean;
  isActive: boolean;
  onPlayPause: () => void;
  onTimeUpdate: (currentTime: number) => void;
  currentTime: number;
}

const MinimalPluginCard = ({
  plugin,
  isPlaying,
  isActive,
  onPlayPause,
  onTimeUpdate,
  currentTime,
}: MinimalPluginCardProps) => {
  return (
    <Link href={`/plugins/${plugin.slug}`} className='block'>
      <div className='bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors duration-200 h-full flex flex-col cursor-pointer'>
        {/* Icon */}
        <div className='w-12 h-12 border border-gray-300 rounded-md flex items-center justify-center mb-4'>
          <div className='w-6 h-6 bg-gray-400 rounded-sm' />
        </div>

        {/* Content */}
        <div className='space-y-3'>
          <div className='flex items-start justify-between'>
            <h3 className='font-medium text-black text-lg'>
              {plugin.name}
            </h3>
            <span className='text-black font-medium text-lg'>
              {plugin.price}
            </span>
          </div>
          
          <p className='text-sm text-gray-500 leading-relaxed'>
            {plugin.description}
          </p>

          {/* Category Tag */}
          <div className='inline-flex items-center'>
            <span className='inline-flex items-center rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-500'>
              {plugin.category}
            </span>
          </div>

          {/* Minimal Player */}
          <div className='pt-4 border-t border-gray-100'>
            <MinimalPlayer
              audioUrl={plugin.audioUrl}
              isPlaying={isPlaying}
              onPlayPause={onPlayPause}
              onTimeUpdate={onTimeUpdate}
              currentTime={currentTime}
              duration={plugin.duration}
              isActive={isActive}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Plugins Section
 * -----------------------------------------------------------------------------------------------*/

const categories = ['All', 'Ambient', 'Electronic', 'Vintage', 'Cinematic', 'Lo-Fi', 'Nature'];

export const PluginsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePluginId, setActivePluginId] = useState<string | null>(null);
  const [pluginStates, setPluginStates] = useState<Record<string, { isPlaying: boolean; currentTime: number }>>(
    pluginsData.reduce((acc: Record<string, { isPlaying: boolean; currentTime: number }>, plugin) => ({
      ...acc,
      [plugin.id]: { isPlaying: false, currentTime: 0 },
    }), {})
  );

  const filteredPlugins = selectedCategory === 'All'
    ? pluginsData
    : pluginsData.filter(plugin => plugin.category === selectedCategory);

  const handlePlayPause = (pluginId: string) => {
    setPluginStates(prev => {
      const newStates: Record<string, { isPlaying: boolean; currentTime: number }> = { ...prev };
      
      Object.keys(newStates).forEach(id => {
        if (id !== pluginId && newStates[id]) {
          newStates[id] = { ...newStates[id], isPlaying: false };
        }
      });
      
      const currentState = newStates[pluginId];
      if (currentState) {
        newStates[pluginId] = {
          ...currentState,
          isPlaying: !currentState.isPlaying,
        };
      } else {
        newStates[pluginId] = { isPlaying: true, currentTime: 0 };
      }
      
      return newStates;
    });
    
    setActivePluginId(pluginId);
  };

  const handleTimeUpdate = (pluginId: string, currentTime: number) => {
    setPluginStates(prev => {
      const newStates: Record<string, { isPlaying: boolean; currentTime: number }> = { ...prev };
      const currentState = newStates[pluginId];
      if (currentState) {
        newStates[pluginId] = { ...currentState, currentTime };
      } else {
        newStates[pluginId] = { isPlaying: false, currentTime };
      }
      return newStates;
    });
  };

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

      {/* Filter Bar */}
      <div className='flex flex-wrap justify-center gap-2 mb-16'>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              'border',
              selectedCategory === category
                ? 'bg-black border-black text-white'
                : 'bg-white border-gray-300 text-black hover:border-gray-400'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Plugin Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {filteredPlugins.map((plugin) => (
          <MinimalPluginCard
            key={plugin.id}
            plugin={plugin}
            isPlaying={pluginStates[plugin.id]?.isPlaying || false}
            isActive={activePluginId === plugin.id}
            onPlayPause={() => handlePlayPause(plugin.id)}
            onTimeUpdate={(time) => handleTimeUpdate(plugin.id, time)}
            currentTime={pluginStates[plugin.id]?.currentTime || 0}
          />
        ))}
      </div>
    </section>
  );
};

PluginsSection.displayName = 'PluginsSection';
