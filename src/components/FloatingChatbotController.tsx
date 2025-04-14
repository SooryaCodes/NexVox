"use client";

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// Use dynamic import to avoid hydration issues
const FloatingChatbot = dynamic(() => import('@/components/rooms/FloatingChatbot'), {
  ssr: false,
});

export default function FloatingChatbotController() {
  const pathname = usePathname();
  
  // Check if the current path is a single room page
  // Single room pages will match the pattern: /rooms/[id]
  const isSingleRoomPage = pathname?.startsWith('/rooms/') && 
                           pathname.split('/').length === 3 && 
                           pathname !== '/rooms/create';
  
  // Only render the chatbot if we're not on a single room page
  if (isSingleRoomPage) {
    return null;
  }
  
  // Add a console log to verify this component is rendering
  if (typeof window !== 'undefined') {
    console.log('FloatingChatbotController rendering on path:', pathname);
  }
  
  return <FloatingChatbot />;
}
