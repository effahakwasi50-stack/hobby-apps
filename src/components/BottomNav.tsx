import React from 'react';
import { LayoutGrid, Map, Sparkles, Heart, Code2 } from 'lucide-react';

interface Props {
  activeView: 'feed' | 'map';
  onToggleView: (view: 'feed' | 'map') => void;
  onOpenAI: () => void;
  onOpenSaved: () => void;
  onOpenDeveloperPortal: () => void;
  savedCount: number;
}

export const BottomNav: React.FC<Props> = ({
  activeView,
  onToggleView,
  onOpenAI,
  onOpenSaved,
  onOpenDeveloperPortal,
  savedCount,
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 px-4 py-2 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Discover Feed Tab */}
        <button
          onClick={() => onToggleView('feed')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${
            activeView === 'feed'
              ? 'text-rose-500 font-black'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-bold">Discover</span>
        </button>

        {/* Map View Tab */}
        <button
          onClick={() => onToggleView('map')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${
            activeView === 'map'
              ? 'text-rose-500 font-black'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Map className="w-5 h-5" />
          <span className="text-[10px] font-bold">Map</span>
        </button>

        {/* Developer Studio */}
        <button
          onClick={onOpenDeveloperPortal}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-slate-800 dark:text-slate-200 font-bold transition"
        >
          <Code2 className="w-5 h-5 text-rose-500" />
          <span className="text-[10px] font-bold">Dev Studio</span>
        </button>

        {/* AI Planner Tab */}
        <button
          onClick={onOpenAI}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-rose-500 font-bold transition"
        >
          <div className="p-1.5 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full text-white shadow-md shadow-rose-500/30">
            <Sparkles className="w-4 h-4 fill-white/20" />
          </div>
          <span className="text-[10px] font-bold">AI Concierge</span>
        </button>

        {/* Saved Spots Tab */}
        <button
          onClick={onOpenSaved}
          className="relative flex flex-col items-center gap-1 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
        >
          <Heart className={`w-5 h-5 ${savedCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
          <span className="text-[10px] font-bold">Saved</span>
          {savedCount > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
              {savedCount}
            </span>
          )}
        </button>

      </div>
    </div>
  );
};
