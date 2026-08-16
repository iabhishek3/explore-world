import React, { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Place, ItineraryDay } from '../types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../lib/places';
import { exportItineraryPdf } from '../lib/exportPdf';
import PlaceModal from './PlaceModal';

interface Props {
  days: ItineraryDay[];
  onChange: (days: ItineraryDay[]) => void;
  onPlaceClick?: (place: Place) => void;
  onClose: () => void;
  tripPlaceIds?: Set<string>;
  onAdd?: (place: Place) => void;
  onRemove?: (place: Place) => void;
}

function SortablePlace({ place, dayId, index, onRemove, onClick }: { place: Place; dayId: string; index: number; onRemove: () => void; onClick?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `${dayId}-${place.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const color = CATEGORY_COLORS[place.category];

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-zinc-100 shadow-sm active:shadow-md transition-all" onClick={onClick}>
      <div {...attributes} {...listeners} className="shrink-0 cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-500 touch-none" onClick={e => e.stopPropagation()}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </div>
      <div className="relative shrink-0">
        <img src={place.image_url} alt={place.name} className="w-12 h-12 rounded-xl object-cover" />
        <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-zinc-900 text-white text-[10px] font-bold flex items-center justify-center">
          {index + 1}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold text-zinc-900 truncate">{place.name}</div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
          <span className="text-[12px] text-zinc-500">{CATEGORY_LABELS[place.category]}</span>
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="shrink-0 w-8 h-8 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function Itinerary({ days, onChange, onPlaceClick, onClose, tripPlaceIds, onAdd, onRemove }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const [activeDayId, activePlaceId] = (active.id as string).split('-');
    const [overDayId, overPlaceId] = (over.id as string).split('-');

    const newDays = [...days];

    if (activeDayId === overDayId) {
      const dayIndex = newDays.findIndex(d => d.id === activeDayId);
      const places = [...newDays[dayIndex].places];
      const oldIndex = places.findIndex(p => p.id === activePlaceId);
      const newIndex = places.findIndex(p => p.id === overPlaceId);
      newDays[dayIndex] = { ...newDays[dayIndex], places: arrayMove(places, oldIndex, newIndex) };
    } else {
      const fromDayIndex = newDays.findIndex(d => d.id === activeDayId);
      const toDayIndex = newDays.findIndex(d => d.id === overDayId);
      const place = newDays[fromDayIndex].places.find(p => p.id === activePlaceId);
      if (!place) return;
      newDays[fromDayIndex] = { ...newDays[fromDayIndex], places: newDays[fromDayIndex].places.filter(p => p.id !== activePlaceId) };
      const toIndex = newDays[toDayIndex].places.findIndex(p => p.id === overPlaceId);
      const toPlaces = [...newDays[toDayIndex].places];
      toPlaces.splice(toIndex, 0, place);
      newDays[toDayIndex] = { ...newDays[toDayIndex], places: toPlaces };
    }

    onChange(newDays);
  }

  function removePlace(dayId: string, placeId: string) {
    onChange(days.map(d => d.id === dayId ? { ...d, places: d.places.filter(p => p.id !== placeId) } : d));
  }

  function addDay() {
    onChange([...days, { id: crypto.randomUUID(), label: `Day ${days.length + 1}`, places: [] }]);
  }

  function removeDay(dayId: string) {
    const filtered = days.filter(d => d.id !== dayId);
    onChange(filtered.map((d, i) => ({ ...d, label: `Day ${i + 1}` })));
  }

  const totalPlaces = days.reduce((sum, d) => sum + d.places.length, 0);

  return (
    <div className="fixed inset-0 z-[9998] bg-zinc-50 flex flex-col">
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-zinc-100 px-5 py-4 safe-area-top">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-100 active:scale-95 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-zinc-900">My Trip</h1>
              <p className="text-[12px] text-zinc-500">
                {totalPlaces} {totalPlaces === 1 ? 'place' : 'places'} · {days.length} {days.length === 1 ? 'day' : 'days'}
              </p>
            </div>
          </div>
          {totalPlaces > 0 && (
            <button
              onClick={() => exportItineraryPdf(days)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 text-white text-[13px] font-medium hover:bg-zinc-800 active:scale-95 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span className="hidden md:inline">Export PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-5 py-6 space-y-6">
          {/* Empty state */}
          {totalPlaces === 0 && (
            <div className="text-center py-20 px-6">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-zinc-800">No places yet</h3>
              <p className="text-sm text-zinc-500 mt-2 max-w-xs mx-auto">
                Add places from the map or use AI Planner to generate an itinerary
              </p>
            </div>
          )}

          {/* Day cards */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            {days.map((day, dayIndex) => (
              <div key={day.id} className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                {/* Day card header */}
                <div className="px-5 py-4 border-b border-zinc-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
                      <span className="text-[13px] font-bold text-white">{dayIndex + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-zinc-900">{day.label}</h3>
                      <p className="text-[12px] text-zinc-400">
                        {day.places.length} {day.places.length === 1 ? 'stop' : 'stops'}
                      </p>
                    </div>
                  </div>
                  {days.length > 1 && (
                    <button
                      onClick={() => removeDay(day.id)}
                      className="text-[12px] text-zinc-400 hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 transition-all font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Places list */}
                <div className="px-4 py-3">
                  <SortableContext items={day.places.map(p => `${day.id}-${p.id}`)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {day.places.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-zinc-100 rounded-2xl">
                          <p className="text-[13px] text-zinc-400">Drag places here or tap + to add</p>
                        </div>
                      )}
                      {day.places.map((place, index) => (
                        <SortablePlace
                          key={`${day.id}-${place.id}`}
                          place={place}
                          dayId={day.id}
                          index={index}
                          onRemove={() => removePlace(day.id, place.id)}
                          onClick={() => setSelectedPlace(place)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </div>
              </div>
            ))}
          </DndContext>

          {/* Add day button */}
          <button
            onClick={addDay}
            className="w-full py-3.5 rounded-xl border-2 border-dashed border-zinc-200 text-sm font-semibold text-zinc-500 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 active:scale-[0.98] transition-all"
          >
            + Add another day
          </button>
        </div>
      </div>

      {/* Place detail modal */}
      {selectedPlace && (
        <PlaceModal
          place={selectedPlace}
          isInTrip={tripPlaceIds ? tripPlaceIds.has(selectedPlace.id) : true}
          onAdd={onAdd || (() => {})}
          onRemove={onRemove || ((p) => removePlace(days.find(d => d.places.some(pl => pl.id === p.id))?.id || '', p.id))}
          onClose={() => setSelectedPlace(null)}
        />
      )}
    </div>
  );
}
