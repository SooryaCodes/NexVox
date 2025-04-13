import React from "react";

interface AudioLevelIndicatorProps {
  level: number;
}

const AudioLevelIndicator: React.FC<AudioLevelIndicatorProps> = ({ level }) => (
  <div className="flex items-center gap-1 h-4">
    {[...Array(8)].map((_, i) => (
      <div 
        key={i}
        className={`w-1 rounded-full ${
          i < level 
            ? i < 3 
              ? 'bg-[#00FFFF] h-1' 
              : i < 6 
                ? 'bg-[#9D00FF] h-2' 
                : 'bg-[#FF00E6] h-3'
            : 'bg-white/20 h-1'
        }`}
      />
    ))}
  </div>
);

export default AudioLevelIndicator;
