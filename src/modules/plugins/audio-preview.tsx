'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '~utils/style';

interface AudioPreviewProps {
  pluginName: string;
  audioUrl: string;
  duration: number;
}

export const AudioPreview = ({ pluginName, audioUrl, duration }: AudioPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
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
      audio.play();
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
          {Array.from({ length: 32 }, (_, i) => (
            <div
              key={i}
              className={cn(
                'transition-all duration-200',
                isPlaying ? 'bg-gray-800' : 'bg-gray-500'
              )}
              style={{
                width: '3px',
                height: `${Math.random() * 20 + 8}px`,
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
    </div>
  );
};
