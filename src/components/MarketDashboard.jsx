import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Search, Activity, DollarSign, RefreshCw } from 'lucide-react';

export default function MarketDashboard({ indices, stocks, onRefreshPrices, onSelectStockForTrade }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('الكل');

  const sectors = ['الكل', ...new Set(stocks.map(s => s.sector))];

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.name.includes(searchQuery) || stock.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === 'الكل' || stock.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-6">
      {/* Live Market Ticker */}
      <div
        role="region"
        aria-label="حالة جلسة التداول المباشرة"
        className="bg-slate-800/90 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between shadow-lg backdrop-blur"
      >
        <div className="flex items-center space-x-3 space-x-reverse">
          <span className="flex h-3 w-3 relative" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <span className="font-bold text-slate-200">جلسة التداول الحية:</span>
            <span className="text-sm text-emerald-400 font-semibold mr-2">مفتوحة - البورصة المصرية (EGX)</span>
          </div>
        </div>
        <button
          onClick={onRefreshPrices}
          aria-label="تحديث الأسعار الآن"
          className="flex items-center space-x-1.5 space-x-reverse bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition duration-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" aria-hidden="true" />
          <span>تحديث الأسعار الآن</span>
        </button>
      </div>

      {/* Indices Section */}
      <section aria-labelledby="indices-heading">
        <h2 id="indices-heading" className="text-xl font-bold text-slate-100 mb-4 flex items-center">
          <Activity className="w-5 h-5 ml-2 text-emerald-400" aria-hidden="true" />
          مؤشرات البورصة المصرية الرئيسيّة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {indices.map((idx) => {
            const changeDirectionText = idx.isUp ? 'ارتفاع' : 'انخفاض';
            const changeValText = `${changeDirectionText} بنسبة ${Math.abs(idx.change)} بالمائة`;

            return (
              <div
                key={idx.symbol}
                tabIndex="0"
                aria-label={`مؤشر ${idx.name} رمز ${idx.symbol} بقيمة ${idx.value.toLocaleString('ar-EG')} نقطة، ${changeValText}`}
                className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl p-5 shadow-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                      {idx.symbol}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-300 mt-1">{idx.name}</h3>
                  </div>
                  <div
                    aria-label={`التغير اليومي: ${changeValText}`}
                    className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${idx.isUp ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}
                  >
                    {idx.isUp ? <TrendingUp className="w-3.5 h-3.5 ml-1" aria-hidden="true" /> : <TrendingDown className="w-3.5 h-3.5 ml-1" aria-hidden="true" />}
                    <span>{idx.change > 0 ? `+${idx.change}%` : `${idx.change}%`}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-white">
                    {idx.value.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-slate-400">حجم التداول: {idx.volume}</span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-700/50 flex justify-between text-xs text-slate-400">
                  <span>أعلى: <strong className="text-slate-200">{idx.high}</strong></span>
                  <span>أدنى: <strong className="text-slate-200">{idx.low}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stocks Table Section */}
      <section aria-labelledby="stocks-heading" className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 id="stocks-heading" className="text-lg font-bold text-slate-100 flex items-center">
              <DollarSign className="w-5 h-5 ml-2 text-emerald-400" aria-hidden="true" />
              قائمة أسهم البورصة التفاعلية
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">تابع الأسهم المتداولة بالجنيه المصري (EGP) وحسب تداولات اليوم</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <label htmlFor="stock-search-input" className="sr-only">
                ابحث عن اسم السهم أو الكود
              </label>
              <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" aria-hidden="true" />
              <input
                id="stock-search-input"
                type="text"
                placeholder="ابحث عن اسم السهم أو الكود..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg pr-9 pl-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none w-full sm:w-64"
              />
            </div>

            {/* Sector Dropdown Filter */}
            <div className="relative">
              <label htmlFor="sector-filter-select" className="sr-only">
                تصفية الأسهم حسب القطاع
              </label>
              <select
                id="sector-filter-select"
                aria-label="تصفية الأسهم حسب القطاع"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none w-full"
              >
                {sectors.map(sec => (
                  <option key={sec} value={sec}>{sec === 'الكل' ? 'جميع القطاعات' : sec}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm text-slate-300">
            <caption className="sr-only">
              أسهم البورصة المصرية وأسعارها وتغيراتها اليومية
            </caption>
            <thead className="bg-slate-900/60 text-xs uppercase text-slate-400 font-semibold border-b border-slate-700">
              <tr>
                <th scope="col" className="px-6 py-3.5">الكود والشركة</th>
                <th scope="col" className="px-6 py-3.5">القطاع</th>
                <th scope="col" className="px-6 py-3.5">السعر الحالي (EGP)</th>
                <th scope="col" className="px-6 py-3.5">التغير اليومي</th>
                <th scope="col" className="px-6 py-3.5">أعلى / أدنى</th>
                <th scope="col" className="px-6 py-3.5">القيم والعمليات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filteredStocks.map((stock) => {
                const stockChangeText = stock.isUp
                  ? `ارتفاع بنسبة ${Math.abs(stock.change)} بالمائة`
                  : `انخفاض بنسبة ${Math.abs(stock.change)} بالمائة`;

                return (
                  <tr key={stock.symbol} className="hover:bg-slate-700/40 transition">
                    <td className="px-6 py-4 font-medium text-slate-100 flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center font-extrabold text-emerald-400 text-xs ml-3" aria-hidden="true">
                        {stock.symbol}
                      </div>
                      <div>
                        <div className="font-bold text-slate-100">{stock.name}</div>
                        <div className="text-xs text-slate-400">رمز السهم: {stock.symbol}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-700/70 text-slate-300 text-xs px-2.5 py-1 rounded-full border border-slate-600">
                        {stock.sector}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white text-base">
                      <span aria-label={`السعر الحالي ${stock.price.toFixed(2)} جنيه مصري`}>
                        {stock.price.toFixed(2)} ج.م
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        aria-label={`تغير اليوم: ${stockChangeText}`}
                        className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-md ${stock.isUp ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}
                      >
                        {stock.isUp ? <TrendingUp className="w-3.5 h-3.5 ml-1" aria-hidden="true" /> : <TrendingDown className="w-3.5 h-3.5 ml-1" aria-hidden="true" />}
                        <span>{stock.change > 0 ? `+${stock.change}%` : `${stock.change}%`}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      <div>أعلى سعر: <span className="text-emerald-400 font-medium">{stock.high}</span></div>
                      <div>أدنى سعر: <span className="text-rose-400 font-medium">{stock.low}</span></div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onSelectStockForTrade(stock)}
                        aria-label={`تسجيل صفقة أو تتبع لسهم ${stock.name}`}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-lg text-xs shadow-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      >
                        تسجيل الصفقة / تتبع
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredStocks.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-400" role="status">
                    لم يتم العثور على نتائج مطابقة للبحث "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
