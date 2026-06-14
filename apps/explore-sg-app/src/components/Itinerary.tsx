import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Place, ItineraryDay } from '../types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../lib/places';

interface Props {
  days: ItineraryDay[];
  onChange: (days: ItineraryDay[]) => void;
  onPlaceClick?: (place: Place) => void;
}

function SortablePlace({ place, dayId, onRemove, onClick }: { place: Place; dayId: string; onRemove: () => void; onClick?: () => void }) {
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
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-zinc-100 group hover:shadow-sm hover:border-zinc-200 transition-all cursor-pointer" onClick={onClick}>
      <div {...attributes} {...listeners} className="shrink-0 cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-500" onClick={e => e.stopPropagation()}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </div>
      <img src={place.image_url} alt={place.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-zinc-900 truncate">{place.name}</div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
          <span className="text-[11px] text-zinc-400">{CATEGORY_LABELS[place.category]}</span>
        </div>
      </div>
      <button
        onClick={onRemove}
        className="shrink-0 w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all cursor-pointer"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function Itinerary({ days, onChange, onPlaceClick }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

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
    <div className="flex flex-col h-full bg-zinc-50/50">
      {/* Header */}
      <div className="px-5 py-4 bg-white border-b border-zinc-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-zinc-900">Your trip</h2>
            <p className="text-[12px] text-zinc-400 mt-0.5">{totalPlaces} {totalPlaces === 1 ? 'place' : 'places'} saved</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center">
            <svg className="w-4.5 h-4.5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Days */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {totalPlaces === 0 && (
          <div className="text-center py-16 px-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <p className="text-[14px] font-medium text-zinc-700">No places yet</p>
            <p className="text-[12px] text-zinc-400 mt-1">Tap + on any place to add it here</p>
          </div>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {days.map((day, dayIndex) => (
            <div key={day.id}>
              {/* Day header */}
              <div className="flex items-center justify-between mb-2.5 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-[11px] font-bold flex items-center justify-center">
                    {dayIndex + 1}
                  </span>
                  <span className="text-[13px] font-semibold text-zinc-900">{day.label}</span>
                  <span className="text-[11px] text-zinc-400">{day.places.length} stops</span>
                </div>
                {days.length > 1 && (
                  <button onClick={() => removeDay(day.id)} className="text-[11px] text-zinc-400 hover:text-red-500 cursor-pointer transition-colors font-medium">
                    Remove
                  </button>
                )}
              </div>

              <SortableContext items={day.places.map(p => `${day.id}-${p.id}`)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2 relative">
                  {/* Timeline line */}
                  {day.places.length > 1 && (
                    <div className="absolute left-[29px] top-4 bottom-4 w-px bg-zinc-200" />
                  )}
                  {day.places.length === 0 && (
                    <div className="text-[12px] text-zinc-300 text-center py-6 border-2 border-dashed border-zinc-150 rounded-xl bg-white">
                      Drag places here
                    </div>
                  )}
                  {day.places.map(place => (
                    <SortablePlace
                      key={`${day.id}-${place.id}`}
                      place={place}
                      dayId={day.id}
                      onRemove={() => removePlace(day.id, place.id)}
                      onClick={() => onPlaceClick?.(place)}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          ))}
        </DndContext>
      </div>

      {/* Add Day */}
      <div className="px-4 py-4 bg-white border-t border-zinc-100">
        <button
          onClick={addDay}
          className="w-full text-[13px] font-semibold text-zinc-900 py-2.5 rounded-xl border-2 border-dashed border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 transition-all cursor-pointer"
        >
          + Add another day
        </button>
      </div>
    </div>
  );
}
