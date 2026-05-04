'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '~utils/style';

interface AudioPreviewProps {
  pluginName: string;
  audioUrl: string;
  duration: number;
  pluginId?: string;
  isAdmin?: boolean;
  initialControls?: Record<string, number> | null;
}

const WAVEFORM_BARS = [
  24, 40, 32, 56, 28, 48, 36, 64, 30, 52, 38, 44,
  26, 58, 34, 46, 62, 28, 50, 36, 42, 54, 32, 48,
  24, 40, 32, 56, 28, 48, 36, 64,
];

export const AudioPreview = ({
  pluginName,
  audioUrl,
  duration,
  pluginId,
  isAdmin = false,
  initialControls,
}: AudioPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [controls, setControls] = useState<Record<string, number>>({
    mix: initialControls?.mix ?? 50,
    tone: initialControls?.tone ?? 50,
    drive: initialControls?.drive ?? 50,
  });
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      void audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const savePluginSettings = async () => {
    if (!isAdmin || !pluginId) return;
    setSaveState('saving');
    try {
      const response = await fetch(`/api/admin/plugins/${pluginId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoControls: controls }),
      });
      if (!response.ok) {
        throw new Error('Unable to save');
      }
      setSaveState('saved');
    } catch (error) {
      console.error(error);
      setSaveState('error');
    }
  };

  return (
    <div className='bg-white border border-gray-300 rounded-xl p-8'>
      <audio ref={audioRef} src={audioUrl} preload='metadata' />
      
      {/* Header */}
      <div className='mb-8'>
        <h2 className='text-2xl font-bold text-black mb-2'>Audio Preview</h2>
        <p className='text-gray-600'>
          Listen to a preview of {pluginName}.
        </p>
      </div>

      {/* Waveform Visualization */}
      <div className='relative w-full' style={{ marginTop: '28px', marginBottom: '24px' }}>
        <div 
          className='flex items-center justify-center gap-1' 
          style={{ 
            width: '100%', 
            minHeight: '40px',
            display: 'flex'
          }}
        >
          {WAVEFORM_BARS.map((barHeight, i) => (
            <div
              key={i}
              className={cn(
                'transition-all duration-200',
                isPlaying ? 'bg-gray-800' : 'bg-gray-500'
              )}
              style={{
                width: '3px',
                height: `${barHeight}px`,
                backgroundColor: isPlaying ? '#8A8A8A' : '#8A8A8A',
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
          onClick={handlePlayPause}
          className={cn(
            'w-9 h-9 rounded-full transition-all duration-200',
            'flex items-center justify-center',
            'border-2',
            isPlaying 
              ? 'bg-black border-black' 
              : 'bg-white border-gray-400 hover:border-gray-600'
          )}
          style={{ width: '36px', height: '36px' }}
        >
          {/* Play/Pause Icon */}
          <div className={cn(
            'w-0 h-0 transition-all duration-200',
            isPlaying 
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

      <div className='mt-8 space-y-4'>
        {Object.entries(controls).map(([key, value]) => (
          <label key={key} className='block'>
            <div className='mb-1 flex items-center justify-between text-sm text-gray-600'>
              <span className='capitalize'>{key}</span>
              <span>{value}</span>
            </div>
            <input
              type='range'
              min={0}
              max={100}
              value={value}
              onChange={(event) =>
                setControls((prev) => ({
                  ...prev,
                  [key]: Number(event.target.value),
                }))
              }
              className='w-full'
            />
          </label>
        ))}
      </div>

      {isAdmin ? (
        <div className='mt-6'>
          <button
            onClick={() => void savePluginSettings()}
            className='px-4 py-2 rounded-md bg-black text-white text-sm font-medium hover:opacity-90'
          >
            Save Plugin Settings
          </button>
          {saveState === 'saved' ? (
            <p className='mt-2 text-sm text-green-600'>Settings saved.</p>
          ) : null}
          {saveState === 'error' ? (
            <p className='mt-2 text-sm text-red-600'>Unable to save settings.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
