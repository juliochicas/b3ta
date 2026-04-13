/**
 * Format currency amounts with proper locale formatting
 * All currencies use comma for thousands, period for decimals (en-US format)
 * Example: 1,234.56
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const getCurrencySymbol = (currency: string = 'USD'): string => {
  const symbols: Record<string, string> = {
    'USD': '$',
    'GTQ': 'Q',
    'MXN': '$',
    'EUR': '€',
    'GBP': '£',
    'CAD': '$',
    'COP': '$',
    'ARS': '$',
    'CLP': '$',
    'PEN': 'S/',
    'BRL': 'R$'
  };
  return symbols[currency] || '$';
};

/**
 * Format currency with symbol only
 * Example: $1,234.56 or Q1,234.56
 */
export const formatCurrencyWithSymbol = (amount: number, currency: string = 'USD'): string => {
  const formatted = formatCurrency(amount, currency);
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${formatted}`;
};

/**
 * Format currency display with currency code (for UI)
 * Example: GTQ Q1,234.56 or USD $1,234.56
 */
export const formatCurrencyDisplay = (amount: number, currency: string = 'USD'): string => {
  const formatted = formatCurrency(amount, currency);
  const symbol = getCurrencySymbol(currency);
  return `${currency} ${symbol}${formatted}`;
};

/**
 * Format currency for PDFs (jsPDF compatible)
 * Example: €1,234.56
 */
export const formatCurrencyForPDF = (amount: number, currency: string = 'USD'): string => {
  const formatted = formatCurrency(amount, currency);
  const symbol = getCurrencySymbol(currency);
  // jsPDF sometimes has issues with € symbol if font doesn't support it, but standard Helvetica handles it ok in modern jsPDF
  return `${symbol}${formatted}`;
};

/**
 * Format currency for emails (HTML compatible)
 * Example: €1,234.56
 */
export const formatCurrencyForEmail = (amount: number, currency: string = 'USD'): string => {
  const formatted = formatCurrency(amount, currency);
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${formatted}`;
};
