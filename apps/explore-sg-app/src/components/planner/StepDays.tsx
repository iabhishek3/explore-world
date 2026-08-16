import React from 'react';

interface StepDaysProps {
  value: number;
  onChange: (days: number) => void;
}

export default function StepDays({ value, onChange }: StepDaysProps) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 leading-tight">
          How many days are you<br />visiting Singapore?
        </h2>
        <p className="text-base text-zinc-500 mt-3">We'll craft the perfect itinerary for your trip length</p>
      </div>

      <div className="grid grid-cols-4 gap-3 md:gap-4">
        {[1, 2, 3, 4, 5, 6, 7].map(day => (
          <button
            key={day}
            onClick={() => onChange(day)}
            className={`aspect-square rounded-2xl text-xl font-bold transition-all active:scale-95 ${
              value === day
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-200 scale-105'
                : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {value > 0 && (
        <div className="flex items-center gap-2 text-violet-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <span className="text-sm font-semibold">
            {value} {value === 1 ? 'day' : 'days'} in Singapore
          </span>
        </div>
      )}
    </div>
  );
}
