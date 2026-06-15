export type Category = 'food' | 'nature' | 'culture' | 'shopping' | 'nightlife' | 'arts' | 'architecture' | 'neighbourhood' | 'attractions';

export interface Place {
  id: string;
  name: string;
  image_url: string;
  rating: number;
  tags: string[];
  address: string;
  category: Category;
  latitude: number;
  longitude: number;
  description?: string;
}

export interface ItineraryDay {
  id: string;
  label: string;
  places: Place[];
}
