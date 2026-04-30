const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const plugins = [
  {
    slug: 'ambient-dreams',
    name: 'Ambient Dreams',
    description: 'Ethereal soundscapes for meditation and focus',
    priceCents: 8900,
    status: 'active',
    previewUrl: '/audio/plugin1.mp3',
    fileKey: 'ambient-dreams',
  },
  {
    slug: 'bass-enhancer',
    name: 'Bass Enhancer',
    description: 'Deep, resonant bass frequencies for electronic music',
    priceCents: 7900,
    status: 'active',
    previewUrl: '/audio/plugin2.mp3',
    fileKey: 'bass-enhancer',
  },
  {
    slug: 'vintage-tape',
    name: 'Vintage Tape',
    description: 'Warm analog saturation with tape emulation plugin',
    priceCents: 9900,
    status: 'active',
    previewUrl: '/audio/plugin3.mp3',
    fileKey: 'vintage-tape',
  },
  {
    slug: 'cinematic-swells',
    name: 'Cinematic Swells',
    description: 'Dramatic orchestral rises for film scoring',
    priceCents: 12900,
    status: 'active',
    previewUrl: '/audio/plugin4.mp3',
    fileKey: 'cinematic-swells',
  },
  {
    slug: 'lo-fi-beats',
    name: 'Lo-Fi Beats',
    description: 'Chill hip-hop textures and dusty vinyl vibes',
    priceCents: 6900,
    status: 'active',
    previewUrl: '/audio/plugin5.mp3',
    fileKey: 'lo-fi-beats',
  },
  {
    slug: 'nature-sounds',
    name: 'Nature Sounds',
    description: 'Authentic environmental audio recordings',
    priceCents: 5900,
    status: 'active',
    previewUrl: '/audio/plugin6.mp3',
    fileKey: 'nature-sounds',
  },
  {
    slug: 'free-basic-reverb',
    name: 'Free Basic Reverb',
    description: 'Simple and clean reverb effect for beginners',
    priceCents: 0,
    status: 'free',
    previewUrl: '/audio/plugin7.mp3',
    fileKey: 'free-basic-reverb',
  },
  {
    slug: 'quantum-synth',
    name: 'Quantum Synth',
    description: 'Next-generation synthesizer with quantum processing',
    priceCents: 0,
    status: 'coming_soon',
    previewUrl: '/audio/plugin8.mp3',
    fileKey: 'quantum-synth',
  },
];

async function main() {
  for (const plugin of plugins) {
    await prisma.plugin.upsert({
      where: { slug: plugin.slug },
      update: plugin,
      create: plugin,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
