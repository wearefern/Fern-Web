'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

import { cn } from '~utils/style';
import { type Plugin } from '../plugin-types';

/* -------------------------------------------------------------------------------------------------
 * Minimal Waveform Player Component
 * -----------------------------------------------------------------------------------------------*/

interface MinimalPlayerProps {
  audioUrl: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onEnded: () => void;
  onTimeUpdate: (currentTime: number) => void;
  onDurationChange: (duration: number) => void;
  currentTime: number;
  duration: number;
  isActive: boolean;
}

const WAVEFORM_BARS = [
  24, 40, 32, 56, 28, 48, 36, 64, 30, 52, 38, 44,
  26, 58, 34, 46, 62, 28, 50, 36, 42, 54, 32, 48,
  24, 40, 32, 56, 28, 48, 36, 64,
];

const MinimalPlayer = ({
  audioUrl,
  isPlaying,
  onPlayPause,
  onEnded,
  onTimeUpdate,
  onDurationChange,
  currentTime,
  duration,
  isActive,
}: MinimalPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isScrubbingRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      onTimeUpdate(audio.currentTime);
    };

    const handleEnded = () => onEnded();
    const handleLoadedMetadata = () => onDurationChange(Number.isFinite(audio.duration) ? audio.duration : 0);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [onDurationChange, onEnded, onTimeUpdate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && isActive) {
      void audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying, isActive]);

  const seekToPointer = (clientX: number) => {
    const audio = audioRef.current;
    const progressElement = progressRef.current;
    if (!audio || !progressElement || !Number.isFinite(audio.duration) || audio.duration <= 0) return;

    const rect = progressElement.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const nextTime = ratio * audio.duration;
    audio.currentTime = nextTime;
    onTimeUpdate(nextTime);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    isScrubbingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    seekToPointer(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isScrubbingRef.current) return;
    seekToPointer(event.clientX);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isScrubbingRef.current) return;
    isScrubbingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
    seekToPointer(event.clientX);
  };

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
      <div className='relative w-full h-[72px]' style={{ marginTop: '28px', marginBottom: '24px' }}>
        <div 
          className='flex items-end justify-center gap-1 h-full' 
          style={{ 
            width: '100%', 
            display: 'flex'
          }}
        >
          {WAVEFORM_BARS.map((barHeight, i) => (
            <div
              key={i}
              className={cn(
                'transition-all duration-200',
                isActive && isPlaying ? 'bg-gray-800' : 'bg-gray-500'
              )}
              style={{
                width: '3px',
                height: `${isActive && isPlaying ? Math.max(12, barHeight + Math.sin(currentTime * 8 + i) * 10) : barHeight}px`,
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
      <div className='flex items-center gap-3' style={{ marginTop: '8px' }}>
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
        
        {/* Progress Line Container */}
        <div
          ref={progressRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            isScrubbingRef.current = false;
          }}
          className='flex-1 cursor-pointer touch-none'
        >
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
            <div
              className='transition-all duration-100'
              style={{
                position: 'absolute',
                left: `${progress}%`,
                top: '50%',
                width: '8px',
                height: '8px',
                backgroundColor: '#111111',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>
        </div>

        {/* Time Display */}
        <div className='text-sm w-[72px] text-right tabular-nums' style={{ color: '#8A8A8A' }}>
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
  onEnded: () => void;
  onTimeUpdate: (currentTime: number) => void;
  onDurationChange: (duration: number) => void;
  currentTime: number;
  duration: number;
}

const MinimalPluginCard = ({
  plugin,
  isPlaying,
  isActive,
  onPlayPause,
  onEnded,
  onTimeUpdate,
  onDurationChange,
  currentTime,
  duration,
}: MinimalPluginCardProps) => {
  console.log('plugin audioUrl:', plugin.audioUrl);

  return (
    <div className='bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors duration-200 h-full flex flex-col'>
      <Link href={`/plugins/${plugin.slug}`} className='block'>
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
        </div>
      </Link>

      {/* Minimal Player */}
      <div className='pt-4 border-t border-gray-100'>
        <MinimalPlayer
          audioUrl={plugin.audioUrl || '/audio/baby.mp3'}
          isPlaying={isPlaying}
          onPlayPause={onPlayPause}
          onEnded={onEnded}
          onTimeUpdate={onTimeUpdate}
          onDurationChange={onDurationChange}
          currentTime={currentTime}
          duration={duration || plugin.duration}
          isActive={isActive}
        />
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Plugins Section
 * -----------------------------------------------------------------------------------------------*/

const categories = ['All', 'Ambient', 'Electronic', 'Vintage', 'Cinematic', 'Lo-Fi', 'Nature'];

export const PluginsSection = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePluginId, setActivePluginId] = useState<string | null>(null);
  const [pluginStates, setPluginStates] = useState<Record<string, { isPlaying: boolean; currentTime: number; duration: number }>>({});

  useEffect(() => {
    const loadPlugins = async () => {
      try {
        const response = await fetch('/api/plugins', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to fetch plugins');
        }

        const data: Plugin[] = await response.json();
        setPlugins(data);
        setPluginStates(
          data.reduce((acc: Record<string, { isPlaying: boolean; currentTime: number; duration: number }>, plugin) => {
            acc[plugin.id] = { isPlaying: false, currentTime: 0, duration: plugin.duration };
            return acc;
          }, {})
        );
      } catch (error) {
        console.error(error);
      }
    };

    void loadPlugins();
  }, []);

  useEffect(() => {
    if (!plugins.length) return;
    console.table(
      plugins.map((p) => ({
        name: p.name,
        slug: p.slug,
        previewUrl: p.previewUrl,
        audioUrl: p.audioUrl,
      }))
    );
  }, [plugins]);

  const filteredPlugins = selectedCategory === 'All'
    ? plugins
    : plugins.filter(plugin => plugin.category === selectedCategory);

  const handlePlayPause = (pluginId: string) => {
    setPluginStates(prev => {
      const newStates: Record<string, { isPlaying: boolean; currentTime: number; duration: number }> = { ...prev };
      
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
        newStates[pluginId] = { isPlaying: true, currentTime: 0, duration: 0 };
      }
      
      return newStates;
    });
    
    setActivePluginId(pluginId);
  };

  const handleTimeUpdate = (pluginId: string, currentTime: number) => {
    setPluginStates(prev => {
      const newStates: Record<string, { isPlaying: boolean; currentTime: number; duration: number }> = { ...prev };
      const currentState = newStates[pluginId];
      if (currentState) {
        newStates[pluginId] = { ...currentState, currentTime };
      } else {
        newStates[pluginId] = { isPlaying: false, currentTime, duration: 0 };
      }
      return newStates;
    });
  };

  const handleEnded = (pluginId: string) => {
    setPluginStates((prev) => ({
      ...prev,
      [pluginId]: {
        ...(prev[pluginId] ?? { duration: 0 }),
        isPlaying: false,
        currentTime: 0,
      },
    }));
  };

  const handleDurationChange = (pluginId: string, duration: number) => {
    setPluginStates((prev) => ({
      ...prev,
      [pluginId]: {
        ...(prev[pluginId] ?? { isPlaying: false, currentTime: 0 }),
        duration,
      },
    }));
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
            onEnded={() => handleEnded(plugin.id)}
            onTimeUpdate={(time) => handleTimeUpdate(plugin.id, time)}
            onDurationChange={(duration) => handleDurationChange(plugin.id, duration)}
            currentTime={pluginStates[plugin.id]?.currentTime || 0}
            duration={pluginStates[plugin.id]?.duration || plugin.duration}
          />
        ))}
      </div>
    </section>
  );
};

PluginsSection.displayName = 'PluginsSection';
