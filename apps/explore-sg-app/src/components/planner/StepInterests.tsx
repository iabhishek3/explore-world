import React from 'react';
import type { Category } from '../../types';

interface StepInterestsProps {
  value: Category[];
  onChange: (interests: Category[]) => void;
}

const categories: { id: Category; label: string; emoji: string }[] = [
  { id: 'food', label: 'Food & Dining', emoji: '🍜' },
  { id: 'nature', label: 'Nature & Parks', emoji: '🌿' },
  { id: 'culture', label: 'Culture & Heritage', emoji: '🏛️' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🌃' },
  { id: 'arts', label: 'Arts & Museums', emoji: '🎨' },
  { id: 'architecture', label: 'Architecture', emoji: '🏗️' },
  { id: 'neighbourhood', label: 'Neighbourhoods', emoji: '🏘️' },
  { id: 'attractions', label: 'Attractions', emoji: '🎡' },
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
        <p className="text-sm text-zinc-500 mt-3">Pick as many as you like — we'll mix them in</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {categories.map(cat => {
          const selected = value.includes(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => toggle(cat.id)}
              className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all active:scale-[0.97] text-left ${
                selected
                  ? 'border-violet-600 bg-violet-50'
                  : 'border-zinc-100 bg-white hover:border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <span className="text-xl">{cat.emoji}</span>
              <span className={`text-sm font-semibold leading-tight ${
                selected ? 'text-violet-700' : 'text-zinc-700'
              }`}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {value.length > 0 && (
        <p className="text-sm font-medium text-violet-600">
          {value.length} {value.length === 1 ? 'interest' : 'interests'} selected
        </p>
      )}
    </div>
  );
}
