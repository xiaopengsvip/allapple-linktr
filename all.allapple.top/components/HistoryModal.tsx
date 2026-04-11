import React from 'react';
import { X, Trash2, ExternalLink } from 'lucide-react';
import { VideoHistoryItem } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: VideoHistoryItem[];
  onClear: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onClear }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#121212] border border-white/10 rounded-2xl shadow-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-bold">观看历史</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center text-gray-500 py-10">暂无历史记录</div>
          ) : (
            history.map((item, idx) => (
              <div key={idx} className="flex flex-col p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-emerald-400 font-mono">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300"
                  >
                    链接 <ExternalLink size={10} />
                  </a>
                </div>
                <div className="text-xs text-gray-400 break-all line-clamp-2 font-mono bg-black/30 p-2 rounded">
                  {item.url}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-end">
          <button 
            onClick={onClear}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium"
          >
            <Trash2 size={16} />
            清除记录
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
