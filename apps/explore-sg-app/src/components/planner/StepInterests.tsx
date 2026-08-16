import React from 'react';
import type { Category } from '../../types';

interface StepInterestsProps {
  value: Category[];
  onChange: (interests: Category[]) => void;
}

const categories: { id: Category; label: string; emoji: string; color: string }[] = [
  { id: 'food', label: 'Food & Dining', emoji: '🍜', color: '#f97316' },
  { id: 'nature', label: 'Nature & Parks', emoji: '🌿', color: '#22c55e' },
  { id: 'culture', label: 'Culture & Heritage', emoji: '🏛️', color: '#8b5cf6' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️', color: '#ec4899' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🌃', color: '#a855f7' },
  { id: 'arts', label: 'Arts & Museums', emoji: '🎨', color: '#06b6d4' },
  { id: 'architecture', label: 'Architecture', emoji: '🏗️', color: '#64748b' },
  { id: 'neighbourhood', label: 'Neighbourhoods', emoji: '🏘️', color: '#f97316' },
  { id: 'attractions', label: 'Attractions', emoji: '🎡', color: '#3b82f6' },
];

export default function StepInterests({ value, onChange }: StepInterestsProps) {
  const toggle = (cat: Category) => {
    if (value.includes(cat)) {
      onChange(value.filter(c => c !== cat));
    } else {
      onChange([...value, cat]);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 leading-tight">
          What are you into?
        </h2>
        <p className="text-base text-zinc-500 mt-3">Pick as many as you like — we'll mix them in</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {categories.map(cat => {
          const selected = value.includes(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => toggle(cat.id)}
              className={`flex items-center gap-3 p-3.5 md:p-4 rounded-2xl border-2 transition-all active:scale-[0.97] text-left ${
                selected
                  ? 'border-violet-500 bg-violet-50 shadow-sm'
                  : 'border-zinc-100 bg-white hover:border-zinc-200'
              }`}
            >
              <span className="text-xl">{cat.emoji}</span>
              <span className={`text-[13px] md:text-[14px] font-semibold leading-tight ${
                selected ? 'text-violet-700' : 'text-zinc-700'
              }`}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {value.length > 0 && (
        <div className="flex items-center gap-2 text-violet-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-semibold">
            {value.length} {value.length === 1 ? 'interest' : 'interests'} selected
          </span>
        </div>
      )}
    </div>
  );
}
