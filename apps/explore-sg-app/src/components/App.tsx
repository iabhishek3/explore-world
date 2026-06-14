import React, { useState, useEffect, useCallback } from 'react';
import type { Category, Place, ItineraryDay } from '../types';
import { PLACES } from '../lib/places';
import FilterBar from './FilterBar';
import ViewToggle from './ViewToggle';
import MapView from './MapView';
import GridView from './GridView';
import Itinerary from './Itinerary';

const STORAGE_KEY = 'exploresg-itinerary';

function loadItinerary(): ItineraryDay[] {
  if (typeof window === 'undefined') return [{ id: '1', label: 'Day 1', places: [] }];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [{ id: '1', label: 'Day 1', places: [] }];
}

export default function App() {
  const [showMap, setShowMap] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Category[]>(['food', 'nature', 'culture', 'shopping', 'nightlife']);
  const [days, setDays] = useState<ItineraryDay[]>(loadItinerary);
  const [showItinerary, setShowItinerary] = useState(false);
  const [focusPlace, setFocusPlace] = useState<Place | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(days));
  }, [days]);

  const filteredPlaces = PLACES.filter(p => activeFilters.includes(p.category));
  const tripPlaceIds = new Set(days.flatMap(d => d.places.map(p => p.id)));

  const addToTrip = useCallback((place: Place) => {
    setDays(prev => {
      const allPlaceIds = prev.flatMap(d => d.places.map(p => p.id));
      if (allPlaceIds.includes(place.id)) return prev;
      const lastDay = prev[prev.length - 1];
      return prev.map(d => d.id === lastDay.id ? { ...d, places: [...d.places, place] } : d);
    });
    // Only auto-open itinerary panel on desktop
    if (window.innerWidth >= 768) {
      setShowItinerary(true);
    }
  }, []);

  const removeFromTrip = useCallback((place: Place) => {
    setDays(prev => prev.map(d => ({ ...d, places: d.places.filter(p => p.id !== place.id) })));
  }, []);

  const handlePlaceClick = useCallback((place: Place) => {
    setShowMap(true);
    setFocusPlace(place);
    if (!activeFilters.includes(place.category)) {
      setActiveFilters(prev => [...prev, place.category]);
    }
  }, [activeFilters]);

  const totalPlaces = days.reduce((sum, d) => sum + d.places.length, 0);

  return (
    <div className="flex flex-col h-screen bg-white text-zinc-900">
      {/* Header */}
      <header className="shrink-0 h-16 flex items-center justify-between px-6 border-b border-zinc-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-red-500 to-red-600 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">SG</span>
          </div>
          <span className="text-[15px] font-semibold text-zinc-900 tracking-tight">Explore Singapore</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowItinerary(!showItinerary)}
            className="relative flex items-center gap-2 px-2.5 md:px-3.5 py-2 rounded-full text-[13px] font-medium bg-white border border-zinc-200 text-zinc-700 hover:shadow-md hover:border-zinc-300 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="hidden md:inline">My Trip</span>
            {totalPlaces > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {totalPlaces}
              </span>
            )}
          </button>
          <button
            className="flex items-center gap-2 px-2.5 md:px-3.5 py-2 rounded-full text-[13px] font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-md hover:opacity-90 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
            <span className="hidden md:inline">AI Planner</span>
          </button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="shrink-0 border-b border-zinc-100 px-6">
        <div className="max-w-[1600px] mx-auto">
          <FilterBar active={activeFilters} onChange={setActiveFilters} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop: split view. Mobile: full grid or full map */}

        {/* Grid */}
        <div className={`overflow-hidden transition-all duration-300 ${
          showMap ? 'hidden md:block md:w-1/2 md:border-r md:border-zinc-100' : 'flex-1'
        }`}>
          <GridView places={filteredPlaces} onAdd={addToTrip} onRemove={removeFromTrip} tripPlaceIds={tripPlaceIds} compact={showMap} onPlaceFocus={showMap ? (place) => setFocusPlace(place) : undefined} />
        </div>

        {/* Map */}
        {showMap && (
          <div className="flex-1 md:w-1/2 md:flex-none relative">
            <div className="absolute inset-0 p-3 md:p-3 p-0">
              <MapView places={filteredPlaces} onAdd={addToTrip} onRemove={removeFromTrip} tripPlaceIds={tripPlaceIds} focusPlace={focusPlace} />
            </div>
          </div>
        )}

        {/* Itinerary Panel */}
        {showItinerary && (
          <div className="w-[300px] shrink-0 border-l border-zinc-200 bg-zinc-50 hidden md:flex flex-col">
            <Itinerary days={days} onChange={setDays} onPlaceClick={handlePlaceClick} />
          </div>
        )}
      </div>

      {/* Floating Toggle */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
        <ViewToggle showMap={showMap} onChange={setShowMap} />
      </div>

      {/* Mobile Itinerary — bottom sheet over map or grid */}
      {showItinerary && (
        <div className="md:hidden fixed inset-x-0 bottom-0 h-[50vh] bg-white border-t border-zinc-200 rounded-t-2xl z-[9998] flex flex-col shadow-2xl">
          <div
            className="flex flex-col items-center pt-2 pb-1 cursor-pointer"
            onClick={() => setShowItinerary(false)}
          >
            <div className="w-10 h-1.5 rounded-full bg-zinc-300" />
            <span className="text-[10px] text-zinc-400 mt-1">Tap to close</span>
          </div>
          <Itinerary days={days} onChange={setDays} onPlaceClick={handlePlaceClick} />
        </div>
      )}
    </div>
  );
}
