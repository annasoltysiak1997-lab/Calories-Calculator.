/** The Bitewise wordmark: text only, no icon. */
export function Wordmark({ size = 22 }: { size?: number }) {
  return <span className="dl-wordmark" style={{ fontSize: size, lineHeight: 1.1 }}>Bitewise</span>;
}
