# ubyjvovk.github.io

Personal homepage. [Astro](https://astro.build) static site, deployed to GitHub Pages.

**Live:** [ubyjvovk.github.io](https://ubyjvovk.github.io)

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
npm test         # game simulation tests (Node 22.6+)
npm run preview  # serve dist/ locally
```

## Deploy

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds the site and
publishes `dist/` to Pages.

**One-time setup:** in the repo's *Settings → Pages*, set **Source** to
**GitHub Actions**. The old "deploy from a branch" setting serves the repo root and
will keep showing the pre-Astro site until it is switched.

## Editing

- Project links and descriptions: `projects` in `src/data/site.ts`.
- Homepage: `src/pages/index.astro`.
- Pixel skyline: `src/components/Skyline.astro`.
- Colours, type, spacing: `src/styles/global.css`.
- Existing writing URLs remain available under `/writings/`.

The homepage restores the original compact calling-card design with the current
project list. System fonts, automatic light/dark colours, reduced-motion support,
and no build-time GitHub API request.

The full-width skyline is a canvas game: press **Enter** (or tap the start prompt), use arrow keys
to move, Space to fire, and Escape to pause. Touch controls are available on
small screens. Leaving the game or switching tabs pauses it automatically.
The skyline stays still until you start. The start prompt flashes three times
on load (except with reduced motion). Speed starts at 2× the original pace and rises gradually; solid towers have
narrow gaps, and drones, fast skimmers, and three-hit gunships fill the sky.
Gunships fire aimed shots. A boss arrives after 45 seconds, alternating carriers
that launch drones and skimmers with destroyers that fire spread volleys. Bosses
retreat after 30 seconds; defeating one grants bonus points and restores a shield.
The next encounter starts 45 seconds after the previous one ends. Towers pause
during boss fights. Amber edges mark the safe passage openings. Game logic lives in `src/lib/sky-game.ts`.

Projects lead with the local RTX 3090 + RTX 5080 DeepSeek branch, followed by
the GitHub profile pins as of 2026-09-18, in order, plus termpanes. The compact
grid uses three columns on desktop, two on tablets, and one on phones.
This is a checked-in snapshot, not a live API dependency.
Project previews are stored locally in `public/images/projects/`: AsciiCity,
Quota Monitor, quotamon-omarchy and AsciiHack use their repository screenshots;
Virt Viewer, nomouse and termpanes use repository-page screenshots. Update `preview` and `previewAlt` in the project data
when replacing them.
