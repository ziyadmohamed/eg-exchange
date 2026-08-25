import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialEgxIndices, initialEgxStocks } from '../data/egxStocks';
import { calculatePortfolioSummary } from '../utils/portfolioEngine';

const PortfolioContext = createContext();

const LOCAL_STORAGE_KEY = 'egx_portfolio_trades_v1';

export function PortfolioProvider({ children }) {
  const [indices, setIndices] = useState(initialEgxIndices);
  const [stocks, setStocks] = useState(initialEgxStocks);
  const [trades, setTrades] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load trades from local storage', e);
    }
    // Default initial mock trade for immediate user feedback
    return [
      {
        id: '1',
        symbol: 'COMI',
        stockName: 'البنك التجاري الدولي',
        sector: 'بنوك',
        investedAmount: 50000,
        entryPrice: 80.00,
        quantity: 625,
        manualValuation: null,
        timestamp: new Date().toLocaleDateString('ar-EG')
      }
    ];
  });

  // Save trades to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trades));
    } catch (e) {
      console.error('Failed to save trades to local storage', e);
    }
  }, [trades]);

  // Simulate live market price ticks
  const refreshPrices = () => {
    setStocks(prevStocks =>
      prevStocks.map(stock => {
        const deltaPercent = (Math.random() * 4 - 2); // random -2% to +2%
        const newPrice = Math.max(1, stock.price * (1 + deltaPercent / 100));
        const newChange = parseFloat((stock.change + deltaPercent / 2).toFixed(2));
        return {
          ...stock,
          price: parseFloat(newPrice.toFixed(2)),
          change: newChange,
          isUp: newChange >= 0
        };
      })
    );

    setIndices(prevIndices =>
      prevIndices.map(idx => {
        const delta = (Math.random() * 1.5 - 0.75);
        const newVal = Math.max(100, idx.value * (1 + delta / 100));
        const newChange = parseFloat((idx.change + delta / 2).toFixed(2));
        return {
          ...idx,
          value: parseFloat(newVal.toFixed(2)),
          change: newChange,
          isUp: newChange >= 0
        };
      })
    );
  };

  const addTrade = (trade) => {
    setTrades(prev => [trade, ...prev]);
  };

  const deleteTrade = (tradeId) => {
    setTrades(prev => prev.filter(t => t.id !== tradeId));
  };

  const portfolioSummary = calculatePortfolioSummary(trades, stocks);

  return (
    <PortfolioContext.Provider value={{
      indices,
      stocks,
      trades,
      portfolioSummary,
      addTrade,
      deleteTrade,
      refreshPrices
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
