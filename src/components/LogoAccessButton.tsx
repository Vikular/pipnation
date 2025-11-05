import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

export function LogoAccessButton() {
  const [isHovered, setIsHovered] = useState(false);

  // Only show on landing page (not in dashboard or admin)
  if (typeof window !== 'undefined' && 
      (window.location.search.includes('logo') || 
       window.location.search.includes('diagnostics') ||
       window.location.search.includes('test-auth'))) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.button
        onClick={() => window.location.href = '/?logo'}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative px-4 py-3 bg-gradient-to-r from-[#d9a55d] to-[#f0b968] text-[#030213] rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 overflow-hidden"
      >
        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#f0b968] to-[#d9a55d] opacity-0 group-hover:opacity-100 transition-opacity"
          initial={false}
          animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
        />
        
        {/* Icon */}
        <motion.div
          animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>
        
        {/* Text */}
        <span className="relative z-10 font-semibold">
          View Logo Design
        </span>
        
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: 'linear',
          }}
        />
      </motion.button>
      
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          x: isHovered ? 0 : 20,
        }}
        className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
      >
        <div className="bg-[#030213] text-white px-3 py-2 rounded-lg shadow-lg text-sm">
          See all logo variations & design system
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-[#030213]" />
        </div>
      </motion.div>
    </motion.div>
  );
}
