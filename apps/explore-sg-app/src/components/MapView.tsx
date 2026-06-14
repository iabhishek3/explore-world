import React, { useRef, useEffect, useState } from 'react';
import type { Place } from '../types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../lib/places';

interface Props {
  places: Place[];
  onAdd: (place: Place) => void;
  onRemove: (place: Place) => void;
  tripPlaceIds: Set<string>;
  focusPlace?: Place | null;
}

export default function MapView({ places, onAdd, onRemove, tripPlaceIds, focusPlace }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any>(null);
  const markersByIdRef = useRef<Record<string, any>>({});
  const [ready, setReady] = useState(false);
  const LRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    import('leaflet').then((L) => {
      LRef.current = L.default || L;
      const Leaf = LRef.current;

      mapRef.current = Leaf.map(mapContainer.current!, {
        center: [1.3521, 103.8198],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      Leaf.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);

      Leaf.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
      markersRef.current = Leaf.layerGroup().addTo(mapRef.current);
      setReady(true);
    });

    return () => { mapRef.current?.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    if (!ready || !markersRef.current || !LRef.current) return;
    const L = LRef.current;

    markersRef.current.clearLayers();
    markersByIdRef.current = {};

    places.forEach(place => {
      const color = CATEGORY_COLORS[place.category];
      const isInTrip = tripPlaceIds.has(place.id);

      const icon = L.divIcon({
        className: '',
        html: `<div style="width:26px;height:26px;border-radius:50%;background:${color};border:2.5px solid ${isInTrip ? '#18181b' : 'rgba(0,0,0,0.4)'};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px ${color}50;cursor:pointer;transition:transform 0.15s;"><span style="width:7px;height:7px;border-radius:50%;background:white;opacity:0.9;"></span></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, -16],
      });

      const marker = L.marker([place.latitude, place.longitude], { icon })
        .addTo(markersRef.current);

      const popupContent = document.createElement('div');
      const btnLabel = isInTrip ? 'Remove from trip' : '+ Add to trip';
      const btnStyle = isInTrip
        ? 'margin-top:14px;width:100%;padding:12px;border-radius:10px;background:#fff;border:2px solid #ef4444;color:#ef4444;font-size:13px;font-weight:600;cursor:pointer;'
        : 'margin-top:14px;width:100%;padding:12px;border-radius:10px;background:#18181b;border:none;color:#fff;font-size:13px;font-weight:600;cursor:pointer;';

      popupContent.innerHTML = `
        <div style="font-family:Inter,-apple-system,sans-serif;width:280px;">
          <div style="position:relative;border-radius:12px;overflow:hidden;margin-bottom:12px;">
            <img src="${place.image_url}" style="width:100%;height:160px;object-fit:cover;display:block;" />
            <div style="position:absolute;top:10px;left:10px;background:white;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:700;color:#18181b;">${CATEGORY_LABELS[place.category]}</div>
            <div style="position:absolute;top:10px;right:10px;background:white;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:600;color:#18181b;display:flex;align-items:center;gap:3px;">
              <svg width="12" height="12" viewBox="0 0 20 20" fill="#18181b"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              ${place.rating}
            </div>
          </div>
          <div style="font-size:16px;font-weight:700;color:#18181b;line-height:1.3;">${place.name}</div>
          <div style="font-size:13px;color:#71717a;margin-top:4px;">${place.address}</div>
          <div style="font-size:13px;color:#52525b;margin-top:6px;line-height:1.5;">${place.description || ''}</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:10px;">${place.tags.map(t => `<span style="font-size:11px;background:#f4f4f5;color:#52525b;padding:3px 8px;border-radius:20px;font-weight:500;">${t}</span>`).join('')}</div>
          <button class="action-btn" style="${btnStyle}">${btnLabel}</button>
        </div>
      `;

      popupContent.querySelector('.action-btn')!.addEventListener('click', () => {
        if (isInTrip) {
          onRemove(place);
        } else {
          onAdd(place);
        }
        marker.closePopup();
      });

      marker.bindPopup(popupContent, {
        closeButton: false,
        className: 'dark-popup',
        maxWidth: 320,
        autoPan: true,
        autoPanPaddingTopLeft: [20, 80],
        autoPanPaddingBottomRight: [20, 20],
      });

      markersByIdRef.current[place.id] = marker;
    });
  }, [places, ready, onAdd, onRemove, tripPlaceIds]);

  // Focus on a place when clicked from itinerary/grid
  useEffect(() => {
    if (!focusPlace || !mapRef.current || !ready) return;
    const marker = markersByIdRef.current[focusPlace.id];
    if (marker) {
      // Offset the center down so the popup appears in the middle of the viewport
      const targetLatLng = LRef.current.latLng(focusPlace.latitude - 0.005, focusPlace.longitude);
      mapRef.current.flyTo(targetLatLng, 14, { duration: 0.8 });
      setTimeout(() => marker.openPopup(), 600);
    }
  }, [focusPlace, ready]);

  return (
    <div ref={mapContainer} className="w-full h-full rounded-xl overflow-hidden" />
  );
}
