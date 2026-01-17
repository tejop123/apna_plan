const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

export function formatCurrency(value) {
  if (value === null || value === undefined) {
    return currencyFormatter.format(0);
  }
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return String(value);
  }
  return currencyFormatter.format(numeric);
}

export function formatDateTime(value, options = {}) {
  if (!value) {
    return 'TBA';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'TBA';
  }
  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options
  });
}

export function formatDate(value) {
  if (!value) {
    return 'Select date';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Select date';
  }
  return date.toLocaleDateString('en-IN', {
    dateStyle: 'medium'
  });
}

export function formatRoute(fromLabel, toLabel) {
  if (!fromLabel && !toLabel) {
    return 'Route TBA';
  }
  return `${fromLabel || 'TBA'} → ${toLabel || 'TBA'}`;
}

export function pluralize(label, count) {
  const numeric = Number(count) || 0;
  return `${numeric} ${numeric === 1 ? label : `${label}s`}`;
}

export function normalizePlaceInput(value = '') {
  if (!value) {
    return '';
  }
  return value
    .replace(/[·|]/g, ' ')
    .split('(')[0]
    .replace(/\s{2,}/g, ' ')
    .trim();
}
