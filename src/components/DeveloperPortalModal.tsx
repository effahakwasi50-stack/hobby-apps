import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  MapPin, 
  Building2, 
  Sparkles, 
  Trash2, 
  CheckCircle, 
  Globe, 
  Image as ImageIcon, 
  DollarSign, 
  Tag, 
  Code2,
  ListPlus,
  Compass
} from 'lucide-react';
import { CategoryType, Destination, Venue } from '../types';

interface Props {
  destinations: Destination[];
  onAddDestination: (dest: Destination) => void;
  onAddVenue: (destinationId: string, venue: Venue) => void;
  customDestinations: Destination[];
  customVenues: Record<string, Venue[]>;
  onDeleteCustomDestination: (id: string) => void;
  onDeleteCustomVenue: (destinationId: string, venueId: string) => void;
  onClose: () => void;
}

export const DeveloperPortalModal: React.FC<Props> = ({
  destinations,
  onAddDestination,
  onAddVenue,
  customDestinations,
  customVenues,
  onDeleteCustomDestination,
  onDeleteCustomVenue,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'addVenue' | 'addDest' | 'manage'>('addVenue');
  const [successMsg, setSuccessMsg] = useState('');

  // Add Destination Form State
  const [destName, setDestName] = useState('');
  const [destCountry, setDestCountry] = useState('');
  const [destTagline, setDestTagline] = useState('');
  const [destLat, setDestLat] = useState('5.5560');
  const [destLng, setDestLng] = useState('-0.1969');
  const [destImage, setDestImage] = useState('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80');

  // Add Venue Form State
  const [targetDestId, setTargetDestId] = useState(destinations[0]?.id || 'accra');
  const [venueName, setVenueName] = useState('');
  const [venueCategory, setVenueCategory] = useState<CategoryType>('beaches');
  const [venueAddress, setVenueAddress] = useState('');
  const [venueLat, setVenueLat] = useState('5.5562');
  const [venueLng, setVenueLng] = useState('-0.1472');
  const [venuePrice, setVenuePrice] = useState('$$$');
  const [venueDescription, setVenueDescription] = useState('');
  const [venueImage, setVenueImage] = useState('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80');
  const [venueAmenities, setVenueAmenities] = useState('Ocean View, Fresh Seafood, Outdoor Terrace, Cocktail Bar');
  const [venueIsSponsored, setVenueIsSponsored] = useState(false);

  const handleCreateDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destName.trim() || !destCountry.trim()) return;

    const newDest: Destination = {
      id: destName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4),
      name: destName.trim(),
      country: destCountry.trim(),
      tagline: destTagline.trim() || 'Worldwide leisure & spot discovery',
      center: { lat: parseFloat(destLat) || 0, lng: parseFloat(destLng) || 0 },
      image: destImage.trim() || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      isCustom: true,
    };

    onAddDestination(newDest);
    setSuccessMsg(`Destination "${newDest.name}" added successfully!`);
    setDestName('');
    setDestCountry('');
    setDestTagline('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleCreateVenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!venueName.trim() || !venueAddress.trim()) return;

    const categoryLabels: Record<CategoryType, string> = {
      all: 'Spot',
      hostels: 'Hostel & Guesthouse',
      beaches: 'Beach & Shoreline',
      seafood: 'Seafood Restaurant',
      resorts: 'Luxury Resort',
      restaurants: 'Dining & Lounge',
      cinemas: 'Cinema & Screen',
      malls: 'Shopping Mall',
      parks: 'Park & Reserve',
      nightlife: 'Cocktail & Nightlife',
      hotels: 'Boutique Hotel',
    };

    const newVenue: Venue = {
      id: 'custom-' + Date.now(),
      name: venueName.trim(),
      category: venueCategory,
      categoryLabel: categoryLabels[venueCategory] || 'Leisure Spot',
      rating: 5.0,
      reviewCount: 1,
      priceLevel: venuePrice,
      distance: '0.3 mi',
      distanceKm: 0.5,
      address: venueAddress.trim(),
      location: { lat: parseFloat(venueLat) || 0, lng: parseFloat(venueLng) || 0 },
      image: venueImage.trim() || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
      images: [venueImage.trim() || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80'],
      description: venueDescription.trim() || 'Developer curated leisure spot.',
      isOpenNow: true,
      openingHours: '10:00 AM - 11:00 PM',
      amenities: venueAmenities.split(',').map((s) => s.trim()).filter(Boolean),
      reviews: [
        {
          id: 'dev-rev-1',
          authorName: 'Developer Admin',
          rating: 5,
          relativeTime: 'Just now',
          text: 'Newly published worldwide location added via Developer Space.',
        },
      ],
      isSponsored: venueIsSponsored,
      sponsorName: venueIsSponsored ? 'Featured Spot' : undefined,
      sponsorBadgeText: venueIsSponsored ? 'Sponsored Partner' : undefined,
      isCustom: true,
    };

    onAddVenue(targetDestId, newVenue);
    setSuccessMsg(`Spot "${newVenue.name}" published to ${targetDestId}!`);
    setVenueName('');
    setVenueAddress('');
    setVenueDescription('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 w-full max-w-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white flex items-center justify-between border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-2xl">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">Developer Space</h2>
                <span className="px-2 py-0.5 bg-rose-500 text-white font-black text-[10px] rounded-full uppercase tracking-wider">
                  Admin Studio
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Add worldwide destinations and leisure locations dynamically
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-1.5 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('addVenue')}
            className={`flex-1 py-2.5 rounded-2xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'addVenue'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Add New Location/Spot
          </button>

          <button
            onClick={() => setActiveTab('addDest')}
            className={`flex-1 py-2.5 rounded-2xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'addDest'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            Add New City/Destination
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-2.5 rounded-2xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'manage'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <ListPlus className="w-4 h-4" />
            Manage ({customDestinations.length + Object.values(customVenues).flat().length})
          </button>
        </div>

        {/* Notification banner */}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          
          {/* TAB 1: ADD NEW LOCATION / VENUE */}
          {activeTab === 'addVenue' && (
            <form onSubmit={handleCreateVenue} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300">Select Destination City</label>
                <select
                  value={targetDestId}
                  onChange={(e) => setTargetDestId(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.country}) {d.isCustom ? '★ Custom' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">Spot Name / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Blue Lagoon Seafood & Beach Bar"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">Category *</label>
                  <select
                    value={venueCategory}
                    onChange={(e) => setVenueCategory(e.target.value as CategoryType)}
                    className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="hostels">Hostels & Guesthouses</option>
                    <option value="hotels">Hotels & Luxury Centers</option>
                    <option value="seafood">Seafood & Coastal Dining</option>
                    <option value="beaches">Beaches & Water</option>
                    <option value="resorts">Luxury Resorts & Hotels</option>
                    <option value="restaurants">Restaurants & Cafes</option>
                    <option value="cinemas">Outdoor & Indoor Cinemas</option>
                    <option value="malls">Shopping Malls & Bazaars</option>
                    <option value="parks">Parks & Botanical Gardens</option>
                    <option value="nightlife">Nightlife & Cocktail Lounges</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300">Full Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 102 Promenade des Anglais, Nice, France"
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">Latitude</label>
                  <input
                    type="text"
                    value={venueLat}
                    onChange={(e) => setVenueLat(e.target.value)}
                    className="w-full p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">Longitude</label>
                  <input
                    type="text"
                    value={venueLng}
                    onChange={(e) => setVenueLng(e.target.value)}
                    className="w-full p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">Price Level</label>
                  <select
                    value={venuePrice}
                    onChange={(e) => setVenuePrice(e.target.value)}
                    className="w-full p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold"
                  >
                    <option value="Free">Free</option>
                    <option value="$">$ (Budget)</option>
                    <option value="$$">$$ (Moderate)</option>
                    <option value="$$$">$$$ (Upscale)</option>
                    <option value="$$$$">$$$$ (Luxury)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={venueImage}
                  onChange={(e) => setVenueImage(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the spot's ambiance, offerings, ocean view, signature dishes or experience..."
                  value={venueDescription}
                  onChange={(e) => setVenueDescription(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300">Amenities (comma separated)</label>
                <input
                  type="text"
                  placeholder="WiFi, Ocean View, Live Music, Private Cabanas, Valet"
                  value={venueAmenities}
                  onChange={(e) => setVenueAmenities(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isSpon"
                  checked={venueIsSponsored}
                  onChange={(e) => setVenueIsSponsored(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500"
                />
                <label htmlFor="isSpon" className="text-slate-700 dark:text-slate-300 cursor-pointer">
                  Mark as Sponsored / Featured Local Partner
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-rose-500/25 transition active:scale-98 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                Publish Custom Location to Feed
              </button>
            </form>
          )}

          {/* TAB 2: ADD NEW DESTINATION / CITY */}
          {activeTab === 'addDest' && (
            <form onSubmit={handleCreateDestination} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">City / Destination Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kyoto & Arashiyama"
                    value={destName}
                    onChange={(e) => setDestName(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">Country / Region *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Japan"
                    value={destCountry}
                    onChange={(e) => setDestCountry(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300">Tagline / Highlight</label>
                <input
                  type="text"
                  placeholder="e.g. Historic bamboo groves, zen temple gardens & riverside matcha cafes"
                  value={destTagline}
                  onChange={(e) => setDestTagline(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">Center Latitude</label>
                  <input
                    type="text"
                    value={destLat}
                    onChange={(e) => setDestLat(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">Center Longitude</label>
                  <input
                    type="text"
                    value={destLng}
                    onChange={(e) => setDestLng(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300">Cover Image URL</label>
                <input
                  type="url"
                  value={destImage}
                  onChange={(e) => setDestImage(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-rose-500/25 transition active:scale-98 flex items-center justify-center gap-2"
              >
                <Globe className="w-5 h-5" />
                Add Worldwide Destination
              </button>
            </form>
          )}

          {/* TAB 3: MANAGE ADDED LOCATIONS */}
          {activeTab === 'manage' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-rose-500" />
                  Developer Custom Destinations ({customDestinations.length})
                </h3>
                {customDestinations.length === 0 ? (
                  <p className="text-slate-400 italic text-xs">No custom destinations added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {customDestinations.map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img src={d.image} alt={d.name} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white">{d.name}</div>
                            <div className="text-slate-400">{d.country}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => onDeleteCustomDestination(d.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                          title="Delete destination"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-slate-200 dark:bg-slate-800" />

              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  Developer Custom Locations / Venues
                </h3>
                {Object.keys(customVenues).length === 0 || (Object.values(customVenues) as Venue[][]).flat().length === 0 ? (
                  <p className="text-slate-400 italic text-xs">No custom locations added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(customVenues).map(([destId, vList]) =>
                      (vList as Venue[]).map((v) => (
                        <div
                          key={v.id}
                          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <img src={v.image} alt={v.name} className="w-10 h-10 rounded-xl object-cover" />
                            <div>
                              <div className="font-extrabold text-slate-900 dark:text-white">{v.name}</div>
                              <div className="text-slate-400">{v.categoryLabel} • {v.address}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => onDeleteCustomVenue(destId, v.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                            title="Delete location"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
