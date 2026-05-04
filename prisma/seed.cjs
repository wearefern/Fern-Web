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

const tools = [
  {
    slug: 'project-manager-template',
    name: 'Project Manager Template',
    description: 'Structured project planning workspace for teams and solo operators.',
    longDescription:
      'A clean project management template with milestones, dependencies, priorities, and delivery checkpoints for modern teams.',
    priceCents: 1900,
    status: 'active',
    category: 'Operations',
    fileKey: 'tools/project-manager-template.zip',
  },
  {
    slug: 'client-portal-starter',
    name: 'Client Portal Starter',
    description: 'Starter kit for client onboarding, approvals, and status updates.',
    longDescription:
      'A reusable starter package to launch client portals quickly with onboarding docs, approval flows, and communication templates.',
    priceCents: 4900,
    status: 'active',
    category: 'Client',
    fileKey: 'tools/client-portal-starter.zip',
  },
  {
    slug: 'invoice-tracker',
    name: 'Invoice Tracker',
    description: 'Track invoice status, due dates, and payment follow-up in one place.',
    longDescription:
      'A practical invoice tracker for freelancers and agencies with aging buckets, reminders, and reconciliation fields.',
    priceCents: 0,
    status: 'free',
    category: 'Finance',
    fileKey: 'tools/invoice-tracker.zip',
  },
  {
    slug: 'deployment-checklist',
    name: 'Deployment Checklist',
    description: 'Pre-launch and post-launch checklists for safer releases.',
    longDescription:
      'A release operations checklist covering QA gates, rollback plans, monitoring setup, and incident readiness.',
    priceCents: 900,
    status: 'active',
    category: 'Engineering',
    fileKey: 'tools/deployment-checklist.zip',
  },
  {
    slug: 'social-media-planner',
    name: 'Social Media Planner',
    description: 'Editorial planning board with campaign calendar and content slots.',
    longDescription:
      'A social planning pack with monthly calendar, campaign tracker, and reusable post formats for consistent publishing.',
    priceCents: 1500,
    status: 'active',
    category: 'Marketing',
    fileKey: 'tools/social-media-planner.zip',
  },
  {
    slug: 'event-budget-calculator',
    name: 'Event Budget Calculator',
    description: 'Estimate event costs, compare scenarios, and track spend.',
    longDescription:
      'A lightweight budget calculator for event planning with fixed/variable cost sections and vendor comparison sheets.',
    priceCents: 0,
    status: 'free',
    category: 'Operations',
    fileKey: 'tools/event-budget-calculator.zip',
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

  for (const tool of tools) {
    await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: tool,
      create: tool,
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
