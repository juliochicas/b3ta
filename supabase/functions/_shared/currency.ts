/**
 * Shared currency formatting functions for edge functions
 * All currencies use comma for thousands, period for decimals (en-US format)
 */

export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const formatCurrencyForEmail = (amount: number): string => {
  return `$${formatCurrency(amount)}`;
};

export const formatCurrencyDisplay = (amount: number, currency: string): string => {
  return `${currency} $${formatCurrency(amount)}`;
};
