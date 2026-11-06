import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const root = new URL('../../../', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'));
const manifest = read('examples/mcp-directory/server.json');
const pkg = read('packages/mcp-server/package.json');
test('registry identity agrees with the package that will be published', () => {
  assert.equal(manifest.name, pkg.mcpName);
  assert.equal(manifest.version, pkg.version);
  assert.equal(manifest.packages[0].identifier, pkg.name);
  assert.equal(manifest.packages[0].version, pkg.version);
  assert.equal(manifest.packages[0].transport.type, 'stdio');
  assert.ok(manifest.description.length <= 100);
  assert.match(manifest.repository.url, /^https:\/\/github.com\/linq-team\/linq-node$/);
});
test('registry documents per-user credentials without embedding values', () => {
  const env = manifest.packages[0].environmentVariables;
  assert.deepEqual(
    env.map((v) => v.name),
    ['LINQ_API_V3_API_KEY'],
  );
  assert.ok(env.every((v) => v.isSecret && v.isRequired && !('value' in v) && !('default' in v)));
  assert.equal('remotes' in manifest, false);
});
test('distribution transform preserves registry ownership marker', () => {
  const require = createRequire(import.meta.url);
  const { execFileSync } = require('node:child_process');
  const transformed = JSON.parse(
    execFileSync(process.execPath, ['scripts/utils/make-dist-package-json.cjs'], {
      cwd: root,
      env: {
        ...process.env,
        PKG_JSON_PATH: fileURLToPath(new URL('packages/mcp-server/package.json', root)),
      },
      encoding: 'utf8',
    }),
  );
  assert.equal(transformed.mcpName, manifest.name);
});

test('release automation updates both registry versions with the SDK', () => {
  const config = read('release-please-config.json');
  const paths = config['extra-files']
    .filter((f) => typeof f === 'object' && f.path === 'examples/mcp-directory/server.json')
    .map((f) => f.jsonpath);
  assert.deepEqual(paths.sort(), ['$.packages[0].version', '$.version']);
});
