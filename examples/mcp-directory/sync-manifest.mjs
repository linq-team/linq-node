import { readFileSync, writeFileSync } from 'node:fs';
const manifestUrl = new URL('./server.json', import.meta.url);
const pkg = JSON.parse(
  readFileSync(new URL('../../packages/mcp-server/package.json', import.meta.url), 'utf8'),
);
const manifest = JSON.parse(readFileSync(manifestUrl, 'utf8'));
manifest.version = pkg.version;
manifest.packages[0].version = pkg.version;
writeFileSync(manifestUrl, JSON.stringify(manifest, null, 2) + '\n');
