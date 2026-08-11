import React from 'react';
import { X, Heart, MapPin, Star, Trash2, Navigation, ArrowRight } from 'lucide-react';
import { Venue } from '../types';

interface Props {
  savedVenues: Venue[];
  onClose: () => void;
  onRemove: (venue: Venue) => void;
  onSelectVenue: (venue: Venue) => void;
  onGetDirections: (venue: Venue) => void;
}

export const SavedTripsDrawer: React.FC<Props> = ({
  savedVenues,
  onClose,
  onRemove,
  onSelectVenue,
  onGetDirections,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-250"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-500">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Saved Vacation Spots
                </h3>
                <p className="text-xs text-slate-400">
                  {savedVenues.length} {savedVenues.length === 1 ? 'place' : 'places'} saved for your trip
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of Saved Spots */}
          <div className="space-y-3 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
            {savedVenues.length > 0 ? (
              savedVenues.map((venue) => (
                <div
                  key={venue.id}
                  onClick={() => onSelectVenue(venue)}
                  className="group relative p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 transition flex items-center gap-3.5 cursor-pointer"
                >
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />

                  <div className="flex-1 truncate">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                      <Star className="w-3 h-3 fill-amber-500" />
                      {venue.rating.toFixed(1)}
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {venue.name}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">
                      {venue.distance} • {venue.categoryLabel}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onGetDirections(venue);
                      }}
                      className="p-2 rounded-xl bg-teal-500/10 text-teal-600 hover:bg-teal-500/20 transition"
                      title="Route to Spot"
                    >
                      <Navigation className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(venue);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">
                  No spots saved yet
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Tap the heart icon on any venue card while exploring to bookmark your top spots!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-2xl transition"
          >
            Close Saved Spots
          </button>
        </div>

      </div>
    </div>
  );
};
