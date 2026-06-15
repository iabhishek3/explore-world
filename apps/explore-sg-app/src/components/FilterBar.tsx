import React from 'react';
import type { Category } from '../types';
import { CATEGORY_LABELS } from '../lib/places';
import { Utensils, Trees, Landmark, ShoppingBag, Moon, Palette, Building2, MapPin, Star } from 'lucide-react';

interface Props {
  active: Category[];
  onChange: (categories: Category[]) => void;
  collapsed?: boolean;
}

const ALL_CATEGORIES: Category[] = ['food', 'nature', 'culture', 'shopping', 'nightlife', 'arts', 'architecture', 'neighbourhood', 'attractions'];

const CATEGORY_ICONS: Record<string, JSX.Element> = {
  food: <Utensils size={18} strokeWidth={1.5} />,
  nature: <Trees size={18} strokeWidth={1.5} />,
  culture: <Landmark size={18} strokeWidth={1.5} />,
  shopping: <ShoppingBag size={18} strokeWidth={1.5} />,
  nightlife: <Moon size={18} strokeWidth={1.5} />,
  arts: <Palette size={18} strokeWidth={1.5} />,
  architecture: <Building2 size={18} strokeWidth={1.5} />,
  neighbourhood: <MapPin size={18} strokeWidth={1.5} />,
  attractions: <Star size={18} strokeWidth={1.5} />,
};

export default function FilterBar({ active, onChange, collapsed }: Props) {
  function toggle(cat: Category) {
    if (active.includes(cat)) {
      onChange(active.filter(c => c !== cat));
    } else {
      onChange([...active, cat]);
    }
  }

  return (
    <div className="flex items-center justify-center py-5 overflow-x-auto no-scrollbar">
      <div className={`relative inline-flex items-center rounded-full border no-scrollbar transition-all duration-300 max-w-full ${collapsed ? 'gap-0 px-2 py-1.5 overflow-visible bg-white/70 backdrop-blur-md border-zinc-200/50 shadow-sm' : 'gap-1 px-3 py-2 overflow-x-auto bg-white border-zinc-200 shadow-sm'}`}>
        {ALL_CATEGORIES.map(cat => {
          const isActive = active.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => toggle(cat)}
              className={`group relative shrink-0 inline-flex items-center justify-center transition-all duration-300 cursor-pointer rounded-full ${
                collapsed ? 'w-8 h-8' : 'h-8 px-3 gap-1.5'
              } ${
                isActive
                  ? 'bg-[#EF3340]/10 text-[#EF3340]'
                  : 'text-zinc-400 hover:text-zinc-600 active:scale-95'
              }`}
            >
              <span className="shrink-0 flex items-center justify-center">
                {CATEGORY_ICONS[cat]}
              </span>
              {!collapsed && (
                <span className="text-[12px] font-medium whitespace-nowrap leading-none">
                  {CATEGORY_LABELS[cat]}
                </span>
              )}
              {collapsed && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 text-white text-[10px] font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                  {CATEGORY_LABELS[cat]}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
