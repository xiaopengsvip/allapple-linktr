import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;     // 允许传入额外的样式类
  onClick?: () => void;   // 点击事件处理
  hoverEffect?: boolean;  // 是否启用悬停浮动效果
}

/**
 * GlassCard 组件
 * 这是一个可复用的容器组件，实现了“毛玻璃”拟态风格。
 * 包含背景模糊、半透明背景、柔和的边框和阴影。
 */
export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  onClick,
  hoverEffect = false 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden
        backdrop-blur-2xl
        /* 精细调整的透明度，打造高级质感 */
        bg-white/60 dark:bg-slate-900/50
        
        /* 细微的边框，增强层次感 */
        border border-white/40 dark:border-white/10
        
        /* 平滑的阴影 */
        shadow-[0_8px_30px_rgb(0,0,0,0.04)]
        dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]
        
        rounded-2xl
        transition-all duration-300 ease-out
        
        /* 条件渲染悬停效果：上浮、增强阴影和边框发光 */
        ${hoverEffect ? 'hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(8,112,184,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-primary-300/50 dark:hover:border-primary-500/30 cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* 内部光泽渐变覆盖层，增加玻璃的质感 */ }
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-white/5 dark:via-transparent dark:to-transparent pointer-events-none" />
      
      {children}
    </div>
  );
};