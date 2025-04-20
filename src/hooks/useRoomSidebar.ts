import { useState, useEffect } from 'react';
import { TABS } from '@/types/room';

export function useRoomSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<typeof TABS[keyof typeof TABS]>(TABS.CHAT);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return {
    isSidebarOpen,
    setIsSidebarOpen,
    activeTab,
    setActiveTab
  };
} 