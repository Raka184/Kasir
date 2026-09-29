import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const routes = [
  'app/api/products/route.js',
  'app/api/members/route.js',
  'app/api/users/route.js',
  'app/api/products/[id]/route.js',
  'app/api/members/[id]/route.js',
  'app/api/users/[id]/route.js',
];

test('JSON-reading API routes import parseJsonBody', async () => {
  for (const route of routes) {
    const source = await readFile(path.join(root, route), 'utf8');

    assert.match(
      source,
      /parseJsonBody/,
      `${route} should read JSON body with parseJsonBody`,
    );

    assert.match(
      source,
      /import\s+\{[^}]*parseJsonBody[^}]*\}\s+from\s+["']@\/lib\/request["']/,
      `${route} should import parseJsonBody from @/lib/request`,
    );
  }
});
