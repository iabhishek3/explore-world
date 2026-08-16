import React from 'react';
import type { ItineraryDay } from '../../types';

interface ResultsViewProps {
  days: ItineraryDay[];
  onReplace: () => void;
  onAppend: () => void;
  onClose: () => void;
}

export default function ResultsView({ days, onReplace, onAppend, onClose }: ResultsViewProps) {
  const totalPlaces = days.reduce((sum, d) => sum + d.places.length, 0);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">Your Itinerary</h2>
            <p className="text-sm text-zinc-500">{days.length} days, {totalPlaces} places</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-1 -mr-1">
        {days.map(day => (
          <div key={day.id}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                <span className="text-[12px] font-bold text-violet-700">{day.id}</span>
              </div>
              <h3 className="text-[15px] font-bold text-zinc-800">{day.label}</h3>
              <div className="flex-1 h-px bg-zinc-100" />
            </div>
            <div className="space-y-2 pl-9">
              {day.places.map((place, i) => (
                <div key={place.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors">
                  <img
                    src={place.image_url}
                    alt={place.name}
                    className="w-11 h-11 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-zinc-800 truncate">{place.name}</p>
                    <p className="text-[11px] text-zinc-500 truncate">{place.address}</p>
                  </div>
                  <span className="text-[11px] font-medium text-zinc-400 shrink-0">#{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-4 border-t border-zinc-100">
        <button
          onClick={onReplace}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[15px] font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-violet-200"
        >
          Use this itinerary
        </button>
        <button
          onClick={onAppend}
          className="w-full py-3.5 rounded-2xl bg-zinc-100 text-zinc-700 text-[14px] font-medium hover:bg-zinc-200 active:scale-[0.98] transition-all"
        >
          Add to existing trip
        </button>
        <button
          onClick={onClose}
          className="w-full py-3 text-[13px] text-zinc-500 hover:text-zinc-700 transition-colors"
        >
          Regenerate
        </button>
      </div>
    </div>
  );
}
