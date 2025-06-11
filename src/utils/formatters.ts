export const formatLargeNumber = (value: number): string => {
  if (value >= 1000000000000) {
    return `${(value / 1000000000000).toFixed(2)}T`;
  }
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(2)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`;
  }
  return value.toString();
};

export const formatPercentage = (value: number | undefined | null): string => {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'N/A';
  }

  if (!isFinite(value)) return '∞%';
  if (value > 9999) return '>9999%';
  if (value < -9999) return '<-9999%';

  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};
