import React, { useState, useEffect, lazy, Suspense, memo } from "react";
import { m, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { 
  FaLink, 
  FaCopy, 
  FaShareAlt, 
  FaQrcode,
} from "react-icons/fa";
import QRCode from "qrcode";

// Lazy load tab components
const SocialShareTab = lazy(() => import('./tabs/SocialShareTab'));
const QRCodeTab = lazy(() => import('./tabs/QRCodeTab'));

type RoomShareModalProps = { 
  isOpen: boolean; 
  onClose: () => void; 
  roomId: number; 
  roomName: string;
  addToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
};

// Optimize component with memo
const RoomShareModal: React.FC<RoomShareModalProps> = memo(({ 
  isOpen, 
  onClose, 
  roomId, 
  roomName, 
  addToast 
}) => {
  const [inviteCode, setInviteCode] = useState<string>("");
  const [copyAnimation, setCopyAnimation] = useState<'link' | 'code' | null>(null);
  const [activeTab, setActiveTab] = useState<'link' | 'social' | 'qr'>('link');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [qrInitiated, setQrInitiated] = useState(false);
  
  const roomUrl = typeof window !== 'undefined' ? `${window.location.origin}/rooms/${roomId}` : '';
  
  // Generate random invite code on mount
  useEffect(() => {
    if (isOpen && !inviteCode) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setInviteCode(code);
    }
  }, [isOpen, inviteCode]);
    
  // Pre-generate QR code when needed
  useEffect(() => {
    if (activeTab === 'qr' && !qrCodeUrl && roomUrl && !qrInitiated) {
      setQrInitiated(true);
      generateQRCode();
    }
  }, [activeTab, qrCodeUrl, roomUrl, qrInitiated]);
  
  // Optimized QR code generation
  const generateQRCode = async () => {
    if (!roomUrl) return;
    
    try {
      setIsGeneratingQR(true);
      // Use setTimeout to prevent UI blocking
      setTimeout(async () => {
      const qrDataUrl = await QRCode.toDataURL(roomUrl, {
        color: {
          dark: '#00FFFF',
          light: '#000000'
        },
          errorCorrectionLevel: 'M', // Changed from H to M for faster generation
        margin: 1,
          width: 256 // Reduced size
      });
      setQrCodeUrl(qrDataUrl);
        setIsGeneratingQR(false);
      }, 100);
    } catch (err) {
      console.error("QR Code generation error:", err);
      addToast("Failed to generate QR code", 'error');
      setIsGeneratingQR(false);
    }
  };
  
  // Handle copy to clipboard
  const copyToClipboard = (text: string, type: 'link' | 'code') => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopyAnimation(type);
        addToast(`${type === 'link' ? 'Room link' : 'Invite code'} copied`, 'success');
        setTimeout(() => setCopyAnimation(null), 1000);
      })
      .catch(() => {
        addToast(`Failed to copy ${type}`, 'error');
      });
  };
  
  // Handle native share if available
  const handleNativeShare = () => {
    if (!navigator.share) {
      addToast('Sharing not supported in your browser', 'warning');
      return;
    }
    
    navigator.share({
      title: `Join my room: ${roomName}`,
      text: `Join me in the "${roomName}" voice room on NexVox! Use invite code: ${inviteCode}`,
      url: roomUrl
    })
      .then(() => addToast('Room shared successfully', 'success'))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          addToast('Error sharing room', 'error');
        }
      });
  };
  
  // Simplified variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };
  
  // Skip rendering if modal is closed
  if (!isOpen) return null;
  
  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="wait">
        {/* Simplified backdrop without particles */}
        <m.div
          key="backdrop"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          onClick={onClose}
          transition={{ duration: 0.2 }}
        />
        
        {/* Modal */}
        <m.div
          key="modal"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 border border-[#00FFFF]/30 rounded-xl p-0 z-50 w-[95%] max-w-lg overflow-hidden shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with simplified design */}
          <div className="relative bg-gradient-to-r from-[#00FFFF]/10 to-[#9D00FF]/10">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="text-[#00FFFF] text-lg flex items-center gap-2">
                <FaShareAlt className="text-[#00FFFF]" />
                Share "{roomName}"
              </h3>
              
              <button 
                onClick={onClose}
                className="text-white/60 hover:text-white w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Tabs Navigation - Simplified */}
          <div className="flex border-b border-white/10">
            <button
              className={`flex-1 py-3 text-center text-sm font-medium ${
                activeTab === 'link' 
                  ? 'text-[#00FFFF] border-b-2 border-[#00FFFF]' 
                  : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setActiveTab('link')}
            >
              <span className="flex items-center justify-center gap-2">
                <FaLink className="h-4 w-4" />
                Links & Code
              </span>
            </button>
            
            <button
              className={`flex-1 py-3 text-center text-sm font-medium ${
                activeTab === 'social' 
                  ? 'text-[#00FFFF] border-b-2 border-[#00FFFF]' 
                  : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setActiveTab('social')}
            >
              <span className="flex items-center justify-center gap-2">
                <FaShareAlt className="h-4 w-4" />
                Social Share
              </span>
            </button>
            
            <button
              className={`flex-1 py-3 text-center text-sm font-medium ${
                activeTab === 'qr' 
                  ? 'text-[#00FFFF] border-b-2 border-[#00FFFF]' 
                  : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setActiveTab('qr')}
            >
              <span className="flex items-center justify-center gap-2">
                <FaQrcode className="h-4 w-4" />
                QR Code
              </span>
            </button>
          </div>
          
          {/* Content Panel - Lazy loaded tabs */}
          <div className="p-4">
            <AnimatePresence mode="wait">
              {activeTab === 'link' && (
                <m.div 
                  key="link-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Invite link with simplified styling */}
                  <div className="space-y-2">
                    <div className="text-sm text-white/80 font-medium flex items-center gap-2">
                      <FaLink className="text-[#00FFFF]" />
                      Room Link
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1 bg-black/50 border border-white/10 rounded-l-md py-2 px-3 text-white/70 truncate">
                        {roomUrl}
                      </div>
                      <button
                        className="bg-[#00FFFF]/20 hover:bg-[#00FFFF]/30 text-[#00FFFF] border border-[#00FFFF]/30 rounded-r-md px-3 py-2 flex items-center justify-center"
                        onClick={() => copyToClipboard(roomUrl, 'link')}
                        aria-label="Copy link"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </div>
                  
                  {/* Invite code with simplified styling */}
                  <div className="space-y-2">
                    <div className="text-sm text-white/80 font-medium flex items-center gap-2">
                      <FaCopy className="text-[#FF00E6]" />
                      Invite Code
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1 bg-black/50 border border-white/10 rounded-l-md py-2 px-3 text-white/70 tracking-wider text-center font-mono">
                        {inviteCode}
                      </div>
                      <button
                        className="bg-[#FF00E6]/20 hover:bg-[#FF00E6]/30 text-[#FF00E6] border border-[#FF00E6]/30 rounded-r-md px-3 py-2 flex items-center justify-center"
                        onClick={() => copyToClipboard(inviteCode, 'code')}
                        aria-label="Copy code"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </div>
                  
                  {/* Native Share button with simplified design */}
                  <div className="pt-2">
                    <button
                      className="w-full py-2 bg-gradient-to-r from-[#00FFFF]/20 to-[#9D00FF]/20 hover:from-[#00FFFF]/30 hover:to-[#9D00FF]/30 border border-[#00FFFF]/30 rounded-md text-white font-medium flex items-center justify-center gap-2"
                      onClick={handleNativeShare}
                    >
                      <FaShareAlt className="text-[#00FFFF]" />
                      <span>Share via Device</span>
                    </button>
                  </div>
                </m.div>
              )}
              
              {activeTab === 'social' && (
                <m.div
                  key="social-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Suspense fallback={<div className="flex justify-center p-10"><div className="w-8 h-8 border-2 border-t-transparent border-[#00FFFF] rounded-full animate-spin"></div></div>}>
                    <SocialShareTab 
                      roomName={roomName}
                      inviteCode={inviteCode}
                      roomUrl={roomUrl}
                      handleSocialShare={(platform: string) => {
                        let shareUrl = '';
                        const text = encodeURIComponent(`Join me in the "${roomName}" voice room on NexVox! Use invite code: ${inviteCode}`);
                        const url = encodeURIComponent(roomUrl);
                        
                        switch (platform) {
                          case 'twitter':
                            shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                            break;
                          case 'facebook':
                            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
                            break;
                          case 'linkedin':
                            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                            break;
                          case 'whatsapp':
                            shareUrl = `https://wa.me/?text=${text}%20${url}`;
                            break;
                          case 'telegram':
                            shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
                            break;
                          case 'discord':
                            copyToClipboard(`Join me in the "${roomName}" voice room on NexVox!\nUse invite code: ${inviteCode}\n${roomUrl}`, 'link');
                            addToast('Discord message copied to clipboard', 'success');
                            return;
                          case 'reddit':
                            shareUrl = `https://www.reddit.com/submit?url=${url}&title=${text}`;
                            break;
                        }
                        
                        if (shareUrl) {
                          window.open(shareUrl, '_blank', 'noopener,noreferrer');
                          addToast(`Sharing to ${platform}`, 'success');
                        }
                      }}
                    />
                  </Suspense>
                </m.div>
              )}
              
              {activeTab === 'qr' && (
                <m.div
                  key="qr-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Suspense fallback={<div className="flex justify-center p-10"><div className="w-8 h-8 border-2 border-t-transparent border-[#00FFFF] rounded-full animate-spin"></div></div>}>
                    <QRCodeTab 
                      roomName={roomName}
                      roomId={roomId}
                      qrCodeUrl={qrCodeUrl}
                      isGeneratingQR={isGeneratingQR}
                      addToast={addToast}
                    />
                  </Suspense>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  );
});

RoomShareModal.displayName = 'RoomShareModal';

export default RoomShareModal; 