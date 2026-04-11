import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Share2, Clock } from 'lucide-react';
import { ContentItem } from '../types';

interface NewsModalProps {
  item: ContentItem | null;
  onClose: () => void;
}

const NewsModal: React.FC<NewsModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center pointer-events-auto"
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            layoutId={`news-${item.id}`}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="
              relative w-full max-w-2xl bg-[#1c1c1e] text-white 
              rounded-t-[32px] sm:rounded-[32px] 
              shadow-2xl overflow-hidden flex flex-col
              max-h-[90vh] sm:h-[80vh]
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image */}
            <div className="relative h-48 sm:h-64 shrink-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1e] to-transparent z-10" />
              <img 
                src={item.image || "https://picsum.photos/800/400?grayscale"} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="px-6 pb-12 -mt-12 relative z-20">
                {/* Meta Tags */}
                <div className="flex items-center gap-3 mb-4">
                  {item.tags && item.tags.length > 0 && (
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                      {item.tags[0]}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-white/40 text-xs font-medium">
                    <Calendar size={12} />
                    <span>{item.subtitle}</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-6 text-white/90">
                  {item.title}
                </h2>

                {/* Body Content */}
                <div className="prose prose-invert prose-lg max-w-none text-white/70 leading-relaxed space-y-4">
                  {item.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} className={paragraph ? "mb-4" : ""}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/5 bg-[#1c1c1e] flex justify-between items-center shrink-0 safe-area-bottom">
              <div className="text-xs text-white/30 font-mono">
                ID: {item.id.toString().padStart(4, '0')}
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">
                <Share2 size={16} />
                Share Article
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsModal;