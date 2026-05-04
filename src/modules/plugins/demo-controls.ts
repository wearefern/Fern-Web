export interface DemoControl {
  key: string;
  label: string;
  min: number;
  max: number;
  default: number;
}

export interface PluginDemoControls {
  controls: DemoControl[];
}

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const sanitizeControl = (value: unknown): DemoControl | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const input = value as Record<string, unknown>;
  const key = typeof input.key === 'string' ? input.key.trim() : '';
  const label = typeof input.label === 'string' ? input.label.trim() : '';
  const min = isFiniteNumber(input.min) ? input.min : NaN;
  const max = isFiniteNumber(input.max) ? input.max : NaN;
  const defaultValue = isFiniteNumber(input.default) ? input.default : NaN;

  if (!key || !label || Number.isNaN(min) || Number.isNaN(max) || Number.isNaN(defaultValue)) {
    return null;
  }

  if (min > max) {
    return null;
  }

  const clampedDefault = Math.min(max, Math.max(min, defaultValue));

  return {
    key,
    label,
    min,
    max,
    default: clampedDefault,
  };
};

export const parseDemoControls = (value: unknown): PluginDemoControls | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const input = value as Record<string, unknown>;
  if (!Array.isArray(input.controls)) {
    return null;
  }

  const controls = input.controls
    .map((control) => sanitizeControl(control))
    .filter((control): control is DemoControl => control !== null);

  if (controls.length !== input.controls.length) {
    return null;
  }

  return { controls };
};

const makeControls = (
  a: DemoControl,
  b: DemoControl,
  c: DemoControl
): PluginDemoControls => ({ controls: [a, b, c] });

export const DEFAULT_DEMO_CONTROLS_BY_SLUG: Record<string, PluginDemoControls | null> = {
  'bass-enhancer': makeControls(
    { key: 'bass', label: 'Bass', min: 0, max: 100, default: 50 },
    { key: 'warmth', label: 'Warmth', min: 0, max: 100, default: 35 },
    { key: 'gain', label: 'Output Gain', min: 0, max: 100, default: 70 }
  ),
  'ambient-dreams': makeControls(
    { key: 'space', label: 'Space', min: 0, max: 100, default: 55 },
    { key: 'width', label: 'Width', min: 0, max: 100, default: 60 },
    { key: 'mix', label: 'Mix', min: 0, max: 100, default: 45 }
  ),
  'vintage-tape': makeControls(
    { key: 'saturation', label: 'Saturation', min: 0, max: 100, default: 58 },
    { key: 'noise', label: 'Noise', min: 0, max: 100, default: 24 },
    { key: 'warmth', label: 'Warmth', min: 0, max: 100, default: 62 }
  ),
  'lo-fi-beats': makeControls(
    { key: 'dust', label: 'Dust', min: 0, max: 100, default: 42 },
    { key: 'wobble', label: 'Wobble', min: 0, max: 100, default: 38 },
    { key: 'compression', label: 'Compression', min: 0, max: 100, default: 66 }
  ),
  'nature-sounds': makeControls(
    { key: 'ambience', label: 'Ambience', min: 0, max: 100, default: 64 },
    { key: 'width', label: 'Width', min: 0, max: 100, default: 50 },
    { key: 'clarity', label: 'Clarity', min: 0, max: 100, default: 57 }
  ),
  'cinematic-swells': makeControls(
    { key: 'rise', label: 'Rise', min: 0, max: 100, default: 70 },
    { key: 'depth', label: 'Depth', min: 0, max: 100, default: 48 },
    { key: 'impact', label: 'Impact', min: 0, max: 100, default: 76 }
  ),
  'free-basic-reverb': makeControls(
    { key: 'size', label: 'Size', min: 0, max: 100, default: 45 },
    { key: 'decay', label: 'Decay', min: 0, max: 100, default: 52 },
    { key: 'mix', label: 'Mix', min: 0, max: 100, default: 40 }
  ),
  'quantum-synth': null,
};

export const getPluginDemoControls = (
  slug: string,
  value: unknown
): PluginDemoControls | null => {
  const parsed = parseDemoControls(value);
  if (parsed) {
    return parsed;
  }
  return DEFAULT_DEMO_CONTROLS_BY_SLUG[slug] ?? null;
};
