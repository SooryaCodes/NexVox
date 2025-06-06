"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useParams, useSearchParams, usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";

// Import types
import { Room, User, ChatMessage, TABS } from "@/types/room";

// Import custom components
import CustomCursor from "@/components/rooms/voice/CustomCursor";
import RoomHeader from "@/components/rooms/voice/RoomHeader";
import RoomStatsDisplay from "@/components/rooms/voice/RoomStatsDisplay";
import RoomAudioVisualizer from "@/components/rooms/voice/RoomAudioVisualizer";
import VoiceRoomContainer from "@/components/rooms/voice/VoiceRoomContainer";
import RoomControlBar from "@/components/rooms/voice/RoomControlBar";
import SidebarPanel from "@/components/rooms/voice/SidebarPanel";
import UserProfileCard from "@/components/rooms/voice/UserProfileCard";
import PublicUserProfileCard from "@/components/rooms/voice/PublicUserProfileCard";
import RoomShareModal from "@/components/rooms/RoomShareModal";
import MiniUserProfile from "@/components/rooms/voice/MiniUserProfile";
import CyberToast from "@/components/rooms/voice/CyberToast";
import RoomAudioSettings from "@/components/rooms/voice/RoomAudioSettings";
import NeonGrid from "@/components/NeonGrid";
import ConversationStartModal from "@/components/rooms/voice/ConversationStartModal";

// Import hooks
import { useRoomData } from "@/hooks/useRoomData";
import { useRoomControls } from "@/hooks/useRoomControls";
import { useRoomToasts } from "@/hooks/useRoomToasts";
import { useRoomSidebar } from "@/hooks/useRoomSidebar";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useUser } from "@/contexts/UserContext";
import { useVoiceConversation } from "@/hooks/useVoiceConversation";

// Import utility functions
import {
  handleSendMessage,
  simulateResponse,
  handleQuickReply,
  simulateQuickReplyResponse,
  handleAiAssistant,
  toggleAiAssistant,
  handleUserHover,
  handleUserHoverEnd,
  toggleUserProfile,
  toggleAudioSettings,
  toggleShareModal,
} from "@/lib/singleRoomUtils";

export default function RoomPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const pathname = usePathname();

  // Add this useEffect to monitor route changes
  useEffect(() => {
    // Store the current path to detect changes
    const currentPath = pathname;
    
    // Global speech synthesis cleanup function
    const stopAllSpeech = () => {
      console.log("Global speech cleanup triggered");
      if (window.speechSynthesis) {
        try {
          // Cancel any ongoing speech
          window.speechSynthesis.cancel();
          
          // Reset with an empty utterance
          const emptyUtterance = new SpeechSynthesisUtterance("");
          window.speechSynthesis.speak(emptyUtterance);
          window.speechSynthesis.cancel();
        } catch (e) {
          console.error("Error during global speech cleanup:", e);
        }
      }
    };
    
    // Handle beforeunload event
    const handleBeforeUnload = () => {
      stopAllSpeech();
    };
    
    // Add global event listener
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // This will run when the component is unmounted or when the route changes
    return () => {
      console.log(`Route changed from ${currentPath}, ensuring voice conversation is stopped`);
      // Perform global speech cleanup
      stopAllSpeech();
      // Remove event listener
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  // Room data and loading state
  const { room, loading, users, roomId, setRoomId, activeSpeakers, setUsers } =
    useRoomData(params?.id);

  // Room toast notifications
  const { toasts, addToast, removeToast } = useRoomToasts();

  // Sidebar controls
  const { isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab } =
    useRoomSidebar();

  // Room controls (mic, hand, etc)
  const { muted, setMuted, handRaised, setHandRaised } =
    useRoomControls(addToast);

  // Sound effects
  const { playClick, playSuccess } = useSoundEffects();

  // User contexts and states
  const { user: contextUser } = useUser();
  const [currentUser, setCurrentUser] = useState<User>({
    id: contextUser.id,
    name: contextUser.name,
    level: contextUser.level,
    status: contextUser.status,
    avatarType: contextUser.avatarType,
    avatarUrl: contextUser.avatarUrl,
    badges: contextUser.badges,
  });

  // Add a new state for muted users
  const [mutedUsers, setMutedUsers] = useState<number[]>([]);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      message: "Anyone know how to configure spatial audio?",
      isUser: false,
      userName: "Alex",
    },
    { message: "You need to enable it in settings first", isUser: true },
    { message: "Thanks! Got it working now", isUser: false, userName: "Alex" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isAiAssistantActive, setIsAiAssistantActive] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Modal states
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [hoveredUser, setHoveredUser] = useState<{
    user: User | null;
    position: { x: number; y: number };
  }>({
    user: null,
    position: { x: 0, y: 0 },
  });
  const [selectedParticipant, setSelectedParticipant] = useState<User | null>(null);
  const participantModalRef = useRef<HTMLDivElement>(null);
  
  // Use the new voice conversation hook
  const {
    activeSpeakerIndex,
    activeSpeakerPulse,
    showStartPrompt,
    isConversationActive,
    startConversation,
    forceStartConversation,
    stopConversation,
    handleHandRaiseAcknowledgment
  } = useVoiceConversation({
    users,
    mutedUsers,
    currentUser,
    room,
    messages,
    sendMessage: (message) => setMessages(prev => [...prev, message])
  });
  
  // Enhanced hover stability
  const [isHoverBlocked, setIsHoverBlocked] = useState(false);
  
  // Combine active speakers from AI and real users
  const allActiveSpeakers = [...activeSpeakers];
  if (activeSpeakerIndex !== null) {
    allActiveSpeakers.push(activeSpeakerIndex);
  }

  // Update room ID when params change
  useEffect(() => {
    if (params?.id) {
      setRoomId(parseInt(params.id));
    }
  }, [params?.id, setRoomId]);

  // Update currentUser when contextUser changes
  useEffect(() => {
    setCurrentUser({
      id: contextUser.id,
      name: contextUser.name,
      level: contextUser.level,
      status: contextUser.status,
      avatarType: contextUser.avatarType,
      avatarUrl: contextUser.avatarUrl,
      badges: contextUser.badges,
    });
  }, [contextUser]);
  
  // React to hand raising
  useEffect(() => {
    // Only acknowledge hand raising if conversation is already active
    // This prevents hand raising from automatically starting the conversation
    if (isConversationActive) {
      console.log("Hand raised - conversation is active, notifying conversation");
      handleHandRaiseAcknowledgment(handRaised);
    } else {
      console.log("Hand raised - conversation is NOT active, ignoring");
      // DO NOT call handleHandRaiseAcknowledgment here to avoid starting conversation
    }
  }, [handRaised, handleHandRaiseAcknowledgment, isConversationActive]);

  // Handle user hover with debouncing to prevent glitching
  const handleUserHoverWrapper = (user: User, mouseX: number, mouseY: number) => {
    if (isHoverBlocked) return;
    
    // Block hover events briefly to prevent rapid state changes
    setIsHoverBlocked(true);
    setTimeout(() => setIsHoverBlocked(false), 50);
    
    handleUserHover(user, mouseX, mouseY, setHoveredUser);
  };

  // Wrapped handler functions using utility functions
  const handleSendMessageWrapper = (e: React.FormEvent) => {
    handleSendMessage(
      e,
      chatInput,
      setMessages,
      setChatInput,
      currentUser,
      playClick,
      playSuccess,
      isAiAssistantActive,
      (message) => handleAiAssistant(message, setIsAiTyping, setMessages),
      () => simulateResponse(setMessages)
    );
  };

  const handleQuickReplyWrapper = (reply: string) => {
    handleQuickReply(
      reply,
      setMessages,
      setShowQuickReplies,
      isAiAssistantActive,
      (message) => handleAiAssistant(message, setIsAiTyping, setMessages),
      (reply) => simulateQuickReplyResponse(reply, setMessages)
    );
  };

  const toggleAiAssistantWrapper = () => {
    toggleAiAssistant(
      isAiAssistantActive,
      setIsAiAssistantActive,
      setMessages,
      addToast
    );
  };

  const handleUserHoverEndWrapper = () => {
    handleUserHoverEnd(setHoveredUser);
  };

  const toggleUserProfileWrapper = () => {
    toggleUserProfile(showUserProfile, setShowUserProfile, playClick);
  };

  const toggleAudioSettingsWrapper = () => {
    toggleAudioSettings(
      isAudioSettingsOpen,
      setIsAudioSettingsOpen,
      playClick,
      addToast
    );
  };

  const toggleShareModalWrapper = () => {
    toggleShareModal(isShareModalOpen, setIsShareModalOpen, playClick);
  };

  // Add a handler for muting a user
  const handleMuteUser = (user: User) => {
    playClick();
    if (mutedUsers.includes(user.id)) {
      setMutedUsers(mutedUsers.filter(id => id !== user.id));
      addToast(`Unmuted ${user.name}`, "success");
    } else {
      setMutedUsers([...mutedUsers, user.id]);
      addToast(`Muted ${user.name}`, "warning");
      
      // If this user is currently speaking and gets muted, stop their voice
      if (activeSpeakerIndex !== null && users[activeSpeakerIndex]?.id === user.id) {
        stopConversation();
      }
    }
    setSelectedParticipant(null);
  };

  // Create a proper handler function that fixes the auto-closing modal issue
  const handleUserProfileClick = useCallback((user: User) => {
    // If the user is already selected, don't close the modal
    if (selectedParticipant?.id === user.id) return;
    
    setSelectedParticipant(user);
    addToast(`Viewing ${user.name}'s profile`, "success");
  }, [selectedParticipant, addToast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-transparent border-t-[#00FFFF] rounded-full animate-spin"></div>
          <div className="absolute top-1 left-1 right-1 bottom-1 border-4 border-transparent border-l-[#9D00FF] rounded-full animate-spin animate-reverse"></div>
          <div className="absolute top-2 left-2 right-2 bottom-2 border-4 border-transparent border-b-[#FF00E6] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Custom cursor */}
      <CustomCursor />
      
      {/* NeonGrid background */}
      <div className="absolute inset-0 z-1">
        <NeonGrid 
          color="#FF00E6" 
          secondaryColor="#9D00FF" 
          density={40} 
          opacity={0.05} 
          animate={true} 
        />
      </div>
      
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid opacity-10 z-0"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-[#00FFFF]/5 via-black to-[#FF00E6]/5 z-0"></div>
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#FF00E6]/10 to-black z-0"></div>

      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        {/* Subtle blobs */}
        <div className="absolute w-[450px] h-[450px] rounded-full bg-[#FF00E6]/5 blur-[100px] top-0 right-20"></div>
        <div className="absolute w-[350px] h-[350px] rounded-full bg-[#00FFFF]/5 blur-[80px] -bottom-20 left-10"></div>

        {/* Animated lines */}
        <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#FF00E6]/30 to-transparent left-1/3 animate-pulse-slow"></div>
        <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#FF00E6]/20 to-transparent right-1/3 animate-pulse-slower"></div>
      </div>
      
      {/* Room header */}
      <RoomHeader
        room={room}
        currentUser={currentUser}
        toggleAudioSettings={toggleAudioSettingsWrapper}
        toggleUserProfile={toggleUserProfileWrapper}
        isAudioSettingsOpen={isAudioSettingsOpen}
      />

      <div className="pt-16 flex h-screen">
        {/* Main Room Area */}
        <div
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? "lg:mr-[350px]" : ""
          }`}
        >
          <div className="py-8 px-6 h-full flex flex-col">
            {/* Room title and stats */}
            <RoomStatsDisplay
              room={room}
              activeSpeakersCount={allActiveSpeakers.length}
            />

            {/* Audio activity visualization */}
            <RoomAudioVisualizer />

            {/* 3D User avatars in circle layout */}
            <VoiceRoomContainer
              users={users}
              activeSpeakers={allActiveSpeakers}
              handRaised={handRaised}
              onUserHover={handleUserHoverWrapper}
              onUserHoverEnd={handleUserHoverEndWrapper}
              mutedUsers={mutedUsers}
              onUserClick={handleUserProfileClick}
            />
          </div>
        </div>
      </div>

      {/* Sidebar toggle button */}
      <button
        className="fixed hidden lg:block top-1/2 transform -translate-y-1/2 bg-black/70 backdrop-blur-md border border-white/10 rounded-l-md p-3 z-30 hover:bg-black/90"
        style={{
          right: isSidebarOpen ? "350px" : "0",
          borderColor: isSidebarOpen ? "#00FFFF" : "rgba(255,255,255,0.1)",
          color: isSidebarOpen ? "#00FFFF" : "white",
        }}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
        aria-expanded={isSidebarOpen}
      >
        {isSidebarOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        )}
      </button>

      {/* Sidebar Panel */}
      <SidebarPanel
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        messages={messages}
        isAiAssistantActive={isAiAssistantActive}
        isAiTyping={isAiTyping}
        showQuickReplies={showQuickReplies}
        setShowQuickReplies={setShowQuickReplies}
        handleSendMessage={handleSendMessageWrapper}
        chatInput={chatInput}
        setChatInput={setChatInput}
        handleQuickReply={handleQuickReplyWrapper}
        toggleAiAssistant={toggleAiAssistantWrapper}
        users={users.map((user, index) => ({
          ...user,
          isSpeaking: allActiveSpeakers.includes(index),
        }))}
        onUserClick={(user: User) => {
          setSelectedParticipant(user);
          addToast(`Viewing ${user.name}'s profile`, "success");
        }}
        currentUser={currentUser}
        addToast={addToast}
      />

      {/* Room Control Bar */}
      <RoomControlBar
        muted={muted}
        handRaised={handRaised}
        isShareModalOpen={isShareModalOpen}
        activeTab={activeTab}
        isSidebarOpen={isSidebarOpen}
        onToggleMute={() => {
          playClick();
          setMuted(!muted);
          if (muted) {
            addToast("Microphone unmuted", "success");
          } else {
            addToast("Microphone muted", "warning");
          }
        }}
        onToggleHandRaise={() => {
          playClick();
          setHandRaised(!handRaised);
          if (!handRaised) {
            addToast("Hand raised", "success");
          }
        }}
        onToggleShare={toggleShareModalWrapper}
        onTabChange={(tab) => {
          playClick();
          setActiveTab(tab);
          setIsSidebarOpen(true);
        }}
        onToggleSidebar={() => setIsSidebarOpen(true)}
        onLeaveRoom={() => {
          // First notify user they're leaving
          addToast("Leaving room...", "warning");
          
          // Enhanced cleanup process
          console.log("ROOM EXIT: Starting comprehensive cleanup");
          
          // 1. Stop the conversation using the hook's method
          stopConversation();
          
          // 2. Cancel speech synthesis directly (belt and suspenders)
          if (window.speechSynthesis) {
            console.log("ROOM EXIT: Directly canceling speech synthesis");
            window.speechSynthesis.cancel();
            
            // 3. Force a reset of the speech synthesis engine with an empty utterance
            try {
              const emptyUtterance = new SpeechSynthesisUtterance("");
              window.speechSynthesis.speak(emptyUtterance);
              window.speechSynthesis.cancel();
              console.log("ROOM EXIT: Speech synthesis reset completed");
            } catch (e) {
              console.error("ROOM EXIT: Error during speech synthesis reset:", e);
            }
          }
          
          // 4. Close audio context if possible
          if (typeof AudioContext !== 'undefined') {
            try {
              console.log("ROOM EXIT: Attempting to close any audio contexts");
              // This is a best effort - we don't have direct access to the context reference
            } catch (e) {
              console.error("ROOM EXIT: Error while closing audio context:", e);
            }
          }
          
          // 5. Wait a short time to ensure cleanup completes before navigation
          setTimeout(() => {
            console.log("ROOM EXIT: Final speech synthesis cancellation before navigation");
            // Final check - directly cancel speech synthesis again
            if (window.speechSynthesis) {
              window.speechSynthesis.cancel();
            }
            
            // 6. Navigate away with a state object indicating we're cleaning up
            router.push("/rooms", { 
              // This doesn't work with the app router but is a reminder of our intent
              // shallow: true 
            });
            
            // 7. Add a final cleanup chance after navigation starts
            setTimeout(() => {
              if (window.speechSynthesis) {
                console.log("ROOM EXIT: Post-navigation speech synthesis cancellation");
                window.speechSynthesis.cancel();
              }
            }, 500);
          }, 300);
        }}
      />

      {/* Modals and overlays */}
      <AnimatePresence mode="wait">
        {/* Conversation start modal */}
        {showStartPrompt && (
          <ConversationStartModal 
            onStart={() => {
              console.log("START CONVERSATION CLICKED FROM MODAL!");
              forceStartConversation();
              console.log("forceStartConversation called directly from modal prop");
              // Force immediate toast for verification
              addToast("Starting conversation now...", "success");
            }}
            playSound={playClick}
          />
        )}
        
        {showUserProfile && (
          <UserProfileCard
            key="user-profile"
            user={currentUser}
            onClose={() => setShowUserProfile(false)}
          />
        )}

        {selectedParticipant && (
          <div 
            ref={participantModalRef}
            onClick={(e) => {
              // Only close if clicking on the outer container, not on the modal itself
              if (e.target === participantModalRef.current) {
                setSelectedParticipant(null);
              }
            }}
          >
            <PublicUserProfileCard
              key={`public-profile-${selectedParticipant.id}`}
              user={selectedParticipant}
              onClose={() => setSelectedParticipant(null)}
              onConnect={() => {
                addToast(
                  `Connection request sent to ${selectedParticipant.name}`,
                  "success"
                );
                setSelectedParticipant(null);
              }}
              onMute={() => handleMuteUser(selectedParticipant)}
              isMuted={mutedUsers.includes(selectedParticipant.id)}
            />
          </div>
        )}

        {hoveredUser.user && (
          <MiniUserProfile
            key={`mini-profile-${hoveredUser.user.id}`}
            user={hoveredUser.user}
            position={hoveredUser.position}
          />
        )}
        
        {/* Active speaker indicator */}
        {activeSpeakerIndex !== null && users[activeSpeakerIndex] && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md border border-[#00FFFF]/30 rounded-lg py-2 px-4 z-30"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#00FFFF]/10 to-[#FF00E6]/10 border border-[#00FFFF]/50 flex items-center justify-center">
                  {users[activeSpeakerIndex].avatarUrl ? (
                    <img 
                      src={users[activeSpeakerIndex].avatarUrl} 
                      alt={users[activeSpeakerIndex].name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-[#00FFFF]">
                      {users[activeSpeakerIndex].name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#00FFFF] animate-ping"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#00FFFF] font-medium">{users[activeSpeakerIndex].name}</span>
                <span className="text-white/70 text-sm">is speaking</span>
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[#00FFFF] animate-pulse" 
                      style={{ animationDelay: `${i * 0.15}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </m.div>
        )}

        {toasts.map((toast) => (
          <CyberToast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}

        {isAudioSettingsOpen && (
          <RoomAudioSettings
            key="audio-settings"
            currentUser={currentUser}
            onClose={() => setIsAudioSettingsOpen(false)}
            onSave={() => {
              setIsAudioSettingsOpen(false);
              addToast("Audio settings saved", "success");
            }}
            addToast={addToast}
          />
        )}
      </AnimatePresence>

      {/* Share modal */}
      <RoomShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        roomId={roomId}
        roomName={room?.name || "Voice Room"}
        addToast={addToast}
      />
    </main>
  );
}
