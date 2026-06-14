import React from 'react';
import type { Place } from '../types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../lib/places';

interface Props {
  place: Place;
  onAdd: (place: Place) => void;
  compact?: boolean;
}

export default function PlaceCard({ place, onAdd, compact }: Props) {
  const color = CATEGORY_COLORS[place.category];

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors group">
        <img src={place.image_url} alt={place.name} className="w-10 h-10 rounded-md object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-medium text-zinc-200 truncate">{place.name}</div>
          <div className="text-[11px] text-zinc-500">{place.address}</div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(place); }}
          className="opacity-0 group-hover:opacity-100 shrink-0 w-6 h-6 rounded-md bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center transition-all cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="group rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/60 hover:border-zinc-700/60 transition-all duration-200">
      <div className="relative aspect-[3/2] overflow-hidden">
        <img src={place.image_url} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-2.5 left-2.5">
          <span
            className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md"
            style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}
          >
            {CATEGORY_LABELS[place.category]}
          </span>
        </div>
        <button
          onClick={() => onAdd(place)}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm hover:bg-black/80 flex items-center justify-center transition-all cursor-pointer border border-white/10"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[13px] font-semibold text-zinc-100 leading-tight">{place.name}</h3>
          <div className="flex items-center gap-0.5 shrink-0">
            <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[11px] text-zinc-400 font-medium">{place.rating}</span>
          </div>
        </div>
        <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">{place.description}</p>
        <p className="text-[11px] text-zinc-600 mt-1.5">{place.address}</p>
      </div>
    </div>
  );
}
