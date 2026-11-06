import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const manifest = JSON.parse(readFileSync(new URL('./server.json', import.meta.url), 'utf8'));
const pkg = manifest.packages[0];
const child = spawn('npx', ['-y', `${pkg.identifier}@${pkg.version}`], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: {
    PATH: process.env.PATH,
    HOME: process.env.HOME,
    TMPDIR: process.env.TMPDIR,
    LINQ_API_V3_API_KEY: 'registry-smoke-placeholder',
  },
});
const pending = new Map();
let seq = 0,
  buffer = '';
child.stdout.on('data', (chunk) => {
  buffer += chunk;
  let end;
  while ((end = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, end);
    buffer = buffer.slice(end + 1);
    let message;
    try {
      message = JSON.parse(line);
    } catch {
      continue;
    }
    const entry = pending.get(message.id);
    if (entry) {
      clearTimeout(entry.timer);
      pending.delete(message.id);
      entry.resolve(message);
    }
  }
});
child.stderr.on('data', () => {});
child.on('error', (error) => {
  for (const entry of pending.values()) entry.reject(error);
});
child.on('exit', (code) => {
  for (const entry of pending.values()) entry.reject(new Error(`Server exited: ${code}`));
});
function request(method, params) {
  const id = ++seq;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`Timeout: ${method}`));
    }, 120000);
    pending.set(id, { resolve, reject, timer });
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
  });
}
try {
  const init = await request('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'linq-registry-smoke', version: '1' },
  });
  assert.ok(init.result, 'Initialize failed');
  child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');
  const list = await request('tools/list', {});
  assert.deepEqual(list.result.tools.map((t) => t.name).sort(), ['execute', 'search_docs']);
  for (const args of [
    { name: 'search_docs', arguments: { query: 'send a message', language: 'typescript' } },
    {
      name: 'execute',
      arguments: {
        code: 'async function run(client) { return { value: 2 + 2, hasClient: !!client }; }',
        intent: 'Credential-free registry smoke check',
      },
    },
  ]) {
    const result = await request('tools/call', args);
    assert.ok(!result.error && result.result && !result.result.isError, `${args.name} failed`);
    const text = result.result.content
      .filter((c) => c.type === 'text')
      .map((c) => c.text)
      .join('\n');
    assert.match(text, args.name === 'execute' ? /"value":\s*4/ : /client\./);
  }
  console.log(`PASS ${pkg.identifier}@${pkg.version}: initialize, tools/list, search_docs, execute`);
} finally {
  for (const entry of pending.values()) clearTimeout(entry.timer);
  child.stdin.end();
  child.kill();
}
