export interface Plugin {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  price: string;
  duration: number;
  audioUrl: string;
  format: string;
  version: string;
  fileSize: string;
  compatibility: string;
  features: string[];
  includedItems: string[];
  systemRequirements: {
    os: string[];
    cpu: string;
    ram: string;
    storage: string;
  };
  licenseText: string;
  macDownloadUrl: string;
  windowsDownloadUrl: string;
}

export const pluginsData: Plugin[] = [
  {
    id: '1',
    slug: 'ambient-dreams',
    name: 'Ambient Dreams',
    category: 'Ambient',
    description: 'Ethereal soundscapes for meditation and focus',
    longDescription: 'Ambient Dreams is a comprehensive sound design toolkit featuring ethereal pads, evolving textures, and atmospheric soundscapes perfect for meditation, focus music, and cinematic backgrounds. With over 500 carefully crafted presets and advanced modulation capabilities, this plugin transforms your creative workflow.',
    price: '$89',
    duration: 180,
    audioUrl: '/audio/plugin1.mp3',
    format: 'VST3, AU, AAX',
    version: '1.2.0',
    fileSize: '245 MB',
    compatibility: 'macOS 10.15+, Windows 10+',
    features: [
      '500+ premium presets',
      'Advanced granular synthesis',
      'Real-time parameter automation',
      'Multi-layer sound engine',
      'Built-in reverb and delay effects',
      'MIDI learn functionality'
    ],
    includedItems: [
      'Ambient Dreams plugin',
      '500+ preset library',
      'User manual',
      'Video tutorials',
      'Free updates for 1 year'
    ],
    systemRequirements: {
      os: ['macOS 10.15+', 'Windows 10+'],
      cpu: 'Intel Core i5 or AMD equivalent',
      ram: '8 GB RAM minimum',
      storage: '500 MB free space'
    },
    licenseText: 'Single user license. Commercial use permitted. One installation per user.',
    macDownloadUrl: '/downloads/ambient-dreams-mac.dmg',
    windowsDownloadUrl: '/downloads/ambient-dreams-win.exe'
  },
  {
    id: '2',
    slug: 'bass-enhancer',
    name: 'Bass Enhancer',
    category: 'Electronic',
    description: 'Deep, resonant bass frequencies for electronic music',
    longDescription: 'Bass Enhancer delivers powerful low-end control with advanced DSP algorithms designed specifically for electronic music production. Features multi-band processing, sub-harmonic synthesis, and intelligent frequency analysis to add weight, clarity, and punch to your basslines.',
    price: '$79',
    duration: 120,
    audioUrl: '/audio/plugin2.mp3',
    format: 'VST3, AU, AAX',
    version: '2.1.0',
    fileSize: '189 MB',
    compatibility: 'macOS 10.15+, Windows 10+',
    features: [
      'Multi-band bass processing',
      'Sub-harmonic synthesis',
      'Intelligent frequency analysis',
      'Real-time spectrum analyzer',
      'Sidechain compression',
      'Preset library for EDM genres'
    ],
    includedItems: [
      'Bass Enhancer plugin',
      'EDM preset pack',
      'Techno preset pack',
      'User manual',
      'Free updates for 1 year'
    ],
    systemRequirements: {
      os: ['macOS 10.15+', 'Windows 10+'],
      cpu: 'Intel Core i5 or AMD equivalent',
      ram: '8 GB RAM minimum',
      storage: '300 MB free space'
    },
    licenseText: 'Single user license. Commercial use permitted. One installation per user.',
    macDownloadUrl: '/downloads/bass-enhancer-mac.dmg',
    windowsDownloadUrl: '/downloads/bass-enhancer-win.exe'
  },
  {
    id: '3',
    slug: 'vintage-tape',
    name: 'Vintage Tape',
    category: 'Vintage',
    description: 'Warm analog saturation with tape emulation plugin',
    longDescription: 'Vintage Tape brings the warmth and character of classic tape machines to your digital productions. Meticulously modeled after legendary tape decks, this plugin adds authentic saturation, compression, and subtle pitch variations that define the analog sound.',
    price: '$99',
    duration: 150,
    audioUrl: '/audio/plugin3.mp3',
    format: 'VST3, AU, AAX',
    version: '1.5.0',
    fileSize: '312 MB',
    compatibility: 'macOS 10.15+, Windows 10+',
    features: [
      'Authentic tape machine modeling',
      'Multiple tape types and speeds',
      'Bias and noise controls',
      'Wow and flutter simulation',
      'Multi-band saturation',
      'Vintage preset collection'
    ],
    includedItems: [
      'Vintage Tape plugin',
      'Vintage preset library',
      'Tape machine impulse responses',
      'User manual',
      'Free updates for 1 year'
    ],
    systemRequirements: {
      os: ['macOS 10.15+', 'Windows 10+'],
      cpu: 'Intel Core i5 or AMD equivalent',
      ram: '8 GB RAM minimum',
      storage: '400 MB free space'
    },
    licenseText: 'Single user license. Commercial use permitted. One installation per user.',
    macDownloadUrl: '/downloads/vintage-tape-mac.dmg',
    windowsDownloadUrl: '/downloads/vintage-tape-win.exe'
  },
  {
    id: '4',
    slug: 'cinematic-swells',
    name: 'Cinematic Swells',
    category: 'Cinematic',
    description: 'Dramatic orchestral rises for film scoring',
    longDescription: 'Cinematic Swells is a specialized instrument for creating dramatic orchestral rises, impacts, and transitions. Featuring advanced sample synthesis and real-time orchestration, this plugin is essential for film composers, game audio designers, and electronic music producers.',
    price: '$129',
    duration: 200,
    audioUrl: '/audio/plugin4.mp3',
    format: 'VST3, AU, AAX',
    version: '3.0.0',
    fileSize: '567 MB',
    compatibility: 'macOS 10.15+, Windows 10+',
    features: [
      'Advanced orchestral sample engine',
      'Real-time swell generation',
      'Multi-layer instrument stacking',
      'Dynamic expression controls',
      'Film scoring presets',
      'MIDI automation support'
    ],
    includedItems: [
      'Cinematic Swells plugin',
      'Orchestral sample library',
      'Film scoring presets',
      'User manual',
      'Video tutorials',
      'Free updates for 1 year'
    ],
    systemRequirements: {
      os: ['macOS 10.15+', 'Windows 10+'],
      cpu: 'Intel Core i7 or AMD equivalent',
      ram: '16 GB RAM recommended',
      storage: '1 GB free space'
    },
    licenseText: 'Single user license. Commercial use permitted. One installation per user.',
    macDownloadUrl: '/downloads/cinematic-swells-mac.dmg',
    windowsDownloadUrl: '/downloads/cinematic-swells-win.exe'
  },
  {
    id: '5',
    slug: 'lo-fi-beats',
    name: 'Lo-Fi Beats',
    category: 'Lo-Fi',
    description: 'Chill hip-hop textures and dusty vinyl vibes',
    longDescription: 'Lo-Fi Beats captures the authentic sound of vintage vinyl, dusty samples, and chill hip-hop aesthetics. This comprehensive plugin includes drum machines, vinyl emulation, sample degradation, and everything needed to create authentic lo-fi productions.',
    price: '$69',
    duration: 160,
    audioUrl: '/audio/plugin5.mp3',
    format: 'VST3, AU, AAX',
    version: '1.8.0',
    fileSize: '423 MB',
    compatibility: 'macOS 10.15+, Windows 10+',
    features: [
      'Vinyl noise and crackle',
      'Sample degradation engine',
      'Vintage drum machine sounds',
      'Tape saturation',
      'Lo-fi preset library',
      'Real-time texture controls'
    ],
    includedItems: [
      'Lo-Fi Beats plugin',
      'Vinyl sample library',
      'Drum kit collection',
      'User manual',
      'Free updates for 1 year'
    ],
    systemRequirements: {
      os: ['macOS 10.15+', 'Windows 10+'],
      cpu: 'Intel Core i5 or AMD equivalent',
      ram: '8 GB RAM minimum',
      storage: '500 MB free space'
    },
    licenseText: 'Single user license. Commercial use permitted. One installation per user.',
    macDownloadUrl: '/downloads/lo-fi-beats-mac.dmg',
    windowsDownloadUrl: '/downloads/lo-fi-beats-win.exe'
  },
  {
    id: '6',
    slug: 'nature-sounds',
    name: 'Nature Sounds',
    category: 'Nature',
    description: 'Authentic environmental audio recordings',
    longDescription: 'Nature Sounds provides a comprehensive library of high-quality environmental recordings and soundscapes. From rainforests to oceans, mountains to deserts, this plugin offers authentic nature sounds perfect for meditation, ambient music, and film production.',
    price: '$59',
    duration: 240,
    audioUrl: '/audio/plugin6.mp3',
    format: 'VST3, AU, AAX',
    version: '1.3.0',
    fileSize: '156 MB',
    compatibility: 'macOS 10.15+, Windows 10+',
    features: [
      '500+ nature recordings',
      'Environmental soundscapes',
      'Dynamic weather sounds',
      'Bird song libraries',
      'Ocean wave generators',
      'Forest ambiance tools'
    ],
    includedItems: [
      'Nature Sounds plugin',
      'Weather preset pack',
      'Ambient texture library',
      'User manual',
      'Free updates for 1 year'
    ],
    systemRequirements: {
      os: ['macOS 10.15+', 'Windows 10+'],
      cpu: 'Intel Core i5 or AMD equivalent',
      ram: '8 GB RAM minimum',
      storage: '200 MB free space'
    },
    licenseText: 'Single user license. Commercial use permitted. One installation per user.',
    macDownloadUrl: '/downloads/nature-sounds-mac.dmg',
    windowsDownloadUrl: '/downloads/nature-sounds-win.exe'
  },
  {
    id: '7',
    slug: 'free-basic-reverb',
    name: 'Free Basic Reverb',
    category: 'Electronic',
    description: 'Simple and clean reverb effect for beginners',
    longDescription: 'Free Basic Reverb is a straightforward reverb plugin designed for beginners and those who need a clean, simple reverb effect. Despite being free, it offers high-quality algorithms and intuitive controls perfect for vocals, drums, and instruments.',
    price: 'Free',
    duration: 90,
    audioUrl: '/audio/plugin7.mp3',
    format: 'VST3, AU',
    version: '1.0.0',
    fileSize: '45 MB',
    compatibility: 'macOS 10.15+, Windows 10+',
    features: [
      'High-quality reverb algorithms',
      'Simple 3-knob interface',
      'Preset library for common applications',
      'Low CPU usage',
      '64-bit internal processing'
    ],
    includedItems: [
      'Free Basic Reverb plugin',
      'Basic preset pack',
      'User manual'
    ],
    systemRequirements: {
      os: ['macOS 10.15+', 'Windows 10+'],
      cpu: 'Intel Core i3 or AMD equivalent',
      ram: '4 GB RAM minimum',
      storage: '100 MB free space'
    },
    licenseText: 'Free for personal and commercial use. No attribution required.',
    macDownloadUrl: '/downloads/free-basic-reverb-mac.dmg',
    windowsDownloadUrl: '/downloads/free-basic-reverb-win.exe'
  },
  {
    id: '8',
    slug: 'quantum-synth',
    name: 'Quantum Synth',
    category: 'Electronic',
    description: 'Next-generation synthesizer with quantum processing',
    longDescription: 'Quantum Synth represents the future of sound synthesis with cutting-edge quantum-inspired processing algorithms. This revolutionary plugin offers unprecedented sound design capabilities, from realistic acoustic emulations to otherworldly textures that defy traditional synthesis methods.',
    price: 'Coming Soon',
    duration: 0,
    audioUrl: '/audio/plugin8.mp3',
    format: 'VST3, AU, AAX',
    version: '2.0.0',
    fileSize: '0 MB',
    compatibility: 'macOS 11+, Windows 11+',
    features: [
      'Quantum-inspired synthesis engine',
      'AI-assisted sound design',
      'Infinite parameter possibilities',
      'Real-time quantum processing',
      'Future-proof architecture'
    ],
    includedItems: [
      'Quantum Synth plugin (upon release)',
      'Advanced preset library',
      'Video tutorials',
      'Priority support'
    ],
    systemRequirements: {
      os: ['macOS 11+', 'Windows 11+'],
      cpu: 'Apple M1/M2 or Intel Core i7+',
      ram: '16 GB RAM recommended',
      storage: '500 MB free space'
    },
    licenseText: 'Pre-order license. Full access upon official release.',
    macDownloadUrl: '/downloads/quantum-synth-mac.dmg',
    windowsDownloadUrl: '/downloads/quantum-synth-win.exe'
  },
];

export const getPluginBySlug = (slug: string): Plugin | undefined => {
  return pluginsData.find(plugin => plugin.slug === slug);
};

export const getAllPlugins = (): Plugin[] => {
  return pluginsData;
};

export const getPluginsByCategory = (category: string): Plugin[] => {
  return pluginsData.filter(plugin => plugin.category === category);
};
