// Single source of truth for everything on the page.
// Edit here — the components are just layout.

export const site = {
  title: 'ubyjvovk',
  description:
    'Building TigerTeamApp.com. Projects by ubyjvovk.',
  url: 'https://ubyjvovk.github.io',
  motto: { lead: 'KILL THE WOLF.', tail: 'BUILD THE FUTURE.' },
  tagline: 'Engineer. Architect. Storyteller.',
  intro: 'I build systems, ship code, and explore ideas\nat the edge of tech and imagination.',
  greek: 'ΜΟΛΩΝ ΛΑΒΕ',
} as const;

export const nav = [
  { label: 'Overview', href: '#top' },
  { label: 'Projects', href: '#projects' },
  { label: 'Writings', href: '#writings' },
  { label: 'Skills', href: '#skills' },
  { label: 'About', href: '#about' },
] as const;

export type SocialName = 'github' | 'x' | 'linkedin' | 'email';

export const socials: { name: SocialName; label: string; href: string }[] = [
  { name: 'github', label: 'GitHub', href: 'https://github.com/ubyjvovk' },
  { name: 'x', label: 'X', href: 'https://x.com/ubyjvovk' },
  { name: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/ubyjvovk' },
  { name: 'email', label: 'Email', href: 'mailto:deemon@gmail.com' },
];

export type IconName =
  | 'waveform'
  | 'speech'
  | 'tree'
  | 'spires'
  | 'neural'
  | 'glasses'
  | 'gauge'
  | 'panel'
  | 'stripes'
  | 'dice'
  | 'ballot';

export type Project = {
  name: string;
  blurb: string;
  icon: IconName;
  tint: 'cyan' | 'rust' | 'green' | 'violet' | 'blue' | 'gold';
  tags: string[];
  preview: string;
  previewAlt: string;
  repo?: string;
  live?: string;
};

// Featured local DeepSeek branch, then GitHub pins and termpanes. Pins synced 2026-09-18.
export const projects: Project[] = [
  {
    name: 'DeepSeek locally',
    preview: '/images/projects/deepseek-local.jpg',
    previewAlt: 'Local RTX 3090 and RTX 5080 setup documentation for DeepSeek-V4.1-Flash',
    blurb: 'DeepSeek-V4.1-Flash, running locally on an RTX 3090 + RTX 5080.',
    icon: 'neural',
    tint: 'cyan',
    tags: ['Python', 'CUDA', 'local inference'],
    repo: 'https://github.com/ubyjvovk/deepseek-v41-flash-5080-3090/tree/local-inference-with-rtx3090-and-5080',
  },
  {
    name: 'asciicity',
    preview: '/images/projects/asciicity.png',
    previewAlt: 'First-person city streets rendered in coloured ASCII',
    blurb:
      'First-person cities, in ASCII.',
    icon: 'spires',
    tint: 'rust',
    tags: ['three.js', 'Vite', 'ASCII', 'maps'],
    repo: 'https://github.com/ubyjvovk/asciicity',
    live: 'https://ubyjvovk.github.io/asciicity/',
  },
  {
    name: 'quota_monitor',
    preview: '/images/projects/quota_monitor.png',
    previewAlt: 'Quota Monitor desktop app showing provider usage limits',
    blurb:
      'LLM subscription quotas, in one place.',
    icon: 'gauge',
    tint: 'cyan',
    tags: ['Go', 'SwiftUI', 'CLI', 'macOS'],
    repo: 'https://github.com/ubyjvovk/quota_monitor',
  },
  {
    name: 'quotamon-omarchy',
    preview: '/images/projects/quotamon-omarchy.png',
    previewAlt: 'Quota Monitor in the Omarchy desktop bar',
    blurb:
      'Your LLM quotas in the Omarchy bar.',
    icon: 'panel',
    tint: 'green',
    tags: ['QML', 'Omarchy', 'Waybar'],
    repo: 'https://github.com/ubyjvovk/quotamon-omarchy',
  },
  {
    name: 'virt-viewer',
    preview: '/images/projects/virt-viewer.jpg',
    previewAlt: 'GitHub repository preview for virt-viewer',
    blurb: 'A viewer for virtual machines over VNC and SPICE.',
    icon: 'panel',
    tint: 'blue',
    tags: ["C", "GTK", "VNC", "SPICE"],
    repo: 'https://github.com/ubyjvovk/virt-viewer',
  },
  {
    name: 'asciihack',
    preview: '/images/projects/asciihack.png',
    previewAlt: 'First-person NetHack dungeon rendered in ASCII',
    blurb: 'NetHack in first-person and isometric ASCII.',
    icon: 'spires',
    tint: 'gold',
    tags: ["NetHack", "TypeScript", "ASCII"],
    repo: 'https://github.com/ubyjvovk/asciihack',
  },
  {
    name: 'nomouse',
    preview: '/images/projects/nomouse.jpg',
    previewAlt: 'GitHub repository preview for nomouse',
    blurb: 'Control your Mac with hand gestures.',
    icon: 'glasses',
    tint: 'green',
    tags: ["Python", "macOS", "MediaPipe"],
    repo: 'https://github.com/ubyjvovk/nomouse',
  },
  {
    name: 'termpanes',
    preview: '/images/projects/termpanes.jpg',
    previewAlt: 'GitHub repository preview for termpanes',
    blurb: 'A programmable terminal multiplexer for Python.',
    icon: 'panel',
    tint: 'cyan',
    tags: ["Python", "PTY", "terminal"],
    repo: 'https://github.com/ubyjvovk/termpanes',
  },
];

// Fallback list for the "Latest on GitHub" column. Replaced at build time by
// live API data when the fetch succeeds — see src/lib/github.ts.
export const recentFallback = [
  { name: 'ubyjvovk/quota_monitor', href: 'https://github.com/ubyjvovk/quota_monitor', when: 'recently' },
  { name: 'ubyjvovk/quotamon-omarchy', href: 'https://github.com/ubyjvovk/quotamon-omarchy', when: 'recently' },
  { name: 'ubyjvovk/virt-viewer', href: 'https://github.com/ubyjvovk/virt-viewer', when: 'recently' },
  { name: 'ubyjvovk/asciicity', href: 'https://github.com/ubyjvovk/asciicity', when: 'recently' },
  { name: 'ubyjvovk/sarge', href: 'https://github.com/ubyjvovk/sarge', when: 'recently' },
];

// Rendered as a four-column grid, filling across rows.
export const skills = [
  'Python', 'Go', 'TypeScript', 'C++',
  'Django', 'PyTorch', 'Docker', 'CUDA',
  'Linux', 'AWS', 'Azure', 'Redis',
  'three.js', 'SwiftUI', 'Vite', 'ML',
];

export const about = [
  'I like tools that expose the actual machine underneath: observable systems, inspectable state, small interfaces, and software that does one strange thing unusually well.',
  'No funnel. No newsletter pop-up. No “book a call.”',
];

export const githubUser = 'ubyjvovk';
