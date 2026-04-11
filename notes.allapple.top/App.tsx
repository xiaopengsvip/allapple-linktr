import React, { useState, useEffect } from 'react';
import { Plus, Search, Moon, Sun, Download, Upload, Trash2, Bot, Menu, X, Sparkles, LayoutGrid } from 'lucide-react';
import { GlassCard } from './components/GlassCard';
import { NoteModal } from './components/NoteModal';
import { Note, NoteFormData, NoteHistoryItem } from './types';
import { summarizeNote } from './services/geminiService';
import { marked } from 'marked';

const App: React.FC = () => {
  // 核心状态管理
  const [notes, setNotes] = useState<Note[]>([]); // 笔记列表
  const [isDarkMode, setIsDarkMode] = useState(true); // 暗色模式开关
  const [searchQuery, setSearchQuery] = useState(''); // 搜索关键词
  const [isModalOpen, setIsModalOpen] = useState(false); // 模态框可见性
  const [editingNote, setEditingNote] = useState<Note | null>(null); // 当前正在编辑的笔记
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 移动端菜单开关
  const [isLoadingAI, setIsLoadingAI] = useState<string | null>(null); // AI 加载状态（存储正在处理的 Note ID）

  // 初始化：从 LocalStorage 加载笔记
  useEffect(() => {
    const savedNotes = localStorage.getItem('glassnote_data');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error("Failed to load notes", e);
      }
    }
  }, []);

  // 副作用：同步主题和笔记数据到 LocalStorage
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('glassnote_theme', JSON.stringify(isDarkMode));
    localStorage.setItem('glassnote_data', JSON.stringify(notes));
  }, [isDarkMode, notes]);

  // 处理保存笔记（新建或更新）
  const handleSaveNote = (data: NoteFormData) => {
    if (editingNote) {
      // 更新现有笔记逻辑
      
      // 1. 创建历史记录项（保存修改前的状态）
      const historyItem: NoteHistoryItem = {
        timestamp: Date.now(),
        title: editingNote.title,
        content: editingNote.content
      };

      // 2. 限制历史记录数量为最近 20 条
      const updatedHistory = [historyItem, ...(editingNote.history || [])].slice(0, 20);

      // 3. 更新笔记列表
      setNotes(notes.map(n => n.id === editingNote.id ? { 
        ...n, 
        ...data, 
        history: updatedHistory,
        timestamp: Date.now(),
        date: new Date().toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      } : n));
    } else {
      // 创建新笔记逻辑
      const newNote: Note = {
        id: Date.now().toString(),
        ...data,
        date: new Date().toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        history: []
      };
      setNotes([newNote, ...notes]); // 添加到列表头部
    }
    setIsModalOpen(false);
    setEditingNote(null);
  };

  // 处理删除笔记
  const handleDeleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // 防止触发 Card 点击事件
    if (window.confirm('确定要删除这条笔记吗？')) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  // 导出笔记为 JSON 文件
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notes_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 导入笔记 JSON 文件
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target?.result as string);
          if (Array.isArray(imported)) {
             // 合并导入的笔记，避免重复 ID
             setNotes(prev => [...imported.filter((n: any) => !prev.find(p => p.id === n.id)), ...prev]);
             alert('笔记导入成功！');
          }
        } catch (err) {
          alert('无效的 JSON 文件');
        }
      };
      reader.readAsText(file);
    }
  };

  // 调用 AI 服务生成摘要
  const handleAISummary = async (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    if (!process.env.API_KEY) {
        alert("未找到 API Key，请配置环境变量。");
        return;
    }
    
    setIsLoadingAI(note.id);
    const summary = await summarizeNote(note.content);
    
    const updatedNote = {
        ...note,
        aiSummary: summary
    };
    
    setNotes(notes.map(n => n.id === note.id ? updatedNote : n));
    setIsLoadingAI(null);
  };

  // 搜索过滤
  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 渲染 Markdown 内容预览
  const getRenderedContent = (markdown: string) => {
    try {
        const html = marked.parse(markdown) as string;
        return { __html: html };
    } catch(e) {
        return { __html: markdown };
    }
  }

  // 定义分类徽章颜色样式
  const getCategoryColor = (cat: string) => {
      switch(cat) {
          case '工作': return 'text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-500/20 border-blue-200 dark:border-blue-500/30';
          case '个人': return 'text-purple-600 bg-purple-100 dark:text-purple-300 dark:bg-purple-500/20 border-purple-200 dark:border-purple-500/30';
          case '学习': return 'text-emerald-600 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/30';
          case '灵感': return 'text-amber-600 bg-amber-100 dark:text-amber-300 dark:bg-amber-500/20 border-amber-200 dark:border-amber-500/30';
          default: return 'text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-500/20 border-slate-200 dark:border-slate-500/30';
      }
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-primary-500 selection:text-white ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
      
      {/* 背景视频容器 */}
      <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden">
         {/* 
            video 标签配置：
            poster: 视频加载前显示的占位图
            src: 视频文件路径 (例如: src="video/your-file.mp4") 
         */}
         <video 
            autoPlay 
            loop 
            muted 
            playsInline
            poster="https://images.unsplash.com/photo-1534796636912-3b95b3ab5980?q=80&w=2672&auto=format&fit=crop"
            className="w-full h-full object-cover scale-105"
         >
            {/* 替换下方的 src 为你的视频地址 */}
            <source src="https://cdn.coverr.co/videos/coverr-gradient-purple-blue-loop-5536/1080p.mp4" type="video/mp4" />
            Your browser does not support the video tag.
         </video>

         {/* 渐变遮罩层，提高文字可读性 */}
         <div className={`absolute inset-0 transition-colors duration-700 ${isDarkMode ? 'bg-slate-950/70 backdrop-blur-sm' : 'bg-slate-50/50 backdrop-blur-sm'}`} />
         
         {/* 晕影效果 (边缘变暗) */}
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
      </div>

      {/* 顶部导航栏 */}
      <nav className="fixed top-0 w-full z-40 px-4 md:px-6 py-4">
        <GlassCard className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between !bg-white/70 dark:!bg-slate-900/60 !backdrop-blur-xl">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <span className="font-display font-bold text-xl text-white">N</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-display font-bold text-lg leading-tight tracking-wide text-slate-800 dark:text-white">GlassNote</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">AI Powered</span>
                </div>
            </div>

            {/* 桌面端菜单 */}
            <div className="hidden md:flex items-center gap-4">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="搜索想法..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all w-64 text-slate-800 dark:text-white"
                    />
                </div>
                
                <div className="h-6 w-px bg-slate-300 dark:bg-white/10 mx-2"></div>

                <div className="flex gap-1">
                    <button onClick={handleExport} className="p-2 hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-full transition-colors text-slate-600 dark:text-slate-300" title="导出">
                        <Download size={20} />
                    </button>
                    <label className="p-2 hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer text-slate-600 dark:text-slate-300" title="导入">
                        <Upload size={20} />
                        <input type="file" onChange={handleImport} className="hidden" accept=".json" />
                    </label>
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-full transition-colors">
                        {isDarkMode ? <Sun size={20} className="text-amber-300" /> : <Moon size={20} className="text-primary-600" />}
                    </button>
                </div>
            </div>

            {/* 移动端菜单切换按钮 */}
            <button className={`${isDarkMode ? 'text-white' : 'text-slate-900'} md:hidden`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
        </GlassCard>

        {/* 移动端下拉菜单 */}
        {isMobileMenuOpen && (
            <GlassCard className="mt-2 p-4 flex flex-col gap-4 md:hidden animate-fade-in">
                <input 
                    type="text" 
                    placeholder="搜索..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-100/50 dark:bg-white/5 p-3 rounded-lg text-slate-800 dark:text-white w-full border border-slate-200 dark:border-white/10"
                />
                <div className="grid grid-cols-3 gap-2 text-slate-800 dark:text-white">
                     <button onClick={handleExport} className="flex flex-col items-center gap-2 text-xs p-2 rounded-lg hover:bg-white/10"><Download size={20}/> 导出</button>
                     <label className="flex flex-col items-center gap-2 text-xs p-2 rounded-lg hover:bg-white/10"><Upload size={20}/> 导入 <input type="file" onChange={handleImport} className="hidden" /></label>
                     <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex flex-col items-center gap-2 text-xs p-2 rounded-lg hover:bg-white/10">{isDarkMode ? <><Sun size={20}/> 浅色</> : <><Moon size={20}/> 深色</>}</button>
                </div>
            </GlassCard>
        )}
      </nav>

      {/* 主内容区域 */}
      <main className="pt-36 pb-24 px-4 md:px-6 max-w-7xl mx-auto">
        {notes.length === 0 ? (
            // 空状态显示
            <div className={`text-center mt-20 backdrop-blur-xl p-10 rounded-3xl inline-block relative left-1/2 -translate-x-1/2 border shadow-2xl ${isDarkMode ? 'bg-slate-900/60 border-white/10 text-white' : 'bg-white/70 border-white/50 text-slate-800'}`}>
                <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center border-2 ${isDarkMode ? 'bg-slate-800/50 border-white/10' : 'bg-white/50 border-primary-100'}`}>
                    <LayoutGrid size={40} className="text-primary-500" />
                </div>
                <h3 className="text-3xl font-display font-bold mb-3">开启你的笔记之旅</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">记录灵感，整理思绪，AI 辅助。</p>
                <button 
                    onClick={() => {
                        setEditingNote(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-1"
                >
                    创建第一条笔记
                </button>
            </div>
        ) : (
            // 笔记网格列表
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                {filteredNotes.map((note) => (
                    <GlassCard 
                        key={note.id} 
                        hoverEffect={true} 
                        onClick={() => {
                            setEditingNote(note);
                            setIsModalOpen(true);
                        }}
                        className={`min-h-[16rem] h-auto flex flex-col p-6 group ${!isDarkMode ? 'text-slate-800' : 'text-white'}`}
                    >
                        {/* 笔记卡片头部：分类和心情 */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${getCategoryColor(note.category)}`}>
                                    {note.category}
                                </span>
                            </div>
                            <span className="text-xs font-medium opacity-60 bg-white/10 px-2 py-1 rounded-full">{note.mood}</span>
                        </div>
                        
                        {/* 标题 */}
                        <h3 className={`text-xl font-bold mb-3 line-clamp-1 transition-colors group-hover:text-primary-500 dark:group-hover:text-primary-400`}>{note.title || '无标题笔记'}</h3>
                        
                        {/* 笔记内容摘要 (Markdown渲染后截断) */}
                        <div className="flex-grow relative mb-4 overflow-hidden">
                             <div 
                                className={`text-sm leading-relaxed prose dark:prose-invert line-clamp-5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}
                                dangerouslySetInnerHTML={getRenderedContent(note.content)}
                             />
                            {/* 底部渐隐效果 */}
                            {!note.aiSummary && (
                                <div className={`absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t ${isDarkMode ? 'from-slate-900/40' : 'from-white/60'} to-transparent`}></div>
                            )}
                        </div>

                        {/* AI 摘要展示 */}
                        {note.aiSummary && (
                            <div className={`mb-4 p-3.5 rounded-xl border text-sm backdrop-blur-sm animate-fade-in ${isDarkMode ? 'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-100' : 'bg-fuchsia-50 border-fuchsia-100 text-fuchsia-800'}`}>
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <Sparkles size={14} className="text-fuchsia-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-90 text-fuchsia-500">AI 摘要</span>
                                </div>
                                <p className="leading-relaxed opacity-90 line-clamp-3 text-xs">{note.aiSummary}</p>
                            </div>
                        )}

                        {/* 卡片底部：日期和操作按钮 */}
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200 dark:border-white/5">
                            <span className="text-xs text-slate-400 font-mono">{note.date.split(' ')[0]}</span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300">
                                <button 
                                    onClick={(e) => handleAISummary(e, note)}
                                    disabled={!!isLoadingAI}
                                    className={`p-2 rounded-lg ${isLoadingAI === note.id ? 'bg-fuchsia-500 animate-pulse text-white' : isDarkMode ? 'bg-white/5 hover:bg-fuchsia-500/20 text-fuchsia-400' : 'bg-slate-100 hover:bg-fuchsia-100 text-fuchsia-600'} transition-all`}
                                    title="生成 AI 总结"
                                >
                                    <Bot size={16} />
                                </button>
                                <button 
                                    onClick={(e) => handleDeleteNote(e, note.id)}
                                    className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5 hover:bg-red-500/20 text-red-400' : 'bg-slate-100 hover:bg-red-100 text-red-600'} transition-all`}
                                    title="删除"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        )}
      </main>

      {/* 悬浮添加按钮 (FAB) */}
      <button
        onClick={() => {
            setEditingNote(null);
            setIsModalOpen(true);
        }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-indigo-500 via-primary-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-500/40 hover:scale-105 active:scale-95 transition-all z-30 group border border-white/20"
      >
        <Plus size={32} className="text-white group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* 页脚 */}
      <footer className="fixed bottom-0 w-full z-10 pointer-events-none">
        <div className="max-w-7xl mx-auto px-6 pb-2">
            <div className={`text-center text-[10px] uppercase tracking-widest font-semibold backdrop-blur-md py-2 rounded-t-xl inline-block px-6 left-1/2 relative -translate-x-1/2 shadow-lg ${isDarkMode ? 'text-slate-400 bg-slate-900/80 border-t border-x border-white/10' : 'text-slate-500 bg-white/80 border-t border-x border-white/60'}`}>
                © {new Date().getFullYear()} GlassNote AI • {notes.length} 条笔记
            </div>
        </div>
      </footer>

      {/* 新建/编辑/查看 模态框 */}
      <NoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
        initialData={editingNote}
      />

    </div>
  );
};

export default App;