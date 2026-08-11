import React, { useState } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow, 
  useAdvancedMarkerRef 
} from '@vis.gl/react-google-maps';
import { 
  Star, 
  MapPin, 
  Navigation, 
  Sparkles, 
  Layers, 
  X, 
  Palmtree, 
  Waves, 
  Building2, 
  UtensilsCrossed, 
  Film, 
  Wine, 
  ShoppingBag, 
  Trees 
} from 'lucide-react';
import { CategoryType, Destination, Venue } from '../types';

interface Props {
  center: { lat: number; lng: number };
  venues: Venue[];
  selectedVenue: Venue | null;
  onSelectVenue: (venue: Venue) => void;
  onGetDirections: (venue: Venue) => void;
  selectedCategory: CategoryType;
}

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export const MapView: React.FC<Props> = ({
  center,
  venues,
  selectedVenue,
  onSelectVenue,
  onGetDirections,
  selectedCategory,
}) => {
  const [activeMarkerVenue, setActiveMarkerVenue] = useState<Venue | null>(selectedVenue);

  const getPinColor = (category: CategoryType) => {
    switch (category) {
      case 'beaches': return '#06b6d4'; // Cyan
      case 'hostels': return '#f59e0b'; // Amber/Gold
      case 'seafood': return '#f97316'; // Orange
      case 'resorts': return '#10b981'; // Emerald
      case 'hotels': return '#059669'; // Teal
      case 'cinemas': return '#ec4899'; // Pink
      case 'nightlife': return '#8b5cf6'; // Purple
      case 'malls': return '#a855f7'; // Violet
      case 'parks': return '#22c55e'; // Green
      default: return '#14b8a6'; // Teal
    }
  };

  // If live Google Maps API Key exists, render official Google Maps SDK
  if (hasValidKey) {
    return (
      <div className="relative w-full h-[calc(100vh-10rem)] min-h-[500px] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl">
        <APIProvider apiKey={API_KEY} version="weekly">
          <Map
            defaultCenter={center}
            center={center}
            defaultZoom={13}
            mapId="VACATION_HUB_MAP"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            style={{ width: '100%', height: '100%' }}
          >
            {venues.map((venue) => (
              <AdvancedMarker
                key={venue.id}
                position={venue.location}
                onClick={() => {
                  setActiveMarkerVenue(venue);
                  onSelectVenue(venue);
                }}
              >
                <Pin
                  background={venue.isSponsored ? '#f59e0b' : getPinColor(venue.category)}
                  glyphColor="#ffffff"
                  borderColor="#ffffff"
                />
              </AdvancedMarker>
            ))}

            {activeMarkerVenue && (
              <InfoWindow
                position={activeMarkerVenue.location}
                onCloseClick={() => setActiveMarkerVenue(null)}
              >
                <div className="p-1 max-w-xs font-sans text-slate-900">
                  <img
                    src={activeMarkerVenue.image}
                    alt={activeMarkerVenue.name}
                    className="w-full h-24 object-cover rounded-xl mb-2"
                  />
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600 mb-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    {activeMarkerVenue.rating.toFixed(1)} ({activeMarkerVenue.reviewCount})
                  </div>
                  <h4 className="font-extrabold text-sm line-clamp-1">{activeMarkerVenue.name}</h4>
                  <p className="text-[11px] text-slate-500 mb-2">{activeMarkerVenue.distance} • {activeMarkerVenue.categoryLabel}</p>
                  <button
                    onClick={() => onGetDirections(activeMarkerVenue)}
                    className="w-full py-1.5 bg-teal-600 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1"
                  >
                    <Navigation className="w-3 h-3" /> Get Directions
                  </button>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>
    );
  }

  // Fallback Interactive Canvas Map if API Key not provided yet
  return (
    <div className="relative w-full h-[calc(100vh-10rem)] min-h-[500px] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      
      {/* Decorative Interactive Grid Canvas */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      
      {/* Floating Simulated Map Pins */}
      <div className="relative w-full h-full max-w-4xl max-h-[500px] border border-slate-800 rounded-2xl bg-slate-950/60 backdrop-blur-sm overflow-hidden flex items-center justify-center">
        
        {/* Ocean / Shoreline visual accents */}
        <div className="absolute -left-20 inset-y-0 w-1/3 bg-cyan-950/30 border-r border-cyan-500/20 flex items-center justify-center">
          <span className="text-cyan-500/30 text-xs font-bold uppercase tracking-widest -rotate-90">
            Coastal Horizon
          </span>
        </div>

        {/* Center Target Indicator */}
        <div className="absolute w-8 h-8 rounded-full border border-teal-500/40 bg-teal-500/10 flex items-center justify-center animate-ping pointer-events-none" />

        {/* Render Venues as Pins on Interactive Canvas */}
        {venues.map((venue, idx) => {
          // Calculate relative offsets for visual display on map
          const xOffset = ((idx * 27) % 70) + 15;
          const yOffset = ((idx * 33) % 70) + 15;
          const isSelected = activeMarkerVenue?.id === venue.id;

          return (
            <div
              key={venue.id}
              onClick={() => {
                setActiveMarkerVenue(venue);
                onSelectVenue(venue);
              }}
              style={{ left: `${xOffset}%`, top: `${yOffset}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
            >
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-2xl transition-all duration-300 border ${
                  isSelected
                    ? 'scale-125 ring-4 ring-teal-400 bg-teal-500 text-white font-black z-30'
                    : 'bg-slate-900/90 text-slate-100 hover:scale-110 border-slate-700'
                }`}
                style={{
                  borderColor: venue.isSponsored ? '#f59e0b' : getPinColor(venue.category)
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: venue.isSponsored ? '#f59e0b' : getPinColor(venue.category) }}
                />
                <span className="text-xs font-extrabold max-w-[100px] truncate">
                  {venue.name}
                </span>
              </div>
            </div>
          );
        })}

        {/* Selected Venue Preview Floating Card */}
        {activeMarkerVenue && (
          <div className="absolute bottom-4 inset-x-4 max-w-sm mx-auto bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-4 duration-200 z-40">
            <button
              onClick={() => setActiveMarkerVenue(null)}
              className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex gap-3 items-center">
              <img
                src={activeMarkerVenue.image}
                alt={activeMarkerVenue.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 truncate">
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400 mb-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {activeMarkerVenue.rating.toFixed(1)} ({activeMarkerVenue.reviewCount})
                </div>
                <h4 className="font-extrabold text-sm text-white truncate">{activeMarkerVenue.name}</h4>
                <p className="text-xs text-slate-400">{activeMarkerVenue.distance} • {activeMarkerVenue.categoryLabel}</p>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onGetDirections(activeMarkerVenue)}
                className="flex-1 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md"
              >
                <Navigation className="w-3.5 h-3.5" />
                Navigate Route
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Helper Footer Note */}
      <div className="absolute top-4 left-4 z-30 px-3 py-1.5 bg-slate-950/80 backdrop-blur-md rounded-full border border-slate-800 text-[11px] text-teal-400 font-bold flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5" />
        Interactive Leisure Map ({venues.length} Filtered Spots)
      </div>

    </div>
  );
};
