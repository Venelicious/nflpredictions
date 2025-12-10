const test = require('node:test');
const assert = require('node:assert');
const { normalizeTipPayload } = require('../lib/tipPayload');

test('normalizeTipPayload keeps season and predictions', () => {
  const payload = { season: '2024', predictions: { foo: 'bar' } };
  const result = normalizeTipPayload(payload);
  assert.strictEqual(result.season, '2024');
  assert.deepStrictEqual(result.predictions, { foo: 'bar' });
});

test('normalizeTipPayload falls back to empty predictions', () => {
  const result = normalizeTipPayload(null);
  assert.strictEqual(result.season, '');
  assert.deepStrictEqual(result.predictions, {});
});

test('normalizeTipPayload accepts payload alias', () => {
  const result = normalizeTipPayload({ season: '2025', payload: { a: 1 } });
  assert.strictEqual(result.season, '2025');
  assert.deepStrictEqual(result.predictions, { a: 1 });
});
