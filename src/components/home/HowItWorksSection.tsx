"use client";

import React from "react";
import ShimmeringText from "@/components/ShimmeringText";
import AmbientRoom from "@/components/AmbientRoom";

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#9D00FF]/10 to-black z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div data-aos="fade-up" data-aos-duration="800">
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
              <div data-aos="fade-right" data-aos-duration="800" data-aos-delay="100">
                <div
                  className="flex gap-4 items-start hover:translate-x-5 transition-transform duration-300"
                >
                  <div className="bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-black rounded-full w-10 h-10 grid place-items-center flex-shrink-0 font-bold shadow-[0_0_15px_rgba(0,255,255,0.7)]">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-orbitron mb-2 text-[#00FFFF]">
                      Create Your Profile
                    </h3>
                    <p className="opacity-80">
                      Choose your username and customize your animated avatar to
                      represent you in voice rooms.
                    </p>
                  </div>
                </div>
              </div>

              <div data-aos="fade-right" data-aos-duration="800" data-aos-delay="200">
                <div
                  className="flex gap-4 items-start hover:translate-x-5 transition-transform duration-300"
                >
                  <div className="bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-black rounded-full w-10 h-10 grid place-items-center flex-shrink-0 font-bold shadow-[0_0_15px_rgba(0,255,255,0.7)]">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-orbitron mb-2 text-[#00FFFF]">
                      Browse Active Rooms
                    </h3>
                    <p className="opacity-80">
                      Explore a variety of voice rooms organized by topic,
                      language, or vibe.
                    </p>
                  </div>
                </div>
              </div>

              <div data-aos="fade-right" data-aos-duration="800" data-aos-delay="300">
                <div
                  className="flex gap-4 items-start hover:translate-x-5 transition-transform duration-300"
                >
                  <div className="bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] text-black rounded-full w-10 h-10 grid place-items-center flex-shrink-0 font-bold shadow-[0_0_15px_rgba(0,255,255,0.7)]">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-orbitron mb-2 text-[#00FFFF]">
                      Join the Conversation
                    </h3>
                    <p className="opacity-80">
                      Drop into any room and start connecting with people from
                      around the world in real-time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
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
