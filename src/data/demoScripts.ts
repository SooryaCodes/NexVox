import { User } from "@/types/room";

// Demo users
export const demoUsers: User[] = [
  {
    id: 101,
    name: "neonCoder",
    avatarUrl: "/images/avatars/neon-coder.png", // Add default fallback image paths
    level: 12,
    status: "online",
    badges: ["Early Adopter", "Voice Master"],
    isHost: true,
    avatarType: "cyberpunk",
  },
  {
    id: 102,
    name: "cyberVibe",
    avatarUrl: "/images/avatars/cyber-vibe.png",
    level: 8,
    status: "online",
    badges: ["Tech Enthusiast"],
    avatarType: "neon",
  },
  {
    id: 103,
    name: "pulseMaster",
    avatarUrl: "/images/avatars/pulse-master.png",
    level: 15,
    status: "online",
    badges: ["Community Leader"],
    avatarType: "digital",
  },
  {
    id: 104,
    name: "glowSeeker",
    avatarUrl: "/images/avatars/glow-seeker.png",
    level: 7,
    status: "online",
    badges: ["Social Butterfly"],
    avatarType: "hologram",
  }
];

// Script lines with timing
export interface ScriptLine {
  userId: number;
  text: string;
  delayBefore: number; // Delay in ms before this line starts
  duration: number; // Duration in ms this line takes to speak
  effects?: {
    pitch?: number; // 0-2, 1 is normal
    rate?: number; // 0.1-10, 1 is normal
    reverb?: boolean;
    panning?: number; // -1 to 1 (left to right)
  };
}

// Script 1: "Why NexVox is the Future of Social"
export const script1: ScriptLine[] = [
  {
    userId: 101, // neonCoder
    text: "Yo, this NexVox Lounge is wild! Voice rooms feel so much more… human than typing on X all day.",
    delayBefore: 1000,
    duration: 4000,
    effects: { pitch: 0.9, rate: 1.1 }
  },
  {
    userId: 102, // cyberVibe
    text: "Totally! The spatial audio? I swear I can hear you on my left, neonCoder. It's like we're in a sci-fi club!",
    delayBefore: 500,
    duration: 5000,
    effects: { pitch: 1.2, rate: 1.2, panning: -0.7 }
  },
  {
    userId: 103, // pulseMaster
    text: "Right? And those vibe toasts— 'Vibe: Lit!' pops up, and I'm hyped. Makes Discord feel ancient.",
    delayBefore: 700,
    duration: 4500,
    effects: { pitch: 0.8, rate: 0.9, reverb: true }
  },
  {
    userId: 104, // glowSeeker
    text: "I'm obsessed with the avatars pulsing when we talk. It's like my neon heart's beating! NexVox is next-level social, hands down.",
    delayBefore: 800,
    duration: 6000,
    effects: { pitch: 1.3, rate: 1.1, panning: 0.5 }
  },
  {
    userId: 101, // neonCoder
    text: "Bet it's gonna take over. Who needs text when you've got this voice vibe? Let's raise hands for NexVox!",
    delayBefore: 600,
    duration: 5000,
    effects: { pitch: 0.9, rate: 1.2 }
  }
];

// Script 2: "Customizing Your NexVox Experience"
export const script2: ScriptLine[] = [
  {
    userId: 102, // cyberVibe
    text: "Okay, I just tweaked my voice in the Settings tab—cranked the pitch up. Do I sound like a cyber-chipmunk now?",
    delayBefore: 1000,
    duration: 5000,
    effects: { pitch: 1.5, rate: 1.2 }
  },
  {
    userId: 103, // pulseMaster
    text: "Ha, you do! I added reverb, so I'm basically a neon god echoing in here. The Web Audio API is magic.",
    delayBefore: 700,
    duration: 5500,
    effects: { pitch: 0.8, rate: 0.9, reverb: true }
  },
  {
    userId: 104, // glowSeeker
    text: "I locked the room to keep it chill—only 10 of us. And the 'Lit' vibe theme? My toolbar's glowing pink!",
    delayBefore: 600,
    duration: 5000,
    effects: { pitch: 1.3, rate: 1.0, panning: 0.3 }
  },
  {
    userId: 101, // neonCoder
    text: "Nice! I'm panning my voice hard right. Can you tell I'm sneaking up on your ear, glowSeeker?",
    delayBefore: 800,
    duration: 4500,
    effects: { pitch: 0.9, rate: 1.1, panning: 0.9 }
  },
  {
    userId: 102, // cyberVibe
    text: "This customization is unreal. NexVox lets you own the vibe—settings are straight fire!",
    delayBefore: 500,
    duration: 4000,
    effects: { pitch: 1.4, rate: 1.2 }
  }
];

// Script 3: "Building Community with NexVox"
export const script3: ScriptLine[] = [
  {
    userId: 104, // glowSeeker
    text: "NexVox's friend system is clutch. I sent a request to pulseMaster, and now we're vibing in chats!",
    delayBefore: 1000,
    duration: 4500,
    effects: { pitch: 1.3, rate: 1.0 }
  },
  {
    userId: 103, // pulseMaster
    text: "Yeah, your voice message about the 'Neon Jam Session' event got me hyped. I RSVP'd—count me in!",
    delayBefore: 600,
    duration: 5000,
    effects: { pitch: 0.8, rate: 0.9, reverb: true }
  },
  {
    userId: 101, // neonCoder
    text: "That's what I love—NexVox connects us globally. I'm in Tokyo, you're in New York, glowSeeker, and it feels like we're next door.",
    delayBefore: 700,
    duration: 6500,
    effects: { pitch: 0.9, rate: 1.1 }
  },
  {
    userId: 102, // cyberVibe
    text: "The voice calls are so crisp. I was on with someone from Berlin yesterday—no lag, just pure neon energy.",
    delayBefore: 800,
    duration: 5000,
    effects: { pitch: 1.2, rate: 1.2, panning: -0.5 }
  },
  {
    userId: 104, // glowSeeker
    text: "It's like a global party. NexVox is building a community that's out of this world!",
    delayBefore: 500,
    duration: 4000,
    effects: { pitch: 1.3, rate: 1.0, panning: 0.5 }
  }
]; 