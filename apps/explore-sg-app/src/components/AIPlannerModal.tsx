import React, { useState } from 'react';
import type { Category, ItineraryDay } from '../types';
import StepDays from './planner/StepDays';
import StepGroup from './planner/StepGroup';
import StepInterests from './planner/StepInterests';
import StepBudget from './planner/StepBudget';
import ResultsView from './planner/ResultsView';

type GroupType = 'solo' | 'couple' | 'family' | 'friends';
type BudgetType = 'budget' | 'moderate' | 'luxury';
type Step = 1 | 2 | 3 | 4 | 'loading' | 'results';

interface AIPlannerModalProps {
  onClose: () => void;
  onApply: (days: ItineraryDay[], mode: 'replace' | 'append') => void;
}

export default function AIPlannerModal({ onClose, onApply }: AIPlannerModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [numDays, setNumDays] = useState(3);
  const [group, setGroup] = useState<GroupType | null>(null);
  const [interests, setInterests] = useState<Category[]>([]);
  const [budget, setBudget] = useState<BudgetType | null>(null);
  const [results, setResults] = useState<ItineraryDay[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  const canProceed = () => {
    switch (step) {
      case 1: return numDays > 0;
      case 2: return group !== null;
      case 3: return interests.length > 0;
      case 4: return budget !== null;
      default: return false;
    }
  };

  const handleNext = async () => {
    setDirection('forward');
    if (step === 4) {
      setStep('loading');
      setError(null);
      try {
        const res = await fetch('/api/planner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ numDays, group, interests, budget }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to generate plan');
        setResults(data.days);
        setStep('results');
      } catch (err: any) {
        setError(err.message);
        setStep(4);
      }
    } else {
      setStep((step as number) + 1 as Step);
    }
  };

  const handleBack = () => {
    setDirection('back');
    if (typeof step === 'number' && step > 1) {
      setStep((step - 1) as Step);
    }
  };

  const progress = typeof step === 'number' ? (step / 4) * 100 : step === 'loading' ? 100 : 100;

  return (
    <div className="fixed inset-0 z-[9998] bg-white flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-5 pt-4 pb-3 safe-area-top">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={step === 1 || step === 'results' ? onClose : handleBack}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-100 active:scale-95 transition-all"
          >
            {step === 1 || step === 'results' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            )}
          </button>
          {typeof step === 'number' && (
            <span className="text-[13px] text-zinc-400 font-medium">{step} of 4</span>
          )}
        </div>

        {/* Progress bar */}
        {(typeof step === 'number' || step === 'loading') && (
          <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 md:px-8">
        <div className="max-w-lg mx-auto h-full flex flex-col justify-center py-8">
          <div
            key={String(step)}
            className={`animate-[${direction === 'forward' ? 'slide-in-right' : 'slide-in-left'}_0.3s_ease-out]`}
            style={{
              animation: `${direction === 'forward' ? 'slideInRight' : 'slideInLeft'} 0.3s ease-out`,
            }}
          >
            {step === 1 && <StepDays value={numDays} onChange={setNumDays} />}
            {step === 2 && <StepGroup value={group} onChange={setGroup} />}
            {step === 3 && <StepInterests value={interests} onChange={setInterests} />}
            {step === 4 && <StepBudget value={budget} onChange={setBudget} />}

            {step === 'loading' && (
              <div className="flex flex-col items-center gap-6 py-16">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-violet-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-600 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-zinc-900">Creating your itinerary</p>
                  <p className="text-sm text-zinc-500 mt-1">Finding the best places for you...</p>
                </div>
              </div>
            )}

            {step === 'results' && results && (
              <ResultsView
                days={results}
                onReplace={() => onApply(results, 'replace')}
                onAppend={() => onApply(results, 'append')}
                onClose={onClose}
              />
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      {typeof step === 'number' && (
        <div className="shrink-0 px-6 pb-6 pt-3 md:px-8 safe-area-bottom">
          <div className="max-w-lg mx-auto">
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full py-4 rounded-2xl text-[15px] font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-30 disabled:scale-100 shadow-lg shadow-violet-200"
            >
              {step === 4 ? 'Generate My Itinerary' : 'Continue'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
