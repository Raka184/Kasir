import test from 'node:test';
import assert from 'node:assert/strict';

import { createResetToken, isResetTokenExpired } from '../lib/password-reset.js';
import { parseJsonBody } from '../lib/request.js';

test('createResetToken returns a non-empty token', () => {
  const token = createResetToken();

  assert.equal(typeof token, 'string');
  assert.ok(token.length > 20);
});

test('isResetTokenExpired returns false for a future expiry and true for a past expiry', () => {
  const future = new Date(Date.now() + 60 * 60 * 1000);
  const past = new Date(Date.now() - 60 * 1000);

  assert.equal(isResetTokenExpired(future), false);
  assert.equal(isResetTokenExpired(past), true);
});

test('parseJsonBody throws a clear error for malformed JSON', async () => {
  const request = new Request('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{bad json}',
  });

  await assert.rejects(
    () => parseJsonBody(request),
    /JSON.*valid|valid JSON|Invalid JSON/i,
  );
});
