import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { sampleHistoricalData } from '../data/egxStocks';
import { PieChart as PieChartIcon, LineChart as LineChartIcon, Award, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

export default function PortfolioCharts({ summary, trades }) {
  const pieData = summary.allocations && summary.allocations.length > 0
    ? summary.allocations
    : [{ name: 'لا توجد صفقات', value: 1 }];

  const statusLabel = summary.isGain ? 'ربح صافي' : summary.isLoss ? 'خسارة صافية' : 'بدون تغيير';

  return (
    <div className="space-y-6">
      {/* Overview Cards Row */}
      <section aria-label="ملخص أداء المحفظة الاستثمارية" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div tabIndex="0" className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400">
          <div className="text-xs text-slate-400 font-semibold mb-1">إجمالي رأس المال المستثمر</div>
          <div className="text-2xl font-black text-white">
            {summary.totalInvested.toLocaleString('ar-EG')} <span className="text-xs text-slate-400 font-normal">ج.م</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center">
            <DollarSign className="w-3.5 h-3.5 ml-1 text-emerald-400" aria-hidden="true" />
            من خلال {trades.length} صفقات مسجلة
          </div>
        </div>

        <div tabIndex="0" className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400">
          <div className="text-xs text-slate-400 font-semibold mb-1">القيمة السوقية الحالية للمحفظة</div>
          <div className="text-2xl font-black text-white">
            {summary.totalCurrentValuation.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-slate-400 font-normal">ج.م</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            محدثة بالأسعار الحية للبورصة
          </div>
        </div>

        <div tabIndex="0" className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400">
          <div className="text-xs text-slate-400 font-semibold mb-1">صافي الأرباح / الخسائر (EGP)</div>
          <div className={`text-2xl font-black dir-ltr text-right ${summary.isGain ? 'text-emerald-400' : summary.isLoss ? 'text-rose-400' : 'text-slate-200'}`}>
            {summary.isGain ? `+${summary.diff.toFixed(2)}` : summary.diff.toFixed(2)} <span className="text-xs font-normal">ج.م</span>
          </div>
          <div className="mt-2 text-xs font-bold flex items-center">
            {summary.isGain ? (
              <span className="text-emerald-400 inline-flex items-center" aria-label={`الحالة: ${statusLabel}`}>
                <ArrowUpRight className="w-4 h-4 ml-0.5" aria-hidden="true" /> ربح صافي
              </span>
            ) : summary.isLoss ? (
              <span className="text-rose-400 inline-flex items-center" aria-label={`الحالة: ${statusLabel}`}>
                <ArrowDownRight className="w-4 h-4 ml-0.5" aria-hidden="true" /> خسارة صافية
              </span>
            ) : (
              <span className="text-slate-400">بدون تغيير</span>
            )}
          </div>
        </div>

        <div tabIndex="0" className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400">
          <div className="text-xs text-slate-400 font-semibold mb-1">نسبة العائد الإجمالي (ROI)</div>
          <div className={`text-2xl font-black dir-ltr text-right ${summary.isGain ? 'text-emerald-400' : summary.isLoss ? 'text-rose-400' : 'text-slate-200'}`}>
            {summary.isGain ? `+${summary.percentage.toFixed(2)}%` : `${summary.percentage.toFixed(2)}%`}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center">
            <Award className="w-3.5 h-3.5 ml-1 text-emerald-400" aria-hidden="true" />
            معدل الأداء بالنسبة للمبلغ الأصلي
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Allocation Pie Chart */}
        <section aria-labelledby="pie-chart-heading" className="lg:col-span-5 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <h3 id="pie-chart-heading" className="text-lg font-bold text-slate-100 mb-4 flex items-center">
            <PieChartIcon className="w-5 h-5 ml-2 text-emerald-400" aria-hidden="true" />
            توزيع المحفظة حسب الأسهم
          </h3>

          {/* Accessible Text Description for Screen Readers */}
          <div className="sr-only">
            جدول تلخيص توزيع الأسهم في المحفظة:
            <ul>
              {summary.allocations.map(alloc => (
                <li key={alloc.symbol}>
                  سهم {alloc.name}: بقيمة {alloc.value.toFixed(2)} جنيه مصري، بنسبة {((alloc.value / (summary.totalCurrentValuation || 1)) * 100).toFixed(1)}% من إجمالي المحفظة.
                </li>
              ))}
            </ul>
          </div>

          <div className="h-64 w-full" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${parseFloat(val).toFixed(2)} ج.م`, 'القيمة']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 border-t border-slate-700/60 pt-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {summary.allocations.map((alloc, idx) => (
                <div key={alloc.symbol} className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center">
                    <span
                      className="w-2.5 h-2.5 rounded-full ml-1.5"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      aria-hidden="true"
                    />
                    <span>{alloc.name}</span>
                  </div>
                  <span className="font-bold text-white">{((alloc.value / (summary.totalCurrentValuation || 1)) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio & Market Trend Area Chart */}
        <section aria-labelledby="area-chart-heading" className="lg:col-span-7 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <h3 id="area-chart-heading" className="text-lg font-bold text-slate-100 mb-4 flex items-center">
            <LineChartIcon className="w-5 h-5 ml-2 text-emerald-400" aria-hidden="true" />
            تطور قيمة المحفظة ومؤشر EGX30 هذا الأسبوع
          </h3>

          {/* Accessible Text Description for Screen Readers */}
          <div className="sr-only">
            جدول أداء قيمة المحفظة خلال أيام الأسبوع:
            <ul>
              {sampleHistoricalData.map(d => (
                <li key={d.date}>
                  يوم {d.date}: قيمة المحفظة {d.portfolio.toLocaleString('ar-EG')} جنيه مصري.
                </li>
              ))}
            </ul>
          </div>

          <div className="h-64 w-full" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sampleHistoricalData}>
                <defs>
                  <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="portfolio"
                  name="قيمة المحفظة (EGP)"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorPortfolio)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 bg-slate-900/60 p-3 rounded-xl border border-slate-700/50 text-xs text-slate-400">
            💡 الرسم البياني يوضح محاكاة لنمو محفظتك الاستثمارية مقارنة بأداء البورصة المصرية خلال جلسات الأسبوع الحالي.
          </div>
        </section>
      </div>
    </div>
  );
}
