import React, { useState, useEffect } from 'react';
import { 
  Volume2, VolumeX, Gauge, 
  Eye, EyeOff, Download, Music
} from 'lucide-react';
import { MediaType } from '../types';

interface ControlsProps {
  isPlaying: boolean;
  togglePlay: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  playbackRate: number;
  changeSpeed: () => void;
  isCleanMode: boolean;
  toggleCleanMode: () => void;
  downloadVideo: () => void;
  currentVideoDuration: number;
  currentVideoTime: number;
  onSeek: (time: number) => void;
  mediaType: MediaType;
}

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

interface ActionItemProps {
  onClick: () => void;
  label: string;
  tooltip?: string;
  children: React.ReactNode;
}

const ActionItem: React.FC<ActionItemProps> = ({ onClick, children, label, tooltip }) => (
    <div 
        className="flex flex-col items-center gap-1 group cursor-pointer" 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        title={tooltip}
    >
        <div className="w-12 h-12 rounded-full bg-black/40 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all active:scale-90 border border-white/10 text-white shadow-lg group-hover:border-white/30 group-hover:shadow-white/10">
            {children}
        </div>
        <span className="text-[10px] font-medium text-white/90 drop-shadow-md opacity-80 group-hover:opacity-100">{label}</span>
    </div>
);

const Controls: React.FC<ControlsProps> = ({
  isPlaying, togglePlay,
  isMuted, toggleMute,
  playbackRate, changeSpeed,
  isCleanMode, toggleCleanMode,
  downloadVideo,
  currentVideoDuration,
  currentVideoTime,
  onSeek,
  mediaType
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentVideoDuration > 0) {
      setProgress((currentVideoTime / currentVideoDuration) * 100);
    } else {
        setProgress(0);
    }
  }, [currentVideoTime, currentVideoDuration]);

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mediaType === 'image') return;
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * currentVideoDuration;
    onSeek(newTime);
  };

  if (isCleanMode) {
    return (
      <button 
        onClick={toggleCleanMode}
        title="Show UI"
        className="absolute bottom-6 right-6 z-50 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 text-white/70 hover:text-white shadow-lg animate-fade-in hover:scale-110 transition-transform"
      >
        <Eye className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-40 flex flex-col justify-between p-4">
        {/* Top Gradient Overlay */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        
        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        {/* Right Side Vertical Actions */}
        <div className="absolute right-2 bottom-20 flex flex-col gap-4 pointer-events-auto items-center">
            
            {mediaType === 'video' && (
                <>
                    <ActionItem onClick={toggleMute} label={isMuted ? "Unmute" : "Mute"} tooltip="Toggle Mute (M)">
                        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </ActionItem>

                    <ActionItem onClick={changeSpeed} label={`${playbackRate}x`} tooltip="Change Speed">
                        <div className="flex flex-col items-center">
                            <Gauge size={24} />
                            <span className="text-[10px] font-bold mt-1">{playbackRate}x</span>
                        </div>
                    </ActionItem>
                </>
            )}

            <ActionItem onClick={downloadVideo} label="Save" tooltip="Download">
                 <Download size={24} />
            </ActionItem>

            <ActionItem onClick={toggleCleanMode} label="Clean" tooltip="Hide UI">
                 <EyeOff size={24} />
            </ActionItem>
            
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-600 border-2 border-white/20 flex items-center justify-center animate-[spin_3s_linear_infinite] mt-2 shadow-lg">
                 <Music size={16} />
            </div>
        </div>

        {/* Bottom Area: Info & Progress */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-3 pointer-events-auto">
             {/* Progress Bar - Only visible for videos or read-only for images */}
             <div 
                className={`w-full flex items-center gap-3 group py-2 select-none ${mediaType === 'video' ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={handleProgressBarClick}
                title={mediaType === 'video' ? "Seek" : "Auto Advance Progress"}
             >
                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden relative transition-all group-hover:h-2">
                    <div 
                        className={`absolute h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] ${mediaType === 'image' ? 'bg-emerald-500' : 'bg-white'}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="text-[10px] font-mono text-white/80 w-20 text-right tabular-nums">
                    {formatTime(currentVideoTime)} / {formatTime(currentVideoDuration)}
                </div>
             </div>
        </div>
    </div>
  );
};

export default Controls;