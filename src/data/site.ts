// Single source of truth for everything on the page.
// Edit here — the components are just layout.

export const site = {
  title: 'ubyjvovk',
  description:
    'Engineer, architect, storyteller. Systems, code, and ideas at the edge of tech and imagination.',
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
  repo?: string;
  live?: string;
};

export const projects: Project[] = [
  {
    name: 'quota_monitor',
    blurb:
      'One normalised view of LLM subscription quota across providers — terminal, macOS menu bar, Waybar and Omarchy.',
    icon: 'gauge',
    tint: 'cyan',
    tags: ['Go', 'SwiftUI', 'CLI', 'macOS'],
    repo: 'https://github.com/ubyjvovk/quota_monitor',
  },
  {
    name: 'asciicity',
    blurb:
      'Walk real cities in first person, rendered as coloured ASCII with a green navigation HUD.',
    icon: 'spires',
    tint: 'rust',
    tags: ['three.js', 'Vite', 'ASCII', 'maps'],
    repo: 'https://github.com/ubyjvovk/asciicity',
    live: 'https://ubyjvovk.github.io/asciicity/',
  },
  {
    name: 'quotamon-omarchy',
    blurb:
      'An Omarchy bar plugin: a deliberately dumb renderer for quotamon --json, with install and update plumbing.',
    icon: 'panel',
    tint: 'green',
    tags: ['QML', 'Omarchy', 'Waybar'],
    repo: 'https://github.com/ubyjvovk/quotamon-omarchy',
  },
  {
    name: 'sarge',
    blurb:
      'A friendly drill sergeant whose stated mission is admirably simple: keep you productive and fit.',
    icon: 'stripes',
    tint: 'violet',
    tags: ['JavaScript', 'web', 'experiment'],
    repo: 'https://github.com/ubyjvovk/sarge',
    live: 'https://ubyjvovk.github.io/sarge/',
  },
  {
    name: 'roll100',
    blurb:
      'A deliberately tiny random-number app: 0–99, once a second, with pause, one-off rolls, gauge and themes.',
    icon: 'dice',
    tint: 'blue',
    tags: ['TypeScript', 'Vite', 'minimal UI'],
    repo: 'https://github.com/ubyjvovk/roll100',
    live: 'https://ubyjvovk.github.io/roll100/',
  },
  {
    name: 'rada_voting',
    blurb:
      'Verkhovna Rada voting data, plus the scraper and parser that make the raw parliamentary record usable.',
    icon: 'ballot',
    tint: 'gold',
    tags: ['Python', 'data', 'scraping'],
    repo: 'https://github.com/ubyjvovk/rada_voting',
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
