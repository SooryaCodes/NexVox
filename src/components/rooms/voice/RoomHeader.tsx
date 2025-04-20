import React from "react";
import Link from "next/link";
import Image from "next/image";
import { m } from "framer-motion";
import { IoSettingsOutline } from "react-icons/io5";
import { Room, User } from "@/types/room";
import { getAvatarStyle, getStatusColor } from "@/utils/profileUtils";

interface RoomHeaderProps {
  room: Room | null;
  currentUser: User;
  toggleAudioSettings: () => void;
  toggleUserProfile: () => void;
  isAudioSettingsOpen: boolean;
}

export default function RoomHeader({ 
  room, 
  currentUser, 
  toggleAudioSettings, 
  toggleUserProfile,
  isAudioSettingsOpen
}: RoomHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-white/10 z-20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-6">
          <Link href="/rooms" className="flex items-center gap-2 text-[#00FFFF] font-orbitron">
            <m.div
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="ml-2 hidden sm:inline">Back to Rooms</span>
            </m.div>
          </Link>
          
          {/* Room name in header */}
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden md:block"
          >
            <h3 className="text-lg font-orbitron text-[#00FFFF]">{room?.name}</h3>
          </m.div>
        </div>
        
        {/* User Controls */}
        <div className="flex items-center gap-3">
          <m.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="relative w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-[#00FFFF]/50 transition-colors"
            aria-label="Toggle audio settings"
            onClick={toggleAudioSettings}
          >
            {isAudioSettingsOpen ? (
              <IoSettingsOutline className="w-5 h-5 text-[#00FFFF]" />
            ) : (
              <IoSettingsOutline className="w-5 h-5" />
            )}
          </m.button>
          
          <m.button 
            className="relative p-2 rounded-full hover:bg-white/5 transition-colors"
            onClick={toggleUserProfile}
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 flex items-center justify-center" 
              style={{ 
                borderColor: `${getAvatarStyle(currentUser.avatarType || "cyan")}`,
                backgroundColor: `${getStatusColor(currentUser.status || "online")}`
              }}
            >
              <Image
                src={currentUser.avatarUrl || "/images/default-avatar.png"}
                alt={currentUser.name}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
          </m.button>
        </div>
      </div>
    </div>
  );
} 