import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizePrediction } from '../js/features/predictions.js';

describe('normalizePrediction', () => {
  test('caps wins, losses and divisionRank at their maximum values', () => {
    const normalized = normalizePrediction({ wins: 30, losses: 99, divisionRank: 9 });

    assert.deepEqual(normalized, { wins: 17, losses: 17, divisionRank: 4 });
  });

  test('floors values at the minimum allowed boundaries', () => {
    const normalized = normalizePrediction({ wins: -5, losses: -1, divisionRank: 0 });

    assert.deepEqual(normalized, { wins: 0, losses: 0, divisionRank: 1 });
  });

  test('defaults to safe values when inputs are not numeric', () => {
    const normalized = normalizePrediction({ wins: 'abc', losses: 'xyz', divisionRank: 'foo' });

    assert.deepEqual(normalized, { wins: 0, losses: 0, divisionRank: 1 });
  });
});
