
import React, { useState, useEffect } from 'react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface HeroProps {
  lang: Language;
}

const Hero: React.FC<HeroProps> = ({ lang }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = TRANSLATIONS[lang].hero;

  const slides = [
    {
      title: t.slide1Title,
      desc: t.slide1Desc,
      action: t.slide1Btn,
      target: "#contact"
    },
    {
      title: t.slide2Title,
      desc: t.slide2Desc,
      action: t.slide2Btn,
      target: "#features"
    },
    {
      title: t.slide3Title,
      desc: t.slide3Desc,
      action: t.slide3Btn,
      target: "#blog"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="home" className="relative h-screen overflow-hidden flex items-center justify-center px-4 md:px-6">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center px-4 md:px-6 transition-all duration-1000 ease-in-out transform
            ${index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'}
          `}
        >
          <div className="w-full max-w-[95%] md:max-w-4xl mx-auto backdrop-blur-md p-6 md:p-14 rounded-[2rem] md:rounded-[3rem] bg-black/40 border border-white/10 shadow-[0_0_60px_-15px_rgba(0,0,0,0.5)] flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-8 font-orbitron animate-pulse-slow text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 drop-shadow-sm leading-tight">
              {slide.title}
            </h1>
            <p className="text-sm sm:text-base md:text-xl lg:text-2xl mb-6 md:mb-10 max-w-2xl mx-auto leading-relaxed text-gray-200 drop-shadow-md font-light">
              {slide.desc}
            </p>
            <button 
              onClick={() => scrollTo(slide.target)}
              className="px-8 py-3 md:px-10 md:py-4 bg-accent hover:bg-white hover:text-accent rounded-full text-white font-bold text-sm md:text-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,113,227,0.6)] animate-bounce-slow uppercase tracking-widest"
            >
              {slide.action}
            </button>
            
            <div className="flex gap-2 md:gap-3 mt-6 md:mt-8">
              {slides.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === index ? 'w-6 md:w-8 bg-accent' : 'w-2 bg-white/30'}`}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Hero;
