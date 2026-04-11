
import React from 'react';
import { X, ExternalLink, RefreshCw } from 'lucide-react';
import { TRANSLATIONS, ASSETS } from '../constants';
import { Language } from '../types';

interface IframeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const IframeModal: React.FC<IframeModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed inset-0 z-[2000] bg-black flex flex-col animate-fade-in">
      {/* 顶部控制栏 */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/90 border-b border-white/10 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
             <ExternalLink size={16} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-orbitron font-bold text-white text-sm">Everett Ecosystem</span>
            <span className="text-[10px] text-gray-500 font-mono">{ASSETS.iframeUrl}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
             onClick={() => {
                const iframe = document.getElementById('ecosystem-frame') as HTMLIFrameElement;
                if(iframe) iframe.src = iframe.src;
             }}
             className="p-2 text-gray-400 hover:text-white transition-colors"
             title="Reload"
           >
              <RefreshCw size={18} />
           </button>
           <button 
             onClick={onClose}
             className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-red-500/80 rounded-full text-white text-sm transition-all font-bold border border-white/10"
           >
             <X size={16} />
             <span className="hidden md:inline">{t.iframeClose}</span>
           </button>
        </div>
      </div>

      {/* Iframe 容器 */}
      <div className="flex-1 relative w-full bg-gray-900">
         <div className="absolute inset-0 flex items-center justify-center text-gray-500 animate-pulse z-0">
            Connecting to Neural Network...
         </div>
         <iframe 
           id="ecosystem-frame"
           src={ASSETS.iframeUrl} 
           title="Ecosystem"
           className="absolute inset-0 w-full h-full z-10 bg-white"
           frameBorder="0"
         />
      </div>
    </div>
  );
};

export default IframeModal;
