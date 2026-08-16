import React from 'react';
import type { Place } from '../types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../lib/places';

interface PlaceModalProps {
  place: Place;
  isInTrip: boolean;
  onAdd: (p: Place) => void;
  onRemove: (p: Place) => void;
  onClose: () => void;
}

export default function PlaceModal({ place, isInTrip, onAdd, onRemove, onClose }: PlaceModalProps) {
  const color = CATEGORY_COLORS[place.category];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'fade-in 0.2s ease-out' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm cursor-pointer hover:scale-105 transition-transform"
        >
          <svg className="w-4 h-4 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img src={place.image_url} alt={place.name} className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4">
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg text-white"
              style={{ background: color }}
            >
              {CATEGORY_LABELS[place.category]}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title + Rating */}
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-[20px] font-bold text-zinc-900 leading-tight">{place.name}</h2>
            <div className="flex items-center gap-1 shrink-0 bg-zinc-100 px-2 py-1 rounded-lg">
              <svg className="w-3.5 h-3.5 text-zinc-900" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-[13px] font-semibold text-zinc-900">{place.rating}</span>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center gap-1.5 mt-2">
            <svg className="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <p className="text-[13px] text-zinc-500">{place.address}</p>
          </div>

          {/* Description */}
          <p className="text-[14px] text-zinc-600 mt-3 leading-relaxed">{place.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {place.tags.map(tag => (
              <span key={tag} className="text-[12px] bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={() => { isInTrip ? onRemove(place) : onAdd(place); onClose(); }}
            className={`w-full mt-5 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer ${
              isInTrip
                ? 'bg-white border-2 border-red-500 text-red-500 hover:bg-red-50'
                : 'bg-violet-600 text-white hover:bg-violet-700'
            }`}
          >
            {isInTrip ? 'Remove from trip' : '+ Add to trip'}
          </button>
        </div>
      </div>
    </div>
  );
}
