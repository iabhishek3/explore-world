import React from 'react';

interface StepDaysProps {
  value: number;
  onChange: (days: number) => void;
}

export default function StepDays({ value, onChange }: StepDaysProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 leading-tight">
          How many days are you<br />visiting Singapore?
        </h2>
        <p className="text-sm text-zinc-500 mt-3">We'll craft the perfect itinerary for your trip length</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4, 5, 6, 7].map(day => (
          <button
            key={day}
            onClick={() => onChange(day)}
            className={`aspect-square rounded-xl text-xl font-bold transition-all active:scale-95 ${
              value === day
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {value > 0 && (
        <p className="text-sm font-medium text-violet-600">
          {value} {value === 1 ? 'day' : 'days'} in Singapore
        </p>
      )}
    </div>
  );
}
