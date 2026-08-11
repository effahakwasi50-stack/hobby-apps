export type CategoryType = 
  | 'all'
  | 'beaches'
  | 'restaurants'
  | 'hotels'
  | 'hostels'
  | 'resorts'
  | 'nightlife'
  | 'parks'
  | 'cinemas'
  | 'malls'
  | 'seafood';

export interface Location {
  lat: number;
  lng: number;
  city: string;
  state?: string;
  country: string;
  address?: string;
}

export interface Review {
  id: string;
  authorName: string;
  authorPhoto?: string;
  rating: number;
  relativeTime: string;
  text: string;
}

export interface Venue {
  id: string;
  name: string;
  category: CategoryType;
  categoryLabel: string;
  rating: number;
  reviewCount: number;
  priceLevel?: string; // '$', '$$', '$$$', '$$$$'
  distance: string; // e.g., '0.4 mi'
  distanceKm: number;
  address: string;
  location: { lat: number; lng: number };
  image: string;
  images: string[];
  description: string;
  isOpenNow: boolean;
  openingHours?: string;
  phone?: string;
  website?: string;
  amenities: string[];
  reviews: Review[];
  isSponsored?: boolean;
  sponsorName?: string;
  sponsorBadgeText?: string;
  isCustom?: boolean;
  isGoogleMapsPlace?: boolean;
  googlePlaceId?: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  tagline: string;
  center: { lat: number; lng: number };
  image: string;
  isCustom?: boolean;
}

export interface AIItineraryItem {
  time: string;
  title: string;
  description: string;
  venueName?: string;
  category?: CategoryType;
  tip?: string;
}

export interface AIItineraryResponse {
  dayTitle: string;
  summary: string;
  items: AIItineraryItem[];
  insiderTips: string[];
}
