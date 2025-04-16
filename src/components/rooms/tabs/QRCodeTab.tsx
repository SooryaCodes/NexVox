import React from 'react';
import Image from 'next/image';

type QRCodeTabProps = {
  roomName: string;
  roomId: number;
  qrCodeUrl: string;
  isGeneratingQR: boolean;
  addToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
};

const QRCodeTab: React.FC<QRCodeTabProps> = ({
  roomName,
  roomId,
  qrCodeUrl,
  isGeneratingQR,
  addToast
}) => {
  const handleDownload = () => {
    // Download QR code
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `nexvox-room-${roomId}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('QR Code downloaded', 'success');
  };
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-2">
        <div className="p-2 bg-gradient-to-r from-[#00FFFF]/10 to-[#9D00FF]/10 rounded-lg border border-white/5">
          <div className="text-white/60 text-sm">Scan to join instantly</div>
        </div>
      </div>
      
      {/* QR Code display */}
      <div className="flex flex-col items-center justify-center">
        <div className="p-3 bg-white/5 border border-[#00FFFF]/20 rounded-lg relative overflow-hidden">
          {/* Corner elements */}
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-[#00FFFF]"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-[#00FFFF]"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-[#00FFFF]"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[#00FFFF]"></div>
          
          {isGeneratingQR ? (
            <div className="w-56 h-56 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#00FFFF] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : qrCodeUrl ? (
            <div className="relative w-56 h-56 bg-white/5 rounded-lg overflow-hidden">
              {/* QR Code */}
              <Image 
                src={qrCodeUrl} 
                alt="Room QR Code" 
                width={224} 
                height={224}
                className="w-full h-full object-contain"
              />
              
              {/* Center logo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/80 p-1 rounded-md">
                  <div className="text-xs text-[#00FFFF]">NexVox</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-56 h-56 flex items-center justify-center bg-black/30">
              <div className="text-white/60">QR Code generation failed</div>
            </div>
          )}
        </div>
        
        {qrCodeUrl && (
          <button
            className="mt-3 py-2 px-3 bg-[#00FFFF]/20 hover:bg-[#00FFFF]/30 border border-[#00FFFF]/30 rounded-md text-[#00FFFF] text-sm flex items-center gap-2"
            onClick={handleDownload}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download QR Code</span>
          </button>
        )}
      </div>
      
      {/* Room info with QR */}
      <div className="text-center text-white/70 text-sm mt-2">
        <p>Scanning this QR code will take you directly to room:</p>
        <p className="font-semibold text-[#00FFFF] mt-1">{roomName}</p>
      </div>
    </div>
  );
};

export default QRCodeTab; 