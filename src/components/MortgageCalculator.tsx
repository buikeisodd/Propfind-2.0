import React, { useState, useEffect } from 'react';
import { Landmark, ArrowRight, DollarSign, Percent, Calendar } from 'lucide-react';

interface MortgageCalculatorProps {
  initialPrice: number;
}

export default function MortgageCalculator({ initialPrice }: MortgageCalculatorProps) {
  const [price, setPrice] = useState<number>(initialPrice);
  const [downPercent, setDownPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [termYears, setTermYears] = useState<number>(30);
  const [taxPercent, setTaxPercent] = useState<number>(1.2);
  const [annualInsurance, setAnnualInsurance] = useState<number>(1500);

  // Sync with initialPrice prop if it changes
  useEffect(() => {
    setPrice(initialPrice);
  }, [initialPrice]);

  // Derived math
  const downPayment = Math.round((price * downPercent) / 100);
  const loanAmount = price - downPayment;
  
  // Monthly calculations
  const monthlyIntRate = interestRate / 100 / 12;
  const totalMonths = termYears * 12;
  
  const monthlyPrincipalAndInterest = monthlyIntRate > 0
    ? (loanAmount * monthlyIntRate * Math.pow(1 + monthlyIntRate, totalMonths)) / 
      (Math.pow(1 + monthlyIntRate, totalMonths) - 1)
    : loanAmount / totalMonths;

  const monthlyTax = (price * (taxPercent / 100)) / 12;
  const monthlyInsurance = annualInsurance / 12;
  const totalMonthlyPayment = Math.round(monthlyPrincipalAndInterest + monthlyTax + monthlyInsurance);

  // SVG Donut metrics
  const piVal = Math.round(monthlyPrincipalAndInterest);
  const txVal = Math.round(monthlyTax);
  const insVal = Math.round(monthlyInsurance);
  const totalVal = piVal + txVal + insVal;

  const piPct = totalVal > 0 ? (piVal / totalVal) * 100 : 0;
  const txPct = totalVal > 0 ? (txVal / totalVal) * 100 : 0;
  const insPct = totalVal > 0 ? (insVal / totalVal) * 100 : 0;

  // Donut geometry helper (radius 50, stroke width 14)
  const r = 40;
  const circ = 2 * Math.PI * r;
  const piOffset = circ;
  const txOffset = circ - (circ * piPct) / 100;
  const insOffset = circ - (circ * (piPct + txPct)) / 100;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-200 shadow-xl" id="mortgage-calculator">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3" id="calc-header">
        <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
          <Landmark className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold text-white tracking-tight text-sm">Interactive Mortgage Estimator</h4>
          <p className="text-xs text-slate-400">Calculate realistic monthly expenses based on custom terms</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="calc-body">
        {/* Sliders Block */}
        <div className="space-y-4" id="calc-sliders-form">
          {/* Purchase price */}
          <div>
            <div className="flex justify-between items-center text-xs font-medium mb-1">
              <span className="text-slate-400">Home Price</span>
              <span className="text-white font-semibold">${price.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={Math.max(10000, Math.round(initialPrice * 0.2))}
              max={initialPrice * 2}
              step="5000"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              id="calc-price"
            />
          </div>

          {/* Down Payment Percent */}
          <div>
            <div className="flex justify-between items-center text-xs font-medium mb-1">
              <span className="text-slate-400">Down Payment ({downPercent}%)</span>
              <span className="text-white font-semibold">${downPayment.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="1"
              value={downPercent}
              onChange={(e) => setDownPercent(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              id="calc-down-percent"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between items-center text-xs font-medium mb-1">
              <span className="text-slate-400">Annual Interest Rate</span>
              <span className="text-blue-400 font-semibold">{interestRate}%</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="15.0"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              id="calc-interest"
            />
          </div>

          {/* Loan Term Selection */}
          <div>
            <span className="block text-xs font-medium text-slate-400 mb-2">Amortization Period</span>
            <div className="grid grid-cols-3 gap-2" id="calc-term-grid">
              {[15, 20, 30].map((yr) => (
                <button
                  type="button"
                  key={yr}
                  onClick={() => setTermYears(yr)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    termYears === yr
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-450'
                  }`}
                  id={`calc-term-btn-${yr}`}
                >
                  {yr} Years
                </button>
              ))}
            </div>
          </div>

          {/* Luxury Tax and Insurance details */}
          <div className="grid grid-cols-2 gap-3" id="calc-extra-grid">
            <div>
              <label className="block text-[11px] text-slate-400 font-medium mb-1">Property Tax% (Annual)</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.05"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg placeholder-slate-700 text-white text-xs px-2.5 py-1.5 focus:outline-none focus:border-blue-500 pr-7"
                  id="calc-tax-percent-input"
                />
                <span className="absolute right-2 px-1 text-slate-500 text-[11px] top-2 font-mono">%</span>
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 font-medium mb-1">Home Insurance (Annual)</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="10000"
                  step="100"
                  value={annualInsurance}
                  onChange={(e) => setAnnualInsurance(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg placeholder-slate-700 text-white text-xs px-2.5 py-1.5 focus:outline-none focus:border-blue-500 pr-7"
                  id="calc-insurance-input"
                />
                <span className="absolute right-2 px-1 text-slate-500 text-[11px] top-2 font-mono">$</span>
              </div>
            </div>
          </div>
        </div>

        {/* Display Breakdown Chart and Math */}
        <div className="flex flex-col justify-center items-center bg-slate-950/40 border border-slate-800/60 p-4 rounded-xl" id="calc-visuals">
          <div className="relative w-36 h-36 flex items-center justify-center mb-4" id="donut-chart-view">
            {/* SVG Donut */}
            <svg width="100%" height="100%" viewBox="0 0 100 100" className="-rotate-90">
              {/* Backing Ring */}
              <circle cx="50" cy="50" r={r} fill="none" stroke="#1e293b" strokeWidth="8" />
              
              {/* Principal & Interest Segment */}
              {piPct > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r={r}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeDasharray={`${(circ * piPct) / 100} ${circ}`}
                  strokeDashoffset="0"
                />
              )}

              {/* Property Taxes Segment */}
              {txPct > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r={r}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray={`${(circ * txPct) / 100} ${circ}`}
                  strokeDashoffset={-((circ * piPct) / 100)}
                />
              )}

              {/* Home Insurance Segment */}
              {insPct > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r={r}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="8"
                  strokeDasharray={`${(circ * insPct) / 100} ${circ}`}
                  strokeDashoffset={-((circ * (piPct + txPct)) / 100)}
                />
              )}
            </svg>
            
            {/* Center numbers */}
            <div className="absolute flex flex-col items-center justify-center text-center" id="donut-center-payment">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Monthly</span>
              <span className="text-white font-bold text-xl">${totalMonthlyPayment.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400">Total Est.</span>
            </div>
          </div>

          {/* Label Details */}
          <div className="w-full space-y-2 text-xs" id="donut-labels">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5" id="label-principal-interest">
              <span className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>P & I Payment</span>
              </span>
              <span className="font-semibold text-white font-mono">${Math.round(monthlyPrincipalAndInterest).toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5" id="label-taxes">
              <span className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Property Taxes</span>
              </span>
              <span className="font-semibold text-white font-mono">${Math.round(monthlyTax).toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between pb-1" id="label-insurance">
              <span className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Home Insurance</span>
              </span>
              <span className="font-semibold text-white font-mono">${Math.round(monthlyInsurance).toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-3 text-[10px] text-slate-500 font-mono text-center" id="calculation-sum">
            Loan Principal: ${loanAmount.toLocaleString()} ({termYears * 12} payments @ {interestRate}% APR)
          </div>
        </div>
      </div>
    </div>
  );
}
