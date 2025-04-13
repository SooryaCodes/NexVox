import React from "react";

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <div className="relative w-20 h-20">
      <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-transparent border-t-[#00FFFF] rounded-full animate-spin"></div>
      <div className="absolute top-1 left-1 right-1 bottom-1 border-4 border-transparent border-l-[#9D00FF] rounded-full animate-spin animate-reverse"></div>
      <div className="absolute top-2 left-2 right-2 bottom-2 border-4 border-transparent border-b-[#FF00E6] rounded-full animate-spin"></div>
    </div>
  </div>
);

export default LoadingSpinner; 