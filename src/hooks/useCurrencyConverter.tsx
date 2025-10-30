import { useState, useEffect } from 'react';

interface CurrencyData {
  currency: string;
  symbol: string;
  rate: number;
  countryCode: string;
}

const CURRENCY_MAP: Record<string, { currency: string; symbol: string }> = {
  US: { currency: 'USD', symbol: '$' },
  GT: { currency: 'GTQ', symbol: 'Q' },
  MX: { currency: 'MXN', symbol: '$' },
  CO: { currency: 'COP', symbol: '$' },
  AR: { currency: 'ARS', symbol: '$' },
  CL: { currency: 'CLP', symbol: '$' },
  PE: { currency: 'PEN', symbol: 'S/' },
  BR: { currency: 'BRL', symbol: 'R$' },
  EC: { currency: 'USD', symbol: '$' },
  ES: { currency: 'EUR', symbol: '€' },
  // Add more countries as needed
};

export const useCurrencyConverter = () => {
  const [currencyData, setCurrencyData] = useState<CurrencyData>({
    currency: 'USD',
    symbol: '$',
    rate: 1,
    countryCode: 'US'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrencyData = async () => {
      try {
        // Get user's country
        const geoResponse = await fetch('https://ipapi.co/json/');
        const geoData = await geoResponse.json();
        const countryCode = geoData.country_code || 'US';
        
        const currencyInfo = CURRENCY_MAP[countryCode] || CURRENCY_MAP['US'];
        
        // If currency is USD, no need to convert
        if (currencyInfo.currency === 'USD') {
          setCurrencyData({
            currency: 'USD',
            symbol: '$',
            rate: 1,
            countryCode
          });
          setLoading(false);
          return;
        }

        // Get exchange rate
        const rateResponse = await fetch(
          `https://api.exchangerate-api.com/v4/latest/USD`
        );
        const rateData = await rateResponse.json();
        const rate = rateData.rates[currencyInfo.currency] || 1;

        setCurrencyData({
          currency: currencyInfo.currency,
          symbol: currencyInfo.symbol,
          rate,
          countryCode
        });
      } catch (error) {
        console.error('Error fetching currency data:', error);
        // Fallback to USD
        setCurrencyData({
          currency: 'USD',
          symbol: '$',
          rate: 1,
          countryCode: 'US'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencyData();
  }, []);

  const convertPrice = (usdPrice: number): string => {
    const converted = usdPrice * currencyData.rate;
    return converted.toLocaleString('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const formatPrice = (usdPrice: number): string => {
    if (currencyData.currency === 'USD') {
      return `$${usdPrice.toLocaleString()}`;
    }
    return `${currencyData.symbol}${convertPrice(usdPrice)}`;
  };

  return {
    currencyData,
    loading,
    convertPrice,
    formatPrice
  };
};
