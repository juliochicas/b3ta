/**
 * Format currency amounts with proper locale formatting
 * For GTQ (Guatemala), uses comma for thousands and period for decimals
 * Example: GTQ 1,234.56
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const locale = currency === 'GTQ' ? 'en-US' : 'en-US'; // en-US uses comma for thousands, period for decimals
  
  return amount.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Format currency with symbol
 */
export const formatCurrencyWithSymbol = (amount: number, currency: string = 'USD'): string => {
  const formatted = formatCurrency(amount, currency);
  const symbols: Record<string, string> = {
    'USD': '$',
    'GTQ': 'Q',
    'MXN': '$',
    'EUR': '€'
  };
  
  const symbol = symbols[currency] || '$';
  return `${symbol} ${formatted}`;
};

/**
 * Format currency display with currency code
 */
export const formatCurrencyDisplay = (amount: number, currency: string = 'USD'): string => {
  const formatted = formatCurrency(amount, currency);
  return `${currency} $${formatted}`;
};
