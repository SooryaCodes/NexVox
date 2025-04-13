// src/app/settings/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { m, motion } from "framer-motion";
import HolographicCard from "@/components/HolographicCard";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import NeonGrid from "@/components/NeonGrid";
import ShimmeringText from "@/components/ShimmeringText";
import { IoChevronBackOutline, IoSaveOutline } from "react-icons/io5";

// Tabs for settings
const settingsTabs = [
  { id: "account", label: "Account" },
  { id: "audio", label: "Audio" },
  { id: "appearance", label: "Appearance" },
  { id: "notifications", label: "Notifications" },
  { id: "privacy", label: "Privacy" },
  { id: "devices", label: "Devices" },
  { id: "accessibility", label: "Accessibility" },
  { id: "language", label: "Language" },
];

// Theme options
const themeOptions = [
  { id: "cyberpunk", name: "Cyberpunk", color: "#00FFFF", secColor: "#FF00E6" },
  { id: "neon", name: "Neon Noir", color: "#FF00E6", secColor: "#9D00FF" },
  { id: "digital", name: "Digital Wave", color: "#00FFFF", secColor: "#9D00FF" },
  { id: "midnight", name: "Midnight Hacker", color: "#9D00FF", secColor: "#00FFFF" },
];

// Language options
const languageOptions = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "ja", name: "日本語" },
  { code: "zh", name: "中文" },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [selectedTheme, setSelectedTheme] = useState("cyberpunk");
  const [settings, setSettings] = useState({
    // Account
    email: "user@nexvox.io",
    username: "CyberUser",
    twoFactorEnabled: true,
    
    // Audio
    inputDevice: "Default Microphone",
    outputDevice: "Default Speakers",
    microphoneVolume: 80,
    outputVolume: 85,
    noiseCancellation: true,
    echoCancellation: true,
    spatialAudio: true,
    
    // Appearance
    theme: "cyberpunk",
    fontSize: "medium",
    reducedMotion: false,
    highContrast: false,
    
    // Notifications
    soundEffects: true,
    roomInvites: true,
    connectionRequests: true,
    systemNotifications: true,
    badgeUnlocks: true,
    emailNotifications: false,
    
    // Privacy
    profileVisibility: "public",
    onlineStatus: "show",
    roomActivity: "friends",
    voiceHistory: false,
    dataCollection: "minimal",
    
    // Devices
    devices: [],
    
    // Accessibility
    screenReader: false,
    keyboardShortcuts: true,
    colorBlindMode: false,
    captionsEnabled: false,
    
    // Language
    language: "en",
    voiceLanguage: "en"
  });
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  const handleSettingChange = (section: string, setting: string, value: any) => {
    setSettings({
      ...settings,
      [setting]: value
    });
  };
  
  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    handleSettingChange("appearance", "theme", theme);
  };
  
  // Toggle switch component
  const ToggleSwitch = ({ label, value, onChange, description }: { label: string, value: boolean, onChange: (value: boolean) => void, description?: string }) => (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-white mb-1">{label}</label>
        {description && <p className="text-xs text-white/50">{description}</p>}
      </div>
      <button 
        className={`relative w-14 h-7 rounded-full transition-colors ${value ? 'bg-[#00FFFF]/40' : 'bg-white/10'}`}
        onClick={() => onChange(!value)}
        aria-checked={value}
        role="switch"
      >
        <span 
          className={`absolute top-1 left-1 w-5 h-5 rounded-full transition-transform transform ${value ? 'translate-x-7 bg-[#00FFFF]' : 'bg-white/70'}`}
        ></span>
      </button>
    </div>
  );
  
  // Radio button component
  const RadioOption = ({ id, name, value, current, onChange, description }: { id: string, name: string, value: string, current: string, onChange: (value: string) => void, description?: string }) => (
    <div className="mb-4">
      <div className="flex items-start gap-2">
        <div 
          className={`relative flex items-center justify-center w-5 h-5 rounded-full border ${current === value ? 'border-[#00FFFF]' : 'border-white/30'} cursor-pointer mt-0.5`}
          onClick={() => onChange(value)}
        >
          {current === value && (
            <div className="w-3 h-3 rounded-full bg-[#00FFFF]"></div>
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm text-white">{name}</div>
          {description && <p className="text-xs text-white/50">{description}</p>}
        </div>
      </div>
    </div>
  );
  
  // Slider component
  const Slider = ({ label, value, onChange, min = 0, max = 100, description }: { label: string, value: number, onChange: (value: number) => void, min?: number, max?: number, description?: string }) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-medium text-white">{label}</label>
        <span className="text-xs text-white/70">{value}%</span>
      </div>
      <input 
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-[#00FFFF]"
      />
      {description && <p className="text-xs text-white/50 mt-1">{description}</p>}
    </div>
  );
  
  // Selection component
  const Select = ({ label, options, value, onChange, description }: { label: string, options: {value: string, label: string}[], value: string, onChange: (value: string) => void, description?: string }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-white mb-1">{label}</label>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/40 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#00FFFF]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {description && <p className="text-xs text-white/50 mt-1">{description}</p>}
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white pb-12">
      <NeonGrid color="#00FFFF" secondaryColor="#9D00FF" opacity={0.05} />
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/rooms">
              <m.button
                className="p-2 bg-black/40 backdrop-blur-md rounded-md border border-white/10 text-white/70"
                whileHover={{ scale: 1.05, borderColor: "#00FFFF", color: "#00FFFF" }}
                whileTap={{ scale: 0.95 }}
                aria-label="Back to Rooms"
              >
                <IoChevronBackOutline className="h-5 w-5" />
              </m.button>
            </Link>
            <h1 className="text-2xl font-orbitron text-[#00FFFF]">Settings</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <m.button
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#00FFFF]/20 to-[#FF00E6]/20 rounded-md border border-[#00FFFF]/30 text-[#00FFFF] font-medium text-sm"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <IoSaveOutline className="h-4 w-4" />
              <span>Save Changes</span>
            </m.button>
          </div>
        </div>
      </header>
      
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar tabs */}
          <div className="md:w-64 shrink-0">
            <GlassmorphicCard className="p-4">
              <div className="flex flex-col gap-1">
                {settingsTabs.map((tab) => (
                  <m.button
                    key={tab.id}
                    className={`flex items-center gap-3 p-3 rounded-lg text-left ${
                      activeTab === tab.id 
                        ? "bg-[#00FFFF]/20 border border-[#00FFFF]/30 text-[#00FFFF]" 
                        : "hover:bg-white/5 text-white/80"
                    }`}
                    whileHover={{ x: activeTab === tab.id ? 0 : 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTabChange(tab.id)}
                  >
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="ml-auto w-2 h-6 bg-[#00FFFF] rounded-full"></div>
                    )}
                  </m.button>
                ))}
              </div>
            </GlassmorphicCard>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <GlassmorphicCard className="p-6">
              {activeTab === "account" && (
                <div>
                  <h2 className="text-xl font-orbitron text-[#00FFFF] mb-6">Account Settings</h2>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white mb-1">Email Address</label>
                    <input 
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleSettingChange("account", "email", e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#00FFFF]"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white mb-1">Username</label>
                    <input 
                      type="text"
                      value={settings.username}
                      onChange={(e) => handleSettingChange("account", "username", e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#00FFFF]"
                    />
                  </div>
                  
                  <ToggleSwitch 
                    label="Two-Factor Authentication" 
                    value={settings.twoFactorEnabled} 
                    onChange={(value) => handleSettingChange("account", "twoFactorEnabled", value)}
                    description="Enhance your account security with two-factor authentication"
                  />
                  
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h3 className="text-lg font-orbitron text-[#FF00E6] mb-6">Danger Zone</h3>
                    
                    <div className="bg-black/40 border border-red-500/30 rounded-lg p-4 mb-4">
                      <h4 className="text-md font-medium text-white mb-2">Reset Password</h4>
                      <p className="text-sm text-white/70 mb-3">Change your account password. You'll be logged out of all sessions.</p>
                      <m.button
                        className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-md text-sm font-medium"
                        whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(239, 68, 68, 0.3)" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Reset Password
                      </m.button>
                    </div>
                    
                    <div className="bg-black/40 border border-red-500/30 rounded-lg p-4">
                      <h4 className="text-md font-medium text-white mb-2">Delete Account</h4>
                      <p className="text-sm text-white/70 mb-3">Permanently delete your account and all associated data. This action cannot be undone.</p>
                      <m.button
                        className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-md text-sm font-medium"
                        whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(239, 68, 68, 0.3)" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Delete Account
                      </m.button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "audio" && (
                <div>
                  <h2 className="text-xl font-orbitron text-[#00FFFF] mb-6">Audio Settings</h2>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white mb-1">Input Device</label>
                    <select 
                      value={settings.inputDevice}
                      onChange={(e) => handleSettingChange("audio", "inputDevice", e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#00FFFF]"
                    >
                      <option value="Default Microphone">Default Microphone</option>
                      <option value="Headset Microphone">Headset Microphone</option>
                      <option value="External Microphone">External Microphone</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white mb-1">Output Device</label>
                    <select 
                      value={settings.outputDevice}
                      onChange={(e) => handleSettingChange("audio", "outputDevice", e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#00FFFF]"
                    >
                      <option value="Default Speakers">Default Speakers</option>
                      <option value="Headphones">Headphones</option>
                      <option value="External Speakers">External Speakers</option>
                    </select>
                  </div>
                  
                  <Slider 
                    label="Microphone Volume" 
                    value={settings.microphoneVolume} 
                    onChange={(value) => handleSettingChange("audio", "microphoneVolume", value)}
                  />
                  
                  <Slider 
                    label="Output Volume" 
                    value={settings.outputVolume} 
                    onChange={(value) => handleSettingChange("audio", "outputVolume", value)}
                  />
                  
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h3 className="text-lg font-orbitron text-[#9D00FF] mb-6">Advanced Audio</h3>
                    
                    <ToggleSwitch 
                      label="Noise Cancellation" 
                      value={settings.noiseCancellation} 
                      onChange={(value) => handleSettingChange("audio", "noiseCancellation", value)}
                      description="Reduce background noise during voice chat"
                    />
                    
                    <ToggleSwitch 
                      label="Echo Cancellation" 
                      value={settings.echoCancellation} 
                      onChange={(value) => handleSettingChange("audio", "echoCancellation", value)}
                      description="Prevent audio feedback during conversations"
                    />
                    
                    <ToggleSwitch 
                      label="Spatial Audio" 
                      value={settings.spatialAudio} 
                      onChange={(value) => handleSettingChange("audio", "spatialAudio", value)}
                      description="Experience 3D positional audio in voice rooms"
                    />
                    
                    <div className="mt-4 bg-black/20 border border-[#9D00FF]/20 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#9D00FF]/20 rounded-md text-[#9D00FF]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white mb-1">Audio Quality Tip</h4>
                          <p className="text-xs text-white/70">For the best experience, use headphones and ensure you have a stable internet connection.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "appearance" && (
                <div>
                  <h2 className="text-xl font-orbitron text-[#00FFFF] mb-6">Appearance Settings</h2>
                  
                  <div className="mb-8">
                    <h3 className="text-md font-medium text-white mb-4">Theme</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {themeOptions.map((theme) => (
                        <m.div
                          key={theme.id}
                          className={`overflow-hidden rounded-lg cursor-pointer ${
                            selectedTheme === theme.id 
                              ? `border-2 border-[${theme.color}]` 
                              : 'border border-white/10'
                          }`}
                          whileHover={{ y: -5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleThemeChange(theme.id)}
                        >
                          <div 
                            className="h-24 p-4"
                            style={{ background: `linear-gradient(135deg, ${theme.color}30, ${theme.secColor}30)` }}
                          >
                            <div 
                              className="w-full h-full rounded-md border border-white/20"
                              style={{ background: `linear-gradient(135deg, ${theme.color}10, ${theme.secColor}10)` }}
                            ></div>
                          </div>
                          <div className="p-3 bg-black/40 text-center">
                            <div className="text-sm" style={{ color: theme.color }}>{theme.name}</div>
                          </div>
                        </m.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white mb-1">Font Size</label>
                    <select 
                      value={settings.fontSize}
                      onChange={(e) => handleSettingChange("appearance", "fontSize", e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#00FFFF]"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="xl">Extra Large</option>
                    </select>
                  </div>
                  
                  <ToggleSwitch 
                    label="Reduced Motion" 
                    value={settings.reducedMotion} 
                    onChange={(value) => handleSettingChange("appearance", "reducedMotion", value)}
                    description="Minimize animations and motion effects"
                  />
                  
                  <ToggleSwitch 
                    label="High Contrast" 
                    value={settings.highContrast} 
                    onChange={(value) => handleSettingChange("appearance", "highContrast", value)}
                    description="Increase contrast for better visibility"
                  />
                </div>
              )}
              
              {activeTab === "notifications" && (
                <div>
                  <h2 className="text-xl font-orbitron text-[#00FFFF] mb-6">Notification Settings</h2>
                  
                  <ToggleSwitch 
                    label="Sound Effects" 
                    value={settings.soundEffects} 
                    onChange={(value) => handleSettingChange("notifications", "soundEffects", value)}
                    description="Play sound effects for notifications and interactions"
                  />
                  
                  <ToggleSwitch 
                    label="Room Invites" 
                    value={settings.roomInvites} 
                    onChange={(value) => handleSettingChange("notifications", "roomInvites", value)}
                    description="Get notified when someone invites you to a room"
                  />
                  
                  <ToggleSwitch 
                    label="Connection Requests" 
                    value={settings.connectionRequests} 
                    onChange={(value) => handleSettingChange("notifications", "connectionRequests", value)}
                    description="Get notified for new connection requests"
                  />
                  
                  <ToggleSwitch 
                    label="System Notifications" 
                    value={settings.systemNotifications} 
                    onChange={(value) => handleSettingChange("notifications", "systemNotifications", value)}
                    description="Important updates and system announcements"
                  />
                  
                  <ToggleSwitch 
                    label="Badge Unlocks" 
                    value={settings.badgeUnlocks} 
                    onChange={(value) => handleSettingChange("notifications", "badgeUnlocks", value)}
                    description="Get notified when you earn a new badge"
                  />
                  
                  <ToggleSwitch 
                    label="Email Notifications" 
                    value={settings.emailNotifications} 
                    onChange={(value) => handleSettingChange("notifications", "emailNotifications", value)}
                    description="Receive important notifications via email"
                  />
                  
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h3 className="text-lg font-orbitron text-[#FF00E6] mb-4">Do Not Disturb Schedule</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-1">Start Time</label>
                        <input 
                          type="time"
                          className="w-full bg-black/40 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#FF00E6]"
                          defaultValue="22:00"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-1">End Time</label>
                        <input 
                          type="time"
                          className="w-full bg-black/40 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#FF00E6]"
                          defaultValue="08:00"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-black/20 border border-[#FF00E6]/20 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#FF00E6]/20 rounded-md text-[#FF00E6]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white mb-1">Do Not Disturb Mode</h4>
                          <p className="text-xs text-white/70">During this time, you won't receive any notifications, but messages and invites will still be saved.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "privacy" && (
                <div>
                  <h2 className="text-xl font-orbitron text-[#00FFFF] mb-6">Privacy Settings</h2>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white mb-1">Profile Visibility</label>
                    <select 
                      value={settings.profileVisibility}
                      onChange={(e) => handleSettingChange("privacy", "profileVisibility", e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#00FFFF]"
                    >
                      <option value="public">Public (Everyone can see)</option>
                      <option value="connections">Connections Only</option>
                      <option value="private">Private (Only you)</option>
                    </select>
                    <p className="text-xs text-white/50 mt-1">Control who can view your profile information</p>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white mb-1">Online Status</label>
                    <select 
                      value={settings.onlineStatus}
                      onChange={(e) => handleSettingChange("privacy", "onlineStatus", e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#00FFFF]"
                    >
                      <option value="show">Show to Everyone</option>
                      <option value="connections">Show to Connections</option>
                      <option value="hide">Always Hide</option>
                    </select>
                    <p className="text-xs text-white/50 mt-1">Control who can see when you're online</p>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white mb-1">Room Activity</label>
                    <select 
                      value={settings.roomActivity}
                      onChange={(e) => handleSettingChange("privacy", "roomActivity", e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#00FFFF]"
                    >
                      <option value="everyone">Visible to Everyone</option>
                      <option value="friends">Visible to Connections</option>
                      <option value="none">Hidden</option>
                    </select>
                    <p className="text-xs text-white/50 mt-1">Control who can see which rooms you join</p>
                  </div>
                  
                  <ToggleSwitch 
                    label="Voice History" 
                    value={settings.voiceHistory} 
                    onChange={(value) => handleSettingChange("privacy", "voiceHistory", value)}
                    description="Allow temporary voice recording for quality improvement (never stored permanently)"
                  />
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white mb-1">Data Collection</label>
                    <select 
                      value={settings.dataCollection}
                      onChange={(e) => handleSettingChange("privacy", "dataCollection", e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#00FFFF]"
                    >
                      <option value="full">Full (Help improve NexVox)</option>
                      <option value="minimal">Minimal (Basic usage data only)</option>
                      <option value="none">None (Essential features only)</option>
                    </select>
                    <p className="text-xs text-white/50 mt-1">Control what data we can collect to improve the service</p>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h3 className="text-lg font-orbitron text-[#9D00FF] mb-4">Blocked Users</h3>
                    
                    <div className="bg-black/20 rounded-lg border border-white/10 p-4 mb-4">
                      <p className="text-sm text-white/70 text-center">You haven't blocked any users yet</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "devices" && (
                <div>
                  <h2 className="text-xl font-orbitron text-[#00FFFF] mb-6">Connected Devices</h2>
                  
                  <div className="bg-black/20 rounded-lg border border-white/10 p-6 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#00FFFF]/20 rounded-md text-[#00FFFF]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-white">Current Device</h3>
                          <span className="px-2 py-0.5 bg-[#00FFFF]/20 text-[#00FFFF] text-xs rounded-full">Active</span>
                        </div>
                        <p className="text-sm text-white/70">Windows 10 • Chrome • Last active now</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="bg-black/20 rounded-lg border border-white/10 p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#9D00FF]/20 rounded-md text-[#9D00FF]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-white">iPhone 13</h3>
                            <m.button
                              className="text-white/60 hover:text-red-400"
                              whileHover={{ scale: 1.1 }}
                              aria-label="Revoke access"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </m.button>
                          </div>
                          <p className="text-sm text-white/70">iOS 15 • Safari • Last active 2 days ago</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-black/20 rounded-lg border border-white/10 p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#FF00E6]/20 rounded-md text-[#FF00E6]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-white">MacBook Pro</h3>
                            <m.button
                              className="text-white/60 hover:text-red-400"
                              whileHover={{ scale: 1.1 }}
                              aria-label="Revoke access"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </m.button>
                          </div>
                          <p className="text-sm text-white/70">macOS • Firefox • Last active 1 week ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h3 className="text-lg font-orbitron text-[#FF00E6] mb-4">Device Security</h3>
                    
                    <div className="bg-black/20 border border-[#FF00E6]/20 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#FF00E6]/20 rounded-md text-[#FF00E6] shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white mb-1">Suspicious Login Alerts</h4>
                          <p className="text-xs text-white/70">We'll notify you if we detect any unusual login activity on your account.</p>
                        </div>
                      </div>
                    </div>
                    
                    <m.button
                      className="w-full py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-md text-sm font-medium"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(239, 68, 68, 0.3)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Log Out of All Devices
                    </m.button>
                  </div>
                </div>
              )}
              
              {activeTab === "accessibility" && (
                <div>
                  <h2 className="text-xl font-orbitron text-[#00FFFF] mb-6">Accessibility Settings</h2>
                  
                  <ToggleSwitch 
                    label="Screen Reader Support" 
                    value={settings.screenReader} 
                    onChange={(value) => handleSettingChange("accessibility", "screenReader", value)}
                    description="Optimize interface for screen readers"
                  />
                  
                  <ToggleSwitch 
                    label="Keyboard Shortcuts" 
                    value={settings.keyboardShortcuts} 
                    onChange={(value) => handleSettingChange("accessibility", "keyboardShortcuts", value)}
                    description="Enable keyboard navigation and shortcuts"
                  />
                  
                  <ToggleSwitch 
                    label="Color Blind Mode" 
                    value={settings.colorBlindMode} 
                    onChange={(value) => handleSettingChange("accessibility", "colorBlindMode", value)}
                    description="Adjust colors for better visibility"
                  />
                  
                  <ToggleSwitch 
                    label="Captions" 
                    value={settings.captionsEnabled} 
                    onChange={(value) => handleSettingChange("accessibility", "captionsEnabled", value)}
                    description="Show captions for voice conversations when available"
                  />
                  
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h3 className="text-lg font-orbitron text-[#9D00FF] mb-4">Keyboard Shortcuts</h3>
                    
                    <div className="bg-black/20 rounded-lg border border-white/10 p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white">Mute/Unmute</span>
                        <div className="flex gap-1">
                          <span className="px-2 py-1 bg-black/40 border border-white/20 rounded text-xs text-white">Ctrl</span>
                          <span className="px-2 py-1 bg-black/40 border border-white/20 rounded text-xs text-white">M</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white">Toggle Settings</span>
                        <div className="flex gap-1">
                          <span className="px-2 py-1 bg-black/40 border border-white/20 rounded text-xs text-white">Ctrl</span>
                          <span className="px-2 py-1 bg-black/40 border border-white/20 rounded text-xs text-white">S</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white">Quick Disconnect</span>
                        <div className="flex gap-1">
                          <span className="px-2 py-1 bg-black/40 border border-white/20 rounded text-xs text-white">Ctrl</span>
                          <span className="px-2 py-1 bg-black/40 border border-white/20 rounded text-xs text-white">D</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white">Navigate Rooms</span>
                        <div className="flex gap-1">
                          <span className="px-2 py-1 bg-black/40 border border-white/20 rounded text-xs text-white">Alt</span>
                          <span className="px-2 py-1 bg-black/40 border border-white/20 rounded text-xs text-white">↑/↓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "language" && (
                <div>
                  <h2 className="text-xl font-orbitron text-[#00FFFF] mb-6">Language Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">Interface Language</label>
                      <select 
                        value={settings.language}
                        onChange={(e) => handleSettingChange("language", "language", e.target.value)}
                        className="w-full bg-black/40 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#00FFFF]"
                      >
                        {languageOptions.map(lang => (
                          <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                      </select>
                      <p className="text-xs text-white/50 mt-1">Change the language of the user interface</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">Voice Recognition Language</label>
                      <select 
                        value={settings.voiceLanguage}
                        onChange={(e) => handleSettingChange("language", "voiceLanguage", e.target.value)}
                        className="w-full bg-black/40 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#00FFFF]"
                      >
                        {languageOptions.map(lang => (
                          <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                      </select>
                      <p className="text-xs text-white/50 mt-1">Language used for voice commands and recognition</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-md font-medium text-white mb-4">Regional Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-white mb-1">Time Format</label>
                        <select 
                          className="w-full bg-black/40 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#00FFFF]"
                          defaultValue="24h"
                        >
                          <option value="12h">12-hour (AM/PM)</option>
                          <option value="24h">24-hour</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-1">Date Format</label>
                        <select 
                          className="w-full bg-black/40 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#00FFFF]"
                          defaultValue="ymd"
                        >
                          <option value="mdy">MM/DD/YYYY</option>
                          <option value="dmy">DD/MM/YYYY</option>
                          <option value="ymd">YYYY/MM/DD</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h3 className="text-lg font-orbitron text-[#9D00FF] mb-4">Language Resources</h3>
                    
                    <div className="bg-black/20 border border-[#9D00FF]/20 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#9D00FF]/20 rounded-md text-[#9D00FF] shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white mb-1">Translation Community</h4>
                          <p className="text-xs text-white/70">Join our translation efforts to help make NexVox accessible in more languages.</p>
                          <m.button
                            className="mt-2 px-3 py-1 bg-[#9D00FF]/20 border border-[#9D00FF]/30 rounded-md text-[#9D00FF] text-xs font-medium"
                            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(157, 0, 255, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Learn More
                          </m.button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-black/20 border border-[#00FFFF]/20 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#00FFFF]/20 rounded-md text-[#00FFFF] shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white mb-1">Translation Quality</h4>
                          <p className="text-xs text-white/70">Found a translation error? Help us improve by submitting feedback.</p>
                          <m.button
                            className="mt-2 px-3 py-1 bg-[#00FFFF]/20 border border-[#00FFFF]/30 rounded-md text-[#00FFFF] text-xs font-medium"
                            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Report Issue
                          </m.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </GlassmorphicCard>
            
            <div className="mt-6 flex justify-end">
              <m.button
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#00FFFF]/20 to-[#FF00E6]/20 rounded-md border border-[#00FFFF]/30 text-[#00FFFF] font-medium"
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <IoSaveOutline className="h-5 w-5" />
                <span>Save All Settings</span>
              </m.button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SettingsPage;