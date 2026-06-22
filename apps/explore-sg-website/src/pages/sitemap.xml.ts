import type { APIRoute } from 'astro';
import { supabase } from '../lib/supabase';

export const GET: APIRoute = async () => {
  const [placesResult, guidesResult] = await Promise.all([
    supabase.from('places').select('id, slug'),
    supabase.from('recommendations').select('id'),
  ]);

  const places = placesResult.data ?? [];
  const guides = guidesResult.data ?? [];

  const staticPages = [
    { url: 'https://exploresg.info/', priority: '1.0', changefreq: 'weekly' },
    { url: 'https://exploresg.info/places', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://exploresg.info/guides', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://exploresg.info/things-to-do', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://exploresg.info/singapore-itinerary', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://exploresg.info/about', priority: '0.5', changefreq: 'monthly' },
    { url: 'https://exploresg.info/privacy', priority: '0.3', changefreq: 'yearly' },
    { url: 'https://exploresg.info/terms', priority: '0.3', changefreq: 'yearly' },
  ];

  const placePages = places.map((place) => ({
    url: `https://exploresg.info/places/${place.slug}`,
    priority: '0.7',
    changefreq: 'weekly',
  }));

  const guidePages = guides.map((guide) => ({
    url: `https://exploresg.info/guides/${guide.id}`,
    priority: '0.7',
    changefreq: 'weekly',
  }));

  const allPages = [...staticPages, ...placePages, ...guidePages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
