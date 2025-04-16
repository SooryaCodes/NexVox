import React from 'react';
import {
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaWhatsapp,
  FaTelegram,
  FaDiscord,
  FaReddit
} from "react-icons/fa";

type SocialShareTabProps = {
  roomName: string;
  inviteCode: string;
  roomUrl: string;
  handleSocialShare: (platform: string) => void;
};

const SocialShareTab: React.FC<SocialShareTabProps> = ({
  roomName,
  inviteCode,
  roomUrl,
  handleSocialShare
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-2">
        <div className="p-2 bg-gradient-to-r from-[#00FFFF]/10 to-[#9D00FF]/10 rounded-lg border border-white/5">
          <div className="text-white/60 text-sm">Share across your networks</div>
        </div>
      </div>
      
      {/* Social media grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          className="flex flex-col items-center p-3 rounded-lg bg-[#1DA1F2]/10 border border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/20 transition-colors"
          onClick={() => handleSocialShare('twitter')}
        >
          <FaTwitter className="text-[#1DA1F2] text-xl mb-1" />
          <span className="text-xs text-white/80">Twitter</span>
        </button>
        
        <button
          className="flex flex-col items-center p-3 rounded-lg bg-[#1877F2]/10 border border-[#1877F2]/30 hover:bg-[#1877F2]/20 transition-colors"
          onClick={() => handleSocialShare('facebook')}
        >
          <FaFacebook className="text-[#1877F2] text-xl mb-1" />
          <span className="text-xs text-white/80">Facebook</span>
        </button>
        
        <button
          className="flex flex-col items-center p-3 rounded-lg bg-[#0077B5]/10 border border-[#0077B5]/30 hover:bg-[#0077B5]/20 transition-colors"
          onClick={() => handleSocialShare('linkedin')}
        >
          <FaLinkedin className="text-[#0077B5] text-xl mb-1" />
          <span className="text-xs text-white/80">LinkedIn</span>
        </button>
        
        <button
          className="flex flex-col items-center p-3 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-colors"
          onClick={() => handleSocialShare('whatsapp')}
        >
          <FaWhatsapp className="text-[#25D366] text-xl mb-1" />
          <span className="text-xs text-white/80">WhatsApp</span>
        </button>
        
        <button
          className="flex flex-col items-center p-3 rounded-lg bg-[#0088cc]/10 border border-[#0088cc]/30 hover:bg-[#0088cc]/20 transition-colors"
          onClick={() => handleSocialShare('telegram')}
        >
          <FaTelegram className="text-[#0088cc] text-xl mb-1" />
          <span className="text-xs text-white/80">Telegram</span>
        </button>
        
        <button
          className="flex flex-col items-center p-3 rounded-lg bg-[#5865F2]/10 border border-[#5865F2]/30 hover:bg-[#5865F2]/20 transition-colors"
          onClick={() => handleSocialShare('discord')}
        >
          <FaDiscord className="text-[#5865F2] text-xl mb-1" />
          <span className="text-xs text-white/80">Discord</span>
        </button>
        
        <button
          className="flex flex-col items-center p-3 rounded-lg bg-[#FF4500]/10 border border-[#FF4500]/30 hover:bg-[#FF4500]/20 transition-colors"
          onClick={() => handleSocialShare('reddit')}
        >
          <FaReddit className="text-[#FF4500] text-xl mb-1" />
          <span className="text-xs text-white/80">Reddit</span>
        </button>
      </div>
      
      {/* Message preview */}
      <div className="mt-3 p-3 border border-white/10 rounded-lg bg-black/30">
        <div className="text-sm text-white/60 mb-1">Message Preview:</div>
        <div className="text-white/80 text-sm">
          Join me in the "<span className="text-[#00FFFF]">{roomName}</span>" voice room on NexVox!
        </div>
        <div className="text-white/80 text-sm mt-1">
          Use invite code: <span className="font-mono text-[#FF00E6] font-bold">{inviteCode}</span>
        </div>
      </div>
    </div>
  );
};

export default SocialShareTab; 