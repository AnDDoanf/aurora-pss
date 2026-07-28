import React from 'react';

export function StatBar({ label, value, maxValue = 100, color = 'emerald', showMax = true, className = '' }) {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));

  const barColors = {
    emerald: 'bg-emerald-500',
    sky: 'bg-sky-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500'
  }[color] || 'bg-emerald-500';

  return (
    <div className={`space-y-1 text-xs ${className}`}>
      <div className="flex items-center justify-between text-slate-300">
        <span className="font-medium">{label}</span>
        <span className="font-mono text-slate-100 font-semibold">
          {value} {showMax && <span className="text-slate-500 font-normal">/ {maxValue}</span>}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
        <div 
          className={`h-full ${barColors} transition-all duration-300 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function StatComparisonRow({ label, baseValue, finalValue, unit = '' }) {
  const delta = (finalValue - baseValue).toFixed(1);
  const isPositive = delta > 0;

  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-800/60 text-xs">
      <span className="text-slate-400 font-medium">{label}</span>
      <div className="flex items-center space-x-3 font-mono">
        <span className="text-slate-400">{baseValue}{unit}</span>
        <span className="text-slate-600">→</span>
        <span className="text-slate-100 font-bold">{finalValue}{unit}</span>
        {delta !== '0.0' && (
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${isPositive ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
            {isPositive ? `+${delta}` : delta}
          </span>
        )}
      </div>
    </div>
  );
}
