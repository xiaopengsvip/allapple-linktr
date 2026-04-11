
import React from 'react';
import { Lightbulb, Zap, Heart, User } from 'lucide-react';
import { TRANSLATIONS, STYLES, TEAM } from '../constants';
import { Language } from '../types';

interface AboutStoryProps {
  lang: Language;
  openModal: (title: string, content: string) => void;
}

const AboutStory: React.FC<AboutStoryProps> = ({ lang, openModal }) => {
  const t = TRANSLATIONS[lang].aboutStory;
  const teamT = TRANSLATIONS[lang].team;

  // 品牌故事时间轴数据
  const storyItems = [
    {
      icon: <Lightbulb size={24} className="text-yellow-400" />,
      title: t.story1Title,
      desc: t.story1Desc,
      year: "2023"
    },
    {
      icon: <Zap size={24} className="text-blue-400" />,
      title: t.story2Title,
      desc: t.story2Desc,
      year: "2024"
    },
    {
      icon: <Heart size={24} className="text-red-400" />,
      title: t.story3Title,
      desc: t.story3Desc,
      year: "Future"
    }
  ];

  return (
    <div className={`${STYLES.glassPanel} rounded-3xl p-8 md:p-12 w-full relative overflow-hidden`}>
      {/* 背景装饰光效 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="text-center mb-16 relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold font-orbitron mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
          {t.title}
        </h2>
        <p className="text-gray-400 uppercase tracking-widest text-xs md:text-sm">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* 左侧：品牌故事时间轴 */}
        <div className="space-y-8">
           {storyItems.map((item, idx) => (
             <div key={idx} className="group flex gap-4 md:gap-6 relative">
               {/* 连接线 */}
               {idx !== storyItems.length - 1 && (
                 <div className="absolute left-[20px] md:left-[24px] top-12 bottom-[-32px] w-[2px] bg-white/10 group-hover:bg-accent/50 transition-colors"></div>
               )}
               
               <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-accent group-hover:bg-accent/20 transition-all duration-300 z-10">
                 {item.icon}
               </div>
               
               <div className="pt-1">
                 <div className="flex items-center gap-3 mb-2">
                   <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                     {item.year}
                   </span>
                   <h3 className="text-lg md:text-xl font-bold font-orbitron text-gray-200 group-hover:text-white transition-colors">
                     {item.title}
                   </h3>
                 </div>
                 <p className="text-gray-400 text-sm md:text-base leading-relaxed group-hover:text-gray-300 transition-colors">
                   {item.desc}
                 </p>
               </div>
             </div>
           ))}
        </div>

        {/* 右侧：创始人与团队展示 */}
        <div className="bg-black/20 rounded-2xl p-6 border border-white/5 hover:border-accent/30 transition-all duration-500">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-orbitron">
             <User className="text-accent" /> {teamT.title}
           </h3>
           <p className="text-gray-400 text-sm mb-8">
             {teamT.desc}
           </p>

           <div className="grid grid-cols-2 gap-4">
              {TEAM.map((member, idx) => (
                <div 
                  key={idx}
                  onClick={() => openModal(`${member.role[lang]}: ${member.name}`, member.description[lang])}
                  className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 cursor-pointer transition-all hover:-translate-y-1 group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={member.avatar || `https://picsum.photos/seed/${idx + 100}/100`}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover filter grayscale group-hover:grayscale-0 transition-all"
                    />
                    <div>
                      <div className="font-bold text-sm text-gray-200">{member.name}</div>
                      <div className="text-[10px] text-accent uppercase tracking-wider">{member.role[lang]}</div>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AboutStory;
