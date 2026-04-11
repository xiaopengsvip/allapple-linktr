import React from 'react';
import { X } from 'lucide-react';
import { STYLES } from '../constants';

interface VideoModalProps {
  isOpen: boolean;
  src: string;
  poster?: string;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, src, poster, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className={`${STYLES.glassModal} relative w-full max-w-4xl rounded-2xl overflow-hidden`} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-20 text-gray-300 hover:text-white">
          <X size={26} />
        </button>
        <video className="w-full h-auto bg-black" controls poster={poster} src={src}>
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoModal;
