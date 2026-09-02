# ubyjvovk.github.io

Personal homepage. [Astro](https://astro.build) static site, deployed to GitHub Pages.

**Live:** [ubyjvovk.github.io](https://ubyjvovk.github.io)

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
npm run preview  # serve dist/ locally
```

## Deploy

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds the site and
publishes `dist/` to Pages.

**One-time setup:** in the repo's *Settings → Pages*, set **Source** to
**GitHub Actions**. The old "deploy from a branch" setting serves the repo root and
will keep showing the pre-Astro site until it is switched.

## Editing

| What | Where |
| --- | --- |
| Name, motto, intro, socials, nav | `src/data/site.ts` |
| Project cards | `projects` in `src/data/site.ts` |
| Skills grid, about copy | `src/data/site.ts` |
| Writings | `src/content/writings/*.md` |
| Colours, type, spacing | `src/styles/global.css` (tokens at the top) |
| Hero artwork | `public/images/hero-mars.png` |

### Project cards

A card renders a GitHub icon when it has a `repo`, and an external-link icon when it
has a `live`. Omit either and that icon is dropped.

### Writings

Each `.md` file in `src/content/writings/` becomes a page at `/writings/<filename>/`.
Frontmatter: `title`, `date`, optional `summary`, optional `draft: true` to hide it.
The homepage lists the three most recent. Delete every file to get a
"Nothing published yet." state — the layout holds either way.

### Latest on GitHub

Fetched from the GitHub API **at build time**. If the request fails for any reason
the build falls back to `recentFallback` in `src/data/site.ts` and carries on.

## Notes

- System fonts only — no webfont request.
- Light/dark toggle in the header, stored in `localStorage`, resolved before first
  paint so there is no flash.
- No client-side framework; the only JavaScript is the theme toggle.
