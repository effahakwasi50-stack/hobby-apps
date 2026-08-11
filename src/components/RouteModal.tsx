import React, { useState } from 'react';
import { 
  X, 
  Navigation, 
  Car, 
  Footprints, 
  Bus, 
  Clock, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  Compass
} from 'lucide-react';
import { Venue } from '../types';

interface Props {
  venue: Venue | null;
  userLocationName?: string;
  onClose: () => void;
}

export const RouteModal: React.FC<Props> = ({
  venue,
  userLocationName = 'Your Current Arrival Location',
  onClose,
}) => {
  if (!venue) return null;

  const [travelMode, setTravelMode] = useState<'driving' | 'walking' | 'transit'>('driving');

  const distKm = venue.distanceKm || 1.2;

  // Calculate estimated time
  const getEstTime = () => {
    switch (travelMode) {
      case 'driving':
        return `${Math.max(2, Math.round(distKm * 2.5))} mins`;
      case 'walking':
        return `${Math.max(5, Math.round(distKm * 18))} mins`;
      case 'transit':
        return `${Math.max(6, Math.round(distKm * 6))} mins`;
    }
  };

  const getSteps = () => {
    switch (travelMode) {
      case 'driving':
        return [
          `Head south toward main boulevard`,
          `Merge onto coastal avenue toward ${venue.name}`,
          `Drive 0.3 miles past the palm grove`,
          `Destination will be on your right (${venue.address})`
        ];
      case 'walking':
        return [
          `Walk through pedestrian beach promenade`,
          `Pass the coconut grove walkway`,
          `Cross safely at pedestrian seaside signal`,
          `Arrive at ${venue.name}`
        ];
      case 'transit':
        return [
          `Board Beach Shuttle Route #1 at Resort Loop`,
          `Ride 2 stops along coastal boulevard`,
          `Exit at ${venue.name} Plaza Stop`
        ];
    }
  };

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${venue.name}, ${venue.address}`
  )}&travelmode=${travelMode}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-5 overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/10 text-teal-500 rounded-2xl shrink-0">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Route & Navigation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live distance and arrival estimate
            </p>
          </div>
        </div>

        {/* Destination Card Preview */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <img
            src={venue.image}
            alt={venue.name}
            className="w-14 h-14 rounded-xl object-cover shrink-0"
          />
          <div className="truncate">
            <div className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
              {venue.name}
            </div>
            <div className="text-xs text-slate-500 truncate">{venue.address}</div>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setTravelMode('driving')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition ${
              travelMode === 'driving'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <Car className="w-4 h-4" /> Drive
          </button>
          <button
            onClick={() => setTravelMode('walking')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition ${
              travelMode === 'walking'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <Footprints className="w-4 h-4" /> Walk
          </button>
          <button
            onClick={() => setTravelMode('transit')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition ${
              travelMode === 'transit'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <Bus className="w-4 h-4" /> Transit
          </button>
        </div>

        {/* Travel Summary Stats */}
        <div className="flex items-center justify-between p-4 bg-teal-500/10 rounded-2xl border border-teal-500/20 text-teal-900 dark:text-teal-200">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-500" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Estimated Time
              </div>
              <div className="text-lg font-black">{getEstTime()}</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Distance
            </div>
            <div className="text-lg font-black">{venue.distance}</div>
          </div>
        </div>

        {/* Route Steps Preview */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Route Guidance
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {getSteps().map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-500 font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Open in Google Maps */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-teal-500/25 transition active:scale-95"
        >
          <Navigation className="w-4 h-4" />
          Start GPS Navigation in Google Maps
          <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
        </a>

      </div>
    </div>
  );
};
