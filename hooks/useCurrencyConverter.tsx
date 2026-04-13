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

const CACHE_KEY = 'b3ta_currency_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const useCurrencyConverter = () => {
  const [currencyData, setCurrencyData] = useState<CurrencyData>({
    currency: 'USD',
    symbol: '$',
    rate: 1,
    countryCode: 'US'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setCurrencyData(data);
          return; // Use cached data, don't make API calls
        }
      } catch (e) {
        // Invalid cache, continue to fetch
      }
    }

    // Fetch in background without blocking render
    const fetchCurrencyData = async () => {
      try {
        setLoading(true);
        
        // Get user's country with timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        
        const geoResponse = await fetch('https://ipapi.co/json/', {
          signal: controller.signal
        });
        clearTimeout(timeout);
        
        const geoData = await geoResponse.json();
        const countryCode = geoData.country_code || 'US';
        
        const currencyInfo = CURRENCY_MAP[countryCode] || CURRENCY_MAP['US'];
        
        // If currency is USD, no need to convert
        if (currencyInfo.currency === 'USD') {
          const data = {
            currency: 'USD',
            symbol: '$',
            rate: 1,
            countryCode
          };
          setCurrencyData(data);
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
          setLoading(false);
          return;
        }

        // Get exchange rate with timeout
        const rateController = new AbortController();
        const rateTimeout = setTimeout(() => rateController.abort(), 3000);
        
        const rateResponse = await fetch(
          `https://api.exchangerate-api.com/v4/latest/USD`,
          { signal: rateController.signal }
        );
        clearTimeout(rateTimeout);
        
        const rateData = await rateResponse.json();
        const rate = rateData.rates[currencyInfo.currency] || 1;

        const data = {
          currency: currencyInfo.currency,
          symbol: currencyInfo.symbol,
          rate,
          countryCode
        };
        
        setCurrencyData(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
      } catch (error) {
        console.error('Error fetching currency data:', error);
        // Keep USD fallback
      } finally {
        setLoading(false);
      }
    };

    // Fetch after a short delay to not block initial render
    const timer = setTimeout(fetchCurrencyData, 100);
    return () => clearTimeout(timer);
  }, []);

  const convertPrice = (usdPrice: number): string => {
    const converted = usdPrice * currencyData.rate;
    // Use appropriate locale based on country
    const locale = currencyData.countryCode === 'GT' ? 'es-GT' : 'en-US';
    return converted.toLocaleString(locale, {
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
