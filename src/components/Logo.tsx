import { motion } from 'motion/react';
import logoImage from 'figma:asset/e2e2f1ae8441670fc3154c69225d8cc55dbcf229.png';

interface LogoProps {
  variant?: 'default' | 'compact' | 'icon-only';
  className?: string;
  animated?: boolean;
}

export function Logo({ variant = 'default', className = '', animated = true }: LogoProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0, rotate: -10 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.7,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
    hover: {
      scale: 1.05,
      rotate: 2,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const glowVariants = {
    initial: { opacity: 0.3 },
    animate: {
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const MotionWrapper = animated ? motion.div : 'div';
  const MotionIcon = animated ? motion.div : 'div';
  const MotionText = animated ? motion.div : 'div';
  const MotionGlow = animated ? motion.div : 'div';

  const wrapperProps = animated
    ? {
        initial: 'hidden',
        animate: 'visible',
        variants: containerVariants,
        whileHover: 'hover',
      }
    : {};

  const iconWrapperProps = animated
    ? {
        variants: iconVariants,
      }
    : {};

  const textProps = animated
    ? {
        variants: textVariants,
      }
    : {};

  const glowProps = animated
    ? {
        variants: glowVariants,
        initial: 'initial',
        animate: 'animate',
      }
    : {};

  if (variant === 'icon-only') {
    return (
      <MotionWrapper
        className={`relative inline-flex items-center justify-center ${className}`}
        {...wrapperProps}
      >
        {/* Animated glow effect */}
        <MotionGlow
          className="absolute inset-0 blur-xl opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(217, 165, 93, 0.4) 0%, transparent 70%)',
          }}
          {...glowProps}
        />
        
        {/* Icon container */}
        <MotionIcon
          className="relative w-12 h-12 sm:w-16 sm:h-16"
          {...iconWrapperProps}
        >
          <img
            src={logoImage}
            alt="Pip Nation Academy"
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </MotionIcon>
      </MotionWrapper>
    );
  }

  if (variant === 'compact') {
    return (
      <MotionWrapper
        className={`relative inline-flex items-center gap-2 sm:gap-3 ${className}`}
        {...wrapperProps}
      >
        {/* Animated glow */}
        <MotionGlow
          className="absolute -left-2 -top-2 w-16 h-16 blur-2xl opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(217, 165, 93, 0.5) 0%, transparent 70%)',
          }}
          {...glowProps}
        />

        {/* Icon */}
        <MotionIcon
          className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
          {...iconWrapperProps}
        >
          <img
            src={logoImage}
            alt="Pip Nation Academy"
            className="w-full h-full object-contain filter drop-shadow-md"
          />
        </MotionIcon>

        {/* Compact text */}
        <MotionText
          className="flex flex-col leading-none"
          {...textProps}
        >
          <span
            className="bg-gradient-to-r from-[#d9a55d] via-[#f0b968] to-[#d9a55d] bg-clip-text text-transparent"
            style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              letterSpacing: '0.05em',
              lineHeight: '1.2',
            }}
          >
            PIP NATION
          </span>
        </MotionText>
      </MotionWrapper>
    );
  }

  // Default full logo
  return (
    <MotionWrapper
      className={`relative inline-flex items-center gap-3 sm:gap-4 ${className}`}
      {...wrapperProps}
    >
      {/* Animated background glow */}
      <MotionGlow
        className="absolute -left-4 -top-4 w-24 h-24 blur-3xl opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(217, 165, 93, 0.6) 0%, rgba(240, 185, 104, 0.3) 50%, transparent 70%)',
        }}
        {...glowProps}
      />

      {/* Shield Icon with gradient overlay */}
      <MotionIcon
        className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0"
        {...iconWrapperProps}
      >
        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 rounded-lg opacity-20"
          style={{
            background: 'radial-gradient(circle at top left, rgba(217, 165, 93, 0.3), transparent)',
          }}
        />
        <img
          src={logoImage}
          alt="Pip Nation Academy Shield"
          className="relative w-full h-full object-contain filter drop-shadow-lg"
        />
      </MotionIcon>

      {/* Text section with gradient */}
      <MotionText
        className="flex flex-col gap-0.5 leading-none"
        {...textProps}
      >
        {/* "PIPS NATION" with animated gradient */}
        <span
          className="bg-gradient-to-r from-[#d9a55d] via-[#f0b968] to-[#e0aa5f] bg-clip-text text-transparent animate-gradient"
          style={{
            fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
            fontWeight: '800',
            letterSpacing: '0.08em',
            lineHeight: '1.1',
            textShadow: '0 2px 8px rgba(217, 165, 93, 0.3)',
          }}
        >
          PIPS NATION
        </span>
        
        {/* "ACADEMY" with complementary styling */}
        <span
          className="bg-gradient-to-r from-[#c49353] via-[#d9a55d] to-[#c49353] bg-clip-text text-transparent"
          style={{
            fontSize: 'clamp(0.75rem, 2vw, 1rem)',
            fontWeight: '600',
            letterSpacing: '0.15em',
            lineHeight: '1.2',
            marginTop: '-0.125rem',
          }}
        >
          ACADEMY
        </span>
      </MotionText>

      {/* Accent line */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-[#d9a55d] to-transparent opacity-40"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
      />
    </MotionWrapper>
  );
}

// Animated gradient CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient-shift 4s ease infinite;
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}
