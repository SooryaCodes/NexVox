"use client";

import React, { useState, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import HolographicCard from "@/components/HolographicCard";
import { User } from "@/types/room";
import { IoSave } from "react-icons/io5";
import { BiLoaderAlt, BiCheck } from "react-icons/bi";

interface SettingsTabProps {
  currentUser: User;
  onSaveSettings?: (settings: any) => void;
  addToast?: (message: string, type: 'success' | 'error' | 'warning') => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ currentUser, onSaveSettings, addToast }) => {
  // Audio settings state
  const [audioInput, setAudioInput] = useState("Default Microphone");
  const [audioOutput, setAudioOutput] = useState("Default Speakers");
  const [micVolume, setMicVolume] = useState(80);
  const [speakerVolume, setSpeakerVolume] = useState(70);
  const [autoMicrophoneMute, setAutoMicrophoneMute] = useState(false);
  const [voiceActivityDetection, setVoiceActivityDetection] = useState(true);
  
  // Spatial audio settings state
  const [spatialAudioEnabled, setSpatialAudioEnabled] = useState(true);
  const [distanceModel, setDistanceModel] = useState("Inverse");
  const [roomSize, setRoomSize] = useState("Small");
  const [roomReverb, setRoomReverb] = useState(30);
  const [attenuationLevel, setAttenuationLevel] = useState(50);
  
  // Voice processing settings state
  const [noiseSuppression, setNoiseSuppression] = useState(true);
  const [echoCancellation, setEchoCancellation] = useState(true);
  const [autoGainControl, setAutoGainControl] = useState(false);
  const [voiceEQ, setVoiceEQ] = useState({bass: 0, mid: 0, treble: 0});
  const [voiceEnhancement, setVoiceEnhancement] = useState(false);
  
  // Avatar animation settings
  const [avatarAnimation, setAvatarAnimation] = useState("Pulse");
  const [avatarColor, setAvatarColor] = useState("#00FFFF");
  const [animationIntensity, setAnimationIntensity] = useState(50);
  
  // Privacy settings
  const [muteOnJoin, setMuteOnJoin] = useState(true);
  const [pushToTalk, setPushToTalk] = useState(false);
  const [pushToTalkKey, setPushToTalkKey] = useState("Space");
  
  // Custom slider component
  const CustomSlider = ({
    min, 
    max,
    value,
    onChange,
    color,
    disabled = false,
    showTicks = false,
    showLabels = false,
    vertical = false,
    height = "h-2"
  }: {
    min: number;
    max: number;
    value: number;
    onChange: (value: number) => void;
    color: string;
    disabled?: boolean;
    showTicks?: boolean;
    showLabels?: boolean;
    vertical?: boolean;
    height?: string;
  }) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    
    const percentage = ((value - min) / (max - min)) * 100;
    
    const handleMove = (clientX: number, clientY: number) => {
      if (disabled || !trackRef.current) return;
      
      const rect = trackRef.current.getBoundingClientRect();
      let newPercentage;
      
      if (vertical) {
        // For vertical slider, invert the percentage calculation
        newPercentage = 100 - ((clientY - rect.top) / rect.height) * 100;
      } else {
        newPercentage = ((clientX - rect.left) / rect.width) * 100;
      }
      
      // Clamp percentage between 0 and 100
      newPercentage = Math.max(0, Math.min(100, newPercentage));
      
      // Convert percentage to value
      const newValue = Math.round(min + (newPercentage / 100) * (max - min));
      onChange(newValue);
    };
    
    const handleMouseDown = (e: React.MouseEvent) => {
      if (disabled) return;
      setIsDragging(true);
      handleMove(e.clientX, e.clientY);
    };
    
    const handleTouchStart = (e: React.TouchEvent) => {
      if (disabled) return;
      setIsDragging(true);
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };
    
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
          handleMove(e.clientX, e.clientY);
        }
      };
      
      const handleTouchMove = (e: TouchEvent) => {
        if (isDragging && e.touches[0]) {
          handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      };
      
      const handleEnd = () => {
        setIsDragging(false);
      };
      
      if (isDragging) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchend', handleEnd);
      }
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('mouseup', handleEnd);
        window.removeEventListener('touchend', handleEnd);
      };
    }, [isDragging, min, max, onChange]);
    
    // Generate ticks
    const ticks = showTicks ? Array.from({ length: 5 }, (_, i) => i * 25) : [];
    
    return (
      <div className={`relative ${vertical ? 'h-40' : 'w-full'} ${disabled ? 'opacity-50' : ''}`}>
        <div 
          ref={trackRef}
          className={`${vertical ? 'w-2 h-full' : `${height} w-full`} bg-black/40 rounded-full overflow-hidden cursor-pointer`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div 
            className={`${vertical ? 'w-full' : 'h-full'} rounded-full`}
            style={{ 
              background: `linear-gradient(${vertical ? '0deg' : '90deg'}, ${color}80, ${color})`,
              width: vertical ? '100%' : `${percentage}%`,
              height: vertical ? `${percentage}%` : '100%',
              position: vertical ? 'absolute' : 'relative',
              bottom: vertical ? '0' : 'auto',
            }}
          />
        </div>
        
        {/* Thumb */}
        <div 
          className="absolute w-4 h-4 rounded-full bg-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
          style={{ 
            left: vertical ? '50%' : `${percentage}%`, 
            top: vertical ? `${100 - percentage}%` : '50%',
            boxShadow: `0 0 10px ${color}`,
            borderColor: color,
            borderWidth: '2px',
          }}
        />
        
        {/* Ticks */}
        {showTicks && (
          <div className={`absolute ${vertical ? 'right-3 h-full top-0 flex flex-col justify-between' : 'w-full flex justify-between mt-2'}`}>
            {ticks.map((tick) => (
              <div 
                key={tick} 
                className={`${vertical ? 'w-1 h-0.5' : 'h-1 w-0.5'} bg-white/30`}
              />
            ))}
          </div>
        )}
        
        {/* Labels */}
        {showLabels && (
          <div className={`absolute ${vertical ? 'right-6 h-full top-0 flex flex-col justify-between text-xs text-white/50' : 'w-full flex justify-between mt-4 text-xs text-white/50'}`}>
            <span>{min}</span>
            {vertical ? null : <span>{Math.round((min + max) / 2)}</span>}
            <span>{max}</span>
          </div>
        )}
      </div>
    );
  };

  // Toggle switch component
  const ToggleSwitch = ({ 
    enabled, 
    setEnabled, 
    color 
  }: { 
    enabled: boolean; 
    setEnabled: (value: boolean) => void; 
    color: string 
  }) => {
    const toggleRef = useRef<HTMLDivElement>(null);
    const [internalEnabled, setInternalEnabled] = useState(enabled);
    
    // Sync with external state prop
    useEffect(() => {
      setInternalEnabled(enabled);
    }, [enabled]);
    
    const handleToggle = (e: React.MouseEvent) => {
      e.preventDefault();
      const newState = !internalEnabled;
      setInternalEnabled(newState);
      setEnabled(newState);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const newState = !internalEnabled;
        setInternalEnabled(newState);
        setEnabled(newState);
      }
    };
    
    return (
      <div 
        ref={toggleRef}
        className="w-14 h-7 px-1 flex items-center bg-black/60 rounded-full cursor-pointer relative"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="switch"
        aria-checked={internalEnabled}
      >
        <m.div 
          className="w-5 h-5 bg-white rounded-full shadow-md z-10" 
          layout
          animate={{ 
            x: internalEnabled ? 30 : 4,
            scale: internalEnabled ? 1.1 : 1,
          }} 
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        <div className="absolute inset-0 rounded-full" style={{
          background: internalEnabled ? `linear-gradient(90deg, ${color}40, ${color}20)` : '',
          boxShadow: internalEnabled ? `0 0 10px ${color}30 inset` : '',
          border: `1px solid ${internalEnabled ? color : 'rgba(255,255,255,0.1)'}`,
        }} />
      </div>
    );
  };

  // Function to handle saving settings
  const handleSaveSettings = () => {
    const settings = {
      audio: {
        input: audioInput,
        output: audioOutput,
        micVolume,
        speakerVolume,
        autoMicrophoneMute,
        voiceActivityDetection
      },
      spatialAudio: {
        enabled: spatialAudioEnabled,
        distanceModel,
        roomSize,
        roomReverb,
        attenuationLevel
      },
      voiceProcessing: {
        noiseSuppression,
        echoCancellation,
        autoGainControl,
        voiceEQ,
        voiceEnhancement
      },
      privacy: {
        muteOnJoin,
        pushToTalk,
        pushToTalkKey
      },
      avatar: {
        animation: avatarAnimation,
        color: avatarColor,
        animationIntensity
      }
    };
    
    // Call the onSaveSettings prop if provided
    if (onSaveSettings) {
      onSaveSettings(settings);
    }
    
    // Show success toast using the parent component's addToast function
    if (addToast) {
      addToast('Settings saved successfully!', 'success');
    }
  };

  const SaveSettings = ({ onClick }: { onClick: () => void }) => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    
    const handleSave = () => {
      setStatus('loading');
      onClick();
      
      // After a delay, show success message
      setTimeout(() => {
        setStatus('success');
        
        // Reset back to normal state after showing success
        setTimeout(() => {
          setStatus('idle');
        }, 2000);
      }, 1000);
    };
    
    return (
      <div className="relative flex justify-center mt-4">
        <button
          onClick={handleSave}
          disabled={status === 'loading'}
          className="relative btn-primary text-white py-2 px-4 rounded-lg transition-all duration-300"
        >
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <m.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <IoSave className="w-5 h-5" />
                <span>Save Settings</span>
              </m.div>
            )}
            
            {status === 'loading' && (
              <m.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <BiLoaderAlt className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </m.div>
            )}
            
            {status === 'success' && (
              <m.div 
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <BiCheck className="w-5 h-5" />
                <span>Saved successfully</span>
              </m.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    );
  };

  return (
    <div className="overflow-y-auto h-full overflow-x-hidden">
      <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 p-4 border-b border-white/10">
        <h3 className="text-lg font-orbitron text-[#00FFFF]">Room Settings</h3>
      </div>
      
      <div className="p-4 space-y-6">
        {/* Audio Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-white/90 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#00FFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Audio Settings
          </h4>
          
          <div className="space-y-3 pl-2 border-l-2 border-[#00FFFF]/30">
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Audio Input</label>
              <select 
                className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#00FFFF] transition-colors"
                value={audioInput}
                onChange={(e) => setAudioInput(e.target.value)}
              >
                <option>Default Microphone</option>
                <option>External Microphone</option>
                <option>Headset Microphone</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Audio Output</label>
              <select 
                className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#00FFFF] transition-colors"
                value={audioOutput}
                onChange={(e) => setAudioOutput(e.target.value)}
              >
                <option>Default Speakers</option>
                <option>Headphones</option>
                <option>External Speakers</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm text-white/70 flex justify-between">
                <span>Microphone Volume</span>
                <span className="text-[#00FFFF]">{micVolume}%</span>
              </label>
              <div className="relative py-2">
                <CustomSlider
                  min={0}
                  max={100}
                  value={micVolume}
                  onChange={setMicVolume}
                  color="#00FFFF"
                  showTicks={true}
                  showLabels={true}
                />
                <div className="absolute -top-1 right-0">
                  <div className="relative w-6 h-6">
                    <div className={`absolute inset-0 rounded-full ${micVolume > 70 ? 'animate-ping' : ''} bg-[#00FFFF]/20`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 3V21M18 6L6 18M6 6L18 18" stroke="#00FFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 my-8">
              <label className="block text-sm text-white/70 flex justify-between">
                <span>Speaker Volume</span>
                <span className="text-[#00FFFF]">{speakerVolume}%</span>
              </label>
              <div className="relative py-2">
                <CustomSlider
                  min={0}
                  max={100}
                  value={speakerVolume}
                  onChange={setSpeakerVolume}
                  color="#00FFFF"
                  showTicks={true}
                />
                <div className="absolute -top-1 right-0">
                  <div className="relative w-6 h-6">
                    {speakerVolume > 0 && (
                      <div className={`absolute inset-0 rounded-full ${speakerVolume > 70 ? 'animate-ping' : ''} bg-[#00FFFF]/20`}></div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="#00FFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        {speakerVolume > 30 && (
                          <path d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53" stroke="#00FFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        )}
                        {speakerVolume > 70 && (
                          <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" stroke="#00FFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        )}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Auto Microphone Mute</span>
              <ToggleSwitch enabled={autoMicrophoneMute} setEnabled={setAutoMicrophoneMute} color="#00FFFF" />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Voice Activity Detection</span>
              <ToggleSwitch enabled={voiceActivityDetection} setEnabled={setVoiceActivityDetection} color="#00FFFF" />
            </div>
          </div>
        </div>
        
        {/* Spatial Audio Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-white/90 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#9D00FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Spatial Audio Settings
          </h4>
          
          <div className="space-y-4 pl-2 border-l-2 border-[#9D00FF]/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Enable Spatial Audio</span>
              <ToggleSwitch enabled={spatialAudioEnabled} setEnabled={setSpatialAudioEnabled} color="#9D00FF" />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Distance Model</label>
              <select 
                className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#9D00FF] transition-colors"
                value={distanceModel}
                onChange={(e) => setDistanceModel(e.target.value)}
                disabled={!spatialAudioEnabled}
              >
                <option>Inverse</option>
                <option>Linear</option>
                <option>Exponential</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Room Size</label>
              <div className="grid grid-cols-3 gap-2">
                {["Small", "Medium", "Large"].map((size) => (
                <m.button
                    key={size}
                    className={`py-2 bg-black/40 rounded-md border ${
                      roomSize === size ? "border-[#9D00FF] text-[#9D00FF]" : "border-white/10"
                    } text-sm`}
                  whileHover={{ borderColor: "#9D00FF", color: "#9D00FF" }}
                  whileTap={{ scale: 0.95 }}
                    onClick={() => setRoomSize(size)}
                    disabled={!spatialAudioEnabled}
                >
                    {size}
                </m.button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm text-white/70 flex justify-between">
                <span>Room Reverb</span>
                <span className="text-[#9D00FF]">{roomReverb}%</span>
              </label>
              <div className="py-2">
                <CustomSlider
                  min={0}
                  max={100}
                  value={roomReverb}
                  onChange={setRoomReverb}
                  color="#9D00FF"
                  disabled={!spatialAudioEnabled}
                />
              </div>
              <div className="flex justify-between text-xs text-white/50">
                <span>Dry</span>
                <span>Wet</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm text-white/70 flex justify-between">
                <span>Distance Attenuation</span>
                <span className="text-[#9D00FF]">{attenuationLevel}%</span>
              </label>
              <div className="py-2">
                <CustomSlider
                  min={0}
                  max={100}
                  value={attenuationLevel}
                  onChange={setAttenuationLevel}
                  color="#9D00FF"
                  disabled={!spatialAudioEnabled}
                />
              </div>
              <div className="flex justify-between text-xs text-white/50">
                <span>Near</span>
                <span>Far</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Voice Processing Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-white/90 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FF00E6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Voice Processing
          </h4>
          
          <div className="space-y-3 pl-2 border-l-2 border-[#FF00E6]/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Noise Suppression</span>
              <ToggleSwitch enabled={noiseSuppression} setEnabled={setNoiseSuppression} color="#FF00E6" />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Echo Cancellation</span>
              <ToggleSwitch enabled={echoCancellation} setEnabled={setEchoCancellation} color="#FF00E6" />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Auto Gain Control</span>
              <ToggleSwitch enabled={autoGainControl} setEnabled={setAutoGainControl} color="#FF00E6" />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Voice Enhancement</span>
              <ToggleSwitch enabled={voiceEnhancement} setEnabled={setVoiceEnhancement} color="#FF00E6" />
            </div>
            
            <div className="space-y-2 pt-4">
              <label className="block text-sm text-white/70 mb-3">Voice Equalizer</label>
              <div className="bg-black/30 rounded-lg p-4 border border-[#FF00E6]/20">
                <div className="grid grid-cols-3 gap-8">
                  {[
                    { name: 'Bass', value: voiceEQ.bass, key: 'bass', freq: '80Hz' },
                    { name: 'Mid', value: voiceEQ.mid, key: 'mid', freq: '1kHz' },
                    { name: 'Treble', value: voiceEQ.treble, key: 'treble', freq: '8kHz' }
                  ].map((band) => (
                    <div key={band.key} className="flex flex-col items-center space-y-3">
                      <div className="text-xs text-[#FF00E6] font-medium">{band.name}</div>
                      <div className="text-[10px] text-white/40">{band.freq}</div>
                      
                      <div className="h-40 flex items-center justify-center">
                        <CustomSlider
                          min={-12}
                          max={12}
                          value={band.value}
                          onChange={(value) => setVoiceEQ({...voiceEQ, [band.key]: value})}
                          color="#FF00E6"
                          vertical={true}
                        />
                      </div>
                      
                      <div className="flex justify-center relative w-full h-6">
                        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/10" />
                        <div className="absolute text-xs font-mono px-2 py-0.5 rounded bg-black border border-[#FF00E6]/30 text-[#FF00E6]">
                          {band.value > 0 ? '+' : ''}{band.value}dB
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Visualizer Demo */}
                <div className="mt-6 pt-3 border-t border-white/5">
                  <div className="h-8 flex items-center space-x-0.5">
                    {Array.from({length: 32}, (_, i) => (
                      <div 
                        key={i} 
                        className="w-1 bg-[#FF00E6]/80"
                        style={{
                          height: `${Math.max(5, Math.abs(Math.sin(i * 0.5) * 25))}px`,
                          opacity: 0.2 + Math.abs(Math.sin(i * 0.2)) * 0.8
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Quick Presets */}
                <div className="mt-4 flex justify-between">
                  <button 
                    className="text-xs px-2 py-1 bg-black/30 rounded border border-[#FF00E6]/20 text-white/60 hover:text-[#FF00E6] transition-colors"
                    onClick={() => setVoiceEQ({bass: 0, mid: 0, treble: 0})}
                  >
                    Flat
                  </button>
                  <button 
                    className="text-xs px-2 py-1 bg-black/30 rounded border border-[#FF00E6]/20 text-white/60 hover:text-[#FF00E6] transition-colors"
                    onClick={() => setVoiceEQ({bass: 3, mid: -2, treble: 4})}
                  >
                    Voice Clarity
                  </button>
                  <button 
                    className="text-xs px-2 py-1 bg-black/30 rounded border border-[#FF00E6]/20 text-white/60 hover:text-[#FF00E6] transition-colors"
                    onClick={() => setVoiceEQ({bass: 6, mid: 0, treble: -2})}
                  >
                    Warm Bass
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Privacy & Input Controls */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-white/90 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FFB800]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Privacy & Controls
          </h4>
          
          <div className="space-y-3 pl-2 border-l-2 border-[#FFB800]/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Mute on Join</span>
              <ToggleSwitch enabled={muteOnJoin} setEnabled={setMuteOnJoin} color="#FFB800" />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Enable Push-to-Talk</span>
              <ToggleSwitch enabled={pushToTalk} setEnabled={setPushToTalk} color="#FFB800" />
            </div>
            
            {pushToTalk && (
              <div className="space-y-2">
                <label className="block text-sm text-white/70">Push-to-Talk Key</label>
                <select 
                  className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#FFB800] transition-colors"
                  value={pushToTalkKey}
                  onChange={(e) => setPushToTalkKey(e.target.value)}
                >
                  <option>Space</option>
                  <option>Control</option>
                  <option>Alt</option>
                  <option>Shift</option>
                  <option>Tab</option>
                </select>
              </div>
            )}
          </div>
        </div>
        
        {/* Avatar Customization */}
        <HolographicCard className="p-4 border border-[#00FFFF]/10 overflow-hidden">
          <h4 className="font-orbitron text-[#00FFFF] text-sm mb-3">Avatar Animation</h4>
          <p className="text-xs text-white/70 mb-3">Choose how your avatar reacts to your voice</p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Animation Type</label>
              <select 
                className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:border-[#00FFFF] transition-colors"
                value={avatarAnimation}
                onChange={(e) => setAvatarAnimation(e.target.value)}
              >
            <option>Pulse</option>
            <option>Wave</option>
            <option>Bounce</option>
                <option>Ripple</option>
                <option>Equalizer</option>
                <option>Glitch</option>
                <option>Orbit</option>
            <option>None</option>
          </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm text-white/70 flex justify-between">
                <span>Animation Intensity</span>
                <span className="text-[#00FFFF]">{animationIntensity}%</span>
              </label>
              <div className="py-2">
                <CustomSlider
                  min={0}
                  max={100}
                  value={animationIntensity}
                  onChange={setAnimationIntensity}
                  color="#00FFFF"
                  disabled={avatarAnimation === "None"}
                  height="h-3"
                />
              </div>
              <div className="flex justify-between text-xs text-white/50">
                <span>Subtle</span>
                <span>Intense</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Avatar Color</label>
              <div className="grid grid-cols-5 gap-2 mb-2">
                {["#00FFFF", "#9D00FF", "#FF00E6", "#FFB800", "#00FF85"].map(color => (
                  <div 
                    key={color}
                    className={`w-full h-8 rounded-md cursor-pointer ${avatarColor === color ? 'ring-2 ring-white' : ''}`}
                    style={{backgroundColor: color}}
                    onClick={() => setAvatarColor(color)}
                  />
                ))}
              </div>
              <div className="flex mt-3 border-t border-white/5 pt-3">
                <label className="block text-xs text-white/60 mr-2">Custom:</label>
                <input 
                  type="text" 
                  value={avatarColor}
                  onChange={(e) => setAvatarColor(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-[#00FFFF] transition-colors"
                  placeholder="#RRGGBB"
                />
                <div 
                  className="ml-2 w-6 h-6 rounded-md border border-white/20"
                  style={{backgroundColor: avatarColor}}
                />
              </div>
            </div>
          </div>
          
          {/* Avatar preview */}
          <div className="mt-6 flex justify-center">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#00FFFF]/20 to-[#FF00E6]/20 flex items-center justify-center relative">
              <div className="w-full h-full bg-gradient-to-br from-[#00FFFF]/30 to-[#FF00E6]/30 flex items-center justify-center">
                <span className="text-2xl font-bold">{currentUser?.name?.charAt(0)}</span>
              </div>
              <div 
                className={`absolute inset-0 rounded-full border-2`}
                style={{
                  borderColor: avatarColor,
                  animation: avatarAnimation === 'None' ? 'none' : avatarAnimation === 'Pulse' ? 'pulse 2s infinite' : 
                    avatarAnimation === 'Wave' ? 'wave 3s infinite' : avatarAnimation === 'Bounce' ? 'bounce 2s infinite' :
                    avatarAnimation === 'Ripple' ? 'ripple 2s infinite' : avatarAnimation === 'Equalizer' ? 'equalizer 2s infinite' :
                    avatarAnimation === 'Glitch' ? 'glitch 1s infinite' : avatarAnimation === 'Orbit' ? 'orbit 3s infinite' : 'none',
                  animationDuration: `${3 - (animationIntensity / 50)}s`
                }}
              ></div>
              {avatarAnimation === 'Equalizer' && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-0.5 bg-white"
                      style={{
                        height: `${3 + Math.random() * 8}px`, 
                        animationDuration: `${0.5 + Math.random() * 0.5}s`,
                        animationDelay: `${i * 0.1}s`,
                        animation: 'equalize 1s ease-in-out infinite alternate'
                      }}
                    ></div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <style jsx>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 0.7; }
              50% { transform: scale(1.05); opacity: 1; }
            }
            @keyframes wave {
              0%, 100% { transform: scale(1); }
              25% { transform: scale(1.03) rotate(2deg); }
              50% { transform: scale(1) rotate(0deg); }
              75% { transform: scale(1.03) rotate(-2deg); }
            }
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
            }
            @keyframes ripple {
              0% { transform: scale(0.9); opacity: 1; }
              100% { transform: scale(1.1); opacity: 0; }
            }
            @keyframes equalize {
              0% { height: 3px; }
              100% { height: 12px; }
            }
            @keyframes glitch {
              0%, 100% { transform: translate(0); }
              20% { transform: translate(-2px, 2px); }
              40% { transform: translate(-2px, -2px); }
              60% { transform: translate(2px, 2px); }
              80% { transform: translate(2px, -2px); }
            }
            @keyframes orbit {
              0% { transform: rotate(0deg) translateX(4px) rotate(0deg); }
              100% { transform: rotate(360deg) translateX(4px) rotate(-360deg); }
            }
          `}</style>
        </HolographicCard>
        
        <div className="pt-6 border-t border-white/10 text-center">
          <SaveSettings onClick={handleSaveSettings} />
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
