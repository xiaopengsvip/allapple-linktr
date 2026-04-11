import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Facebook, Send, Mail, Link as LinkIcon, Check, Globe } from 'lucide-react';
import { Language, translations } from '../translations';

interface ShareOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  lang: Language;
}

// Custom X Logo
const XIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231h0.001Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
  </svg>
);

const ShareOptionsModal: React.FC<ShareOptionsModalProps> = ({ isOpen, onClose, url, lang }) => {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleSocialShare = (platform: string) => {
    const text = encodeURIComponent(t.shareText);
    const subject = encodeURIComponent(t.shareSubject);
    const encodedUrl = encodeURIComponent(url);
    
    let shareUrl = '';
    switch(platform) {
      case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`; break;
      case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`; break;
      case 'weibo': shareUrl = `http://service.weibo.com/share/share.php?url=${encodedUrl}&title=${text}`; break;
      case 'telegram': shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${text}`; break;
      case 'email': shareUrl = `mailto:?subject=${subject}&body=${text}%0A%0A${encodedUrl}`; break;
    }
    if (shareUrl) window.open(shareUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="bg-white/90 backdrop-blur-xl rounded-[32px] p-6 w-full max-w-sm shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-black">{t.shareOptions}</h3>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
             </div>

             <div className="grid grid-cols-4 gap-4 mb-6">
                <ShareButton icon={<XIcon size={20} />} label="X" onClick={() => handleSocialShare('twitter')} color="bg-black text-white" />
                <ShareButton icon={<Facebook size={24} />} label="Facebook" onClick={() => handleSocialShare('facebook')} color="bg-[#1877F2] text-white" />
                <ShareButton icon={<Globe size={24} />} label="Weibo" onClick={() => handleSocialShare('weibo')} color="bg-[#E6162D] text-white" />
                <ShareButton icon={<Send size={24} />} label="Telegram" onClick={() => handleSocialShare('telegram')} color="bg-[#229ED9] text-white" />
                <ShareButton icon={<Mail size={24} />} label="Email" onClick={() => handleSocialShare('email')} color="bg-gray-500 text-white" />
             </div>

             <div className="bg-gray-100 p-1 rounded-2xl flex items-center">
                <div className="flex-1 px-4 py-3 text-sm text-gray-500 truncate font-mono">
                  {url.replace(/^https?:\/\//, '')}
                </div>
                <button 
                  onClick={handleCopy}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all
                    ${copied ? 'bg-green-500 text-white' : 'bg-white text-black shadow-sm hover:scale-105'}
                  `}
                >
                  {copied ? <Check size={16} /> : <LinkIcon size={16} />}
                  {copied ? t.copied : t.copyLink}
                </button>
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ShareButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; color: string }> = ({ icon, label, onClick, color }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${color}`}>
      {icon}
    </div>
    <span className="text-xs font-medium text-gray-600">{label}</span>
  </button>
);

export default ShareOptionsModal;