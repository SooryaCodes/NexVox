import React from "react";
import { m } from "framer-motion";

interface Category {
  id: number;
  name: string;
  icon: string;
  count: number;
  color: string;
}

interface CategoryItemProps {
  category: Category | { id: number; name: string; icon: string; count: number; color: string };
  isActive: boolean;
  onClick: (id: number) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, isActive, onClick }) => (
  <m.div
    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
      isActive ? "bg-[#00FFFF]/20 border border-[#00FFFF]/50" : "hover:bg-white/5"
    }`}
    whileHover={{ x: 5 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onClick(category.id)}
  >
    <div 
      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-gradient-to-br from-black to-gray-900 border border-${isActive ? '[#00FFFF]' : 'white/10'}`}
      style={{ boxShadow: isActive ? `0 0 15px ${category.color || '#00FFFF'}50` : "none" }}
    >
      {category.icon}
    </div>
    <div className="flex-1">
      <h3 className={`font-medium ${isActive ? "text-[#00FFFF]" : "text-white"}`}>{category.name}</h3>
      <p className="text-xs text-white/60">{category.count} rooms</p>
    </div>
    {isActive && (
      <div className="w-2 h-10 bg-[#00FFFF] rounded-full glow-sm"></div>
    )}
  </m.div>
);

export default CategoryItem; 