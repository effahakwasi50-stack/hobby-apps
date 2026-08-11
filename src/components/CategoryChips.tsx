import React from 'react';
import { 
  Sparkles, 
  UtensilsCrossed, 
  Waves, 
  Building2, 
  Film, 
  Wine, 
  ShoppingBag, 
  Trees,
  BedDouble,
  Home
} from 'lucide-react';
import { CategoryType } from '../types';

interface Props {
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  counts?: Record<string, number>;
}

interface CategoryOption {
  id: CategoryType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'all', label: 'All Places', icon: Sparkles, color: 'from-rose-500 to-pink-500' },
  { id: 'hostels', label: 'Hostels & Guesthouses', icon: Home, color: 'from-amber-500 to-orange-500' },
  { id: 'beaches', label: 'Beaches & Lakes', icon: Waves, color: 'from-cyan-500 to-blue-500' },
  { id: 'restaurants', label: 'Restaurants & Eateries', icon: UtensilsCrossed, color: 'from-orange-500 to-red-500' },
  { id: 'hotels', label: 'Hotels & Luxury', icon: BedDouble, color: 'from-emerald-500 to-teal-600' },
  { id: 'nightlife', label: 'Nightlife & Lounges', icon: Wine, color: 'from-purple-500 to-indigo-500' },
  { id: 'parks', label: 'Parks & Nature', icon: Trees, color: 'from-green-500 to-emerald-600' },
  { id: 'cinemas', label: 'Cinemas & Entertainment', icon: Film, color: 'from-rose-500 to-pink-600' },
  { id: 'malls', label: 'Shopping & Malls', icon: ShoppingBag, color: 'from-violet-500 to-purple-600' },
];

export const CategoryChips: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
  counts = {},
}) => {
  return (
    <div className="w-full py-2.5 overflow-x-auto no-scrollbar scroll-smooth">
      <div className="flex items-center gap-2 px-3 sm:px-4 min-w-max">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          const count = counts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-black transition-all duration-200 select-none ${
                isSelected
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-md shadow-rose-500/20 scale-102`
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-rose-500 dark:text-rose-400'}`} />
              <span>{cat.label}</span>
              {count > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
