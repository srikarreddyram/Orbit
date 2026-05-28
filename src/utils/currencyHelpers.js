export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  NZD: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
}

export const getCurrencySymbol = (code) => {
  return CURRENCIES[code]?.symbol || '$'
}

export const formatCurrency = (amount, code = 'USD', includeSymbol = true) => {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const formatted = absAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const symbol = includeSymbol ? getCurrencySymbol(code) : '';
  
  if (isNegative) {
    return `-${symbol}${formatted}`;
  }
  return `${symbol}${formatted}`;
}
