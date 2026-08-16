import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import prototypeEmbeddings from '../../lib/prototype-embeddings.json';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

// Combine pre-computed prototype embeddings by averaging relevant ones
function buildQueryEmbedding(group: string, interests: string[], budget: string): number[] {
  const keys = [group, budget, ...interests.map(i => i.toLowerCase())];
  const vectors = keys
    .filter(k => (prototypeEmbeddings as any)[k])
    .map(k => (prototypeEmbeddings as any)[k] as number[]);

  if (vectors.length === 0) {
    throw new Error('No matching prototype embeddings found');
  }

  // Average all relevant vectors
  const dim = vectors[0].length;
  const avg = new Array(dim).fill(0);
  for (const vec of vectors) {
    for (let i = 0; i < dim; i++) {
      avg[i] += vec[i];
    }
  }
  // Normalize
  let norm = 0;
  for (let i = 0; i < dim; i++) {
    avg[i] /= vectors.length;
    norm += avg[i] * avg[i];
  }
  norm = Math.sqrt(norm);
  for (let i = 0; i < dim; i++) {
    avg[i] /= norm;
  }
  return avg;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function groupIntoDays(places: any[], numDays: number) {
  const placesPerDay = Math.ceil(places.length / numDays);
  const used = new Set<number>();
  const days = [];

  for (let day = 0; day < numDays; day++) {
    const dayPlaces: any[] = [];

    let seed = null;
    for (const p of places) {
      if (!used.has(p.id)) {
        seed = p;
        used.add(p.id);
        dayPlaces.push(p);
        break;
      }
    }

    if (!seed) break;

    while (dayPlaces.length < placesPerDay) {
      const lastPlace = dayPlaces[dayPlaces.length - 1];
      let nearest = null;
      let nearestDist = Infinity;

      for (const p of places) {
        if (used.has(p.id)) continue;
        const dist = haversineDistance(
          lastPlace.latitude, lastPlace.longitude,
          p.latitude, p.longitude
        );
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = p;
        }
      }

      if (!nearest) break;
      used.add(nearest.id);
      dayPlaces.push(nearest);
    }

    days.push({
      id: String(day + 1),
      label: `Day ${day + 1}`,
      places: dayPlaces.map(p => ({
        id: String(p.id),
        name: p.name,
        image_url: p.image_url,
        rating: p.rating,
        tags: p.tags || [],
        address: p.address,
        category: (p.tags?.[0] || 'attractions').toLowerCase(),
        latitude: p.latitude,
        longitude: p.longitude,
        description: p.overview || '',
      })),
    });
  }

  return days;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { numDays, group, interests, budget } = await request.json();

    // Build query embedding from pre-computed prototypes (no API call!)
    const queryEmbedding = buildQueryEmbedding(group, interests, budget);

    // Search for similar places
    const matchCount = Math.min(numDays * 5, 25);
    const embeddingStr = `[${queryEmbedding.join(',')}]`;

    // Capitalize interests to match DB tags (e.g. "food" -> "Food")
    const capitalizedInterests = interests.map((i: string) =>
      i.charAt(0).toUpperCase() + i.slice(1)
    );

    const { data: matchedPlaces, error } = await supabase.rpc('match_places', {
      query_embedding: embeddingStr,
      match_threshold: 0.0,
      match_count: matchCount,
      filter_categories: capitalizedInterests.length > 0 ? capitalizedInterests : null,
    });

    if (error) {
      return new Response(JSON.stringify({ error: 'Failed to search places: ' + error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!matchedPlaces || matchedPlaces.length === 0) {
      return new Response(JSON.stringify({ error: 'No matching places found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Group places into days by geographic proximity
    const days = groupIntoDays(matchedPlaces, numDays);

    return new Response(JSON.stringify({ days }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Planner API error:', err?.name, err?.message);
    return new Response(JSON.stringify({ error: err?.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
