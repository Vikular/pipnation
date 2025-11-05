import { Smartphone, Tablet, Monitor, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export function MobileTestBadge() {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const updateDevice = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      
      if (width < 640) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    updateDevice();
    window.addEventListener('resize', updateDevice);
    return () => window.removeEventListener('resize', updateDevice);
  }, []);

  const getIcon = () => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getColor = () => {
    switch (deviceType) {
      case 'mobile':
        return 'from-green-500 to-green-600';
      case 'tablet':
        return 'from-blue-500 to-blue-600';
      default:
        return 'from-purple-500 to-purple-600';
    }
  };

  const getLabel = () => {
    switch (deviceType) {
      case 'mobile':
        return 'Mobile';
      case 'tablet':
        return 'Tablet';
      default:
        return 'Desktop';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-16 left-3 md:top-20 md:left-4 z-30"
    >
      <div className={`bg-gradient-to-r ${getColor()} text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg flex items-center gap-2`}>
        {getIcon()}
        <div className="flex flex-col">
          <span className="text-xs md:text-sm font-medium">{getLabel()}</span>
          <span className="text-[10px] md:text-xs opacity-90">{screenWidth}px</span>
        </div>
        <Check className="w-3 h-3 md:w-4 md:h-4" />
      </div>
    </motion.div>
  );
}
