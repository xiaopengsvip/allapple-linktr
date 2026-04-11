import React, { useState } from 'react';
import { ChevronDown, History } from 'lucide-react';
import { Category } from '../types';
import { CATEGORY_LABELS } from '../constants';

interface TopBarProps {
  currentCategory: Category;
  onCategoryChange: (c: Category) => void;
  onRefresh: () => void;
  onOpenHistory: () => void;
  isCleanMode: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  currentCategory,
  onCategoryChange,
  onOpenHistory,
  isCleanMode
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isCleanMode) return null;

  return (
    <div className="md:hidden absolute top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start pointer-events-none">
        
        {/* Category Selector */}
        <div className="pointer-events-auto relative">
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 text-lg font-bold text-white shadow-sm drop-shadow-md"
            >
                {CATEGORY_LABELS[currentCategory]}
                <ChevronDown size={16} className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Mobile Dropdown */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 mt-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden min-w-[140px] animate-in slide-in-from-top-2 fade-in">
                    {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                onCategoryChange(cat);
                                setIsMenuOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors
                                ${currentCategory === cat ? 'bg-white/10 text-emerald-400' : 'text-white/80 active:bg-white/5'}
                            `}
                        >
                            {CATEGORY_LABELS[cat]}
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* Right Actions */}
        <div className="pointer-events-auto flex gap-4">
             <button onClick={onOpenHistory} className="p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 text-white/80 hover:bg-white/10">
                 <History size={18} />
             </button>
        </div>
    </div>
  );
};

export default TopBar;
