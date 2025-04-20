import React from "react";
import { m } from "framer-motion";
import { User, ChatMessage, TABS } from "@/types/room";
import ChatTab from "./ChatTab";
import ParticipantsTab from "./ParticipantsTab";
import SettingsTab from "./SettingsTab";
import ProfileTab from "./ProfileTab";

interface SidebarPanelProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeTab: typeof TABS[keyof typeof TABS];
  setActiveTab: (tab: typeof TABS[keyof typeof TABS]) => void;
  messages: ChatMessage[];
  isAiAssistantActive: boolean;
  isAiTyping: boolean;
  showQuickReplies: boolean;
  setShowQuickReplies: (show: boolean) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  chatInput: string;
  setChatInput: (input: string) => void;
  handleQuickReply: (reply: string) => void;
  toggleAiAssistant: () => void;
  users: User[];
  onUserClick: (user: User) => void;
  currentUser: User;
  addToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
}

export default function SidebarPanel({
  isOpen,
  setIsOpen,
  activeTab,
  setActiveTab,
  messages,
  isAiAssistantActive,
  isAiTyping,
  showQuickReplies,
  setShowQuickReplies,
  handleSendMessage,
  chatInput,
  setChatInput,
  handleQuickReply,
  toggleAiAssistant,
  users,
  onUserClick,
  currentUser,
  addToast
}: SidebarPanelProps) {
  return (
    <div 
      className={`fixed top-16 bottom-0 right-0 w-full md:w-[350px] bg-black/80 backdrop-blur-xl border-l border-white/10 z-20 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-hidden shadow-xl`}
      aria-hidden={!isOpen}
    >
      {/* Close button for mobile */}
      <button 
        className="absolute top-4 right-4 lg:hidden text-white/70 hover:text-white p-2 z-10"
        onClick={() => setIsOpen(false)}
        aria-label="Close sidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {/* Tabs Navigation */}
      <div className="flex border-b border-white/10">
        {Object.values(TABS).map((tab) => (
          <m.button
            key={tab}
            className={`flex-1 py-4 text-center text-sm font-medium ${
              activeTab === tab 
                ? 'text-[#00FFFF] border-b-2 border-[#00FFFF]' 
                : 'text-white/70 hover:text-white'
            }`}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab(tab)}
            aria-selected={activeTab === tab}
            role="tab"
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </m.button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {/* Chat Tab */}
        {activeTab === TABS.CHAT && (
          <ChatTab
            messages={messages}
            isAiAssistantActive={isAiAssistantActive}
            isAiTyping={isAiTyping}
            showQuickReplies={showQuickReplies}
            setShowQuickReplies={setShowQuickReplies}
            handleSendMessage={handleSendMessage}
            chatInput={chatInput}
            setChatInput={setChatInput}
            handleQuickReply={handleQuickReply}
            toggleAiAssistant={toggleAiAssistant}
          />
        )}
        
        {/* Participants Tab */}
        {activeTab === TABS.PARTICIPANTS && (
          <ParticipantsTab
            users={users}
            onUserClick={onUserClick}
          />
        )}
        
        {/* Settings Tab */}
        {activeTab === TABS.SETTINGS && (
          <SettingsTab
            currentUser={currentUser}
            addToast={addToast}
            onSaveSettings={(settings) => {
              // Handle settings save
              addToast("Settings updated successfully", 'success');
            }}
          />
        )}
        
        {/* Profile Tab */}
        {activeTab === TABS.PROFILE && (
          <ProfileTab
            currentUser={currentUser}
            toggleUserProfile={() => {}}
          />
        )}
      </div>
    </div>
  );
} 