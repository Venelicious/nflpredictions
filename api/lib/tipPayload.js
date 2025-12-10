function normalizeTipPayload(payload = {}) {
  const safePayload = typeof payload === 'object' && payload !== null ? payload : {};
  const normalizedPredictions =
    safePayload.predictions || safePayload.payload || (typeof safePayload === 'object' ? safePayload : {});

  return {
    season: safePayload.season || '',
    predictions: typeof normalizedPredictions === 'object' && normalizedPredictions !== null ? normalizedPredictions : {},
  };
}

module.exports = { normalizeTipPayload };
