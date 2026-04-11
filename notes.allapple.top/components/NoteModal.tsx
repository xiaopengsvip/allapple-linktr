import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, Edit2, Calendar, Tag, Smile, ArrowLeft, Maximize2, Minimize2, Clock, RotateCcw } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { MarkdownEditor } from './MarkdownEditor';
import { Note, NoteFormData, Category, Mood, NoteHistoryItem } from '../types';
import { marked } from 'marked';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: NoteFormData) => void;
  initialData?: Note | null; // 如果存在，则为编辑模式；否则为新建模式
}

const CATEGORIES: Category[] = ['工作', '个人', '学习', '灵感', '其他'];
const MOODS: Mood[] = ['开心 😊', '兴奋 😄', '平静 😌', '中立 😐', '悲伤 😢'];

export const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  // 状态管理
  const [isEditing, setIsEditing] = useState(false); // 是否处于编辑模式
  const [isFullScreen, setIsFullScreen] = useState(false); // 是否全屏显示
  const [showHistory, setShowHistory] = useState(false); // 是否显示历史记录侧边栏
  const [viewingHistoryItem, setViewingHistoryItem] = useState<NoteHistoryItem | null>(null); // 当前正在查看的历史版本

  // 表单数据状态
  const [formData, setFormData] = useState<NoteFormData>({
    title: '',
    content: '',
    category: '个人',
    mood: '平静 😌',
  });

  // 当模态框打开或 initialData 变化时重置状态
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // 打开现有笔记 -> 进入阅读模式
        setFormData({
            title: initialData.title,
            content: initialData.content,
            category: initialData.category,
            mood: initialData.mood
        });
        setIsEditing(false);
      } else {
        // 创建新笔记 -> 进入编辑模式
        setFormData({
            title: '',
            content: '',
            category: '个人',
            mood: '平静 😌',
        });
        setIsEditing(true);
      }
      // 重置 UI 状态
      setIsFullScreen(false);
      setShowHistory(false);
      setViewingHistoryItem(null);
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    onSave(formData);
  };

  // 恢复历史版本逻辑
  const handleRestore = (item: NoteHistoryItem) => {
      if (window.confirm(`确定要将笔记恢复到 ${new Date(item.timestamp).toLocaleString()} 的版本吗？`)) {
          const restoredData = {
              title: item.title,
              content: item.content,
              category: formData.category,
              mood: formData.mood
          };
          onSave(restoredData);
      }
  };

  const getRenderedContent = (markdown: string) => {
    try {
      return { __html: marked.parse(markdown) as string };
    } catch (e) {
      return { __html: markdown };
    }
  };

  // 决定当前显示的内容（是当前最新版，还是历史版本）
  const displayTitle = viewingHistoryItem ? viewingHistoryItem.title : formData.title;
  const displayContent = viewingHistoryItem ? viewingHistoryItem.content : formData.content;

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300`}>
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* 主模态框容器 - 根据是否全屏调整样式 */}
      <div className={`z-10 bg-transparent transition-all duration-500 ease-in-out flex flex-col
          ${isFullScreen 
            ? 'w-full h-full rounded-none m-0 p-0 fixed inset-0' 
            : 'w-full max-w-4xl h-[85vh] animate-fade-in-up'
          }
      `}>
        <GlassCard className={`flex flex-col h-full overflow-hidden relative !bg-white/90 dark:!bg-slate-900/90 ${isFullScreen ? 'rounded-none border-0' : ''}`}>
            
            {/* 顶部工具栏 */}
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl z-20">
                <div className="flex items-center gap-4">
                    {/* 返回按钮逻辑：从编辑返回阅读，或从历史返回当前 */}
                    {isEditing && initialData ? (
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-500 dark:text-slate-400"
                            title="返回阅读"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    ) : viewingHistoryItem ? (
                        <button 
                            onClick={() => setViewingHistoryItem(null)}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-500 dark:text-slate-400"
                            title="返回当前版本"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    ) : null}

                    <h2 className="text-lg md:text-xl font-display font-bold text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
                        {isEditing ? (initialData ? '编辑笔记' : '新建笔记') : viewingHistoryItem ? '历史版本' : '阅读笔记'}
                    </h2>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    {/* 全屏切换按钮 */}
                    <button
                        onClick={() => setIsFullScreen(!isFullScreen)}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors hidden sm:block"
                        title={isFullScreen ? "退出全屏" : "全屏查看"}
                    >
                        {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>

                    {/* 历史记录按钮 (仅在阅读模式且有历史记录时显示) */}
                    {!isEditing && initialData && (initialData.history?.length || 0) > 0 && (
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className={`p-2 rounded-full transition-colors ${showHistory ? 'bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400' : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'}`}
                            title="历史记录"
                        >
                            <Clock size={18} />
                        </button>
                    )}

                    {/* 编辑按钮 */}
                    {!isEditing && !viewingHistoryItem && (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-primary-100 hover:bg-primary-200 dark:bg-primary-500/20 dark:hover:bg-primary-500/30 text-primary-600 dark:text-primary-400 font-medium transition-colors text-sm md:text-base"
                        >
                            <Edit2 size={16} />
                            <span className="hidden sm:inline">编辑</span>
                        </button>
                    )}
                    
                    {/* 恢复版本按钮 (仅在查看历史版本时显示) */}
                    {viewingHistoryItem && (
                         <button 
                            onClick={() => handleRestore(viewingHistoryItem)}
                            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 text-amber-600 dark:text-amber-400 font-medium transition-colors text-sm md:text-base"
                        >
                            <RotateCcw size={16} />
                            <span className="hidden sm:inline">恢复此版本</span>
                        </button>
                    )}

                    <div className="w-px h-6 bg-slate-300 dark:bg-white/10 mx-1"></div>

                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors text-slate-400 dark:text-slate-500"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* 主内容区域 */}
            <div className="flex flex-grow overflow-hidden relative">
                
                {/* 笔记内容容器 (如果历史侧边栏打开，向左腾出空间) */}
                <div className={`flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-slate-900/20 transition-all duration-300 ${showHistory && !isEditing ? 'mr-0 md:mr-72' : ''}`}>
                    
                    {/* 视图模式：阅读 */}
                    {!isEditing && (
                        <div className={`p-6 md:p-12 mx-auto animate-fade-in ${isFullScreen ? 'max-w-6xl' : 'max-w-3xl'}`}>
                            
                            {viewingHistoryItem && (
                                <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl flex items-center justify-between text-amber-800 dark:text-amber-200">
                                    <span className="text-sm font-medium flex items-center gap-2">
                                        <Clock size={16} />
                                        正在预览 {new Date(viewingHistoryItem.timestamp).toLocaleString()} 的历史版本
                                    </span>
                                </div>
                            )}

                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-8 leading-tight tracking-tight">
                                {displayTitle || <span className="text-slate-300 dark:text-slate-600 italic">无标题</span>}
                            </h1>

                            <div className="flex flex-wrap gap-3 mb-10 text-sm font-medium">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20">
                                    <Calendar size={14} />
                                    <span>{initialData?.date || new Date().toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-500/20">
                                    <Tag size={14} />
                                    <span>{formData.category}</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-100 dark:border-orange-500/20">
                                    <Smile size={14} />
                                    <span>{formData.mood}</span>
                                </div>
                            </div>

                            {/* AI 摘要展示区域 */}
                            {initialData?.aiSummary && !viewingHistoryItem && (
                                <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-fuchsia-50 to-purple-50 dark:from-fuchsia-900/10 dark:to-purple-900/10 border border-fuchsia-100 dark:border-fuchsia-500/20">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-lg shadow-md shadow-purple-500/20">
                                            <Sparkles size={16} />
                                        </div>
                                        <span className="font-bold text-fuchsia-900 dark:text-fuchsia-200">AI 智能总结</span>
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                                        {initialData.aiSummary}
                                    </p>
                                </div>
                            )}

                            {/* Markdown 渲染内容 */}
                            <div 
                                className="prose dark:prose-invert prose-lg max-w-none text-slate-700 dark:text-slate-300"
                                dangerouslySetInnerHTML={getRenderedContent(displayContent)}
                            />
                        </div>
                    )}

                    {/* 视图模式：编辑 */}
                    {isEditing && (
                        <div className={`p-6 md:p-10 flex flex-col gap-6 h-full animate-fade-in ${isFullScreen ? 'max-w-6xl mx-auto w-full' : ''}`}>
                            <input
                                type="text"
                                placeholder="输入标题..."
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-700 focus:border-primary-500 dark:focus:border-primary-500 rounded-none px-0 py-4 text-3xl font-bold text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none transition-all"
                            />

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <label className="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 pl-1 font-bold">分类</label>
                                    <div className="relative group">
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value as Category})}
                                            className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer transition-all hover:border-primary-300"
                                        >
                                            {CATEGORIES.map(c => <option key={c} value={c} className="bg-white dark:bg-slate-800">{c}</option>)}
                                        </select>
                                        <div className="absolute right-4 top-4 pointer-events-none text-slate-400">▼</div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 pl-1 font-bold">心情</label>
                                    <div className="relative group">
                                         <select
                                            value={formData.mood}
                                            onChange={(e) => setFormData({...formData, mood: e.target.value as Mood})}
                                            className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer transition-all hover:border-primary-300"
                                        >
                                            {MOODS.map(m => <option key={m} value={m} className="bg-white dark:bg-slate-800">{m}</option>)}
                                        </select>
                                        <div className="absolute right-4 top-4 pointer-events-none text-slate-400">▼</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-grow min-h-[300px] bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-inner flex flex-col">
                                <MarkdownEditor 
                                    value={formData.content}
                                    onChange={(val) => setFormData({...formData, content: val})}
                                    placeholder="在此记录你的想法..."
                                    className="h-full"
                                />
                            </div>

                            <div className="flex justify-end pt-2 pb-6">
                                 <button
                                    onClick={handleSave}
                                    className="px-8 py-3.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-primary-600/30 transform transition-all active:scale-95 flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    <span>{initialData ? '保存修改' : '创建笔记'}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 历史记录侧边栏 */}
                <div className={`absolute md:absolute top-0 right-0 h-full w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200 dark:border-slate-800 shadow-2xl transform transition-transform duration-300 z-30 ${showHistory && !isEditing ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-sm uppercase tracking-wide">
                            <Clock size={16} className="text-primary-500" /> 版本历史
                        </h3>
                        <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"><X size={16}/></button>
                    </div>
                    <div className="overflow-y-auto h-full pb-20 p-3 bg-slate-50/50 dark:bg-black/20">
                        {initialData?.history && initialData.history.length > 0 ? (
                            <div className="flex flex-col gap-3 relative">
                                {/* 连接线 */}
                                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 z-0"></div>
                                
                                {/* 当前版本项 */}
                                <button
                                    onClick={() => setViewingHistoryItem(null)}
                                    className={`relative z-10 p-4 rounded-xl text-left transition-all border shadow-sm group ${!viewingHistoryItem ? 'bg-white dark:bg-slate-800 border-primary-500 ring-1 ring-primary-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary-300'}`}
                                >
                                    <div className={`w-3 h-3 rounded-full absolute -left-[1.6rem] top-1/2 -translate-y-1/2 border-2 ${!viewingHistoryItem ? 'bg-primary-500 border-primary-200' : 'bg-slate-300 border-slate-100 dark:bg-slate-600 dark:border-slate-800'}`}></div>
                                    <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">当前最新版本</div>
                                    <div className="text-xs text-slate-500">刚刚</div>
                                </button>

                                {/* 历史版本列表 */}
                                {initialData.history.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setViewingHistoryItem(item)}
                                        className={`relative z-10 p-4 rounded-xl text-left transition-all border shadow-sm group ${viewingHistoryItem === item ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-500 ring-1 ring-amber-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                                    >
                                        <div className={`w-3 h-3 rounded-full absolute -left-[1.6rem] top-1/2 -translate-y-1/2 border-2 ${viewingHistoryItem === item ? 'bg-amber-500 border-amber-200' : 'bg-slate-300 border-slate-100 dark:bg-slate-600 dark:border-slate-800'}`}></div>
                                        <div className="font-bold text-sm text-slate-700 dark:text-slate-200 mb-1 truncate">{item.title || '无标题'}</div>
                                        <div className="text-xs text-slate-400 group-hover:text-slate-500">{new Date(item.timestamp).toLocaleString()}</div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center mt-20 text-slate-400">
                                <Clock size={40} className="mb-4 opacity-20" />
                                <p className="text-xs">暂无历史记录</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </GlassCard>
      </div>
    </div>
  );
};