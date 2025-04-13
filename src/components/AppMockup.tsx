import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { m, AnimatePresence } from 'framer-motion';
import soundEffects from '@/utils/soundEffects';

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
  
  // Handle avatar click with sound
  const handleAvatarClick = (avatarId: number, status: string) => {
    setActiveAvatar(avatarId);
    
    // Play appropriate sound based on avatar status
    if (status === 'speaking') {
      soundEffects.loadAndPlay('avatar-speaking', '/audios/digital-click2.mp3');
    } else if (status === 'muted') {
      soundEffects.loadAndPlay('avatar-muted', '/audios/error.mp3');
    } else {
      soundEffects.loadAndPlay('avatar-idle', '/audios/digital-click.mp3');
    }
  };
  
  // Cycle through vibes with sound
  useEffect(() => {
    // Define vibeOptions inside the effect to avoid dependency issues
    const vibeOptions = ['Chill', 'Epic', 'Focus', 'Energy', 'Relax'];
    
    const vibeInterval = setInterval(() => {
      setShowVibesToast(true);
      const newVibe = vibeOptions[Math.floor(Math.random() * vibeOptions.length)];
      setCurrentVibe(newVibe);
      
      // Removed automatic sound playback
      // Uncomment the line below if you want the sound to play on user interaction only
      // soundEffects.loadAndPlay('vibe-toast', '/audios/digital-blip.mp3');
      
      setTimeout(() => {
        setShowVibesToast(false);
      }, 3000);
    }, 8000);
    
    // Show initial vibe after a delay without sound
    const initialTimeout = setTimeout(() => {
      setShowVibesToast(true);
      // Removed automatic sound playback on initial load
      // soundEffects.loadAndPlay('vibe-initial', '/audios/digital-blip.mp3');
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
    <div ref={containerRef} className={`${className} w-full max-w-sm mx-auto bg-black rounded-2xl shadow-xl overflow-hidden border border-white/10`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00FFFF]/20 to-[#9D00FF]/20 p-4 flex justify-between items-center border-b border-white/10">
        <h3 className="text-lg font-orbitron text-white">{roomName}</h3>
        <div className="flex items-center text-xs text-white/80 space-x-1">
          <div className="w-2 h-2 rounded-full bg-[#00FFFF] animate-pulse"></div>
          <span>Live</span>
        </div>
      </div>
      
      {/* App content */}
      <div className="p-6 h-96 flex flex-col">
        {/* Avatars grid */}
        <div className="grid grid-cols-3 gap-4 justify-center mb-auto">
          {avatars.map((avatar) => (
            <div key={avatar.id} className="relative group" onClick={() => handleAvatarClick(avatar.id, avatar.status)}>
              <m.div 
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${avatar.color} flex items-center justify-center text-white font-medium text-lg relative border-2 border-black ${avatar.status === 'speaking' ? 'avatar-speaking' : ''}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => soundEffects.playHover()}
              >
                {avatar.initial}
                
                {/* Status indicator */}
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${
                  avatar.status === 'speaking' ? 'bg-[#00FFFF]' : 
                  avatar.status === 'muted' ? 'bg-red-500' : 
                  'bg-gray-400'
                }`}></div>
              </m.div>
              
              {/* Avatar tooltip */}
              {showTooltips && activeAvatar === avatar.id && (
                <AnimatePresence>
                  <m.div 
                    className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black px-3 py-1 rounded text-xs font-orbitron text-white border border-[#00FFFF]/30 whitespace-nowrap"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {avatar.status === 'speaking' ? 'Speaking...' : 
                     avatar.status === 'muted' ? 'Muted' : 
                     'Listening'}
                  </m.div>
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
          <m.div 
            className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#00FFFF]/20 to-[#9D00FF]/20 px-4 py-2 rounded-full border border-white/10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xs text-white/70">Current Vibe:</span>
              <span className="text-sm font-orbitron text-[#00FFFF]">{currentVibe}</span>
            </div>
          </m.div>
        )}
      </AnimatePresence>
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
  
  const handleButtonClick = () => {
    // Play appropriate sound based on button type
    switch (icon) {
      case 'mic':
        soundEffects.loadAndPlay('mic-toggle', '/audios/digital-click2.mp3');
        break;
      case 'wave':
        soundEffects.loadAndPlay('wave-reaction', '/audios/digital-blip.mp3');
        break;
      case 'leave':
        soundEffects.loadAndPlay('leave-room', '/audios/error.mp3');
        break;
    }
  };
  
  return (
    <m.button 
      className={`w-12 h-12 rounded-full transition-colors flex items-center justify-center relative ${getButtonStyles()}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onMouseEnter={() => {
        setIsHovered(true);
        soundEffects.playHover();
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleButtonClick}
    >
      {getIcon()}
      
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <m.div 
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-white/10"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
          >
            {tooltip}
          </m.div>
        )}
      </AnimatePresence>
    </m.button>
  );
};

export default AppMockup; 