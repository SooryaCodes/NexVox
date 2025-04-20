import React from "react";
import { m } from "framer-motion";
import GlitchText from "@/components/GlitchText";
import { Room } from "@/types/room";

interface RoomStatsDisplayProps {
  room: Room | null;
  activeSpeakersCount: number;
}

export default function RoomStatsDisplay({ room, activeSpeakersCount }: RoomStatsDisplayProps) {
  return (
    <div className="mb-4 text-center">
      <GlitchText
        text={room?.name || "Voice Room"}
        className="text-4xl font-orbitron mb-2"
        color="cyan"
        intensity="medium"
        activeOnView={true}
      />
      
      {/* Room description */}
      {room?.description && (
        <p className="text-white/60 max-w-lg mx-auto mb-4">{room.description}</p>
      )}
      
      {/* Room stats with enhanced visual style */}
      <div className="flex justify-center gap-4 mb-6">
        <m.div 
          whileHover={{ scale: 1.05, y: -3 }}
          className="bg-black/40 backdrop-blur-md rounded-lg px-4 py-2 border border-[#00FFFF]/10 hover:border-[#00FFFF]/30 transition-all"
        >
          <div className="text-xs text-white/50 mb-1">Participants</div>
          <div className="text-xl font-orbitron text-[#00FFFF]">{room?.participantCount}</div>
        </m.div>
        <m.div
          whileHover={{ scale: 1.05, y: -3 }}
          className="bg-black/40 backdrop-blur-md rounded-lg px-4 py-2 border border-[#9D00FF]/10 hover:border-[#9D00FF]/30 transition-all"
        >
          <div className="text-xs text-white/50 mb-1">Active Speakers</div>
          <div className="text-xl font-orbitron text-[#9D00FF]">{activeSpeakersCount}</div>
        </m.div>
        <m.div
          whileHover={{ scale: 1.05, y: -3 }}
          className="bg-black/40 backdrop-blur-md rounded-lg px-4 py-2 border border-[#FF00E6]/10 hover:border-[#FF00E6]/30 transition-all"
        >
          <div className="text-xs text-white/50 mb-1">Room Type</div>
          <div className="text-xl font-orbitron text-[#FF00E6] capitalize">{room?.type}</div>
        </m.div>
      </div>
    </div>
  );
} 