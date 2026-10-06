/** URL of a file in public/, relative to the app's base so it works on any static host or sub-path. */
export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`;
}
