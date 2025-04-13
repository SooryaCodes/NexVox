// Sound effects utility for NexVox
// Handles playing interaction sounds with optimizations for performance

class SoundEffects {
  private static instance: SoundEffects;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.5;
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private lastPlayed: Map<string, number> = new Map();
  private firstInteraction: boolean = false;

  private constructor() {
    // Pre-load common sounds
    this.preloadSound('click', '/audios/digital-click.mp3');
    this.preloadSound('hover', '/audios/digital-blip.mp3');
    this.preloadSound('error', '/audios/error.mp3');
    this.preloadSound('success', '/audios/process-request-accept.mp3');
    this.preloadSound('scroll', '/audios/gear-scroll.mp3');
    this.preloadSound('transition', '/audios/whoosh2.mp3');
    this.preloadSound('loading', '/audios/digital-load2.mp3');
    this.preloadSound('complete', '/audios/final-accept.mp3');
    this.preloadSound('whoosh', '/audios/flabby-whoosh.mp3');
    this.preloadSound('splash', '/audios/hit-splash.mp3');
    this.preloadSound('bap', '/audios/bap.mp3');
    this.preloadSound('beep', '/audios/beep-beep.mp3');
    this.preloadSound('big-transition', '/audios/resonance.mp3');
    this.preloadSound('oscillation', '/audios/oscillation.mp3');
    this.preloadSound('ignite', '/audios/ignite.mp3');

    // Set up first interaction listener to handle autoplay restrictions
    if (typeof window !== 'undefined') {
      const handleFirstInteraction = () => {
        this.firstInteraction = true;
        // Try to play a silent sound to unlock audio
        const silent = new Audio("data:audio/mp3;base64,SUQzBAAAAAABEUgABwAAABNJTkYAAAA8AABUXVNTRQAAAAEAAABTUFRYAAAABAAAAFNPVVIAAAABAAAAAA==");
        silent.volume = 0.01;
        silent.play().catch(() => {});
        
        // Remove listeners after first interaction
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('touchstart', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
      };
      
      window.addEventListener('click', handleFirstInteraction);
      window.addEventListener('touchstart', handleFirstInteraction);
      window.addEventListener('keydown', handleFirstInteraction);
    }
  }

  public static getInstance(): SoundEffects {
    if (!SoundEffects.instance) {
      SoundEffects.instance = new SoundEffects();
    }
    return SoundEffects.instance;
  }

  // Enable/disable all sounds
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  // Set global volume for all sounds
  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    // Update volume for all loaded sounds
    this.sounds.forEach(sound => {
      sound.volume = this.volume;
    });
  }

  // Preload a sound for later use
  public preloadSound(name: string, path: string): void {
    if (!this.sounds.has(name)) {
      const audio = new Audio(path);
      audio.volume = this.volume;
      audio.load();
      this.sounds.set(name, audio);
    }
  }

  // Play a sound by name with debounce protection
  public play(name: string, debounceMs: number = 50): void {
    if (!this.enabled) return;
    
    const now = Date.now();
    const lastPlayed = this.lastPlayed.get(name) || 0;
    
    // Debounce frequent sounds
    if (now - lastPlayed < debounceMs) return;
    
    // Handle playing the sound
    if (this.sounds.has(name)) {
      const sound = this.sounds.get(name);
      
      // Clone the audio to prevent overlapping issues
      if (sound) {
        const clone = new Audio(sound.src);
        clone.volume = this.volume;
        
        // Clean up after playing
        clone.addEventListener('ended', () => {
          // Allow garbage collection
          clone.remove();
        });
        
        clone.play().catch(e => {
          // Silently fail - this commonly happens due to browser autoplay restrictions
          console.debug('Sound playback error (normal if before user interaction):', e);
        });
        
        this.lastPlayed.set(name, now);
      }
    } else {
      console.warn(`Sound "${name}" not loaded`);
    }
  }

  // Play a sound for clicks
  public playClick(): void {
    this.play('click', 100);
  }

  // Play a sound for hover - use lower debounce for better responsiveness
  public playHover(): void {
    // Hover sounds disabled as requested
    return;
  }

  // Play a scroll sound (heavily debounced)
  public playScroll(): void {
    this.play('scroll', 500);
  }

  // Play a transition sound
  public playTransition(): void {
    this.play('transition', 300);
  }

  // Play a whoosh sound
  public playWhoosh(): void {
    this.play('whoosh', 300);
  }

  // Play a success sound
  public playSuccess(): void {
    this.play('success');
  }

  // Play an error sound
  public playError(): void {
    this.play('error');
  }

  // Play loading sound
  public playLoading(): void {
    this.play('loading', 800);
  }

  // Play completion sound
  public playComplete(): void {
    this.play('complete');
  }

  // Load a custom sound on demand
  public loadAndPlay(name: string, path: string): void {
    this.preloadSound(name, path);
    this.play(name);
  }
}

export default SoundEffects.getInstance(); 