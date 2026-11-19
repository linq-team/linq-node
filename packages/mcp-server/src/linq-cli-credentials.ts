import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const API_KEY_ENV = 'LINQ_API_V3_API_KEY';

interface LinqCliConfig {
  profile?: string;
  profiles?: Record<string, { token?: string } | undefined>;
}

/**
 * Read the API token the `linq` CLI stores in ~/.linq/config.json.
 *
 * MCP clients launch this server as a detached child process, so it does not
 * inherit a login shell. On macOS in particular, a GUI-launched editor never
 * sees `export LINQ_API_V3_API_KEY=...` from a shell profile, which leaves the
 * env var the only supported credential source unreachable for most desktop
 * users. Falling back to the CLI's own config means `linq login` is enough.
 *
 * Returns null whenever the file is absent, unreadable, malformed, or holds no
 * token — the caller then proceeds as before and the SDK reports the missing
 * credential itself.
 */
export function readTokenFromLinqCli(home: string = homedir()): string | null {
  const configPath = join(home, '.linq', 'config.json');
  if (!existsSync(configPath)) return null;

  let config: LinqCliConfig;
  try {
    config = JSON.parse(readFileSync(configPath, 'utf8')) as LinqCliConfig;
  } catch {
    return null;
  }

  // LINQ_PROFILE mirrors the CLI's --profile flag, so a developer working
  // against staging gets staging here too.
  const profileName = process.env['LINQ_PROFILE'] || config.profile || 'default';
  const token = config.profiles?.[profileName]?.token;
  return typeof token === 'string' && token.length > 0 ? token : null;
}

/**
 * Populate the API key env var from the CLI config when it is not already set.
 * An explicitly provided key always wins.
 */
export function applyLinqCliCredentials(env: NodeJS.ProcessEnv = process.env): boolean {
  if (env[API_KEY_ENV]) return false;
  const token = readTokenFromLinqCli();
  if (!token) return false;
  env[API_KEY_ENV] = token;
  return true;
}
