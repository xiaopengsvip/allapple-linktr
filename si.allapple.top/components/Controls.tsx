
import React, { useState, useRef, useEffect } from 'react';
import { Music, Pause, Play, Volume2, VolumeX, Bot, Share2, SkipForward } from 'lucide-react';
import { MUSIC_PLAYLIST, STYLES } from '../constants';

interface ControlsProps {
  bgVideoRef: React.RefObject<HTMLVideoElement>;
  onToggleAi: () => void;
  isAiOpen: boolean;
  onShare: (e: React.MouseEvent) => void;
}

const Controls: React.FC<ControlsProps> = ({ bgVideoRef, onToggleAi, isAiOpen, onShare }) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 初始化音频
  useEffect(() => {
    // 随机选择一首开始
    const startIndex = Math.floor(Math.random() * MUSIC_PLAYLIST.length);
    setCurrentSongIndex(startIndex);

    audioRef.current = new Audio(MUSIC_PLAYLIST[startIndex]);
    audioRef.current.volume = 0.5;

    // 监听播放结束，自动播放下一首
    const handleEnded = () => {
      playNextSong();
    };

    audioRef.current.addEventListener('ended', handleEnded);
    // 如果加载或播放出错，自动跳到下一首并记录
    const handleError = (e: any) => {
      console.error('Audio error:', e);
      playNextSong();
    };
    audioRef.current.addEventListener('error', handleError);

    return () => {
      audioRef.current?.removeEventListener('ended', handleEnded);
      audioRef.current?.removeEventListener('error', handleError);
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const playNextSong = () => {
    if (!audioRef.current) return;
    
    // 计算下一首索引 (循环播放)
    let nextIndex = currentSongIndex + 1;
    if (nextIndex >= MUSIC_PLAYLIST.length) {
      nextIndex = 0;
    }

    // 更新索引
    setCurrentSongIndex(nextIndex);
    
    // 切换源并播放
    audioRef.current.src = MUSIC_PLAYLIST[nextIndex];
    audioRef.current.play()
      .then(() => setIsPlayingMusic(true))
      .catch(e => {
        console.error("Auto-play blocked or file missing:", e);
        setIsPlayingMusic(false);
      });
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
    setIsPlayingMusic(!isPlayingMusic);
  };

  const toggleVideo = () => {
    if (!bgVideoRef.current) return;
    if (isPlayingVideo) {
      bgVideoRef.current.pause();
    } else {
      bgVideoRef.current.play();
    }
    setIsPlayingVideo(!isPlayingVideo);
  };

  const toggleSound = () => {
    if (!bgVideoRef.current) return;
    bgVideoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className={`fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-[99] flex items-center gap-2 md:gap-3 px-4 py-2 md:px-5 md:py-3 ${STYLES.glassFloating} rounded-full transition-all scale-90 md:scale-100 origin-bottom hover:scale-105 hover:border-white/30`}>
      
      {/* 音乐控制: 单击暂停/播放，双击下一首 */}
      <button 
        onClick={toggleMusic} 
        onDoubleClick={playNextSong}
        title={`Music: ${MUSIC_PLAYLIST[currentSongIndex].split('/').pop()} (Double click for next)`} 
        className={`p-2 rounded-full transition-all hover:bg-white/10 ${isPlayingMusic ? 'text-accent' : 'text-gray-300'}`}
      >
        {isPlayingMusic ? <Pause size={18} className="animate-pulse" /> : <Music size={18} />}
      </button>

      {/* 当前曲目名（友好展示） */}
      <div className="hidden sm:flex items-center text-xs text-gray-300 ml-2 max-w-[180px] truncate">
        {MUSIC_PLAYLIST[currentSongIndex] ? MUSIC_PLAYLIST[currentSongIndex].split('/').pop() : ''}
      </div>

      <div className="w-[1px] h-4 md:h-5 bg-white/10"></div>

      <button onClick={toggleVideo} title="Video" className={`p-2 rounded-full transition-all hover:bg-white/10 ${!isPlayingVideo ? 'text-red-400' : 'text-gray-300'}`}>
        {isPlayingVideo ? <Pause size={18} /> : <Play size={18} />}
      </button>

      <button onClick={toggleSound} title="Mute" className={`p-2 rounded-full transition-all hover:bg-white/10 ${!isMuted ? 'text-white' : 'text-gray-400'}`}>
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <div className="w-[1px] h-4 md:h-5 bg-white/10"></div>

      <button onClick={onToggleAi} title="AI Assistant" className={`p-2 rounded-full transition-all relative group hover:bg-white/10 ${isAiOpen ? 'text-accent' : 'text-gray-300'}`}>
        <Bot size={20} className={isAiOpen ? 'animate-bounce' : 'group-hover:scale-110'} />
        {isAiOpen && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent rounded-full animate-ping"></span>}
      </button>
      
      <div className="w-[1px] h-4 md:h-5 bg-white/10"></div>

      <button onClick={onShare} title="Share" className="p-2 rounded-full transition-all hover:bg-white/10 text-gray-300 hover:text-accent">
         <Share2 size={18} />
      </button>

    </div>
  );
};

export default Controls;
