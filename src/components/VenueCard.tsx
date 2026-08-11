import React from 'react';
import { 
  Star, 
  MapPin, 
  Heart, 
  Sparkles, 
  Clock, 
  Navigation,
  ArrowUpRight
} from 'lucide-react';
import { Venue } from '../types';

interface Props {
  venue: Venue;
  isSaved?: boolean;
  onToggleSave?: (venue: Venue) => void;
  onClick?: (venue: Venue) => void;
  onGetDirections?: (venue: Venue) => void;
}

export const VenueCard: React.FC<Props> = ({
  venue,
  isSaved = false,
  onToggleSave,
  onClick,
  onGetDirections,
}) => {
  return (
    <div
      onClick={() => onClick && onClick(venue)}
      className="group relative bg-white dark:bg-slate-800/90 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700/60 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Photo Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={venue.image}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Top Gradient Overlay */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />

        {/* Category Pill / Native Sponsored Tag */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
          {venue.isSponsored ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/90 backdrop-blur-md text-slate-950 font-extrabold text-[11px] tracking-wide uppercase rounded-full shadow-lg shadow-amber-500/20 border border-amber-300/40">
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              Sponsored
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 bg-black/40 backdrop-blur-md text-white font-semibold text-xs rounded-full border border-white/20">
              {venue.categoryLabel}
            </span>
          )}

          {/* Open/Closed Badge */}
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 backdrop-blur-md font-bold text-[11px] rounded-full border ${
            venue.isOpenNow
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
              : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${venue.isOpenNow ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            {venue.isOpenNow ? 'Open Now' : 'Closed'}
          </span>
        </div>

        {/* Save / Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleSave) onToggleSave(venue);
          }}
          className="absolute top-3.5 right-3.5 p-2.5 rounded-full bg-white/20 hover:bg-white/40 dark:bg-slate-900/40 dark:hover:bg-slate-900/60 backdrop-blur-md text-white border border-white/30 transition-transform active:scale-90 shadow-md"
          title={isSaved ? 'Remove from Saved' : 'Save to Trip'}
        >
          <Heart className={`w-4 h-4 transition-colors ${isSaved ? 'text-rose-500 fill-rose-500' : 'text-white'}`} />
        </button>

        {/* Distance Badge on Photo Bottom */}
        <div className="absolute bottom-3 left-3.5 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold rounded-xl border border-white/10">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            {venue.distance}
          </span>
          {venue.priceLevel && (
            <span className="inline-flex items-center px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-amber-300 text-xs font-extrabold rounded-xl border border-white/10">
              {venue.priceLevel}
            </span>
          )}
        </div>
      </div>

      {/* Details Area */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          {/* Title & Star Rating */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
              {venue.name}
            </h3>
            
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg shrink-0 border border-amber-200/50 dark:border-amber-800/50">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-black text-amber-900 dark:text-amber-200">
                {venue.rating.toFixed(1)}
              </span>
              <span className="text-[10px] text-amber-700/70 dark:text-amber-400/70 font-medium">
                ({venue.reviewCount})
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
            {venue.description}
          </p>

          {/* Address */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-3 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{venue.address}</span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between gap-2 mt-auto">
          <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 group-hover:underline inline-flex items-center gap-1">
            Explore Spot <ArrowUpRight className="w-3.5 h-3.5" />
          </span>

          {onGetDirections && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onGetDirections(venue);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-bold text-xs transition"
            >
              <Navigation className="w-3.5 h-3.5 text-teal-500" />
              Route
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
