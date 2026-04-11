
import React, { useState, useEffect, useRef } from 'react';
import { PRODUCT_COLORS, ASSETS, TRANSLATIONS, STYLES } from '../constants';
import { Language } from '../types';
import { Check, Info, Box } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface ProductCustomizerProps {
  lang: Language;
}

const ProductCustomizer: React.FC<ProductCustomizerProps> = ({ lang }) => {
  const [selectedColor, setSelectedColor] = useState(PRODUCT_COLORS[0]);
  const modelRef = useRef<HTMLElement>(null);
  const t = TRANSLATIONS[lang].customizer;

  const hexToRgba = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
      1.0
    ] : [1, 1, 1, 1];
  };

  useEffect(() => {
    const updateColor = () => {
      if (modelRef.current) {
        // @ts-ignore
        const materials = modelRef.current.model?.materials;
        if (materials && materials.length > 0) {
          const material = materials[0];
          material.pbrMetallicRoughness.setBaseColorFactor(hexToRgba(selectedColor.hex));
        }
      }
    };
    updateColor();
    const currentRef = modelRef.current;
    if (currentRef) {
      currentRef.addEventListener('load', updateColor);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('load', updateColor);
      }
    };
  }, [selectedColor]);

  return (
    <div className={`${STYLES.glassPanel} rounded-2xl md:rounded-3xl p-6 md:p-12 transition-all hover:border-accent/30`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Visual Preview */}
        <div className="relative group">
          <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full opacity-50 pointer-events-none"></div>
          
          <div className={`relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-b from-white/5 to-transparent border border-white/10`}>
            
            <model-viewer
              ref={modelRef}
              src={ASSETS.model3d}
              poster={ASSETS.modelPoster}
              alt="Everett 3D Model"
              shadow-intensity="1"
              camera-controls
              auto-rotate
              ar
              className="w-full h-full"
              style={{ backgroundColor: 'transparent' }}
            >
              <div slot="poster" className="absolute inset-0 flex items-center justify-center text-white bg-black/20 backdrop-blur-sm">
                 <div className="flex flex-col items-center gap-2">
                    <Box className="animate-bounce" />
                    <span>Loading 3D Model...</span>
                 </div>
              </div>
            </model-viewer>

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>

            <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6 pointer-events-none z-10">
              <h3 className="text-lg md:text-3xl font-orbitron font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-1 md:mb-2">{selectedColor.name[lang]}</h3>
              <div className="flex items-center gap-2">
                 <p className="text-[10px] md:text-sm text-white/90 drop-shadow-md bg-white/10 px-2 py-0.5 md:px-3 md:py-1 rounded backdrop-blur-md border border-white/20 tracking-wider uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                    {t.previewText}
                 </p>
              </div>
            </div>
          </div>
          <p className="text-center text-[10px] md:text-xs text-gray-500 mt-3 md:mt-4 flex items-center justify-center gap-2 opacity-70">
            <Info size={10} className="md:w-3 md:h-3" /> {lang === 'zh' ? '拖动旋转 · 滚轮缩放' : 'Drag to rotate · Scroll to zoom'}
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-8 md:space-y-10">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 font-orbitron">{t.title}</h2>
            <p className="text-gray-300 leading-relaxed text-base md:text-lg">{t.subtitle}</p>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4 md:mb-6 font-bold">{t.selectColor}</h3>
            <div className="flex flex-wrap gap-4 md:gap-6">
              {PRODUCT_COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color)}
                  className={`relative w-12 h-12 md:w-16 md:h-16 rounded-full transition-all duration-300 transform ${
                    selectedColor.id === color.id 
                      ? 'scale-125 shadow-[0_0_20px_rgba(255,255,255,0.4)] ring-2 ring-white ring-offset-2 ring-offset-transparent' 
                      : 'opacity-70 hover:opacity-100 hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  aria-label={`Select ${color.name[lang]}`}
                >
                  {selectedColor.id === color.id && (
                    <Check className="absolute inset-0 m-auto text-white drop-shadow-md" size={20} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 md:pt-8 border-t border-white/10">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400 text-sm md:text-base">{t.shipping}</span>
              <span className="font-mono text-accent text-base md:text-lg">{t.weeks}</span>
            </div>
            <button className="w-full py-4 md:py-5 bg-white text-black font-bold rounded-xl md:rounded-2xl hover:bg-accent hover:text-white transition-all duration-300 shadow-xl hover:shadow-accent/40 text-base md:text-lg uppercase tracking-wide">
              {t.preorder} {selectedColor.name[lang]} {t.limited}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCustomizer;
