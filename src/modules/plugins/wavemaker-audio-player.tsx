'use client';

import { Pause, Play } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '~ui/atoms/button';

import { cn } from '~utils/style';

interface WavemakerAudioPlayerProps {
  audioUrl: string;
  duration: string;
  id: string;
  compact?: boolean;
  className?: string;
}

const audioPlayEvent = 'fern-audio-preview-play';

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) {
    return '0:00';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
};

export const WavemakerAudioPlayer = ({
  audioUrl,
  duration,
  id,
  compact,
  className,
}: WavemakerAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');

  const bars = useMemo(
    () =>
      Array.from({ length: compact ? 18 : 28 }, (_, index) => {
        const wave = Math.sin(index * 0.92) * 18;
        const pulse = Math.cos(index * 0.37) * 10;
        return Math.max(18, Math.round(42 + wave + pulse));
      }),
    [compact]
  );

  useEffect(() => {
    const onExternalPlay = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (customEvent.detail === id) {
        void audioRef.current?.play();
        setPlaying(true);
      } else {
        audioRef.current?.pause();
        setPlaying(false);
      }
    };

    window.addEventListener(audioPlayEvent, onExternalPlay);
    return () => window.removeEventListener(audioPlayEvent, onExternalPlay);
  }, [id]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    window.dispatchEvent(new CustomEvent(audioPlayEvent, { detail: id }));
    await audio.play();
    setPlaying(true);
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-black/10 bg-neutral-50 p-3 dark:border-white/10 dark:bg-neutral-900',
        className
      )}
    >
      <audio
        ref={audioRef}
        src={audioUrl}
        preload='none'
        onTimeUpdate={(event) => {
          const audio = event.currentTarget;
          setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
          setCurrentTime(formatTime(audio.currentTime));
        }}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
          setCurrentTime('0:00');
        }}
      />

      <div className='flex items-center gap-3'>
        <Button
          type='button'
          size='icon'
          aria-label={playing ? 'Pause audio preview' : 'Play audio preview'}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void togglePlay();
          }}
          className='h-9 w-9 shrink-0 bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80'
        >
          {playing ? <Pause className='h-4 w-4' /> : <Play className='h-4 w-4' />}
        </Button>

        <div className='min-w-0 flex-1'>
          <div className='relative flex h-12 items-center gap-1 overflow-hidden'>
            {bars.map((height, index) => (
              <span
                key={index}
                className='w-full rounded-full bg-black/16 dark:bg-white/18'
                style={{ height: `${height}%` }}
              />
            ))}

            <div
              aria-hidden='true'
              className='absolute left-0 top-1/2 h-px -translate-y-1/2 bg-black dark:bg-white'
              style={{ width: `${progress * 100}%` }}
            />
            <div
              aria-hidden='true'
              className='absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black dark:bg-white'
              style={{ left: `${progress * 100}%` }}
            />
          </div>

          <div className='mt-1 flex justify-between font-mono text-xs text-black/50 dark:text-white/50'>
            <span>{currentTime}</span>
            <span>{duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
