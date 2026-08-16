import React from 'react';

type GroupType = 'solo' | 'couple' | 'family' | 'friends';

interface StepGroupProps {
  value: GroupType | null;
  onChange: (group: GroupType) => void;
}

const groups: { id: GroupType; label: string; emoji: string; desc: string }[] = [
  { id: 'solo', label: 'Solo', emoji: '🧳', desc: 'Just me, exploring at my pace' },
  { id: 'couple', label: 'Couple', emoji: '💑', desc: 'Romantic getaway for two' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦', desc: 'Fun for the whole family' },
  { id: 'friends', label: 'Friends', emoji: '👯', desc: 'Group adventure together' },
];

export default function StepGroup({ value, onChange }: StepGroupProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 leading-tight">
          Who's joining you?
        </h2>
        <p className="text-sm text-zinc-500 mt-3">This helps us pick the right kind of experiences</p>
      </div>

      <div className="space-y-3">
        {groups.map(g => (
          <button
            key={g.id}
            onClick={() => onChange(g.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all active:scale-[0.98] text-left ${
              value === g.id
                ? 'border-violet-600 bg-violet-50'
                : 'border-zinc-100 bg-white hover:border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            <span className="text-2xl w-11 h-11 flex items-center justify-center rounded-xl bg-zinc-50">
              {g.emoji}
            </span>
            <div className="flex-1">
              <span className="text-[15px] font-semibold text-zinc-900">{g.label}</span>
              <p className="text-sm text-zinc-500 mt-0.5">{g.desc}</p>
            </div>
            {value === g.id && (
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
