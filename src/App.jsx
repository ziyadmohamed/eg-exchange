import React, { useState } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import MarketDashboard from './components/MarketDashboard';
import TradeWizard from './components/TradeWizard';
import PortfolioCharts from './components/PortfolioCharts';
import { TrendingUp, BarChart3, HelpCircle, RefreshCw, Layers } from 'lucide-react';

function AppContent() {
  const { indices, stocks, trades, portfolioSummary, addTrade, deleteTrade, refreshPrices } = usePortfolio();
  const [activeTab, setActiveTab] = useState('wizard'); // 'wizard', 'market', 'analytics'
  const [selectedStockForTrade, setSelectedStockForTrade] = useState(null);
  const [updateStatusText, setUpdateStatusText] = useState('');

  const handleSelectStockFromMarket = (stock) => {
    setSelectedStockForTrade(stock);
    setActiveTab('wizard');
  };

  const handleRefreshPrices = () => {
    refreshPrices();
    setUpdateStatusText('تم تحديث أسعار الأسهم والمؤشرات بالبورصة المصرية بنجاح');
    setTimeout(() => setUpdateStatusText(''), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Skip to main content link for screen reader and keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:right-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-slate-950 focus:font-extrabold focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        الانتقال إلى المحتوى الرئيسي
      </a>

      {/* Screen reader live region for global updates */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {updateStatusText}
      </div>

      {/* Top Navigation Header */}
      <header className="bg-slate-800/80 border-b border-slate-700/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-600/20" aria-hidden="true">
              <TrendingUp className="w-6 h-6 text-slate-950 font-black" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center">
                مراقب البورصة المصرية <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full mr-2 font-mono" aria-label="حالة المباشر: البورصة حية">EGX LIVE</span>
              </h1>
              <p className="text-xs text-slate-400">مساعد التداول الذكي - كسبت ولا خسرت في البورصة؟</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="hidden sm:flex items-center text-xs bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300" aria-label="مؤشر البورصة الرئيسي EGX 30 يبلغ 28940.5 نقطة">
              <span className="w-2 h-2 rounded-full bg-emerald-500 ml-2 animate-pulse" aria-hidden="true"></span>
              مؤشر EGX 30: <strong className="text-emerald-400 mr-1 font-mono">28,940.50</strong>
            </div>
            <button
              onClick={handleRefreshPrices}
              aria-label="تحديث أسعار البورصة والمؤشرات الآن"
              className="bg-emerald-600 hover:bg-emerald-500 focus:ring-2 focus:ring-emerald-400 focus:outline-none text-slate-950 font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center transition shadow-md"
            >
              <RefreshCw className="w-4 h-4 ml-1.5" aria-hidden="true" />
              تحديث الأسعار
            </button>
          </div>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <nav className="bg-slate-800 border-b border-slate-700/60" aria-label="أقسام التطبيق الرئيسية">
        <div
          role="tablist"
          aria-label="أقسام التصفح والتداول"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-2 space-x-reverse overflow-x-auto py-2"
        >
          <button
            id="tab-wizard"
            role="tab"
            aria-selected={activeTab === 'wizard'}
            aria-controls="panel-wizard"
            tabIndex={activeTab === 'wizard' ? 0 : -1}
            onClick={() => setActiveTab('wizard')}
            className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
              activeTab === 'wizard'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <HelpCircle className="w-4 h-4 ml-2" aria-hidden="true" />
            مساعد الصفقات (كسبت ولا خسرت؟)
          </button>

          <button
            id="tab-market"
            role="tab"
            aria-selected={activeTab === 'market'}
            aria-controls="panel-market"
            tabIndex={activeTab === 'market' ? 0 : -1}
            onClick={() => setActiveTab('market')}
            className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
              activeTab === 'market'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Layers className="w-4 h-4 ml-2" aria-hidden="true" />
            مراقب البورصة والأسعار
          </button>

          <button
            id="tab-analytics"
            role="tab"
            aria-selected={activeTab === 'analytics'}
            aria-controls="panel-analytics"
            tabIndex={activeTab === 'analytics' ? 0 : -1}
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
              activeTab === 'analytics'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <BarChart3 className="w-4 h-4 ml-2" aria-hidden="true" />
            تحليلات المحفظة والأداء
          </button>
        </div>
      </nav>

      {/* Dynamic Content Container */}
      <main id="main-content" tabIndex="-1" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full focus:outline-none">
        {activeTab === 'wizard' && (
          <div id="panel-wizard" role="tabpanel" aria-labelledby="tab-wizard">
            <TradeWizard
              stocks={stocks}
              initialStock={selectedStockForTrade}
              onAddTrade={addTrade}
              trades={trades}
              onDeleteTrade={deleteTrade}
            />
          </div>
        )}

        {activeTab === 'market' && (
          <div id="panel-market" role="tabpanel" aria-labelledby="tab-market">
            <MarketDashboard
              indices={indices}
              stocks={stocks}
              onRefreshPrices={handleRefreshPrices}
              onSelectStockForTrade={handleSelectStockFromMarket}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div id="panel-analytics" role="tabpanel" aria-labelledby="tab-analytics">
            <PortfolioCharts
              summary={portfolioSummary}
              trades={trades}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 text-slate-400 text-xs py-4 text-center">
        <div className="max-w-7xl mx-auto px-4">
          تطبيق مراقب البورصة المصرية ومساعد حساب الأرباح والخسائر (EGX Tracker) &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
}
