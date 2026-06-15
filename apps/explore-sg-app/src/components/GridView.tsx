import React, { useState } from 'react';
import type { Place } from '../types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../lib/places';
import { MapPin } from 'lucide-react';

interface Props {
  places: Place[];
  onAdd: (place: Place) => void;
  onRemove: (place: Place) => void;
  tripPlaceIds: Set<string>;
  compact?: boolean;
  onPlaceFocus?: (place: Place) => void;
  onScroll?: (scrollTop: number) => void;
}

export default function GridView({ places, onAdd, onRemove, tripPlaceIds, compact, onPlaceFocus, onScroll }: Props) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  if (places.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-400 text-[14px]">
        No places match your filters
      </div>
    );
  }

  return (
    <>
      <div className="overflow-y-auto h-full px-6 pt-24 pb-10" onScroll={onScroll ? (e) => onScroll((e.target as HTMLDivElement).scrollTop) : undefined}>
        <div className={`max-w-[1600px] mx-auto grid gap-x-6 gap-y-10 ${compact ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
          {places.map(place => (
            <PlaceItem
              key={place.id}
              place={place}
              onAdd={onAdd}
              onRemove={onRemove}
              isInTrip={tripPlaceIds.has(place.id)}
              onClick={() => onPlaceFocus ? onPlaceFocus(place) : setSelectedPlace(place)}
            />
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPlace && (
        <PlaceModal
          place={selectedPlace}
          isInTrip={tripPlaceIds.has(selectedPlace.id)}
          onAdd={onAdd}
          onRemove={onRemove}
          onClose={() => setSelectedPlace(null)}
        />
      )}
    </>
  );
}

function PlaceItem({ place, onAdd, onRemove, isInTrip, onClick }: { place: Place; onAdd: (p: Place) => void; onRemove: (p: Place) => void; isInTrip: boolean; onClick: () => void }) {
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="relative aspect-[4/3] rounded-[12px] overflow-hidden mb-3 bg-zinc-100">
        {place.image_url ? (
          <img
            src={place.image_url}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-300 text-3xl">
            <MapPin size={32} />
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); isInTrip ? onRemove(place) : onAdd(place); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 ${
            isInTrip ? 'bg-red-500 hover:bg-red-600' : 'bg-white/90 hover:bg-white'
          }`}
        >
          {isInTrip ? (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          )}
        </button>
        <div className="absolute top-3 left-3">
          <span className="text-[11px] font-bold px-2 py-1 rounded-md bg-white text-zinc-900 shadow-sm">
            {CATEGORY_LABELS[place.category]}
          </span>
        </div>
      </div>

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold text-zinc-900 leading-snug truncate">{place.name}</h3>
          <p className="text-[14px] text-zinc-500 mt-0.5 truncate">{place.address}</p>
          <p className="text-[14px] text-zinc-600 mt-0.5 truncate">{place.description}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0 pt-0.5">
          <svg className="w-3.5 h-3.5 text-zinc-900" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-[14px] text-zinc-900">{place.rating}</span>
        </div>
      </div>
    </div>
  );
}

function PlaceModal({ place, isInTrip, onAdd, onRemove, onClose }: { place: Place; isInTrip: boolean; onAdd: (p: Place) => void; onRemove: (p: Place) => void; onClose: () => void }) {
  const color = CATEGORY_COLORS[place.category];

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4" onClick={onClose}>
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
            className={`w-full mt-5 py-3 rounded-xl text-[14px] font-semibold transition-all cursor-pointer ${
              isInTrip
                ? 'bg-white border-2 border-red-500 text-red-500 hover:bg-red-50'
                : 'bg-zinc-900 text-white hover:bg-zinc-800'
            }`}
          >
            {isInTrip ? 'Remove from trip' : '+ Add to trip'}
          </button>
        </div>
      </div>
    </div>
  );
}
