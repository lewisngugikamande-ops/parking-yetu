export function generateCorrelationId() {
  return 'corr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
}
