import { githubUser, recentFallback } from '../data/site';

export type RecentRepo = { name: string; href: string; when: string };

function relative(from: Date): string {
  const days = Math.floor((Date.now() - from.getTime()) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return '1d ago';
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

/**
 * Fetched once at build time. Any failure (offline, rate limit, API change)
 * falls back to the hand-written list so the build never breaks on it.
 */
export async function recentRepos(limit = 5): Promise<RecentRepo[]> {
  const token = import.meta.env.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;
  try {
    const res = await fetch(
      `https://api.github.com/users/${githubUser}/repos?sort=pushed&per_page=${limit}&type=owner`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': `${githubUser}.github.io`,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const repos = (await res.json()) as {
      name: string;
      html_url: string;
      pushed_at: string;
      fork: boolean;
    }[];
    const rows = repos
      .filter((r) => !r.fork)
      .slice(0, limit)
      .map((r) => ({
        name: `${githubUser}/${r.name}`,
        href: r.html_url,
        when: relative(new Date(r.pushed_at)),
      }));
    return rows.length ? rows : recentFallback;
  } catch (err) {
    console.warn(
      `[github] live repo list unavailable, using fallback — ${(err as Error).message}`,
    );
    return recentFallback;
  }
}
