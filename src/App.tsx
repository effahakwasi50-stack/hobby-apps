import React, { useState, useMemo, useEffect } from 'react';
import { 
  Palmtree, 
  MapPin, 
  Sparkles, 
  Compass, 
  Search, 
  ArrowRight, 
  ShieldCheck,
  Building2,
  Waves,
  UtensilsCrossed,
  Globe,
  Code2,
  Plus
} from 'lucide-react';
import { CategoryType, Destination, Review, Venue } from './types';
import { POPULAR_DESTINATIONS, MOCK_VENUES } from './data/destinationsAndVenues';
import { filterLeisureVenues, calculateDistanceMiles } from './services/placesService';
import { Navbar } from './components/Navbar';
import { CategoryChips } from './components/CategoryChips';
import { VenueCard } from './components/VenueCard';
import { VenueDetailModal } from './components/VenueDetailModal';
import { MapView } from './components/MapView';
import { RouteModal } from './components/RouteModal';
import { AIConciergeModal } from './components/AIConciergeModal';
import { SavedTripsDrawer } from './components/SavedTripsDrawer';
import { DeveloperPortalModal } from './components/DeveloperPortalModal';
import { BottomNav } from './components/BottomNav';
import { ApiKeyBanner } from './components/ApiKeyBanner';

export default function App() {
  // Custom Developer Destinations loaded from localStorage
  const [customDestinations, setCustomDestinations] = useState<Destination[]>(() => {
    try {
      const stored = localStorage.getItem('vacation_hub_custom_destinations');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Custom Developer Venues loaded from localStorage
  const [customVenues, setCustomVenues] = useState<Record<string, Venue[]>>(() => {
    try {
      const stored = localStorage.getItem('vacation_hub_custom_venues');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // All combined destinations (Built-in Popular + Developer Added)
  const allDestinations = useMemo(() => {
    return [...POPULAR_DESTINATIONS, ...customDestinations];
  }, [customDestinations]);

  const [selectedDestination, setSelectedDestination] = useState<Destination>(allDestinations[0]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'feed' | 'map'>('feed');
  const [isUsingGPS, setIsUsingGPS] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Modal States
  const [activeVenueDetail, setActiveVenueDetail] = useState<Venue | null>(null);
  const [activeRouteVenue, setActiveRouteVenue] = useState<Venue | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isDeveloperPortalOpen, setIsDeveloperPortalOpen] = useState(false);
  const [showApiKeyBanner, setShowApiKeyBanner] = useState(true);

  // Saved Favorites State
  const [savedVenueIds, setSavedVenueIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('vacation_hub_saved');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Merged Venues Data (Mock Venues + Custom Developer Venues)
  const venuesData = useMemo(() => {
    const merged: Record<string, Venue[]> = { ...MOCK_VENUES };
    Object.entries(customVenues).forEach(([destId, vList]) => {
      merged[destId] = [...(merged[destId] || []), ...(vList as Venue[])];
    });
    return merged;
  }, [customVenues]);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vacation_hub_saved', JSON.stringify(savedVenueIds));
    } catch (e) {
      console.warn('localStorage save failed:', e);
    }
  }, [savedVenueIds]);

  useEffect(() => {
    try {
      localStorage.setItem('vacation_hub_custom_destinations', JSON.stringify(customDestinations));
    } catch (e) {
      console.warn('localStorage save custom destinations failed:', e);
    }
  }, [customDestinations]);

  useEffect(() => {
    try {
      localStorage.setItem('vacation_hub_custom_venues', JSON.stringify(customVenues));
    } catch (e) {
      console.warn('localStorage save custom venues failed:', e);
    }
  }, [customVenues]);

  // Handle Developer Adding Custom Destination
  const handleAddDestination = (newDest: Destination) => {
    setCustomDestinations((prev) => [newDest, ...prev]);
    setSelectedDestination(newDest);
  };

  // Handle Developer Adding Custom Venue
  const handleAddVenue = (destinationId: string, newVenue: Venue) => {
    setCustomVenues((prev) => ({
      ...prev,
      [destinationId]: [newVenue, ...(prev[destinationId] || [])],
    }));
  };

  // Delete Developer Custom Destination
  const handleDeleteCustomDestination = (id: string) => {
    setCustomDestinations((prev) => prev.filter((d) => d.id !== id));
    if (selectedDestination.id === id) {
      setSelectedDestination(POPULAR_DESTINATIONS[0]);
    }
  };

  // Delete Developer Custom Venue
  const handleDeleteCustomVenue = (destId: string, venueId: string) => {
    setCustomVenues((prev) => ({
      ...prev,
      [destId]: (prev[destId] || []).filter((v) => v.id !== venueId),
    }));
  };

  // Handle GPS location trigger
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setIsUsingGPS(true);

        setSelectedDestination({
          id: 'gps-current',
          name: 'Your Current Location',
          country: 'Live GPS Spot',
          tagline: 'Discovering leisure spots near your live GPS location',
          center: coords,
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        });
      },
      (err) => {
        alert(`Geolocation error: ${err.message}. Using selected destination.`);
      }
    );
  };

  // Flat list of ALL venues worldwide across all destinations
  const allVenuesWorldwide = useMemo(() => {
    return (Object.values(venuesData) as Venue[][]).flat();
  }, [venuesData]);

  // Current raw venues for selected destination
  const rawVenues = useMemo(() => {
    if (isUsingGPS && userCoords) {
      return allVenuesWorldwide.map((v) => {
        const dist = calculateDistanceMiles(userCoords.lat, userCoords.lng, v.location.lat, v.location.lng);
        return {
          ...v,
          distance: `${dist} mi`,
          distanceKm: Math.round(dist * 1.609 * 10) / 10,
        };
      });
    }
    return venuesData[selectedDestination.id] || venuesData['accra'] || [];
  }, [selectedDestination, isUsingGPS, userCoords, venuesData, allVenuesWorldwide]);

  // Apply Strict Filtration (Excluding schools, banks, business centers, corporate offices, hospitals)
  const leisureFilteredVenues = useMemo(() => {
    return filterLeisureVenues(rawVenues);
  }, [rawVenues]);

  // Search results logic: Search within current city AND across all worldwide cities
  const displayVenues = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    // If search matches other destinations globally and current city has no match, offer global search
    return leisureFilteredVenues.filter((v) => {
      // Category Filter
      const matchesCat =
        selectedCategory === 'all'
          ? true
          : v.category === selectedCategory ||
            (selectedCategory === 'seafood' && (v.category === 'seafood' || v.name.toLowerCase().includes('seafood'))) ||
            (selectedCategory === 'resorts' && (v.category === 'resorts' || v.category === 'hotels'));

      // Search Query
      const matchesSearch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.categoryLabel.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.address.toLowerCase().includes(q) ||
        (v.amenities && v.amenities.some((a) => a.toLowerCase().includes(q)));

      return matchesCat && matchesSearch;
    });
  }, [leisureFilteredVenues, selectedCategory, searchQuery]);

  // Global search matches across ALL destinations if local search is empty
  const globalSearchVenues = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q || displayVenues.length > 0) return [];

    return allVenuesWorldwide.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.categoryLabel.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.address.toLowerCase().includes(q)
    );
  }, [searchQuery, displayVenues.length, allVenuesWorldwide]);

  // Horizontal Curated Showcase Lists
  const seafoodSpots = useMemo(() => {
    return leisureFilteredVenues.filter((v) => v.category === 'seafood' || v.category === 'restaurants');
  }, [leisureFilteredVenues]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: leisureFilteredVenues.length };
    leisureFilteredVenues.forEach((v) => {
      counts[v.category] = (counts[v.category] || 0) + 1;
    });
    return counts;
  }, [leisureFilteredVenues]);

  // Toggle Save Favorite
  const handleToggleSave = (venue: Venue) => {
    setSavedVenueIds((prev) =>
      prev.includes(venue.id) ? prev.filter((id) => id !== venue.id) : [...prev, venue.id]
    );
  };

  // Add Review handler
  const handleAddReview = (venueId: string, review: Review) => {
    const destKey = selectedDestination.id in customVenues ? selectedDestination.id : 'honolulu';
    setCustomVenues((prev) => {
      const list = prev[destKey] || [];
      const updated = list.map((v) => {
        if (v.id === venueId) {
          return {
            ...v,
            reviewCount: v.reviewCount + 1,
            reviews: [review, ...(v.reviews || [])],
          };
        }
        return v;
      });
      return { ...prev, [destKey]: updated };
    });
  };

  // All saved venues list
  const savedVenues = useMemo(() => {
    return allVenuesWorldwide.filter((v) => savedVenueIds.includes(v.id));
  }, [allVenuesWorldwide, savedVenueIds]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-20 sm:pb-8 transition-colors selection:bg-rose-500 selection:text-white">
      
      {/* Optional Google Maps API Key Setup Banner */}
      {showApiKeyBanner && (
        <ApiKeyBanner onDismiss={() => setShowApiKeyBanner(false)} />
      )}

      {/* Main Header Navbar */}
      <Navbar
        destinations={allDestinations}
        allVenues={allVenuesWorldwide}
        selectedDestination={selectedDestination}
        onSelectDestination={(dest) => {
          setSelectedDestination(dest);
          setIsUsingGPS(false);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        savedCount={savedVenueIds.length}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenAI={() => setIsAIModalOpen(true)}
        onOpenDeveloperPortal={() => setIsDeveloperPortalOpen(true)}
        activeView={activeView}
        onToggleView={setActiveView}
        onUseMyLocation={handleUseMyLocation}
        isUsingGPS={isUsingGPS}
        onSelectVenue={(v) => setActiveVenueDetail(v)}
        onAddGooglePlaceVenue={(gv) => {
          handleAddVenue(selectedDestination.id, gv);
          setActiveVenueDetail(gv);
        }}
      />

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Destination Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="relative aspect-[21/9] sm:aspect-[24/8] w-full min-h-[220px] bg-slate-900">
            <img
              src={selectedDestination.image}
              alt={selectedDestination.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-transparent flex flex-col justify-end p-6 sm:p-10">
              
              {/* Developer / Pure Leisure Badges */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 font-black text-[10px] uppercase tracking-wider rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Pure Leisure Mode: 0 Schools, Banks or Offices
                </div>

                <button
                  onClick={() => setIsDeveloperPortalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 backdrop-blur-md border border-rose-400/40 text-rose-300 font-black text-[10px] uppercase tracking-wider rounded-full transition"
                >
                  <Code2 className="w-3.5 h-3.5 text-rose-400" />
                  Developer Portal: Add Ghana Spots
                </button>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-2">
                {selectedDestination.name}
              </h1>
              <p className="text-xs sm:text-base text-slate-200/90 max-w-xl font-medium line-clamp-2">
                {selectedDestination.tagline}
              </p>

              {/* Leisure Stats Pill Bar */}
              <div className="flex items-center gap-2 sm:gap-4 mt-4 text-xs font-black text-white/90 flex-wrap">
                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10">
                  <Waves className="w-4 h-4 text-cyan-400" />
                  Beaches & Water
                </span>
                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10">
                  <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                  Fresh Seafood
                </span>
                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10">
                  <Building2 className="w-4 h-4 text-rose-400" />
                  Luxury Resorts
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* View Switcher: Feed or Interactive Map */}
        {activeView === 'map' ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-rose-500" />
                  Interactive Worldwide Map
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Showing leisure spots around {selectedDestination.name}
                </p>
              </div>

              <button
                onClick={() => setActiveView('feed')}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs rounded-full transition"
              >
                Back to Feed View
              </button>
            </div>

            <MapView
              center={selectedDestination.center}
              venues={displayVenues}
              selectedVenue={activeVenueDetail}
              onSelectVenue={(venue) => setActiveVenueDetail(venue)}
              onGetDirections={(venue) => setActiveRouteVenue(venue)}
              selectedCategory={selectedCategory}
            />
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Category Chips Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-2 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <CategoryChips
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                counts={categoryCounts}
              />
            </div>

            {/* Horizontal Showcase: Top Rated Seafood & Oceanfront Dining */}
            {selectedCategory === 'all' && searchQuery === '' && seafoodSpots.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <UtensilsCrossed className="w-5 h-5 text-amber-500" />
                      Top Rated Seafood & Oceanfront Dining
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Fresh coastal catches, beachfront poké bowls & Mai Tais in {selectedDestination.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCategory('seafood')}
                    className="text-xs font-black text-rose-500 hover:underline flex items-center gap-1"
                  >
                    View All <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {seafoodSpots.slice(0, 3).map((venue) => (
                    <VenueCard
                      key={venue.id}
                      venue={venue}
                      isSaved={savedVenueIds.includes(venue.id)}
                      onToggleSave={handleToggleSave}
                      onClick={(v) => setActiveVenueDetail(v)}
                      onGetDirections={(v) => setActiveRouteVenue(v)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Main Organic & Developer Feed */}
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-rose-500" />
                    Curated Vacation Feed ({displayVenues.length})
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {searchQuery
                      ? `Filter result for "${searchQuery}" in ${selectedDestination.name}`
                      : `Showing spots in ${selectedDestination.name}`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsDeveloperPortalOpen(true)}
                    className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-slate-100 font-extrabold text-xs rounded-full transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5 text-rose-500" />
                    Add Spot
                  </button>

                  <button
                    onClick={() => setActiveView('map')}
                    className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-95 text-white font-black text-xs rounded-full shadow-md shadow-rose-500/20 transition flex items-center gap-1.5"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    View Map
                  </button>
                </div>
              </div>

              {/* Display Venues Grid */}
              {displayVenues.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayVenues.map((venue) => (
                    <VenueCard
                      key={venue.id}
                      venue={venue}
                      isSaved={savedVenueIds.includes(venue.id)}
                      onToggleSave={handleToggleSave}
                      onClick={(v) => setActiveVenueDetail(v)}
                      onGetDirections={(v) => setActiveRouteVenue(v)}
                    />
                  ))}
                </div>
              ) : globalSearchVenues.length > 0 ? (
                /* Global Search Results if no matches in current city */
                <div className="space-y-4">
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-3xl text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center justify-between">
                    <span>
                      No matches in <strong>{selectedDestination.name}</strong>, but found {globalSearchVenues.length} spots globally across other worldwide destinations!
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {globalSearchVenues.map((venue) => (
                      <VenueCard
                        key={venue.id}
                        venue={venue}
                        isSaved={savedVenueIds.includes(venue.id)}
                        onToggleSave={handleToggleSave}
                        onClick={(v) => setActiveVenueDetail(v)}
                        onGetDirections={(v) => setActiveRouteVenue(v)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* Empty Search State */
                <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-200 mb-1">
                    No leisure spots found
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                    Try adjusting your search terms, switching destinations, or adding custom locations in the Developer Studio.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSearchQuery('');
                      }}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-200 transition"
                    >
                      Reset Filters
                    </button>

                    <button
                      onClick={() => setIsDeveloperPortalOpen(true)}
                      className="px-4 py-2 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add This Spot
                    </button>
                  </div>
                </div>
              )}
            </section>

          </div>
        )}

      </main>

      {/* Developer Portal Modal */}
      {isDeveloperPortalOpen && (
        <DeveloperPortalModal
          destinations={allDestinations}
          onAddDestination={handleAddDestination}
          onAddVenue={handleAddVenue}
          customDestinations={customDestinations}
          customVenues={customVenues}
          onDeleteCustomDestination={handleDeleteCustomDestination}
          onDeleteCustomVenue={handleDeleteCustomVenue}
          onClose={() => setIsDeveloperPortalOpen(false)}
        />
      )}

      {/* Venue Detail Modal */}
      <VenueDetailModal
        venue={activeVenueDetail}
        onClose={() => setActiveVenueDetail(null)}
        isSaved={activeVenueDetail ? savedVenueIds.includes(activeVenueDetail.id) : false}
        onToggleSave={handleToggleSave}
        onGetDirections={(v) => setActiveRouteVenue(v)}
        onAddReview={handleAddReview}
      />

      {/* Navigation Route Guidance Modal */}
      <RouteModal
        venue={activeRouteVenue}
        onClose={() => setActiveRouteVenue(null)}
      />

      {/* Gemini AI Concierge Modal */}
      {isAIModalOpen && (
        <AIConciergeModal
          destinationName={selectedDestination.name}
          onClose={() => setIsAIModalOpen(false)}
        />
      )}

      {/* Saved Trips Drawer */}
      {isSavedDrawerOpen && (
        <SavedTripsDrawer
          savedVenues={savedVenues}
          onClose={() => setIsSavedDrawerOpen(false)}
          onRemove={handleToggleSave}
          onSelectVenue={(v) => {
            setActiveVenueDetail(v);
            setIsSavedDrawerOpen(false);
          }}
          onGetDirections={(v) => {
            setActiveRouteVenue(v);
            setIsSavedDrawerOpen(false);
          }}
        />
      )}

      {/* Bottom Navigation Scaffolding Bar */}
      <BottomNav
        activeView={activeView}
        onToggleView={setActiveView}
        onOpenAI={() => setIsAIModalOpen(true)}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenDeveloperPortal={() => setIsDeveloperPortalOpen(true)}
        savedCount={savedVenueIds.length}
      />

    </div>
  );
}
