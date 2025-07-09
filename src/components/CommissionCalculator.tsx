import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calculator, PieChart, Settings, Plus, Minus, Globe, Wifi, WifiOff, RefreshCw, Clock } from 'lucide-react';

interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  timestamp: number;
}

interface ExchangeRateData {
  rates: Record<string, ExchangeRate>;
  lastUpdated: number;
  isOnline: boolean;
  error?: string;
}

interface PricingTier {
  id: string;
  name: string;
  netRate: number;
  markup: number;
  sellingRate: number;
  commission: number;
  profit: number;
  nights: number;
  guests: number;
  rooms: number;
}

interface CommissionSettings {
  defaultMarkup: number;
  commissionRate: number;
  showNetRates: boolean;
  autoCalculate: boolean;
  currency: string;
  baseCurrency: string;
  exchangeRateUpdateFrequency: number; // minutes
  autoUpdateRates: boolean;
}

const CommissionCalculator: React.FC = () => {
  // Currency configuration
  const currencies: Currency[] = [
    { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦' },
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' }
  ];

  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([
    {
      id: '1',
      name: 'Sabi Sands Safari Lodge',
      netRate: 9500, // ZAR rates
      markup: 25,
      sellingRate: 11875,
      commission: 1781,
      profit: 2375,
      nights: 8,
      guests: 2,
      rooms: 1
    },
    {
      id: '2',
      name: 'Thornybush Game Lodge',
      netRate: 8500, // ZAR rates
      markup: 20,
      sellingRate: 10200,
      commission: 1530,
      profit: 1700,
      nights: 3,
      guests: 2,
      rooms: 1
    }
  ]);

  const [settings, setSettings] = useState<CommissionSettings>({
    defaultMarkup: 25,
    commissionRate: 15,
    showNetRates: true,
    autoCalculate: true,
    currency: 'ZAR',
    baseCurrency: 'ZAR',
    exchangeRateUpdateFrequency: 60, // 1 hour
    autoUpdateRates: true
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showExchangeSettings, setShowExchangeSettings] = useState(false);
  
  // Exchange rate state
  const [exchangeRates, setExchangeRates] = useState<ExchangeRateData>({
    rates: {},
    lastUpdated: 0,
    isOnline: false
  });
  
  const [isUpdatingRates, setIsUpdatingRates] = useState(false);

  // Exchange rate API functions
  const fetchExchangeRates = async (): Promise<void> => {
    if (isUpdatingRates) return;
    
    setIsUpdatingRates(true);
    
    try {
      // Using Exchange Rates API (free tier)
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${settings.baseCurrency}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const timestamp = Date.now();
      
      const rates: Record<string, ExchangeRate> = {};
      currencies.forEach(currency => {
        if (currency.code !== settings.baseCurrency) {
          rates[currency.code] = {
            from: settings.baseCurrency,
            to: currency.code,
            rate: data.rates[currency.code] || 1,
            timestamp
          };
        }
      });
      
      setExchangeRates({
        rates,
        lastUpdated: timestamp,
        isOnline: true,
        error: undefined
      });
      
      // Save to localStorage for offline use
      localStorage.setItem('exchangeRates', JSON.stringify({
        rates,
        lastUpdated: timestamp,
        baseCurrency: settings.baseCurrency
      }));
      
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      
      // Try to load from localStorage
      const savedRates = localStorage.getItem('exchangeRates');
      if (savedRates) {
        const parsed = JSON.parse(savedRates);
        setExchangeRates({
          rates: parsed.rates || {},
          lastUpdated: parsed.lastUpdated || 0,
          isOnline: false,
          error: error instanceof Error ? error.message : 'Failed to fetch exchange rates'
        });
      } else {
        setExchangeRates({
          rates: {},
          lastUpdated: 0,
          isOnline: false,
          error: error instanceof Error ? error.message : 'Failed to fetch exchange rates'
        });
      }
    } finally {
      setIsUpdatingRates(false);
    }
  };

  // Convert amount between currencies
  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    
    // If converting from base currency
    if (fromCurrency === settings.baseCurrency) {
      const rate = exchangeRates.rates[toCurrency];
      return rate ? amount * rate.rate : amount;
    }
    
    // If converting to base currency
    if (toCurrency === settings.baseCurrency) {
      const rate = exchangeRates.rates[fromCurrency];
      return rate ? amount / rate.rate : amount;
    }
    
    // Converting between two non-base currencies
    const fromRate = exchangeRates.rates[fromCurrency];
    const toRate = exchangeRates.rates[toCurrency];
    
    if (fromRate && toRate) {
      // Convert to base currency first, then to target currency
      const baseAmount = amount / fromRate.rate;
      return baseAmount * toRate.rate;
    }
    
    return amount; // Fallback if rates not available
  };

  // Get current currency info
  const getCurrentCurrency = (): Currency => {
    return currencies.find(c => c.code === settings.currency) || currencies[0];
  };

  // Format currency with proper symbol and formatting
  const formatCurrency = (amount: number, fromCurrency: string = settings.baseCurrency): string => {
    const currency = getCurrentCurrency();
    
    // Convert from base currency to display currency
    const convertedAmount = convertCurrency(amount, fromCurrency, currency.code);
    
    const formattedAmount = new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(convertedAmount);
    
    // For ZAR, replace the currency code with R symbol
    if (currency.code === 'ZAR') {
      return formattedAmount.replace('ZAR', 'R');
    }
    
    return formattedAmount;
  };

  // Currency change handler
  const handleCurrencyChange = (newCurrency: string) => {
    setSettings(prev => ({ ...prev, currency: newCurrency }));
  };

  // Initialize and update exchange rates
  useEffect(() => {
    // Load saved rates on component mount
    const savedRates = localStorage.getItem('exchangeRates');
    if (savedRates) {
      const parsed = JSON.parse(savedRates);
      setExchangeRates({
        rates: parsed.rates || {},
        lastUpdated: parsed.lastUpdated || 0,
        isOnline: false, // Initially offline until we fetch new rates
        error: undefined
      });
    }
    
    // Fetch fresh rates
    fetchExchangeRates();
  }, [settings.baseCurrency]);

  // Set up automatic updates
  useEffect(() => {
    if (!settings.autoUpdateRates) return;
    
    const interval = setInterval(() => {
      fetchExchangeRates();
    }, settings.exchangeRateUpdateFrequency * 60 * 1000); // Convert minutes to milliseconds
    
    return () => clearInterval(interval);
  }, [settings.autoUpdateRates, settings.exchangeRateUpdateFrequency]);

  // Time since last update
  const getTimeSinceLastUpdate = (): string => {
    if (!exchangeRates.lastUpdated) return 'Never';
    
    const now = Date.now();
    const diff = now - exchangeRates.lastUpdated;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
    if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    return 'Just now';
  };

  // Calculate selling rate and profits
  const calculatePricing = (netRate: number, markup: number, nights: number, guests: number, rooms: number) => {
    const sellingRate = netRate * (1 + markup / 100);
    const totalNet = netRate * nights * guests * rooms;
    const totalSelling = sellingRate * nights * guests * rooms;
    const commission = totalSelling * (settings.commissionRate / 100);
    const profit = totalSelling - totalNet - commission;
    
    return {
      sellingRate: Math.round(sellingRate),
      totalNet,
      totalSelling,
      commission: Math.round(commission),
      profit: Math.round(profit)
    };
  };

  // Update pricing tier
  const updatePricingTier = (id: string, field: keyof PricingTier, value: number) => {
    setPricingTiers(tiers => 
      tiers.map(tier => {
        if (tier.id === id) {
          const updatedTier = { ...tier, [field]: value };
          
          if (settings.autoCalculate) {
            const calculated = calculatePricing(
              field === 'netRate' ? value : tier.netRate,
              field === 'markup' ? value : tier.markup,
              updatedTier.nights,
              updatedTier.guests,
              updatedTier.rooms
            );
            
            return {
              ...updatedTier,
              sellingRate: calculated.sellingRate,
              commission: calculated.commission,
              profit: calculated.profit
            };
          }
          
          return updatedTier;
        }
        return tier;
      })
    );
  };

  // Add new pricing tier
  const addPricingTier = () => {
    const newTier: PricingTier = {
      id: Date.now().toString(),
      name: `New Hotel ${pricingTiers.length + 1}`,
      netRate: 400,
      markup: settings.defaultMarkup,
      sellingRate: 500,
      commission: 75,
      profit: 25,
      nights: 1,
      guests: 2,
      rooms: 1
    };
    
    const calculated = calculatePricing(
      newTier.netRate,
      newTier.markup,
      newTier.nights,
      newTier.guests,
      newTier.rooms
    );
    
    setPricingTiers([...pricingTiers, {
      ...newTier,
      sellingRate: calculated.sellingRate,
      commission: calculated.commission,
      profit: calculated.profit
    }]);
  };

  // Remove pricing tier
  const removePricingTier = (id: string) => {
    setPricingTiers(tiers => tiers.filter(tier => tier.id !== id));
  };

  // Calculate totals
  const calculateTotals = () => {
    return pricingTiers.reduce((acc, tier) => {
      const tierTotal = tier.sellingRate * tier.nights * tier.guests * tier.rooms;
      const tierNetTotal = tier.netRate * tier.nights * tier.guests * tier.rooms;
      const tierCommission = tierTotal * (settings.commissionRate / 100);
      const tierProfit = tierTotal - tierNetTotal - tierCommission;
      
      return {
        totalNet: acc.totalNet + tierNetTotal,
        totalSelling: acc.totalSelling + tierTotal,
        totalCommission: acc.totalCommission + tierCommission,
        totalProfit: acc.totalProfit + tierProfit,
        avgMarkup: acc.avgMarkup + tier.markup
      };
    }, { totalNet: 0, totalSelling: 0, totalCommission: 0, totalProfit: 0, avgMarkup: 0 });
  };

  const totals = calculateTotals();
  const avgMarkup = totals.avgMarkup / pricingTiers.length || 0;
  const profitMargin = totals.totalSelling > 0 ? (totals.totalProfit / totals.totalSelling) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Commission & Markup Calculator</h1>
            <p className="text-gray-600">Manage pricing, commissions, and profit margins</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Exchange Rate Status */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
              {exchangeRates.isOnline ? (
                <Wifi className="w-4 h-4 text-green-600" />
              ) : (
                <WifiOff className="w-4 h-4 text-amber-600" />
              )}
              <span className="text-xs text-gray-600">
                {exchangeRates.isOnline ? 'Live rates' : 'Offline rates'}
              </span>
              <span className="text-xs text-gray-500">
                {getTimeSinceLastUpdate()}
              </span>
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <select
                value={settings.currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none pr-8"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
              <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchExchangeRates}
              disabled={isUpdatingRates}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isUpdatingRates ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button
              onClick={addPricingTier}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Hotel
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-blue-900">Calculator Settings</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowExchangeSettings(!showExchangeSettings)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    showExchangeSettings 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-200 text-blue-700 hover:bg-blue-300'
                  }`}
                >
                  Exchange Rates
                </button>
              </div>
            </div>
            
            {!showExchangeSettings ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Default Markup %</label>
                  <input
                    type="number"
                    value={settings.defaultMarkup}
                    onChange={(e) => setSettings({...settings, defaultMarkup: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Commission Rate %</label>
                  <input
                    type="number"
                    value={settings.commissionRate}
                    onChange={(e) => setSettings({...settings, commissionRate: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showNetRates}
                      onChange={(e) => setSettings({...settings, showNetRates: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-blue-700">Show Net Rates</span>
                  </label>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoCalculate}
                      onChange={(e) => setSettings({...settings, autoCalculate: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-blue-700">Auto Calculate</span>
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Base Currency</label>
                    <select
                      value={settings.baseCurrency}
                      onChange={(e) => setSettings({...settings, baseCurrency: e.target.value})}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.flag} {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Update Frequency (minutes)</label>
                    <input
                      type="number"
                      value={settings.exchangeRateUpdateFrequency}
                      onChange={(e) => setSettings({...settings, exchangeRateUpdateFrequency: parseInt(e.target.value) || 60})}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="5"
                      max="1440"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoUpdateRates}
                        onChange={(e) => setSettings({...settings, autoUpdateRates: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm text-blue-700">Auto Update Rates</span>
                    </label>
                  </div>
                </div>
                
                {/* Exchange Rate Status */}
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Exchange Rate Status</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {exchangeRates.isOnline ? (
                          <Wifi className="w-4 h-4 text-green-600" />
                        ) : (
                          <WifiOff className="w-4 h-4 text-amber-600" />
                        )}
                        <span className="text-sm font-medium">
                          {exchangeRates.isOnline ? 'Connected - Live Rates' : 'Offline - Cached Rates'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Last updated: {getTimeSinceLastUpdate()}</span>
                      </div>
                      {exchangeRates.error && (
                        <div className="mt-2 text-sm text-red-600">
                          Error: {exchangeRates.error}
                        </div>
                      )}
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Current Rates (from {settings.baseCurrency})</h5>
                      <div className="text-xs text-gray-600 space-y-1">
                        {currencies.map(currency => {
                          if (currency.code === settings.baseCurrency) return null;
                          const rate = exchangeRates.rates[currency.code];
                          return (
                            <div key={currency.code} className="flex justify-between">
                              <span>{currency.code}:</span>
                              <span>{rate ? rate.rate.toFixed(4) : 'N/A'}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Total Revenue</span>
            </div>
            <div className="text-2xl font-bold text-green-900">{formatCurrency(totals.totalSelling)}</div>
            <div className="text-sm text-green-700">Selling price total</div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Commission</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">{formatCurrency(totals.totalCommission)}</div>
            <div className="text-sm text-blue-700">{settings.commissionRate}% of revenue</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-900">Net Profit</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">{formatCurrency(totals.totalProfit)}</div>
            <div className="text-sm text-purple-700">{profitMargin.toFixed(1)}% margin</div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-amber-900">Avg Markup</span>
            </div>
            <div className="text-2xl font-bold text-amber-900">{avgMarkup.toFixed(1)}%</div>
            <div className="text-sm text-amber-700">Across all hotels</div>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Pricing Breakdown</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hotel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stay Details
                  </th>
                  {settings.showNetRates && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Rate
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Markup %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Selling Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pricingTiers.map((tier) => {
                  const totalRevenue = tier.sellingRate * tier.nights * tier.guests * tier.rooms;
                  const totalCommission = totalRevenue * (settings.commissionRate / 100);
                  const totalProfit = totalRevenue - (tier.netRate * tier.nights * tier.guests * tier.rooms) - totalCommission;
                  
                  return (
                    <tr key={tier.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{tier.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500">N:</span>
                              <input
                                type="number"
                                value={tier.nights}
                                onChange={(e) => updatePricingTier(tier.id, 'nights', parseInt(e.target.value) || 1)}
                                className="w-12 px-1 py-1 text-xs border border-gray-300 rounded"
                                min="1"
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500">G:</span>
                              <input
                                type="number"
                                value={tier.guests}
                                onChange={(e) => updatePricingTier(tier.id, 'guests', parseInt(e.target.value) || 1)}
                                className="w-12 px-1 py-1 text-xs border border-gray-300 rounded"
                                min="1"
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500">R:</span>
                              <input
                                type="number"
                                value={tier.rooms}
                                onChange={(e) => updatePricingTier(tier.id, 'rooms', parseInt(e.target.value) || 1)}
                                className="w-12 px-1 py-1 text-xs border border-gray-300 rounded"
                                min="1"
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      {settings.showNetRates && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900">{settings.baseCurrency === 'ZAR' ? 'R' : currencies.find(c => c.code === settings.baseCurrency)?.symbol}</span>
                            <input
                              type="number"
                              value={tier.netRate}
                              onChange={(e) => updatePricingTier(tier.id, 'netRate', parseFloat(e.target.value) || 0)}
                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded ml-1"
                            />
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={tier.markup}
                            onChange={(e) => updatePricingTier(tier.id, 'markup', parseFloat(e.target.value) || 0)}
                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-500 ml-1">%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(tier.sellingRate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-900">{formatCurrency(totalRevenue)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-900">{formatCurrency(totalCommission)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-purple-900">{formatCurrency(totalProfit)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => removePricingTier(tier.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Profit Margin Visualization */}
        <div className="mt-6 bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Margin Breakdown</h3>
          <div className="space-y-4">
            {pricingTiers.map((tier) => {
              const totalRevenue = tier.sellingRate * tier.nights * tier.guests * tier.rooms;
              const totalCommission = totalRevenue * (settings.commissionRate / 100);
              const totalNet = tier.netRate * tier.nights * tier.guests * tier.rooms;
              const totalProfit = totalRevenue - totalNet - totalCommission;
              
              const netPercentage = (totalNet / totalRevenue) * 100;
              const commissionPercentage = (totalCommission / totalRevenue) * 100;
              const profitPercentage = (totalProfit / totalRevenue) * 100;
              
              return (
                <div key={tier.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{tier.name}</span>
                    <span className="text-sm text-gray-600">Total: {formatCurrency(totalRevenue)}</span>
                  </div>
                  <div className="flex h-6 rounded-full overflow-hidden">
                    <div 
                      className="bg-red-400 flex items-center justify-center text-xs text-white font-medium"
                      style={{ width: `${netPercentage}%` }}
                    >
                      {netPercentage > 10 && `${netPercentage.toFixed(0)}%`}
                    </div>
                    <div 
                      className="bg-blue-400 flex items-center justify-center text-xs text-white font-medium"
                      style={{ width: `${commissionPercentage}%` }}
                    >
                      {commissionPercentage > 5 && `${commissionPercentage.toFixed(0)}%`}
                    </div>
                    <div 
                      className="bg-green-400 flex items-center justify-center text-xs text-white font-medium"
                      style={{ width: `${profitPercentage}%` }}
                    >
                      {profitPercentage > 5 && `${profitPercentage.toFixed(0)}%`}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>Net Cost: {formatCurrency(totalNet)}</span>
                    <span>Commission: {formatCurrency(totalCommission)}</span>
                    <span>Profit: {formatCurrency(totalProfit)}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-400 rounded"></div>
              <span>Net Cost</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 rounded"></div>
              <span>Commission</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span>Profit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionCalculator;