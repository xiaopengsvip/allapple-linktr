import React from 'react';
import { Bold, Italic, List, Heading, Code, Quote, Eye, Edit3 } from 'lucide-react';
import { marked } from 'marked';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Markdown 编辑器组件
 * 支持基础的 Markdown 语法插入（加粗、斜体、列表等）
 * 支持实时预览模式切换
 */
export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange, placeholder, className }) => {
  const [isPreview, setIsPreview] = React.useState(false); // 控制预览/编辑模式状态
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // 在光标位置插入 Markdown 语法的辅助函数
  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    // 拼接新文本：前缀 + 选中文本 + 后缀
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // 重新聚焦并保持选中状态（如果需要）或将光标移至中间
    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  // 将 Markdown 转换为 HTML
  const getHtml = (markdown: string) => {
    try {
      return { __html: marked.parse(markdown) as string };
    } catch (e) {
      return { __html: 'Parsing error' };
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
        {/* 工具栏区域 */}
        <div className="flex items-center justify-between gap-2 mb-2 p-2 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5">
            <div className="flex gap-1">
                <button onClick={() => insertText('**', '**')} className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors" title="加粗">
                    <Bold size={18} className="text-gray-700 dark:text-gray-200" />
                </button>
                <button onClick={() => insertText('*', '*')} className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors" title="斜体">
                    <Italic size={18} className="text-gray-700 dark:text-gray-200" />
                </button>
                <button onClick={() => insertText('# ')} className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors" title="标题">
                    <Heading size={18} className="text-gray-700 dark:text-gray-200" />
                </button>
                <button onClick={() => insertText('- ')} className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors" title="列表">
                    <List size={18} className="text-gray-700 dark:text-gray-200" />
                </button>
                <button onClick={() => insertText('> ')} className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors" title="引用">
                    <Quote size={18} className="text-gray-700 dark:text-gray-200" />
                </button>
                <button onClick={() => insertText('`', '`')} className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors" title="代码">
                    <Code size={18} className="text-gray-700 dark:text-gray-200" />
                </button>
            </div>
            
            {/* 预览切换按钮 */}
            <button 
                onClick={() => setIsPreview(!isPreview)} 
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isPreview ? 'bg-blue-500 text-white' : 'hover:bg-black/10 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200'}`}
            >
                {isPreview ? <><Edit3 size={16}/> 编辑</> : <><Eye size={16}/> 预览</>}
            </button>
        </div>

        {/* 编辑区域 */}
        <div className="flex-grow relative bg-white/40 dark:bg-black/20 rounded-xl border border-black/5 dark:border-white/5 overflow-hidden">
            {isPreview ? (
                // 预览视图
                <div 
                    className="w-full h-full p-4 overflow-y-auto custom-scrollbar prose dark:prose-invert"
                    dangerouslySetInnerHTML={getHtml(value || '*(空内容)*')}
                />
            ) : (
                // 文本输入视图
                <textarea
                    ref={textareaRef}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-full p-4 bg-transparent resize-none focus:outline-none custom-scrollbar text-gray-800 dark:text-gray-100 font-mono text-base leading-relaxed"
                />
            )}
        </div>
    </div>
  );
};