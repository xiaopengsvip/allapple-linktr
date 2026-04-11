import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import { X, Download, Share2, Copy } from 'lucide-react';
import { Language, translations } from '../translations';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  lang: Language;
  logoUrl?: string; // 可选的 Logo URL
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, url, lang, logoUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const t = translations[lang];

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, { 
        width: 200, // 稍微增大二维码尺寸 (Slightly larger QR code)
        margin: 1,
        color: {
          dark: '#1c1c1e', // 深灰色代替纯黑 (Dark grey instead of pure black for softer contrast)
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H'
      }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [isOpen, url]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 顶部操作栏 (Top Action Bar) */}
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* 卡片内容区域 (Card Body) */}
            <div className="flex flex-col items-center pt-12 pb-8 px-8">
              
              {/* Logo 区域 (Logo Section) */}
              <div className="w-20 h-20 rounded-[20px] bg-gray-50 p-0.5 shadow-sm mb-5 border border-gray-100">
                <img 
                  src={logoUrl || "https://picsum.photos/200"} 
                  alt="Logo" 
                  className="w-full h-full rounded-[18px] object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://picsum.photos/200";
                  }}
                />
              </div>

              {/* 标题与副标题 (Title & Subtitle) */}
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-1">{t.title}</h2>
              <p className="text-gray-400 text-sm font-medium mb-6">{t.subtitle}</p>

              {/* 二维码容器 (QR Container) */}
              <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-6">
                 <canvas ref={canvasRef} className="rounded-lg w-[180px] h-[180px]" />
              </div>

              {/* URL 显示 (URL Display) */}
              <div className="flex items-center gap-2 text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1.5 rounded-full mb-8 border border-gray-100/50">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="truncate max-w-[200px]">{url.replace(/^https?:\/\//, '')}</span>
              </div>

              {/* 底部按钮组 (Action Buttons) - 颜色调柔和 (Colors softened) */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <button className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200/50 py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-95">
                  <Download size={16} />
                  Save
                </button>
                <button className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200/50 py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-95">
                  <Share2 size={16} />
                  Share
                </button>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QRCodeModal;