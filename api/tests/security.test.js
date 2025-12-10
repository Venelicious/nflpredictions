const test = require('node:test');
const assert = require('node:assert');
const { hashPassword, verifyPassword, createSessionToken, hashToken, calculateExpiry } = require('../lib/security');

test('hashPassword and verifyPassword', () => {
  const password = 'Secret123!';
  const hash = hashPassword(password);
  assert.ok(hash !== password);
  assert.ok(verifyPassword(password, hash));
  assert.ok(!verifyPassword('wrong', hash));
});

test('createSessionToken generates unique tokens', () => {
  const tokenA = createSessionToken();
  const tokenB = createSessionToken();
  assert.ok(tokenA && tokenB && tokenA !== tokenB);
  assert.strictEqual(tokenA.length, tokenB.length);
});

test('hashToken creates deterministic sha256 hashes', () => {
  const token = 'abc';
  const hash = hashToken(token);
  assert.strictEqual(hash.length, 64);
  assert.strictEqual(hashToken(token), hash);
});

test('calculateExpiry respects days argument', () => {
  const now = Date.now();
  const expires = calculateExpiry(2).getTime();
  const diffDays = Math.round((expires - now) / (1000 * 60 * 60 * 24));
  assert.ok(diffDays >= 2);
});
