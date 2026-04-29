export interface Plugin {
  slug: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  price: number;
  duration: string;
  audioUrl: string;
  format: string;
  version: string;
  fileSize: string;
  compatibility: string;
  features: string[];
  includedItems: string[];
  systemRequirements: string[];
  licenseText: string;
  macDownloadUrl: string;
  windowsDownloadUrl: string;
}

const previewAudioUrl = '/sfx/author-name-pronunciation.mp3';

export const plugins: Plugin[] = [
  {
    slug: 'ambient-dreams',
    name: 'Ambient Dreams',
    category: 'Ambient',
    description: 'Soft evolving textures, glassy pads, and spacious modulation for calm productions.',
    longDescription:
      'Ambient Dreams is built for expressive sound beds, cinematic pauses, meditation cues, and wide atmospheric layers. Its macro controls keep movement musical while leaving enough room for voices, synths, and field recordings.',
    price: 49,
    duration: '0:32',
    audioUrl: previewAudioUrl,
    format: 'VST3 / AU',
    version: '1.2.0',
    fileSize: '186 MB',
    compatibility: 'macOS 12+ / Windows 10+',
    features: [
      'Eight curated ambient engines',
      'Tempo-aware shimmer delay',
      'Wide stereo motion controls',
      'Low-noise pad layering',
    ],
    includedItems: [
      'Ambient Dreams plugin installer',
      '64 factory presets',
      'Quick start guide',
      'License certificate',
    ],
    systemRequirements: [
      '64-bit DAW with VST3 or AU support',
      '4 GB RAM minimum',
      '500 MB free disk space',
      'Internet connection for license activation',
    ],
    licenseText:
      'Single-user commercial license. You may use the plugin in unlimited released productions, but you may not redistribute, resell, or share the installer or license key.',
    macDownloadUrl: '/downloads/ambient-dreams-macos.zip',
    windowsDownloadUrl: '/downloads/ambient-dreams-windows.zip',
  },
  {
    slug: 'bass-enhancer',
    name: 'Bass Enhancer',
    category: 'Electronic',
    description: 'A focused low-end shaper for club-ready weight, punch, and harmonic clarity.',
    longDescription:
      'Bass Enhancer adds controlled saturation, phase-aware sub reinforcement, and transient focus to bass lines, kicks, and electronic stems without muddying the mix.',
    price: 39,
    duration: '0:28',
    audioUrl: previewAudioUrl,
    format: 'VST3 / AU / AAX',
    version: '1.1.4',
    fileSize: '92 MB',
    compatibility: 'macOS 12+ / Windows 10+',
    features: [
      'Sub harmonic generator',
      'Parallel drive circuit',
      'Mono-safe low frequency control',
      'Kick and bass focus modes',
    ],
    includedItems: [
      'Bass Enhancer plugin installer',
      '42 factory presets',
      'Mixing notes PDF',
      'License certificate',
    ],
    systemRequirements: [
      '64-bit DAW with VST3, AU, or AAX support',
      '4 GB RAM minimum',
      '250 MB free disk space',
      'Internet connection for license activation',
    ],
    licenseText:
      'Single-user commercial license. You may install on two personal machines and use in unlimited commercial and personal projects.',
    macDownloadUrl: '/downloads/bass-enhancer-macos.zip',
    windowsDownloadUrl: '/downloads/bass-enhancer-windows.zip',
  },
  {
    slug: 'vintage-tape',
    name: 'Vintage Tape',
    category: 'Vintage',
    description: 'Warm tape saturation, flutter, head bump, and soft compression in one clean interface.',
    longDescription:
      'Vintage Tape brings gentle analog coloration to buses, instruments, and masters with tasteful movement, adjustable bias, and mix-ready drive profiles.',
    price: 59,
    duration: '0:35',
    audioUrl: previewAudioUrl,
    format: 'VST3 / AU',
    version: '2.0.1',
    fileSize: '144 MB',
    compatibility: 'macOS 12+ / Windows 10+',
    features: [
      'Three tape machine profiles',
      'Wow and flutter modulation',
      'Head bump contour',
      'Noise floor trim',
    ],
    includedItems: [
      'Vintage Tape plugin installer',
      '58 factory presets',
      'Tape calibration guide',
      'License certificate',
    ],
    systemRequirements: [
      '64-bit DAW with VST3 or AU support',
      '8 GB RAM recommended',
      '400 MB free disk space',
      'Internet connection for license activation',
    ],
    licenseText:
      'Single-user commercial license. Presets may be used in productions, but plugin files and factory content may not be redistributed.',
    macDownloadUrl: '/downloads/vintage-tape-macos.zip',
    windowsDownloadUrl: '/downloads/vintage-tape-windows.zip',
  },
  {
    slug: 'cinematic-swells',
    name: 'Cinematic Swells',
    category: 'Cinematic',
    description: 'Risers, reverses, tonal blooms, and transition movement for trailer-grade moments.',
    longDescription:
      'Cinematic Swells turns simple input into dramatic builds and releases, combining granular layers, filtered noise, pitch curves, and timed dynamics.',
    price: 69,
    duration: '0:41',
    audioUrl: previewAudioUrl,
    format: 'VST3 / AU / AAX',
    version: '1.3.2',
    fileSize: '238 MB',
    compatibility: 'macOS 12+ / Windows 10+',
    features: [
      'Tempo-locked swell designer',
      'Reverse tail generator',
      'Granular bloom engine',
      'One-knob tension control',
    ],
    includedItems: [
      'Cinematic Swells plugin installer',
      '72 factory presets',
      'Cue-building walkthrough',
      'License certificate',
    ],
    systemRequirements: [
      '64-bit DAW with VST3, AU, or AAX support',
      '8 GB RAM recommended',
      '750 MB free disk space',
      'Internet connection for license activation',
    ],
    licenseText:
      'Single-user commercial license for music, film, games, and broadcast productions. Redistribution of plugin assets is prohibited.',
    macDownloadUrl: '/downloads/cinematic-swells-macos.zip',
    windowsDownloadUrl: '/downloads/cinematic-swells-windows.zip',
  },
  {
    slug: 'lo-fi-beats',
    name: 'Lo-Fi Beats',
    category: 'Lo-Fi',
    description: 'Dusty compression, vinyl movement, sampler tone, and laid-back groove shaping.',
    longDescription:
      'Lo-Fi Beats gives drum loops, keys, and samples a relaxed worn-in character with noise layers, pitch drift, sample-rate color, and transient smoothing.',
    price: 35,
    duration: '0:30',
    audioUrl: previewAudioUrl,
    format: 'VST3 / AU',
    version: '1.0.8',
    fileSize: '118 MB',
    compatibility: 'macOS 12+ / Windows 10+',
    features: [
      'Vinyl texture layer',
      'Sampler-style bit depth control',
      'Lazy swing processor',
      'Soft-clipped output stage',
    ],
    includedItems: [
      'Lo-Fi Beats plugin installer',
      '50 factory presets',
      'Beat processing cheat sheet',
      'License certificate',
    ],
    systemRequirements: [
      '64-bit DAW with VST3 or AU support',
      '4 GB RAM minimum',
      '350 MB free disk space',
      'Internet connection for license activation',
    ],
    licenseText:
      'Single-user commercial license. You may use processed audio royalty-free in released productions.',
    macDownloadUrl: '/downloads/lo-fi-beats-macos.zip',
    windowsDownloadUrl: '/downloads/lo-fi-beats-windows.zip',
  },
  {
    slug: 'nature-sounds',
    name: 'Nature Sounds',
    category: 'Nature',
    description: 'Layered environmental beds and organic motion for calm, place, and texture.',
    longDescription:
      'Nature Sounds blends rain, leaves, water, wind, and distant ambience into controllable beds for wellness apps, podcasts, film scenes, and music intros.',
    price: 29,
    duration: '0:36',
    audioUrl: previewAudioUrl,
    format: 'VST3 / AU',
    version: '1.4.0',
    fileSize: '312 MB',
    compatibility: 'macOS 12+ / Windows 10+',
    features: [
      'Five natural ambience layers',
      'Randomized organic movement',
      'Built-in gentle EQ',
      'Loop-safe texture engine',
    ],
    includedItems: [
      'Nature Sounds plugin installer',
      '45 factory presets',
      'Field layer reference',
      'License certificate',
    ],
    systemRequirements: [
      '64-bit DAW with VST3 or AU support',
      '4 GB RAM minimum',
      '800 MB free disk space',
      'Internet connection for license activation',
    ],
    licenseText:
      'Single-user commercial license. Audio generated by the plugin may be used in unlimited productions without additional royalties.',
    macDownloadUrl: '/downloads/nature-sounds-macos.zip',
    windowsDownloadUrl: '/downloads/nature-sounds-windows.zip',
  },
];

export const getPluginBySlug = (slug: string) =>
  plugins.find((plugin) => plugin.slug === slug);
