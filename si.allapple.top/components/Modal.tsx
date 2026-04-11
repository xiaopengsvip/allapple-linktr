
import React from 'react';
import { X } from 'lucide-react';
import { STYLES } from '../constants';

interface ModalProps {
  isOpen: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, content, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4"
      onClick={handleBackdropClick}
    >
      <div className={`${STYLES.glassModal} p-6 rounded-2xl w-full max-w-lg shadow-lg animate-slide-left relative text-white`}>
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors hover:rotate-90 duration-500"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 font-orbitron">{title}</h2>
        <p className="text-gray-200 leading-relaxed">{content}</p>
      </div>
    </div>
  );
};

export default Modal;
