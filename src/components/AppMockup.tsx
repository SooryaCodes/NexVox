import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

interface AppMockupProps {
  roomName?: string;
  className?: string;
  showTooltips?: boolean;
}

// Mockup avatar data
const avatars = [
  { id: 1, initial: 'A', status: 'speaking', color: 'from-[#00FFFF] to-[#0088FF]' },
  { id: 2, initial: 'S', status: 'idle', color: 'from-[#9D00FF] to-[#FF00E6]' },
  { id: 3, initial: 'M', status: 'muted', color: 'from-[#FF00E6] to-[#FF3300]' },
  { id: 4, initial: 'J', status: 'speaking', color: 'from-[#0088FF] to-[#00FFFF]' },
  { id: 5, initial: 'K', status: 'idle', color: 'from-[#9D00FF] to-[#0088FF]' },
  { id: 6, initial: 'P', status: 'idle', color: 'from-[#00FFFF] to-[#FF00E6]' },
];

const AppMockup = ({
  roomName = 'Cyber Lounge',
  className = '',
  showTooltips = true
}: AppMockupProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeAvatar, setActiveAvatar] = useState<number | null>(null);
  const [showVibesToast, setShowVibesToast] = useState(false);
  const [currentVibe, setCurrentVibe] = useState('Chill');
  const vibeOptions = ['Chill', 'Epic', 'Focus', 'Energy', 'Relax'];
  
  // Cycle through vibes
  useEffect(() => {
    const vibeInterval = setInterval(() => {
      setShowVibesToast(true);
      setCurrentVibe(vibeOptions[Math.floor(Math.random() * vibeOptions.length)]);
      
      setTimeout(() => {
        setShowVibesToast(false);
      }, 3000);
    }, 8000);
    
    // Show initial vibe after a delay
    const initialTimeout = setTimeout(() => {
      setShowVibesToast(true);
      setTimeout(() => setShowVibesToast(false), 3000);
    }, 2000);
    
    return () => {
      clearInterval(vibeInterval);
      clearTimeout(initialTimeout);
    };
  }, []);

  // Animate active speakers
  useEffect(() => {
    const speakingAvatars = document.querySelectorAll('.avatar-speaking');
    
    speakingAvatars.forEach(avatar => {
      gsap.to(avatar, {
        scale: 1.05,
        boxShadow: '0 0 15px rgba(0, 255, 255, 0.7)',
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
    
    return () => {
      gsap.killTweensOf('.avatar-speaking');
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Device frame */}
      <div className="bg-gradient-to-br from-gray-800 to-black p-2 rounded-3xl shadow-[0_0_30px_rgba(0,255,255,0.3)] mx-auto max-w-xs">
        <div className="bg-black rounded-2xl overflow-hidden border border-[#00FFFF]/20 relative">
          {/* App header */}
          <div className="bg-gradient-to-r from-[#00FFFF]/20 to-[#9D00FF]/20 backdrop-blur-md p-4 relative">
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="relative z-10 flex items-center justify-between">
              <h4 className="font-orbitron text-sm text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00FFFF] animate-pulse"></span>
                {roomName}
              </h4>
              <div className="text-xs px-2 py-0.5 bg-[#00FFFF]/10 rounded-full border border-[#00FFFF]/30 text-[#00FFFF]">
                6 online
              </div>
            </div>
          </div>
          
          {/* Room interface */}
          <div className="p-6 h-96 flex flex-col">
            {/* Avatars grid */}
            <div className="grid grid-cols-3 gap-4 justify-center mb-auto">
              {avatars.map((avatar) => (
                <div key={avatar.id} className="relative group" onClick={() => setActiveAvatar(avatar.id)}>
                  <motion.div 
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${avatar.color} flex items-center justify-center text-white font-medium text-lg relative border-2 border-black ${avatar.status === 'speaking' ? 'avatar-speaking' : ''}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {avatar.initial}
                    
                    {/* Status indicator */}
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${
                      avatar.status === 'speaking' ? 'bg-[#00FFFF]' : 
                      avatar.status === 'muted' ? 'bg-red-500' : 
                      'bg-gray-400'
                    }`}></div>
                  </motion.div>
                  
                  {/* Avatar tooltip */}
                  {(activeAvatar === avatar.id || (showTooltips && avatar.status === 'speaking')) && (
                    <AnimatePresence>
                      <motion.div 
                        className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black px-3 py-1 rounded text-xs font-orbitron text-white border border-[#00FFFF]/30 whitespace-nowrap"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {avatar.status === 'speaking' ? 'Speaking...' : 
                         avatar.status === 'muted' ? 'Muted' : 
                         'Listening'}
                      </motion.div>
                    </AnimatePresence>
                  )}
                  
                  {/* Animated ring for speaking */}
                  {avatar.status === 'speaking' && (
                    <div className="absolute inset-0 rounded-full">
                      <div className="absolute inset-0 rounded-full border-2 border-[#00FFFF] animate-ping opacity-50"></div>
                      <div className="absolute inset-0 rounded-full border border-[#00FFFF]/50"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Controls */}
            <div className="mt-auto">
              <div className="bg-black/60 backdrop-blur-md rounded-xl border border-white/10 p-4">
                <div className="flex justify-around">
                  <ControlButton icon="mic" tooltip="Microphone" />
                  <ControlButton icon="wave" tooltip="React" />
                  <ControlButton icon="leave" tooltip="Leave Room" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Vibe toast notification */}
          <AnimatePresence>
            {showVibesToast && (
              <motion.div 
                className="absolute top-16 right-4 bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] px-3 py-1 rounded-full text-xs"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                Vibe: {currentVibe}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Ambient effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#00FFFF]/5 to-transparent opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#9D00FF]/10 to-transparent"></div>
          </div>
        </div>
      </div>
      
      {/* Device glow */}
      <div className="absolute -inset-4 bg-[#00FFFF]/5 rounded-3xl blur-xl -z-10"></div>
      <div className="absolute -inset-1 bg-gradient-to-r from-[#00FFFF]/5 to-[#9D00FF]/5 rounded-3xl blur-md -z-10"></div>
    </div>
  );
};

// Control button component
const ControlButton = ({ icon, tooltip }: { icon: 'mic' | 'wave' | 'leave', tooltip: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getButtonStyles = () => {
    switch (icon) {
      case 'mic':
        return 'bg-[#00FFFF]/20 hover:bg-[#00FFFF]/40 text-[#00FFFF]';
      case 'wave':
        return 'bg-[#9D00FF]/20 hover:bg-[#9D00FF]/40 text-[#9D00FF]';
      case 'leave':
        return 'bg-red-500/20 hover:bg-red-500/40 text-red-400';
      default:
        return 'bg-gray-500/20';
    }
  };
  
  const getIcon = () => {
    switch (icon) {
      case 'mic':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
        );
      case 'wave':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 7a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 'leave':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  return (
    <motion.button 
      className={`w-12 h-12 rounded-full transition-colors flex items-center justify-center relative ${getButtonStyles()}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {getIcon()}
      
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-white/10"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
          >
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default AppMockup; 