import type { Place } from '../types';

export const PLACES: Place[] = [
  // FOOD
  { id: '1', name: 'Maxwell Food Centre', image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop', rating: 4.6, tags: ['hawker', 'chicken rice'], address: '1 Kadayanallur St', category: 'food', latitude: 1.2804, longitude: 103.8448, description: 'Home to the legendary Tian Tian chicken rice' },
  { id: '2', name: 'Lau Pa Sat', image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop', rating: 4.3, tags: ['hawker', 'satay'], address: '18 Raffles Quay', category: 'food', latitude: 1.2806, longitude: 103.8504, description: 'Victorian-era hawker centre with famous satay street' },
  { id: '3', name: 'Jumbo Seafood', image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop', rating: 4.5, tags: ['restaurant', 'chilli crab'], address: '20 Upper Circular Rd', category: 'food', latitude: 1.2873, longitude: 103.8465, description: 'Iconic chilli crab restaurant at Clarke Quay' },
  { id: '4', name: 'Tekka Centre', image_url: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&h=400&fit=crop', rating: 4.4, tags: ['hawker', 'indian'], address: '665 Buffalo Rd', category: 'food', latitude: 1.3065, longitude: 103.8521, description: 'Best Indian food in Little India' },
  { id: '5', name: 'Tiong Bahru Market', image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop', rating: 4.5, tags: ['hawker', 'local'], address: '30 Seng Poh Rd', category: 'food', latitude: 1.2848, longitude: 103.8318, description: 'Hipster neighborhood hawker — chwee kueh & kopi' },
  { id: '6', name: '328 Katong Laksa', image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop', rating: 4.7, tags: ['laksa', 'local'], address: '51 East Coast Rd', category: 'food', latitude: 1.3049, longitude: 103.9052, description: 'Rich coconut laksa — eaten with spoon only' },

  // NATURE
  { id: '7', name: 'Gardens by the Bay', image_url: 'https://images.unsplash.com/photo-1506351421178-63b52a2d2562?w=600&h=400&fit=crop', rating: 4.8, tags: ['garden', 'supertrees'], address: '18 Marina Gardens Dr', category: 'nature', latitude: 1.2816, longitude: 103.8636, description: 'Iconic Supertrees, Cloud Forest & Flower Dome' },
  { id: '8', name: 'MacRitchie Reservoir', image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop', rating: 4.6, tags: ['hiking', 'treetop walk'], address: 'MacRitchie Reservoir Park', category: 'nature', latitude: 1.3425, longitude: 103.8333, description: '250m suspension bridge through primary rainforest' },
  { id: '9', name: 'Botanic Gardens', image_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&h=400&fit=crop', rating: 4.7, tags: ['UNESCO', 'free'], address: '1 Cluny Rd', category: 'nature', latitude: 1.3138, longitude: 103.8159, description: 'UNESCO World Heritage — free entry, stunning orchid garden' },
  { id: '10', name: 'Pulau Ubin', image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop', rating: 4.5, tags: ['island', 'cycling'], address: 'Pulau Ubin', category: 'nature', latitude: 1.4044, longitude: 103.9594, description: 'Rustic island escape — rent bikes, explore wetlands' },
  { id: '11', name: 'Henderson Waves', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop', rating: 4.4, tags: ['bridge', 'southern ridges'], address: 'Henderson Rd', category: 'nature', latitude: 1.2717, longitude: 103.8186, description: 'Stunning undulating pedestrian bridge at 36m height' },
  { id: '12', name: 'Singapore Zoo', image_url: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=600&h=400&fit=crop', rating: 4.7, tags: ['wildlife', 'family'], address: '80 Mandai Lake Rd', category: 'nature', latitude: 1.4043, longitude: 103.7930, description: 'Open-concept zoo — breakfast with orangutans' },

  // CULTURE
  { id: '13', name: 'Chinatown Heritage Centre', image_url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop', rating: 4.3, tags: ['museum', 'history'], address: '48 Pagoda St', category: 'culture', latitude: 1.2838, longitude: 103.8443, description: 'Immersive history of early Chinese immigrants' },
  { id: '14', name: 'National Gallery', image_url: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&h=400&fit=crop', rating: 4.6, tags: ['art', 'museum'], address: '1 St Andrew\'s Rd', category: 'culture', latitude: 1.2903, longitude: 103.8517, description: 'World\'s largest collection of Southeast Asian art' },
  { id: '15', name: 'Kampong Glam', image_url: 'https://images.unsplash.com/photo-1562613338-5a9a4a58c483?w=600&h=400&fit=crop', rating: 4.5, tags: ['street art', 'mosque'], address: 'Arab Street', category: 'culture', latitude: 1.3025, longitude: 103.8598, description: 'Sultan Mosque, Haji Lane street art & boutiques' },
  { id: '16', name: 'Peranakan Museum', image_url: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=600&h=400&fit=crop', rating: 4.4, tags: ['museum', 'peranakan'], address: '39 Armenian St', category: 'culture', latitude: 1.2949, longitude: 103.8492, description: 'Beautifully restored museum of Peranakan culture' },
  { id: '17', name: 'Little India', image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&h=400&fit=crop', rating: 4.3, tags: ['heritage', 'vibrant'], address: 'Serangoon Rd', category: 'culture', latitude: 1.3066, longitude: 103.8518, description: 'Colorful streets, temples, spice shops & flower garlands' },
  { id: '18', name: 'Thian Hock Keng Temple', image_url: 'https://images.unsplash.com/photo-1548018560-c7196e91a2dd?w=600&h=400&fit=crop', rating: 4.5, tags: ['temple', 'historic'], address: '158 Telok Ayer St', category: 'culture', latitude: 1.2812, longitude: 103.8479, description: 'Oldest Hokkien temple in Singapore, no nails used' },

  // SHOPPING
  { id: '19', name: 'Orchard Road', image_url: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=600&h=400&fit=crop', rating: 4.4, tags: ['luxury', 'malls'], address: 'Orchard Rd', category: 'shopping', latitude: 1.3048, longitude: 103.8318, description: '2.2km shopping belt — ION, Paragon, Takashimaya' },
  { id: '20', name: 'Haji Lane', image_url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&h=400&fit=crop', rating: 4.5, tags: ['boutique', 'indie'], address: 'Haji Lane', category: 'shopping', latitude: 1.3017, longitude: 103.8594, description: 'Indie boutiques, vintage finds & street art' },
  { id: '21', name: 'Bugis Street Market', image_url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop', rating: 4.1, tags: ['market', 'budget'], address: '3 New Bugis St', category: 'shopping', latitude: 1.2992, longitude: 103.8554, description: 'Cheap clothes, souvenirs & street food stalls' },
  { id: '22', name: 'VivoCity', image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop', rating: 4.3, tags: ['mall', 'waterfront'], address: '1 HarbourFront Walk', category: 'shopping', latitude: 1.2644, longitude: 103.8223, description: 'Largest mall — rooftop sky garden with harbor views' },
  { id: '23', name: 'Jewel Changi', image_url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&h=400&fit=crop', rating: 4.8, tags: ['airport', 'waterfall'], address: '78 Airport Blvd', category: 'shopping', latitude: 1.3604, longitude: 103.9894, description: 'Indoor waterfall, canopy park & 280 shops at the airport' },
  { id: '24', name: 'Mustafa Centre', image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop', rating: 4.2, tags: ['24hr', 'everything'], address: '145 Syed Alwi Rd', category: 'shopping', latitude: 1.3106, longitude: 103.8560, description: '24-hour department store — literally sells everything' },

  // NIGHTLIFE
  { id: '25', name: 'Clarke Quay', image_url: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&h=400&fit=crop', rating: 4.3, tags: ['bars', 'riverside'], address: '3 River Valley Rd', category: 'nightlife', latitude: 1.2908, longitude: 103.8464, description: 'Riverside bars, clubs & live music strip' },
  { id: '26', name: 'Atlas Bar', image_url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop', rating: 4.7, tags: ['gin', 'art deco'], address: '600 North Bridge Rd', category: 'nightlife', latitude: 1.3006, longitude: 103.8604, description: 'Art Deco gin palace — 1,000+ gins, world\'s best bar lists' },
  { id: '27', name: 'Lantern at Fullerton Bay', image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop', rating: 4.6, tags: ['rooftop', 'cocktails'], address: '80 Collyer Quay', category: 'nightlife', latitude: 1.2823, longitude: 103.8535, description: 'Rooftop bar with Marina Bay Sands panorama' },
  { id: '28', name: 'Ann Siang Hill', image_url: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&h=400&fit=crop', rating: 4.4, tags: ['hidden bars', 'chill'], address: 'Ann Siang Hill', category: 'nightlife', latitude: 1.2819, longitude: 103.8456, description: 'Cluster of hidden rooftop bars & speakeasies' },
  { id: '29', name: 'Marina Bay Sands SkyBar', image_url: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=600&h=400&fit=crop', rating: 4.5, tags: ['rooftop', 'iconic'], address: '10 Bayfront Ave', category: 'nightlife', latitude: 1.2834, longitude: 103.8607, description: 'CE LA VI — drinks 57 floors above the city' },
  { id: '30', name: 'Boat Quay', image_url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&h=400&fit=crop', rating: 4.2, tags: ['bars', 'riverside'], address: 'Boat Quay', category: 'nightlife', latitude: 1.2872, longitude: 103.8494, description: 'Historic shophouse bars along the Singapore River' },
];

export const CATEGORY_COLORS: Record<string, string> = {
  food: '#f97316',
  nature: '#22c55e',
  culture: '#8b5cf6',
  shopping: '#ec4899',
  nightlife: '#a855f7',
  arts: '#06b6d4',
  architecture: '#64748b',
  neighbourhood: '#14b8a6',
  attractions: '#eab308',
};

export const CATEGORY_LABELS: Record<string, string> = {
  food: 'Food',
  nature: 'Nature',
  culture: 'Culture',
  shopping: 'Shopping',
  nightlife: 'Nightlife',
  arts: 'Arts',
  architecture: 'Architecture',
  neighbourhood: 'Neighbourhood',
  attractions: 'Attractions',
};
