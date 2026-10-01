import { useEffect, useState } from 'react';

/**
 * Hash routes so the app works on any static host (Netlify, Vercel, GitHub Pages)
 * without server rewrites.
 */
export type Route =
  | { name: 'home' }
  | { name: 'food'; query?: string; foodId?: string; grams?: number }
  | { name: 'dish' }
  | { name: 'dish-original' }
  | { name: 'portion' }
  | { name: 'recipes' }
  | { name: 'recipe'; id: string }
  | { name: 'design-system' }
  | { name: 'not-found' };

export function parseRoute(hash: string): Route {
  const [path, qs] = hash.replace(/^#/, '').split('?');
  const params = new URLSearchParams(qs ?? '');
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return { name: 'home' };
  switch (parts[0]) {
    case 'food': return { name: 'food', query: params.get('q') ?? undefined, foodId: params.get('id') ?? undefined, grams: params.get('g') ? Number(params.get('g')) : undefined };
    case 'dish': return parts[1] === 'original' ? { name: 'dish-original' } : { name: 'dish' };
    case 'portion': return { name: 'portion' };
    case 'recipes': return parts[1] ? { name: 'recipe', id: parts[1] } : { name: 'recipes' };
    case 'design-system': return { name: 'design-system' };
    default: return { name: 'not-found' };
  }
}

export function href(path: string): string {
  return `#${path.startsWith('/') ? path : `/${path}`}`;
}

export function navigate(path: string) {
  window.location.hash = href(path);
}

export function goBack(fallback: string) {
  if (window.history.length > 1) window.history.back();
  else navigate(fallback);
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  useEffect(() => {
    const on = () => {
      setRoute(parseRoute(window.location.hash));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}
