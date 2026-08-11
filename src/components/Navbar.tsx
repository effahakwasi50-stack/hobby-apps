import React, { useState, useMemo, useEffect } from 'react';
import { 
  Palmtree, 
  MapPin, 
  Search, 
  Sparkles, 
  Heart, 
  Map as MapIcon, 
  LayoutGrid, 
  ChevronDown, 
  Navigation,
  X,
  Code2,
  Plus,
  ArrowRight,
  Globe,
  MapPinOff,
  ExternalLink
} from 'lucide-react';
import { Destination, Venue } from '../types';
import { searchGooglePlaces } from '../services/googlePlacesService';

interface Props {
  destinations: Destination[];
  allVenues: Venue[];
  selectedDestination: Destination;
  onSelectDestination: (dest: Destination) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenAI: () => void;
  onOpenDeveloperPortal: () => void;
  activeView: 'feed' | 'map';
  onToggleView: (view: 'feed' | 'map') => void;
  onUseMyLocation?: () => void;
  isUsingGPS?: boolean;
  onSelectVenue?: (venue: Venue) => void;
  onAddGooglePlaceVenue?: (venue: Venue) => void;
}

export const Navbar: React.FC<Props> = ({
  destinations,
  allVenues,
  selectedDestination,
  onSelectDestination,
  searchQuery,
  onSearchChange,
  savedCount,
  onOpenSaved,
  onOpenAI,
  onOpenDeveloperPortal,
  activeView,
  onToggleView,
  onUseMyLocation,
  isUsingGPS,
  onSelectVenue,
  onAddGooglePlaceVenue,
}) => {
  const [isDestMenuOpen, setIsDestMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [googlePlacesResults, setGooglePlacesResults] = useState<Venue[]>([]);
  const [isSearchingGaps, setIsSearchingGaps] = useState(false);

  // Search auto-suggestions from local curated dataset
  const matchingDestinations = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return destinations.filter(
      (d) => d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)
    );
  }, [destinations, searchQuery]);

  const matchingVenues = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allVenues
      .filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.categoryLabel.toLowerCase().includes(q) ||
          v.address.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [allVenues, searchQuery]);

  // Live Google Places Search Pairing
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setGooglePlacesResults([]);
      setIsSearchingGaps(false);
      return;
    }

    let isMounted = true;
    setIsSearchingGaps(true);

    const timer = setTimeout(() => {
      searchGooglePlaces(searchQuery, selectedDestination.name, selectedDestination.center)
        .then((gResults) => {
          if (isMounted) {
            setGooglePlacesResults(gResults);
            setIsSearchingGaps(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsSearchingGaps(false);
        });
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, selectedDestination]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Destination Picker */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* VacationHub Brand Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/25">
                <Palmtree className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="hidden xs:block">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  Vacation<span className="text-rose-500">Hub</span>
                </span>
                <span className="block text-[10px] font-extrabold tracking-wider text-rose-500 uppercase -mt-1">
                  Ghana Leisure
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            {/* Destination Selector Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setIsDestMenuOpen(!isDestMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-extrabold text-xs sm:text-sm rounded-2xl transition border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" />
                <span className="max-w-[100px] sm:max-w-[160px] truncate">{selectedDestination.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDestMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Destination Dropdown Modal */}
              {isDestMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                    <span>Ghana Central Hubs</span>
                    <Globe className="w-3.5 h-3.5 text-rose-500" />
                  </div>
                  
                  <div className="space-y-1 max-h-80 overflow-y-auto no-scrollbar">
                    {destinations.map((dest) => (
                      <button
                        key={dest.id}
                        onClick={() => {
                          onSelectDestination(dest);
                          setIsDestMenuOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-2xl flex items-center gap-3 transition ${
                          selectedDestination.id === dest.id
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold'
                        }`}
                      >
                        <img src={dest.image} alt={dest.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                        <div className="truncate flex-1">
                          <div className="text-xs flex items-center gap-1.5 truncate">
                            <span>{dest.name}</span>
                            {dest.isCustom && (
                              <span className="text-[9px] px-1.5 py-0.2 bg-rose-500/10 text-rose-500 rounded font-bold">Custom</span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">{dest.country}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Search Input paired with Google Maps Places */}
          <div className="hidden md:flex flex-1 max-w-md mx-2 relative">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search everywhere: Labadi beach, Buka, Kempinski, Kumasi City Mall, hostels..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-100/90 dark:bg-slate-800/90 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm rounded-full border border-slate-200 dark:border-slate-700 focus:border-rose-500 dark:focus:border-rose-400 focus:outline-none transition-all shadow-inner font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Instant Search Suggestions Dropdown */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 space-y-3 animate-in fade-in duration-150 max-h-[420px] overflow-y-auto no-scrollbar">
                
                {/* Matching Destinations */}
                {matchingDestinations.length > 0 && (
                  <div>
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1 px-2">
                      Matching Ghana Central Hubs
                    </div>
                    <div className="space-y-1">
                      {matchingDestinations.map((d) => (
                        <button
                          key={d.id}
                          onClick={() => {
                            onSelectDestination(d);
                            onSearchChange('');
                            setIsSearchFocused(false);
                          }}
                          className="w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center justify-between text-xs font-bold transition"
                        >
                          <div className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-rose-500" />
                            <span>{d.name} ({d.country})</span>
                          </div>
                          <span className="text-[10px] text-rose-500 flex items-center gap-0.5">
                            Switch <ArrowRight className="w-3 h-3" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching Curated Spots */}
                {matchingVenues.length > 0 && (
                  <div>
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1 px-2">
                      Curated Leisure Spots ({matchingVenues.length})
                    </div>
                    <div className="space-y-1">
                      {matchingVenues.map((v) => (
                        <div
                          key={v.id}
                          onClick={() => {
                            if (onSelectVenue) onSelectVenue(v);
                            setIsSearchFocused(false);
                          }}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2.5 text-xs transition cursor-pointer"
                        >
                          <img src={v.image} alt={v.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div className="truncate flex-1">
                            <div className="font-extrabold text-slate-900 dark:text-white truncate">{v.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">{v.categoryLabel} • {v.address}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Live Google Maps Places Search Results */}
                {googlePlacesResults.length > 0 && (
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
                    <div className="text-[10px] font-black uppercase text-teal-500 dark:text-teal-400 tracking-wider mb-1.5 px-2 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-teal-500" />
                        Google Maps Live Places ({selectedDestination.name})
                      </span>
                      <span className="text-[9px] bg-teal-500/10 px-1.5 py-0.5 rounded text-teal-600 font-bold">Maps API</span>
                    </div>
                    <div className="space-y-1">
                      {googlePlacesResults.map((gv) => (
                        <div
                          key={gv.id}
                          onClick={() => {
                            if (onAddGooglePlaceVenue) onAddGooglePlaceVenue(gv);
                            if (onSelectVenue) onSelectVenue(gv);
                            setIsSearchFocused(false);
                          }}
                          className="p-2 hover:bg-teal-50 dark:hover:bg-teal-950/30 rounded-xl flex items-center gap-2.5 text-xs transition cursor-pointer border border-teal-500/20"
                        >
                          <img src={gv.image} alt={gv.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                          <div className="truncate flex-1">
                            <div className="font-extrabold text-slate-900 dark:text-white truncate flex items-center gap-1">
                              <span>{gv.name}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{gv.address}</div>
                          </div>
                          <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/50 px-2 py-0.5 rounded-full shrink-0">
                            Add to Map
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isSearchingGaps && (
                  <div className="p-2 text-center text-xs text-teal-500 flex items-center justify-center gap-2 font-bold">
                    <div className="w-3 h-3 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    Searching Google Maps across {selectedDestination.name}...
                  </div>
                )}

                {matchingDestinations.length === 0 && matchingVenues.length === 0 && googlePlacesResults.length === 0 && !isSearchingGaps && (
                  <div className="p-3 text-center text-xs text-slate-400">
                    Searching everywhere in {selectedDestination.name} for "{searchQuery}"...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions & Developer Space Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Developer Space Button */}
            <button
              onClick={onOpenDeveloperPortal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-extrabold text-xs sm:text-sm shadow-md transition active:scale-95 border border-slate-700 dark:border-slate-200"
              title="Developer Studio: Add custom locations in Ghana"
            >
              <Code2 className="w-4 h-4 text-rose-500" />
              <span className="hidden lg:inline">Dev Studio</span>
              <span className="lg:hidden text-[10px] px-1 bg-rose-500 text-white rounded font-bold">+</span>
            </button>

            {/* AI Concierge Trigger */}
            <button
              onClick={onOpenAI}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-rose-500/20 transition active:scale-95"
            >
              <Sparkles className="w-4 h-4 fill-white/20 animate-pulse" />
              <span className="hidden sm:inline">AI Planner</span>
            </button>

            {/* Saved Spots Trigger */}
            <button
              onClick={onOpenSaved}
              className="relative p-2.5 sm:px-3.5 sm:py-2 rounded-full bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-extrabold transition flex items-center gap-1.5 border border-slate-200/80 dark:border-slate-700"
            >
              <Heart className={`w-4 h-4 ${savedCount > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Saved</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-black rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            {/* View Switcher: Feed / Map */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200/80 dark:border-slate-700">
              <button
                onClick={() => onToggleView('feed')}
                className={`p-1.5 sm:px-3 sm:py-1 rounded-full text-xs font-black transition flex items-center gap-1 ${
                  activeView === 'feed'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Feed</span>
              </button>
              <button
                onClick={() => onToggleView('map')}
                className={`p-1.5 sm:px-3 sm:py-1 rounded-full text-xs font-black transition flex items-center gap-1 ${
                  activeView === 'map'
                    ? 'bg-white dark:bg-slate-900 text-rose-500 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Map</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
