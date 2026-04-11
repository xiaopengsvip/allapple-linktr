import React from 'react';
import { motion } from 'framer-motion';
import { Music, Play, Pause, Volume2, VolumeX, Video } from 'lucide-react';
import { Language, translations } from '../translations';

interface MediaControlsProps {
  isPlayingMusic: boolean;
  toggleMusic: () => void;
  isPlayingVideo: boolean;
  toggleVideo: () => void;
  isMutedVideo: boolean;
  toggleMuteVideo: () => void;
  lang: Language;
}

const ControlButton: React.FC<{ onClick: () => void; label: string; active?: boolean; children: React.ReactNode }> = ({ onClick, label, active, children }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    title={label}
    className={`
      w-12 h-12 rounded-full flex items-center justify-center
      border backdrop-blur-md shadow-lg transition-colors
      ${active 
        ? 'bg-white/90 text-black border-white' 
        : 'bg-black/40 text-white border-white/20 hover:bg-black/60'}
    `}
  >
    {children}
  </motion.button>
);

const MediaControls: React.FC<MediaControlsProps> = ({
  isPlayingMusic,
  toggleMusic,
  isPlayingVideo,
  toggleVideo,
  isMutedVideo,
  toggleMuteVideo,
  lang,
}) => {
  const t = translations[lang];

  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
    >
      <ControlButton onClick={toggleMusic} label={t.music} active={isPlayingMusic}>
        <Music size={20} className={isPlayingMusic ? "animate-pulse" : ""} />
      </ControlButton>
      
      <ControlButton onClick={toggleVideo} label={t.videoBg} active={isPlayingVideo}>
        {isPlayingVideo ? <Pause size={20} /> : <Play size={20} />}
      </ControlButton>
      
      <ControlButton onClick={toggleMuteVideo} label={t.muteVideo} active={!isMutedVideo}>
        {isMutedVideo ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </ControlButton>
    </motion.div>
  );
};

export default MediaControls;