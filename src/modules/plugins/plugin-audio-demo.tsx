'use client';

import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type DemoControl, getPluginDemoControls } from './demo-controls';

interface PluginAudioDemoProps {
  plugin: {
    id: string;
    name: string;
    slug: string;
    previewUrl?: string | null;
    demoControls?: unknown;
    status?: string;
  };
  isAdmin?: boolean;
}

const WAVEFORM_BARS = [
  24, 40, 32, 56, 28, 48, 36, 64, 30, 52, 38, 44, 26, 58, 34, 46, 62, 28, 50,
  36, 42, 54, 32, 48, 24, 40, 32, 56, 28, 48, 36, 64,
];

const getInitialValues = (controls: DemoControl[]) =>
  controls.reduce<Record<string, number>>((acc, control) => {
    acc[control.key] = control.default;
    return acc;
  }, {});

const normalize = (value: number, min: number, max: number) => {
  if (max <= min) return 0;
  return (value - min) / (max - min);
};

export function PluginAudioDemo({ plugin, isAdmin = false }: PluginAudioDemoProps) {
  const controls = useMemo(
    () => getPluginDemoControls(plugin.slug, plugin.demoControls)?.controls ?? [],
    [plugin.demoControls, plugin.slug]
  );
  const [controlValues, setControlValues] = useState<Record<string, number>>(() =>
    getInitialValues(controls)
  );
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [audioSource, setAudioSource] = useState<string>(plugin.previewUrl || '/audio/baby.mp3');
  const [isUploadedSource, setIsUploadedSource] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const isComingSoon = plugin.status === 'coming_soon';
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isScrubbingRef = useRef(false);
  const objectUrlRef = useRef<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const bassRef = useRef<BiquadFilterNode | null>(null);
  const highRef = useRef<BiquadFilterNode | null>(null);
  const delayRef = useRef<DelayNode | null>(null);
  const delayWetRef = useRef<GainNode | null>(null);

  useEffect(() => {
    setControlValues(getInitialValues(controls));
  }, [controls]);

  useEffect(() => {
    if (!isUploadedSource) {
      setAudioSource(plugin.previewUrl || '/audio/baby.mp3');
    }
  }, [isUploadedSource, plugin.previewUrl]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      if (audioContextRef.current) {
        void audioContextRef.current.close();
      }
    };
  }, []);

  const initializeAudioGraph = useCallback(async () => {
    if (typeof window === 'undefined' || !audioRef.current) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new window.AudioContext();
      }
      const audioContext = audioContextRef.current;

      if (!sourceNodeRef.current) {
        const source = audioContext.createMediaElementSource(audioRef.current);
        const gain = audioContext.createGain();
        const bass = audioContext.createBiquadFilter();
        const high = audioContext.createBiquadFilter();
        const delay = audioContext.createDelay(1.0);
        const delayWet = audioContext.createGain();

        bass.type = 'lowshelf';
        bass.frequency.value = 180;
        high.type = 'highshelf';
        high.frequency.value = 2200;
        delay.delayTime.value = 0.18;
        delayWet.gain.value = 0;

        source.connect(bass);
        bass.connect(high);
        high.connect(gain);
        gain.connect(audioContext.destination);
        high.connect(delay);
        delay.connect(delayWet);
        delayWet.connect(gain);

        sourceNodeRef.current = source;
        gainRef.current = gain;
        bassRef.current = bass;
        highRef.current = high;
        delayRef.current = delay;
        delayWetRef.current = delayWet;
      }

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
    } catch (error) {
      // Keep native playback working if Web Audio is unavailable.
      console.error('Web Audio initialization failed', error);
    }
  }, []);

  useEffect(() => {
    Object.entries(controlValues).forEach(([key, value]) => {
      const normalizedValue = normalize(value, 0, 100);
      const lowered = key.toLowerCase();

      if (lowered.includes('gain') || lowered.includes('output') || lowered.includes('volume')) {
        if (gainRef.current) gainRef.current.gain.value = 0.4 + normalizedValue * 1.2;
        return;
      }

      if (lowered.includes('bass')) {
        if (bassRef.current) bassRef.current.gain.value = -8 + normalizedValue * 20;
        return;
      }

      if (lowered.includes('warmth') || lowered.includes('clarity')) {
        if (highRef.current) {
          highRef.current.gain.value = lowered.includes('clarity')
            ? normalizedValue * 12
            : -4 + normalizedValue * 12;
        }
        return;
      }

      if (lowered.includes('space') || lowered.includes('depth') || lowered.includes('mix')) {
        if (delayWetRef.current && delayRef.current) {
          delayRef.current.delayTime.value = 0.08 + normalizedValue * 0.32;
          delayWetRef.current.gain.value = normalizedValue * 0.35;
        }
      }
    });
  }, [controlValues]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      void playPromise.catch((error) => {
        console.error('Unable to play audio', error);
        setAudioError('Unable to play audio.');
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [audioSource, isPlaying]);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setIsUploadedSource(true);
    setAudioSource(objectUrl);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setAudioError(null);
  }, []);

  const handleTogglePlay = useCallback(() => {
    void initializeAudioGraph();
    setAudioError(null);
    setIsPlaying((prev) => !prev);
  }, [initializeAudioGraph]);

  const handleResetControls = useCallback(() => {
    setControlValues(getInitialValues(controls));
    setSaveState('idle');
  }, [controls]);

  const handleSaveDefaults = useCallback(async () => {
    if (!isAdmin) return;

    setSaveState('saving');
    const payload = {
      demoControls: {
        controls: controls.map((control) => ({
          ...control,
          default: controlValues[control.key] ?? control.default,
        })),
      },
    };

    try {
      const response = await fetch(`/api/admin/plugins/${plugin.id}/demo-controls`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Unable to save defaults');
      setSaveState('saved');
    } catch (error) {
      console.error(error);
      setSaveState('error');
    }
  }, [controlValues, controls, isAdmin, plugin.id]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  const audioSrc = audioSource || '/audio/baby.mp3';
  const hasAudio = Boolean(audioSrc);

  const seekToPointer = (clientX: number) => {
    const audio = audioRef.current;
    const progressElement = progressRef.current;
    if (!audio || !progressElement || !Number.isFinite(audio.duration) || audio.duration <= 0) return;

    const rect = progressElement.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const nextTime = ratio * audio.duration;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
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

  useEffect(() => {
    console.log(plugin.previewUrl);
    console.log(audioSrc);
  }, [audioSrc, plugin.previewUrl]);

  return (
    <div className='bg-white border border-gray-300 rounded-xl p-8'>
      <audio ref={audioRef} src={audioSrc} preload='metadata' />

      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-black mb-2'>Interactive Audio Demo</h2>
        <p className='text-gray-600'>Test {plugin.name} with preview playback and responsive controls.</p>
      </div>

      {isComingSoon ? (
        <p className='mb-4 text-sm text-gray-500'>This plugin is coming soon. Demo controls are read-only.</p>
      ) : null}

      {isAdmin ? (
        <div className='mb-5'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Upload Local Audio (.mp3, .wav, .ogg)
          </label>
          <input
            type='file'
            accept='.mp3,.wav,.ogg'
            onChange={handleFileChange}
            className='block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-black file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90'
          />
          {isUploadedSource ? (
            <p className='mt-2 text-xs text-gray-500'>Using temporary local audio for this browser session.</p>
          ) : null}
        </div>
      ) : null}

      {!hasAudio ? <p className='mb-5 text-sm text-gray-500'>No preview audio available for this plugin yet.</p> : null}

      <div className='relative w-full h-[72px] mt-5 mb-6'>
        <div className='flex items-end justify-center gap-1 h-full'>
          {WAVEFORM_BARS.map((barHeight, index) => {
            const threshold = ((index + 1) / WAVEFORM_BARS.length) * 100;
            const active = progress >= threshold;
            return (
              <div
                key={index}
                className='transition-colors duration-150 rounded-full'
                style={{
                  width: '3px',
                  height: `${isPlaying ? Math.max(12, barHeight + Math.sin(currentTime * 8 + index) * 10) : barHeight}px`,
                  backgroundColor: hasAudio && (active || isPlaying) ? '#8A8A8A' : '#D4D4D4',
                  opacity: active ? 1 : 0.65,
                }}
              />
            );
          })}
        </div>
      </div>

      <div className='flex items-center gap-3'>
        <button
          type='button'
          onClick={handleTogglePlay}
          disabled={!hasAudio}
          className='w-9 h-9 rounded-full border border-gray-400 flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-40'
        >
          <span className='sr-only'>{isPlaying ? 'Pause' : 'Play'}</span>
          <div
            className={
              isPlaying
                ? 'w-2 h-3 bg-black'
                : 'w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-black'
            }
          />
        </button>

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
          <div className='h-[2px] w-full bg-gray-200 relative'>
            <div className='h-[2px] bg-black transition-all duration-100' style={{ width: `${progress}%` }} />
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

        <div className='text-sm text-gray-500 w-[72px] text-right tabular-nums'>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {audioError ? <p className='mt-2 text-sm text-red-600'>{audioError}</p> : null}

      <div className='mt-8 space-y-4'>
        {controls.map((control) => (
          <label key={control.key} className='block'>
            <div className='mb-1 flex items-center justify-between text-sm text-gray-600'>
              <span>{control.label}</span>
              <span>{Math.round(controlValues[control.key] ?? control.default)}</span>
            </div>
            <input
              type='range'
              min={control.min}
              max={control.max}
              value={controlValues[control.key] ?? control.default}
              disabled={isComingSoon}
              onChange={(event) => {
                const nextValue = Number(event.target.value);
                setControlValues((prev) => ({
                  ...prev,
                  [control.key]: nextValue,
                }));
                setSaveState('idle');
              }}
              className='w-full disabled:opacity-60'
            />
          </label>
        ))}
      </div>

      <div className='mt-6 flex flex-wrap gap-3'>
        <button
          type='button'
          onClick={handleResetControls}
          className='px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-black hover:border-gray-400'
        >
          Reset Controls
        </button>

        {isAdmin ? (
          <button
            type='button'
            onClick={() => void handleSaveDefaults()}
            disabled={controls.length === 0 || saveState === 'saving'}
            className='px-4 py-2 rounded-md bg-black text-white text-sm font-medium hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60'
          >
            {saveState === 'saving' ? 'Saving...' : 'Save Default Controls'}
          </button>
        ) : null}
      </div>

      {isAdmin && saveState === 'saved' ? <p className='mt-2 text-sm text-green-600'>Defaults saved.</p> : null}
      {isAdmin && saveState === 'error' ? <p className='mt-2 text-sm text-red-600'>Unable to save defaults.</p> : null}
    </div>
  );
}
