"use client"
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { IoClose, IoCopy, IoArrowBack, IoArrowForward } from 'react-icons/io5';
import { RiRobot2Fill } from 'react-icons/ri';
import { FiUsers, FiLink } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RoomData, generateRoomId, generateRoomCode, createRoom } from '@/lib/roomUtils';
import NeonGrid from '@/components/NeonGrid';

const CreateRoomPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Omit<RoomData, 'id'>>({
    name: '',
    description: '',
    maxParticipants: 10,
    isPublic: true,
    participantCount: 0,
    type: 'conversation'
  });
  const [roomCode, setRoomCode] = useState('');
  const [roomLink, setRoomLink] = useState('');
  const [copyToast, setCopyToast] = useState({ visible: false, text: '' });
  const [roomId, setRoomId] = useState('');
  
  const formRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Generate random room ID and code on first render
  useEffect(() => {
    // Generate a random room ID
    const newId = generateRoomId();
    setRoomId(newId);
    
    // Generate a random 6-character room code
    const code = generateRoomCode();
    setRoomCode(code);
    
    // Set the room link
    setRoomLink(`nexvox.vercel.app/rooms/${newId}`);
  }, []);

  // Animation on mount
  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { 
          y: 20, 
          opacity: 0,
        },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.5, 
          ease: "power2.out" 
        }
      );
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }));
  };

  const nextStep = () => {
    if (step < 3) {
      const targetEl = formRef.current;
      if (targetEl) {
        gsap.fromTo(
          targetEl, 
          { x: 0, opacity: 1 },
          { 
            x: -10, 
            opacity: 0, 
            duration: 0.2, 
            ease: "power2.in",
            onComplete: () => {
              setStep(step + 1);
              gsap.fromTo(
                targetEl, 
                { x: 10, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.2, ease: "power2.out" }
              );
            }
          }
        );
      } else {
        setStep(step + 1);
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      const targetEl = formRef.current;
      if (targetEl) {
        gsap.fromTo(
          targetEl, 
          { x: 0, opacity: 1 },
          { 
            x: 10, 
            opacity: 0, 
            duration: 0.2, 
            ease: "power2.in",
            onComplete: () => {
              setStep(step - 1);
              gsap.fromTo(
                targetEl, 
                { x: -10, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.2, ease: "power2.out" }
              );
            }
          }
        );
      } else {
        setStep(step - 1);
      }
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyToast({ visible: true, text: `${label} copied!` });
      
      // Animate the copy button
      gsap.to(`#${label.toLowerCase()}-copy-btn`, {
        scale: 1.1,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
      
      // Hide toast after 2 seconds
      setTimeout(() => {
        setCopyToast({ visible: false, text: '' });
      }, 2000);
    });
  };

  const createAndJoinRoom = () => {
    // Use the utility function to create the room
    const newRoom = createRoom({
      ...formData,
      participantCount: 1, // Starting with just you
    });
    
    // Navigate to the new room
    router.push(`/rooms/${newRoom.id}`);
  };

  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      {/* Background effects */}
      <NeonGrid color="#00FFFF" secondaryColor="#9D00FF" opacity={0.05} />
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/rooms" className="flex items-center gap-2">
            <button className="flex items-center gap-2 text-white hover:text-[#00FFFF] transition-colors">
              <IoArrowBack />
              <span>Back to Rooms</span>
            </button>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-orbitron text-[#00FFFF]">Create New Room</h1>
          </div>
          <div className="w-[100px]"></div> {/* Empty div for balanced layout */}
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div 
          ref={formRef}
          className="w-full max-w-[600px] bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_0_25px_rgba(0,255,255,0.2)] overflow-auto"
        >
          {/* Form content - steps */}
          <div className="p-6">
            {/* Step indicators */}
            <div className="flex justify-center mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-orbitron text-sm ${
                      step === i 
                        ? 'bg-[#00FFFF]/20 text-[#00FFFF] border border-[#00FFFF]' 
                        : step > i 
                          ? 'bg-[#9D00FF]/20 text-[#9D00FF] border border-[#9D00FF]' 
                          : 'bg-white/5 text-white/40 border border-white/20'
                    }`}
                  >
                    {i}
                  </div>
                  {i < 3 && (
                    <div className={`w-12 sm:w-20 h-0.5 ${
                      step > i ? 'bg-gradient-to-r from-[#00FFFF] to-[#9D00FF]' : 'bg-white/10'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Step 1: Room Details */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="room-name" className="block text-white/80 mb-2 font-medium">
                    Room Name
                  </label>
                  <input 
                    type="text"
                    id="room-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Cyber Lounge"
                    className="w-full bg-black/40 border border-[#00FFFF]/30 focus:border-[#9D00FF] outline-none text-white p-3 rounded-md placeholder-white/30 transition-all focus:shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                    maxLength={30}
                    aria-label="Room name input"
                  />
                </div>
                
                <div>
                  <label htmlFor="room-description" className="block text-white/80 mb-2 font-medium">
                    Description <span className="text-white/40 text-sm">(Max 100 chars)</span>
                  </label>
                  <textarea
                    id="room-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Chill vibes and good conversations..."
                    className="w-full bg-black/40 border border-[#00FFFF]/30 focus:border-[#9D00FF] outline-none text-white p-3 rounded-md placeholder-white/30 transition-all focus:shadow-[0_0_10px_rgba(0,255,255,0.3)] min-h-[100px] resize-none"
                    maxLength={100}
                    aria-label="Room description input"
                  />
                  <div className="text-right text-white/40 text-xs mt-1">
                    {formData.description.length}/100
                  </div>
                </div>
                
                <div>
                  <label htmlFor="room-type" className="block text-white/80 mb-2 font-medium">
                    Room Type
                  </label>
                  <select
                    id="room-type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-[#00FFFF]/30 focus:border-[#9D00FF] outline-none text-white p-3 rounded-md transition-all focus:shadow-[0_0_10px_rgba(0,255,255,0.3)] appearance-none"
                    aria-label="Room type selection"
                  >
                    <option value="conversation">Conversation</option>
                    <option value="music">Music</option>
                    <option value="gaming">Gaming</option>
                    <option value="chill">Chill</option>
                  </select>
                </div>
              </div>
            )}
            
            {/* Step 2: Room Settings */}
            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <label htmlFor="max-participants" className="block text-white/80 mb-2 font-medium">
                    Maximum Participants
                  </label>
                  <select
                    id="max-participants"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-[#00FFFF]/30 focus:border-[#9D00FF] outline-none text-white p-3 rounded-md transition-all focus:shadow-[0_0_10px_rgba(0,255,255,0.3)] appearance-none"
                    aria-label="Maximum participants selection"
                  >
                    <option value="5">5 participants</option>
                    <option value="10">10 participants</option>
                    <option value="20">20 participants</option>
                    <option value="50">50 participants</option>
                  </select>
                </div>
                
                <div>
                  <span className="block text-white/80 mb-4 font-medium">Room Privacy</span>
                  <div className="flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-black rounded-md border border-[#00FFFF]/30">
                        {formData.isPublic ? (
                          <FiUsers className="w-5 h-5 text-[#00FFFF]" />
                        ) : (
                          <RiRobot2Fill className="w-5 h-5 text-[#FF00E6]" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {formData.isPublic ? "Public Room" : "Private Room"}
                        </div>
                        <div className="text-sm text-white/50">
                          {formData.isPublic 
                            ? "Anyone can join this room" 
                            : "Only people with the code can join"}
                        </div>
                      </div>
                    </div>
                    
                    {/* Toggle switch */}
                    <button 
                      onClick={handleToggle}
                      className="relative w-14 h-7 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#00FFFF]/30"
                      style={{ 
                        background: formData.isPublic 
                          ? 'linear-gradient(to right, #00FFFF, #9D00FF)' 
                          : 'linear-gradient(to right, #9D00FF, #FF00E6)'
                      }}
                      aria-label={formData.isPublic ? "Switch to private" : "Switch to public"}
                    >
                      <span 
                        className="block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300"
                        style={{ transform: formData.isPublic ? 'translateX(0)' : 'translateX(28px)' }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Room Share */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-4">
                  <div className="font-orbitron text-xl mb-2 text-[#00FFFF]">Your Room is Ready!</div>
                  <p className="text-white/60">Share this link or code with others to invite them</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="room-link" className="block text-white/80 mb-2 font-medium flex items-center gap-2">
                      <FiLink className="text-[#00FFFF]" />
                      Room Link
                    </label>
                    <div className="flex">
                      <input 
                        type="text"
                        id="room-link"
                        value={roomLink}
                        readOnly
                        className="flex-1 bg-black/40 border border-[#00FFFF]/30 outline-none text-[#00FFFF] p-3 rounded-l-md"
                        aria-label="Shareable room link"
                      />
                      <button 
                        id="link-copy-btn"
                        onClick={() => copyToClipboard(roomLink, "Link")}
                        className="bg-[#FF00E6]/20 hover:bg-[#FF00E6]/30 text-[#FF00E6] px-4 rounded-r-md border border-[#FF00E6]/30 transition-colors"
                        aria-label="Copy room link"
                      >
                        <IoCopy />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="room-code" className="block text-white/80 mb-2 font-medium">
                      Room Code
                    </label>
                    <div className="flex">
                      <input 
                        type="text"
                        id="room-code"
                        value={roomCode}
                        readOnly
                        className="flex-1 bg-black/40 border border-[#00FFFF]/30 outline-none text-[#9D00FF] p-3 rounded-l-md font-orbitron tracking-widest"
                        aria-label="Shareable room code"
                      />
                      <button 
                        id="code-copy-btn"
                        onClick={() => copyToClipboard(roomCode, "Code")}
                        className="bg-[#FF00E6]/20 hover:bg-[#FF00E6]/30 text-[#FF00E6] px-4 rounded-r-md border border-[#FF00E6]/30 transition-colors"
                        aria-label="Copy room code"
                      >
                        <IoCopy />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6">
                  <button
                    onClick={createAndJoinRoom}
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#00FFFF]/20 to-[#FF00E6]/20 hover:from-[#00FFFF]/30 hover:to-[#FF00E6]/30 border border-[#00FFFF]/30 rounded-md font-orbitron text-[#00FFFF] relative overflow-hidden group"
                    aria-label="Create and join room"
                  >
                    <span className="relative z-10">Create & Join Room</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-[#00FFFF]/10 to-[#FF00E6]/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Form footer */}
          <div className="border-t border-white/10 px-6 py-4 flex justify-between">
            {step > 1 ? (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 text-white hover:text-[#00FFFF] transition-colors"
                aria-label="Go back to previous step"
              >
                <IoArrowBack />
                <span>Back</span>
              </button>
            ) : (
              <div></div> // Empty div to maintain layout
            )}
            
            {step < 3 && (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00FFFF]/20 to-[#9D00FF]/20 hover:from-[#00FFFF]/30 hover:to-[#9D00FF]/30 rounded-md border border-[#00FFFF]/30 text-[#00FFFF]"
                aria-label="Continue to next step"
                disabled={step === 1 && !formData.name.trim()}
              >
                <span>Next</span>
                <IoArrowForward />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Toast notification */}
      {copyToast.visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-[#00FFFF]/20 border border-[#00FFFF]/50 text-[#00FFFF] rounded-md backdrop-blur-md"
        >
          {copyToast.text}
        </motion.div>
      )}
    </main>
  );
};

export default CreateRoomPage; 