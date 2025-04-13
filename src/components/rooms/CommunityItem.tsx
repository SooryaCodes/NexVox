import React from "react";
import { m } from "framer-motion";
import Image from "next/image";

interface Community {
  id: number;
  name: string;
  members: number;
  rooms: number;
  image: string;
}

interface CommunityItemProps {
  community: Community;
}

const CommunityItem: React.FC<CommunityItemProps> = ({ community }) => (
  <m.div
    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-white/5"
    whileHover={{ x: 5 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#FF00E6]/30">
      <Image
        src={community.image}
        alt={community.name}
        fill
        className="object-cover"
      />
    </div>
    <div className="flex-1">
      <h3 className="font-medium text-white">{community.name}</h3>
      <p className="text-xs text-white/60">{community.members} members</p>
    </div>
    <div className="px-2 py-1 bg-[#FF00E6]/20 rounded-md text-xs text-[#FF00E6]">
      {community.rooms} rooms
    </div>
  </m.div>
);

export default CommunityItem; 