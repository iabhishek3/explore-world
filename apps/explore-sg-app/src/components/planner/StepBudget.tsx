import React from 'react';

type BudgetType = 'budget' | 'moderate' | 'luxury';

interface StepBudgetProps {
  value: BudgetType | null;
  onChange: (budget: BudgetType) => void;
}

const budgets: { id: BudgetType; label: string; icon: string; desc: string; examples: string }[] = [
  { id: 'budget', label: 'Budget-friendly', icon: '$', desc: 'Keep it light on the wallet', examples: 'Hawker food, free parks, public MRT' },
  { id: 'moderate', label: 'Moderate', icon: '$$', desc: 'Best value experiences', examples: 'Cafes & restaurants, paid attractions' },
  { id: 'luxury', label: 'Luxury', icon: '$$$', desc: 'Go all out', examples: 'Fine dining, premium tickets, exclusive spots' },
];

export default function StepBudget({ value, onChange }: StepBudgetProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 leading-tight">
          What's your budget?
        </h2>
        <p className="text-sm text-zinc-500 mt-3">We'll match places to your spending style</p>
      </div>

      <div className="space-y-3">
        {budgets.map(b => (
          <button
            key={b.id}
            onClick={() => onChange(b.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all active:scale-[0.98] text-left ${
              value === b.id
                ? 'border-violet-600 bg-violet-50'
                : 'border-zinc-100 bg-white hover:border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            <span className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
              value === b.id ? 'bg-violet-600 text-white' : 'bg-zinc-100 text-zinc-600'
            }`}>
              {b.icon}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-[15px] font-semibold text-zinc-900">{b.label}</span>
              <p className="text-sm text-zinc-500 mt-0.5">{b.desc}</p>
              <p className="text-xs text-zinc-400 mt-1">{b.examples}</p>
            </div>
            {value === b.id && (
              <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
