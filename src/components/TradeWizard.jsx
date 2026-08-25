import React, { useState, useEffect } from 'react';
import { HelpCircle, TrendingUp, TrendingDown, Wallet, Calculator, AlertCircle, PlusCircle, Trash2 } from 'lucide-react';

export default function TradeWizard({ stocks, initialStock, onAddTrade, trades, onDeleteTrade }) {
  const [selectedStockSymbol, setSelectedStockSymbol] = useState(initialStock ? initialStock.symbol : stocks[0]?.symbol || 'COMI');
  const [investedAmount, setInvestedAmount] = useState(''); // حاطط كام
  const [entryPrice, setEntryPrice] = useState(''); // سعر الشراء للسهم
  const [currentQuantity, setCurrentQuantity] = useState(''); // عدد الأسهم حالياً أو "معاك كام"
  const [valuationMode, setValuationMode] = useState('quantity'); // 'quantity' or 'manualValuation'
  const [manualCurrentValue, setManualCurrentValue] = useState(''); // معاك كام دلوقتي كقيم إجمالية
  const [formFeedback, setFormFeedback] = useState('');

  // Update form defaults if initialStock changes
  useEffect(() => {
    if (initialStock) {
      setSelectedStockSymbol(initialStock.symbol);
      if (!entryPrice) {
        setEntryPrice(initialStock.price.toString());
      }
    }
  }, [initialStock]);

  const selectedStockObj = stocks.find(s => s.symbol === selectedStockSymbol) || stocks[0];

  // Calculations for live guidance before submission
  const investedNum = parseFloat(investedAmount) || 0;
  const entryPriceNum = parseFloat(entryPrice) || selectedStockObj?.price || 1;

  // Calculate shares quantity if entering invested amount and buy price
  const calculatedShares = entryPriceNum > 0 ? Math.floor(investedNum / entryPriceNum) : 0;

  // Current total value
  let liveCurrentValue = 0;
  if (valuationMode === 'quantity') {
    const qty = parseFloat(currentQuantity) || calculatedShares;
    liveCurrentValue = qty * (selectedStockObj?.price || 0);
  } else {
    liveCurrentValue = parseFloat(manualCurrentValue) || 0;
  }

  const netDiff = liveCurrentValue - investedNum;
  const percentageReturn = investedNum > 0 ? ((netDiff / investedNum) * 100) : 0;
  const isGain = netDiff > 0;
  const isLoss = netDiff < 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!investedNum || investedNum <= 0) {
      setFormFeedback('خطأ: يرجى إدخال المبلغ المستثمر (حاطط كام) بشكل صحيح أكبر من صفر');
      return;
    }

    const finalQuantity = valuationMode === 'quantity' && currentQuantity
      ? parseFloat(currentQuantity)
      : calculatedShares;

    const newTrade = {
      id: Date.now().toString(),
      symbol: selectedStockObj.symbol,
      stockName: selectedStockObj.name,
      sector: selectedStockObj.sector,
      investedAmount: investedNum,
      entryPrice: entryPriceNum,
      quantity: finalQuantity,
      manualValuation: valuationMode === 'manualValuation' ? parseFloat(manualCurrentValue) : null,
      timestamp: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    onAddTrade(newTrade);
    setFormFeedback(`تم حفظ صفقة سهم ${selectedStockObj.name} بنجاح في محفظتك`);

    // Reset inputs
    setInvestedAmount('');
    setCurrentQuantity('');
    setManualCurrentValue('');

    setTimeout(() => setFormFeedback(''), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Interactive Wizard Header Card */}
      <section
        aria-label="مقدمة مساعد الصفقات والتتبع الذكي"
        className="bg-gradient-to-r from-emerald-900/60 via-slate-800 to-slate-800 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
      >
        <div className="max-w-3xl">
          <div className="inline-flex items-center bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <HelpCircle className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
            مساعد التداول والتتبع الذكي
          </div>
          <h2 className="text-2xl font-black text-white">
            "بتتداول في السهم الفلاني؟ حاطط كام و دلوقتي معاك كام؟"
          </h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            أجب عن الأسئلة البسيطة أدناه وسيقوم التطبيق بحساب أرباحك أو خسائرك فوراً في البورصة المصرية بناءً على أسعار السوق الحية.
          </p>
        </div>
      </section>

      {/* Screen reader notification for form feedback */}
      <div className="sr-only" aria-live="assertive" role="alert">
        {formFeedback}
      </div>

      {/* Main Grid: Form + Live Interactive Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Card */}
        <div className="lg:col-span-7 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center border-b border-slate-700 pb-3">
            <Calculator className="w-5 h-5 ml-2 text-emerald-400" aria-hidden="true" />
            تسجيل صفقة استثمارية جديدة
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5" aria-label="نموذج تسجيل صفقة جديدة">
            {/* Step 1: Stock Selection */}
            <div>
              <label htmlFor="wizard-stock-select" className="block text-sm font-bold text-slate-300 mb-2">
                1. اختار السهم اللي بتتداول فيه:
              </label>
              <select
                id="wizard-stock-select"
                value={selectedStockSymbol}
                onChange={(e) => {
                  setSelectedStockSymbol(e.target.value);
                  const s = stocks.find(st => st.symbol === e.target.value);
                  if (s) setEntryPrice(s.price.toString());
                }}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-4 py-3 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {stocks.map(s => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.name} ({s.symbol}) - السعر الحالي: {s.price.toFixed(2)} ج.م
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Invested Capital "حاطط كام" */}
            <div>
              <label htmlFor="wizard-invested-amount" className="block text-sm font-bold text-slate-300 mb-2">
                2. حاطط كام؟ (إجمالي رأس المال المستثمر بالجنيه):
              </label>
              <div className="relative">
                <input
                  id="wizard-invested-amount"
                  type="number"
                  placeholder="مثال: 50000"
                  value={investedAmount}
                  onChange={(e) => setInvestedAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl pr-4 pl-14 py-3 text-lg font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
                <span className="absolute left-4 top-3.5 text-xs font-bold text-slate-400" aria-hidden="true">ج.م (EGP)</span>
              </div>
            </div>

            {/* Entry Buy Price */}
            <div>
              <label htmlFor="wizard-entry-price" className="block text-sm font-bold text-slate-300 mb-2">
                سعر شراء السهم وقت دخول الصفقة (اختياري):
              </label>
              <div className="relative">
                <input
                  id="wizard-entry-price"
                  type="number"
                  step="0.01"
                  placeholder={`سعر السوق الحالي: ${selectedStockObj?.price || 0}`}
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl pr-4 pl-14 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="absolute left-4 top-3 text-xs font-bold text-slate-400" aria-hidden="true">ج.م/سهم</span>
              </div>
            </div>

            {/* Step 3: Valuation Mode Switch & Inputs */}
            <div>
              <fieldset>
                <legend className="block text-sm font-bold text-slate-300 mb-2">
                  3. دلوقتي معاك كام؟ طريقة إدخال القيمة:
                </legend>
                <div className="grid grid-cols-2 gap-3 mb-3" role="radiogroup" aria-label="طريقة الحساب الحالية">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={valuationMode === 'quantity'}
                    onClick={() => setValuationMode('quantity')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition focus:outline-none focus:ring-2 focus:ring-emerald-400 ${valuationMode === 'quantity' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'}`}
                  >
                    حساب بواسطة عدد الأسهم
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={valuationMode === 'manualValuation'}
                    onClick={() => setValuationMode('manualValuation')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition focus:outline-none focus:ring-2 focus:ring-emerald-400 ${valuationMode === 'manualValuation' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'}`}
                  >
                    إدخال القيمة الحالية مباشرةً
                  </button>
                </div>
              </fieldset>

              {valuationMode === 'quantity' ? (
                <div>
                  <label htmlFor="wizard-quantity-input" className="sr-only">
                    عدد الأسهم المملوكة لديك
                  </label>
                  <div className="relative">
                    <input
                      id="wizard-quantity-input"
                      type="number"
                      placeholder={calculatedShares > 0 ? `العدد التقديري: ${calculatedShares} سهم` : "عدد الأسهم المملوكة لديك"}
                      value={currentQuantity}
                      onChange={(e) => setCurrentQuantity(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl pr-4 pl-16 py-3 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <span className="absolute left-4 top-3.5 text-xs font-bold text-slate-400" aria-hidden="true">سهم</span>
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="wizard-manual-valuation-input" className="sr-only">
                    إجمالي القيمة الحالية للمحفظة بالجنيه
                  </label>
                  <div className="relative">
                    <input
                      id="wizard-manual-valuation-input"
                      type="number"
                      placeholder="أدخل القيمة الحالية الإجمالية لمحفظتك الآن"
                      value={manualCurrentValue}
                      onChange={(e) => setManualCurrentValue(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl pr-4 pl-14 py-3 text-lg font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <span className="absolute left-4 top-3.5 text-xs font-bold text-slate-400" aria-hidden="true">ج.م (EGP)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-400 focus:outline-none text-slate-950 font-black py-3.5 px-6 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition duration-200 flex items-center justify-center text-base mt-4"
            >
              <PlusCircle className="w-5 h-5 ml-2" aria-hidden="true" />
              حفظ الصفقة في محفظتي الآن
            </button>
          </form>
        </div>

        {/* Live Dynamic Result Card */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-6 flex-1">
            <h3 className="text-lg font-bold text-slate-100 border-b border-slate-700 pb-3 flex items-center">
              <Wallet className="w-5 h-5 ml-2 text-emerald-400" aria-hidden="true" />
              تحليل ومؤشر الأرباح / الخسائر الحية
            </h3>

            {/* Dynamic Status Badge (Accessible Live Region) */}
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className={`p-5 rounded-2xl border text-center transition-all duration-300 ${
                investedNum === 0
                  ? 'bg-slate-900/50 border-slate-700 text-slate-400'
                  : isGain
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-emerald-950 shadow-lg'
                  : isLoss
                  ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 shadow-rose-950 shadow-lg'
                  : 'bg-amber-950/80 border-amber-500/50 text-amber-300'
              }`}
            >
              <div className="text-xs uppercase font-extrabold tracking-wider mb-1">النتيجة الحالية</div>

              {investedNum === 0 ? (
                <div className="text-base font-medium py-2 text-slate-400">
                  قم بإدخال بيانات الاستثمار في النموذج لعرض نتيجة "كسبت ولا خسرت"
                </div>
              ) : isGain ? (
                <div className="space-y-1">
                  <div className="inline-flex items-center text-emerald-400 font-extrabold text-2xl">
                    <TrendingUp className="w-7 h-7 ml-2 animate-bounce" aria-hidden="true" />
                    انت كسبان! 🎉
                  </div>
                  <p className="text-sm text-emerald-300 font-semibold">
                    حققت ربحاً بمقدار <strong className="text-white dir-ltr">{netDiff.toFixed(2)} +</strong> ج.م
                  </p>
                </div>
              ) : isLoss ? (
                <div className="space-y-1">
                  <div className="inline-flex items-center text-rose-400 font-extrabold text-2xl">
                    <TrendingDown className="w-7 h-7 ml-2 animate-pulse" aria-hidden="true" />
                    انت خسران ⚠️
                  </div>
                  <p className="text-sm text-rose-300 font-semibold">
                    انخفضت قيمة استثمارك بمقدار <strong className="text-white dir-ltr">{Math.abs(netDiff).toFixed(2)} -</strong> ج.م
                  </p>
                </div>
              ) : (
                <div className="text-amber-300 font-bold text-xl">
                  متعادل (بدون تغيير في رأس المال)
                </div>
              )}
            </div>

            {/* Detailed Stats Summary */}
            <div className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-700/80 text-sm">
              <div className="flex justify-between items-center text-slate-300">
                <span>رأس المال المستثمر (حاطط كام):</span>
                <span className="font-bold text-white">{investedNum.toLocaleString('ar-EG')} ج.م</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>القيمة الحالية بالأسعار الحية (معاك كام):</span>
                <span className="font-bold text-white">{liveCurrentValue.toFixed(2)} ج.م</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>سعر السهم بالسوق الآن:</span>
                <span className="font-bold text-emerald-400">{selectedStockObj?.price.toFixed(2)} ج.م</span>
              </div>

              <div className="pt-2 border-t border-slate-700 flex justify-between items-center font-bold">
                <span>نسبة العائد على الاستثمار (ROI):</span>
                <span className={`text-base ${isGain ? 'text-emerald-400' : isLoss ? 'text-rose-400' : 'text-slate-300'}`}>
                  {percentageReturn > 0 ? `+${percentageReturn.toFixed(2)}%` : `${percentageReturn.toFixed(2)}%`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Saved Trades Portfolio List */}
      <section aria-labelledby="saved-trades-heading" className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
        <h3 id="saved-trades-heading" className="text-lg font-bold text-slate-100 mb-4 flex items-center justify-between">
          <span>الصفقات والأسهم التي تتابعها ({trades.length})</span>
          {trades.length > 0 && (
            <span className="text-xs text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full font-semibold">
              يتم تحديث أسعار الصفقات تلقائياً مع البورصة
            </span>
          )}
        </h3>

        {trades.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-700 rounded-xl bg-slate-900/40" role="status">
            <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-2" aria-hidden="true" />
            <p className="text-slate-400 text-sm">لا توجد صفقات مسجلة حتى الآن. استخدم النموذج أعلاه لإضافة أول سهم تتابعه!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm text-slate-300">
              <caption className="sr-only">سجل الصفقات الاستثمارية المحفوظة لمحفظتك</caption>
              <thead className="bg-slate-900 text-xs text-slate-400 uppercase border-b border-slate-700">
                <tr>
                  <th scope="col" className="px-4 py-3">السهم</th>
                  <th scope="col" className="px-4 py-3">المبلغ المستثمر</th>
                  <th scope="col" className="px-4 py-3">عدد الأسهم</th>
                  <th scope="col" className="px-4 py-3">القيمة الحالية</th>
                  <th scope="col" className="px-4 py-3">الربح / الخسارة</th>
                  <th scope="col" className="px-4 py-3">الحالة</th>
                  <th scope="col" className="px-4 py-3">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {trades.map((tr) => {
                  const currentStockObj = stocks.find(s => s.symbol === tr.symbol);
                  const currentLivePrice = currentStockObj ? currentStockObj.price : tr.entryPrice;

                  const currentValuation = tr.manualValuation !== null && tr.manualValuation !== undefined
                    ? tr.manualValuation
                    : (tr.quantity * currentLivePrice);

                  const diff = currentValuation - tr.investedAmount;
                  const percent = tr.investedAmount > 0 ? ((diff / tr.investedAmount) * 100) : 0;
                  const isTradeGain = diff > 0;
                  const isTradeLoss = diff < 0;
                  const tradeStatusLabel = isTradeGain ? 'كسبان' : isTradeLoss ? 'خسران' : 'متعادل';

                  return (
                    <tr key={tr.id} className="hover:bg-slate-700/40 transition">
                      <td className="px-4 py-3.5 font-bold text-slate-100">
                        <div className="flex items-center">
                          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs px-2 py-0.5 rounded ml-2">
                            {tr.symbol}
                          </span>
                          {tr.stockName}
                        </div>
                        <div className="text-xs text-slate-400 font-normal mt-0.5">{tr.timestamp}</div>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-200">
                        {tr.investedAmount.toLocaleString('ar-EG')} ج.م
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-300">
                        {tr.quantity ? tr.quantity.toLocaleString('ar-EG') : '-'}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-white">
                        {currentValuation.toFixed(2)} ج.م
                      </td>
                      <td className="px-4 py-3.5 font-extrabold dir-ltr">
                        <span className={isTradeGain ? 'text-emerald-400' : isTradeLoss ? 'text-rose-400' : 'text-slate-300'}>
                          {isTradeGain ? `+${diff.toFixed(2)} ج.م (+${percent.toFixed(2)}%)` : `${diff.toFixed(2)} ج.م (${percent.toFixed(2)}%)`}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          aria-label={`حالة الصفقة: ${tradeStatusLabel}`}
                          className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
                            isTradeGain ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                            isTradeLoss ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                            'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {isTradeGain ? 'كسبان 🎉' : isTradeLoss ? 'خسران ⚠️' : 'متعادل'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => onDeleteTrade(tr.id)}
                          aria-label={`حذف صفقة سهم ${tr.stockName}`}
                          className="text-slate-400 hover:text-rose-400 p-1.5 rounded hover:bg-slate-700 transition focus:outline-none focus:ring-2 focus:ring-rose-400"
                          title="حذف الصفقة"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
