import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Compass, 
  Send, 
  Clock, 
  Star, 
  CheckCircle2, 
  Lightbulb, 
  Loader2,
  CalendarDays
} from 'lucide-react';
import { AIItineraryResponse } from '../types';
import { generateVacationItinerary } from '../services/geminiService';

interface Props {
  destinationName: string;
  onClose: () => void;
}

export const AIConciergeModal: React.FC<Props> = ({
  destinationName,
  onClose,
}) => {
  const [preferences, setPreferences] = useState('');
  const [vibe, setVibe] = useState('Relaxing & Luxurious');
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<AIItineraryResponse | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const res = await generateVacationItinerary(destinationName, preferences || 'Best local highlights', vibe);
      setItinerary(res);
    } catch (err) {
      console.error('Failed to generate itinerary:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              AI Vacation Concierge
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Personalized 1-day leisure plan for <span className="font-extrabold text-teal-600 dark:text-teal-400">{destinationName}</span>
            </p>
          </div>
        </div>

        {/* Input Form Area */}
        <form onSubmit={handleGenerate} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Select Desired Vibe
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Relaxing & Luxurious',
                'Romantic Sunset & Dining',
                'Family Fun & Outdoor',
                'Beach & Nightlife'
              ].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVibe(v)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition ${
                    vibe === v
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Specific Wishes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Must include fresh poké, paddleboarding, and rooftop fire pits..."
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:opacity-95 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-teal-500/20 transition active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Crafting Your Perfect Itinerary...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 fill-white/20" />
                Generate Vacation Plan with Gemini AI
              </>
            )}
          </button>
        </form>

        {/* Display Generated Schedule */}
        {itinerary && (
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
            
            <div className="p-4 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200/60 dark:border-teal-800/60">
              <div className="flex items-center gap-2 text-teal-800 dark:text-teal-200 font-extrabold text-lg mb-1">
                <CalendarDays className="w-5 h-5 text-teal-500" />
                {itinerary.dayTitle}
              </div>
              <p className="text-xs sm:text-sm text-teal-900/80 dark:text-teal-300/80 leading-relaxed">
                {itinerary.summary}
              </p>
            </div>

            {/* Itinerary Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Your Day's Schedule
              </h4>
              
              <div className="space-y-3">
                {itinerary.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-teal-500/10 text-teal-600 dark:text-teal-300 font-extrabold text-[11px] rounded-full">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>
                      {item.venueName && (
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">
                          📍 {item.venueName}
                        </span>
                      )}
                    </div>

                    <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {item.title}
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    {item.tip && (
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-xl">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{item.tip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Insider Secrets */}
            {itinerary.insiderTips && itinerary.insiderTips.length > 0 && (
              <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-900 dark:text-amber-200">
                <div className="font-bold text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" /> Concierge Insider Secrets
                </div>
                <ul className="space-y-1 text-xs list-disc list-inside">
                  {itinerary.insiderTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
