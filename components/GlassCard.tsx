import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  noPadding?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', delay = 0, noPadding = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 100, damping: 20 }}
      className={`
        relative overflow-hidden
        bg-white/10 backdrop-blur-3xl saturate-150
        border border-white/20
        shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
        rounded-[32px]
        ${noPadding ? '' : 'p-6'}
        ${className}
      `}
    >
      {/* Subtle shine effect */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;