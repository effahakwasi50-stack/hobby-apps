import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  Heart, 
  Navigation, 
  Share2, 
  Check, 
  Sparkles, 
  MessageSquare, 
  Send,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Review, Venue } from '../types';

interface Props {
  venue: Venue | null;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: (venue: Venue) => void;
  onGetDirections?: (venue: Venue) => void;
  onAddReview?: (venueId: string, review: Review) => void;
}

export const VenueDetailModal: React.FC<Props> = ({
  venue,
  onClose,
  isSaved = false,
  onToggleSave,
  onGetDirections,
  onAddReview,
}) => {
  if (!venue) return null;

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewName, setNewReviewName] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);

  const images = venue.images && venue.images.length > 0 ? venue.images : [venue.image];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newRev: Review = {
      id: 'rev-' + Date.now(),
      authorName: newReviewName.trim() || 'Vacation Guest',
      rating: newReviewRating,
      relativeTime: 'Just now',
      text: newReviewText.trim()
    };

    if (onAddReview) {
      onAddReview(venue.id, newRev);
    }

    setNewReviewText('');
    setNewReviewName('');
    setShowWriteReview(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white backdrop-blur-md transition border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Gallery Carousel */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-slate-950 overflow-hidden shrink-0">
          <img
            src={images[activeImgIndex]}
            alt={venue.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent pointer-events-none" />

          {/* Carousel Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image Dots Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === activeImgIndex ? 'w-6 bg-teal-400' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Category & Sponsored Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {venue.isSponsored && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-full shadow-lg">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                Sponsored
              </span>
            )}
            <span className="inline-flex items-center px-3.5 py-1 bg-slate-900/80 backdrop-blur-md text-white font-semibold text-xs rounded-full border border-white/20">
              {venue.categoryLabel}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* Header Title & Quick Rating */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {venue.name}
              </h2>
              <div className="flex items-center gap-3 mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex-wrap">
                <span className="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-bold">
                  <MapPin className="w-4 h-4 text-teal-500" />
                  {venue.distance} away
                </span>
                <span>•</span>
                <span className="truncate">{venue.address}</span>
              </div>
            </div>

            {/* Rating Box */}
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-2xl border border-amber-200/60 dark:border-amber-800/60 self-start">
              <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              <div>
                <div className="text-lg font-black text-amber-900 dark:text-amber-200 leading-none">
                  {venue.rating.toFixed(1)}
                </div>
                <div className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 mt-0.5">
                  {venue.reviewCount} Reviews
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              About This Spot
            </h3>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              {venue.description}
            </p>
          </div>

          {/* Key Info Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs sm:text-sm">
            {venue.openingHours && (
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-teal-500 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[11px]">Hours</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{venue.openingHours}</div>
                </div>
              </div>
            )}
            {venue.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-teal-500 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[11px]">Phone</div>
                  <a href={`tel:${venue.phone}`} className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                    {venue.phone}
                  </a>
                </div>
              </div>
            )}
            {venue.website && (
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-teal-500 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[11px]">Official Site</div>
                  <a href={venue.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline truncate block max-w-[200px]">
                    Visit Website
                  </a>
                </div>
              </div>
            )}
            {venue.priceLevel && (
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 text-amber-500 font-extrabold text-center shrink-0">$</span>
                <div>
                  <div className="text-slate-400 text-[11px]">Price Tier</div>
                  <div className="font-bold text-amber-600 dark:text-amber-400">{venue.priceLevel}</div>
                </div>
              </div>
            )}
          </div>

          {/* Amenities & Highlights */}
          {venue.amenities && venue.amenities.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                Spot Amenities
              </h3>
              <div className="flex flex-wrap gap-2">
                {venue.amenities.map((amenity, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/10 text-teal-700 dark:text-teal-300 font-semibold text-xs rounded-xl border border-teal-500/20"
                  >
                    <Check className="w-3.5 h-3.5 text-teal-500" />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews Section */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-500" />
                Guest Reviews ({venue.reviews?.length || 0})
              </h3>
              <button
                onClick={() => setShowWriteReview(!showWriteReview)}
                className="px-3 py-1.5 bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-300 font-bold text-xs rounded-xl hover:bg-teal-100 transition"
              >
                {showWriteReview ? 'Cancel' : 'Write a Review'}
              </button>
            </div>

            {/* Write Review Form */}
            {showWriteReview && (
              <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${star <= newReviewRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                />

                <textarea
                  rows={3}
                  placeholder="Share your experience at this vacation spot..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="w-full p-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  required
                />

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post Review
                </button>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-3">
              {venue.reviews && venue.reviews.length > 0 ? (
                venue.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                        {rev.authorName}
                      </div>
                      <span className="text-[10px] text-slate-400">{rev.relativeTime}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3.5 h-3.5 ${
                            idx < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      "{rev.text}"
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to share!</p>
              )}
            </div>
          </div>

        </div>

        {/* Modal Fixed Footer Action Bar */}
        <div className="p-4 sm:px-8 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave && onToggleSave(venue)}
              className={`p-3 rounded-2xl border transition flex items-center gap-2 text-xs font-bold ${
                isSaved
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save Spot'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition text-xs font-bold flex items-center gap-2"
              title="Share Spot"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedShare ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>

          {onGetDirections && (
            <button
              onClick={() => {
                onGetDirections(venue);
                onClose();
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-teal-500/25 transition active:scale-95"
            >
              <Navigation className="w-4 h-4" />
              Get Directions
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
