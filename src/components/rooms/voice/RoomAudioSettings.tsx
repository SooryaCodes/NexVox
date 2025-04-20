import React from "react";
import { m } from "framer-motion";
import { User } from "@/types/room";
import SettingsTab from "./SettingsTab";

interface RoomAudioSettingsProps {
  currentUser: User;
  onClose: () => void;
  onSave: () => void;
  addToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
}

export default function RoomAudioSettings({
  currentUser,
  onClose,
  onSave,
  addToast
}: RoomAudioSettingsProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-xl rounded-xl border border-[#00FFFF]/20 p-4 z-40 w-[90%] max-w-md shadow-[0_0_30px_rgba(0,255,255,0.2)]"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-orbitron text-[#00FFFF]">Audio Settings</h3>
        <button 
          onClick={onClose}
          className="text-white/60 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="h-[70vh] overflow-y-auto">
        <SettingsTab 
          currentUser={currentUser} 
          onSaveSettings={onSave}
          addToast={addToast}
        />
      </div>
    </m.div>
  );
} 