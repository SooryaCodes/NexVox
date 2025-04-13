import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => (
  <div className="bg-gradient-to-br from-black/60 to-black/30 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#00FFFF]/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] group">
    <div className="p-5 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00FFFF]/10 to-[#FF00E6]/10 flex items-center justify-center border border-white/10 group-hover:border-[#00FFFF]/30 transition-colors duration-300">
          <div className="text-[#00FFFF] group-hover:text-[#FF00E6] transition-colors duration-300">
            {icon}
          </div>
        </div>
        <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">{title}</p>
      </div>
      <p className="text-3xl font-orbitron mt-auto bg-clip-text text-transparent bg-gradient-to-r from-[#00FFFF] to-[#FF00E6]">{value}</p>
    </div>
  </div>
);

export default StatsCard; 