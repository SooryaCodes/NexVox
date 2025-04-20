import React from "react";
import AudioWaveform from "@/components/AudioWaveform";

export default function RoomAudioVisualizer() {
  return (
    <div className="max-w-md mx-auto mt-6">
      <AudioWaveform 
        width={400} 
        height={40} 
        bars={40} 
        color="#00FFFF" 
        activeColor="#FF00E6" 
        className="transform scale-90 md:scale-100"
      />
    </div>
  );
} 