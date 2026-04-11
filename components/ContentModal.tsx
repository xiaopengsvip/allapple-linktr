import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Share2, ExternalLink, Tag } from 'lucide-react';
import { ContentItem } from '../types';

interface ContentModalProps {
  item: ContentItem | null;
  onClose: () => void;
}

const ContentModal: React.FC<ContentModalProps> = ({ item, onClose }) => {
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
            layoutId={`content-${item.id}`}
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
            <div className="relative h-56 sm:h-72 shrink-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1e] via-[#1c1c1e]/20 to-transparent z-10" />
              <img 
                src={item.image || "https://picsum.photos/800/600?grayscale"} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors"
              >
                <X size={20} />
              </button>
              
              {/* Title overlay on image */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform translate-y-2">
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 }}
                 >
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex gap-2 mb-2">
                        {item.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-white">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className="text-2xl sm:text-4xl font-bold leading-tight text-white shadow-sm">
                      {item.title}
                    </h2>
                 </motion.div>
              </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="px-6 py-6 relative z-20">
                {/* Meta */}
                <div className="flex items-center gap-4 mb-6 text-white/50 text-sm font-medium border-b border-white/5 pb-4">
                  <div className="flex items-center gap-1.5">
                    {item.type === 'news' ? <Calendar size={14} /> : <Tag size={14} />}
                    <span>{item.subtitle}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="prose prose-invert prose-lg max-w-none text-white/80 leading-relaxed space-y-4">
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
                REF: {item.type.toUpperCase()}-{item.id}
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium text-white/70">
                  <Share2 size={16} />
                  Share
                </button>
                {item.link && (
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black hover:bg-white/90 transition-colors text-sm font-bold"
                  >
                    Open
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContentModal;