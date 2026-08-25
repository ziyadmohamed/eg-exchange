/**
 * Calculates profit/loss metrics for trades and total portfolio.
 */
export function calculateProfitLoss(investedAmount, currentValue) {
  const invested = parseFloat(investedAmount) || 0;
  const current = parseFloat(currentValue) || 0;
  const diff = current - invested;
  const percentage = invested > 0 ? (diff / invested) * 100 : 0;

  let status = 'EVEN'; // 'GAIN', 'LOSS', 'EVEN'
  let label = 'متعادل';

  if (diff > 0.01) {
    status = 'GAIN';
    label = 'كسبان 🎉';
  } else if (diff < -0.01) {
    status = 'LOSS';
    label = 'خسران ⚠️';
  }

  return {
    invested,
    current,
    diff,
    percentage,
    status,
    label,
    isGain: status === 'GAIN',
    isLoss: status === 'LOSS'
  };
}

export function calculateTradeValuation(trade, currentStockPrice) {
  const livePrice = currentStockPrice || trade.entryPrice || 0;

  if (trade.manualValuation !== null && trade.manualValuation !== undefined && trade.manualValuation > 0) {
    return trade.manualValuation;
  }

  return (trade.quantity || 0) * livePrice;
}

export function calculatePortfolioSummary(trades, stocks) {
  let totalInvested = 0;
  let totalCurrentValuation = 0;
  const stockAllocations = {};

  trades.forEach(trade => {
    totalInvested += trade.investedAmount || 0;

    const stockObj = stocks.find(s => s.symbol === trade.symbol);
    const livePrice = stockObj ? stockObj.price : trade.entryPrice;

    const tradeCurrentValuation = calculateTradeValuation(trade, livePrice);
    totalCurrentValuation += tradeCurrentValuation;

    if (!stockAllocations[trade.symbol]) {
      stockAllocations[trade.symbol] = {
        symbol: trade.symbol,
        name: trade.stockName || trade.symbol,
        value: 0
      };
    }
    stockAllocations[trade.symbol].value += tradeCurrentValuation;
  });

  const pnl = calculateProfitLoss(totalInvested, totalCurrentValuation);

  return {
    totalInvested,
    totalCurrentValuation,
    ...pnl,
    allocations: Object.values(stockAllocations)
  };
}
