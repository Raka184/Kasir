import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';

import { getTokenPayload, COOKIE_NAME } from '../lib/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-jangan-dipakai-di-produksi';

test('getTokenPayload accepts a valid token and rejects expired tokens', () => {
  const validToken = jwt.sign({ id: 42, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
  const expiredToken = jwt.sign({ id: 42, role: 'admin' }, JWT_SECRET, { expiresIn: -1 });

  assert.ok(getTokenPayload(validToken));
  assert.equal(getTokenPayload(expiredToken), null);
  assert.equal(getTokenPayload(''), null);
  assert.equal(getTokenPayload(COOKIE_NAME), null);
});
