"use client";

import React from "react";
import ShimmeringText from "@/components/ShimmeringText";
import AmbientRoom from "@/components/AmbientRoom";
import { useScrollAnimation, getAnimationClasses } from '@/utils/useScrollAnimation';

const HowItWorksSection = () => {
  const [sectionRef, isVisible] = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
    once: true,
    rootMargin: "0px 0px -10% 0px"
  });

  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description: "Sign up and customize your profile with avatars, voice preferences, and personal details.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      number: "02",
      title: "Browse Available Rooms",
      description: "Explore themed rooms based on interests, language, or current events.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      number: "03",
      title: "Join Conversations",
      description: "Enter rooms and participate in real-time voice discussions with people worldwide.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      number: "04",
      title: "Create Your Own Room",
      description: "Host discussions on topics you're passionate about and build your community.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="how-it-works" 
      className="py-24 px-4 sm:px-8 relative"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-black"></div>
      <div className="absolute inset-0 bg-[#9D00FF]/5"></div>
      
      {/* Grid lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-[#9D00FF]/20 to-transparent"></div>
        <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-[#9D00FF]/20 to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className={getAnimationClasses(isVisible, 'up')}>
          <ShimmeringText
            text="How NexVox Works"
            className="text-3xl sm:text-4xl font-orbitron text-center mb-16"
            variant="gradient"
            as="h2"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={step.number} className={getAnimationClasses(isVisible, 'left', 150, index)}>
                  <div
                    className="flex gap-4 items-start hover:translate-x-3 transition-all duration-300"
                  >
                    <div className="bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-black rounded-full w-10 h-10 grid place-items-center flex-shrink-0 font-bold shadow-[0_0_15px_rgba(0,255,255,0.7)]">
                      {step.number.substring(1)}
                    </div>
                    <div>
                      <h3 className="text-xl font-orbitron mb-2 text-[#00FFFF]">
                        {step.title}
                      </h3>
                      <p className="opacity-80">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 h-full ${getAnimationClasses(isVisible, 'right', 200)}`}>
              <AmbientRoom
                roomName="Synthwave Dreams"
                participantCount={128}
                roomType="music"
                className="h-48"
              />
              <AmbientRoom
                roomName="Global Chat"
                participantCount={245}
                roomType="conversation"
                className="h-48"
              />
              <AmbientRoom
                roomName="Gaming Lobby"
                participantCount={87}
                roomType="gaming"
                className="h-48"
              />
              <AmbientRoom
                roomName="Chill Vibes"
                participantCount={164}
                roomType="chill"
                className="h-48"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
