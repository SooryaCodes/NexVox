import React from "react";
import { m } from "framer-motion";
import { FaShareAlt } from "react-icons/fa";
import ControlButton from "./ControlButton";
import { TABS } from "@/types/room";

interface RoomControlBarProps {
  muted: boolean;
  handRaised: boolean;
  isShareModalOpen: boolean;
  activeTab: typeof TABS[keyof typeof TABS];
  isSidebarOpen: boolean;
  onToggleMute: () => void;
  onToggleHandRaise: () => void;
  onToggleShare: () => void;
  onTabChange: (tab: typeof TABS[keyof typeof TABS]) => void;
  onToggleSidebar: () => void;
  onLeaveRoom: () => void;
}

export default function RoomControlBar({
  muted,
  handRaised,
  isShareModalOpen,
  activeTab,
  isSidebarOpen,
  onToggleMute,
  onToggleHandRaise,
  onToggleShare,
  onTabChange,
  onToggleSidebar,
  onLeaveRoom
}: RoomControlBarProps) {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 w-auto max-w-full px-4 sm:px-0">
      <m.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-black/70 backdrop-blur-md rounded-full border border-white/10 p-3 flex flex-wrap justify-center items-center gap-2 md:gap-4 overflow-x-auto shadow-xl"
      >
        <ControlButton
          icon={muted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          )}
          label={muted ? "Unmute microphone" : "Mute microphone"}
          onClick={onToggleMute}
          color="#00FFFF"
          isActive={muted}
        />
        
        <ControlButton
          icon={handRaised ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" strokeOpacity="0.7" />
            </svg>
          )}
          label={handRaised ? "Lower hand" : "Raise hand"}
          onClick={onToggleHandRaise}
          color="#9D00FF"
          isActive={handRaised}
        />
        
        {/* Share Button */}
        <ControlButton
          icon={<FaShareAlt className="h-5 w-5 sm:h-6 sm:w-6" />}
          label="Share room"
          onClick={onToggleShare}
          color="#00FFFF"
          isActive={isShareModalOpen}
        />
        
        {/* Show/hide control buttons based on screen size */}
        <div className="hidden sm:flex sm:gap-2 md:gap-4">
          <ControlButton
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            label="Toggle chat"
            onClick={() => onTabChange(TABS.CHAT)}
            isActive={activeTab === TABS.CHAT && isSidebarOpen}
          />
          
          <ControlButton
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            label="Show participants"
            onClick={() => onTabChange(TABS.PARTICIPANTS)}
            isActive={activeTab === TABS.PARTICIPANTS && isSidebarOpen}
          />
          
          <ControlButton
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            label="Settings"
            onClick={() => onTabChange(TABS.SETTINGS)}
            isActive={activeTab === TABS.SETTINGS && isSidebarOpen}
          />
          
          <ControlButton
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            label="Profile"
            onClick={() => onTabChange(TABS.PROFILE)}
            isActive={activeTab === TABS.PROFILE && isSidebarOpen}
            color="#FF00E6"
          />
        </div>
        
        {/* Mobile sidebar toggle button */}
        <div className="sm:hidden">
          <ControlButton
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            }
            label="Show sidebar"
            onClick={onToggleSidebar}
            isActive={isSidebarOpen}
          />
        </div>
        
        <ControlButton
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          }
          label="Leave room"
          onClick={onLeaveRoom}
          danger={true}
        />
      </m.div>
    </div>
  );
}