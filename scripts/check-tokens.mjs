// Fails when a colour literal appears outside src/theme. Components must use var(--dl-…).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('../src/', import.meta.url).pathname;
const allowed = ['theme/'];
const pattern = /#[0-9a-fA-F]{3,8}\b|rgba?\(/g;
const problems = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx|css)$/.test(name)) {
      const rel = relative(root, p);
      if (allowed.some((a) => rel.startsWith(a)) || rel.includes('__tests__')) continue;
      readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
        if (line.match(pattern)) problems.push(`src/${rel}:${i + 1}  ${line.trim()}`);
      });
    }
  }
}
walk(root);
if (problems.length) {
  console.error('Colour literals found outside src/theme (use var(--dl-…) tokens):\n' + problems.join('\n'));
  process.exit(1);
}
console.log('check-tokens: no colour literals outside src/theme');
