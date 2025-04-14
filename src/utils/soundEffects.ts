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
  private isClient: boolean = typeof window !== 'undefined';
  private isNavigating: boolean = false;
  private playQueue: Array<{name: string, debounceMs: number}> = [];
  private processingQueue: boolean = false;

  private constructor() {
    // Only initialize audio on client-side
    if (this.isClient) {
      // Pre-load common sounds - use only files that actually exist
      this.preloadSound('click', '/audios/digital-click.mp3');
      this.preloadSound('click-soft', '/audios/digital-click.mp3'); // Fallback for missing soft-click
      this.preloadSound('click-heavy', '/audios/digital-click2.mp3'); // Use existing similar sound
      this.preloadSound('click-muted', '/audios/digital-click.mp3'); // Fallback
      this.preloadSound('hover', '/audios/digital-blip.mp3');
      this.preloadSound('error', '/audios/error.mp3');
      this.preloadSound('success', '/audios/process-request-accept.mp3');
      this.preloadSound('scroll', '/audios/gear-scroll.mp3');
      this.preloadSound('transition', '/audios/whoosh2.mp3');
      this.preloadSound('complete', '/audios/final-accept.mp3');
      this.preloadSound('whoosh', '/audios/flabby-whoosh.mp3');
      this.preloadSound('splash', '/audios/hit-splash.mp3');
      this.preloadSound('bap', '/audios/bap.mp3');
      this.preloadSound('beep', '/audios/beep-beep.mp3');
      this.preloadSound('big-transition', '/audios/resonance.mp3');
      this.preloadSound('oscillation', '/audios/oscillation.mp3');
      this.preloadSound('ignite', '/audios/ignite.mp3');

      // Pre-load UI sounds - use fallbacks for missing files
      this.preloadSound('toggle', '/audios/digital-click.mp3'); // Fallback
      this.preloadSound('select', '/audios/digital-blip.mp3'); // Fallback
      this.preloadSound('confirm', '/audios/process-request-accept.mp3'); // Fallback
      this.preloadSound('cancel', '/audios/error.mp3'); // Fallback
      this.preloadSound('tab', '/audios/digital-blip.mp3'); // Fallback
      this.preloadSound('save', '/audios/final-accept.mp3'); // Fallback
      this.preloadSound('edit', '/audios/digital-click2.mp3'); // Fallback
      this.preloadSound('delete', '/audios/error.mp3'); // Fallback
      this.preloadSound('notification', '/audios/digital-blip.mp3'); // Fallback
      this.preloadSound('avatar', '/audios/digital-click.mp3'); // Fallback
      this.preloadSound('status', '/audios/digital-click.mp3'); // Fallback
      this.preloadSound('theme', '/audios/digital-blip.mp3'); // Fallback
      this.preloadSound('language', '/audios/digital-click.mp3'); // Fallback
      this.preloadSound('privacy', '/audios/digital-click.mp3'); // Fallback
      this.preloadSound('device', '/audios/digital-click.mp3'); // Fallback
      this.preloadSound('accessibility', '/audios/digital-click.mp3'); // Fallback

      // Set up first interaction listener to handle autoplay restrictions
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
    if (this.isClient) {
      this.sounds.forEach(sound => {
        sound.volume = this.volume;
      });
    }
  }

  // Preload a sound for later use
  public preloadSound(name: string, path: string): void {
    if (!this.isClient || this.sounds.has(name)) return;
    
    const audio = new Audio(path);
    audio.volume = this.volume;
    
    // Add error handling to prevent uncaught 404 errors
    audio.addEventListener('error', (e) => {
      console.warn(`Failed to load audio: ${path}`);
      // Remove from sounds map to avoid future errors
      this.sounds.delete(name);
    });
    
    audio.load();
    this.sounds.set(name, audio);
  }

  // Set navigation state
  public setNavigating(isNavigating: boolean): void {
    this.isNavigating = isNavigating;
    
    // If we're no longer navigating, process any queued sounds
    if (!isNavigating && this.playQueue.length > 0) {
      this.processPlayQueue();
    }
  }

  private processPlayQueue(): void {
    if (this.processingQueue) return;
    
    this.processingQueue = true;
    
    // Process at most 2 sounds from the queue
    const toProcess = this.playQueue.splice(0, 2);
    
    toProcess.forEach(({name, debounceMs}) => {
      this._playSound(name, debounceMs);
    });
    
    this.processingQueue = false;
    
    // If there are more items and we're not navigating, schedule next batch
    if (this.playQueue.length > 0 && !this.isNavigating) {
      setTimeout(() => this.processPlayQueue(), 100);
    }
  }

  // Play a sound with debounce protection
  public play(name: string, debounceMs: number = 50): void {
    // During navigation, only allow essential sounds or queue less important ones
    if (this.isNavigating && name !== 'transition') {
      // Queue the sound to play after navigation completes
      this.playQueue.push({name, debounceMs});
      return;
    }
    
    this._playSound(name, debounceMs);
  }
  
  // Internal method to actually play the sound
  private _playSound(name: string, debounceMs: number = 50): void {
    if (!this.isClient || !this.enabled || !this.firstInteraction) return;

    const now = Date.now();
    const lastPlayed = this.lastPlayed.get(name) || 0;
    
    // More aggressive debouncing during navigation
    const effectiveDebounce = this.isNavigating ? Math.max(debounceMs, 300) : debounceMs;
    
    if (now - lastPlayed < effectiveDebounce) return;
    
    const sound = this.sounds.get(name);
    if (!sound) {
      // Handle missing sound - try to use a default sound instead
      const defaultSound = this.sounds.get('click');
      if (!defaultSound) return; // No fallback available
      
      // Use default sound instead
      defaultSound.currentTime = 0;
      defaultSound.play().catch(() => {});
      this.lastPlayed.set(name, now);
      return;
    }
    
    // Reset the sound to the beginning
    sound.currentTime = 0;
    
    // Lower volume for navigation sounds
    const originalVolume = sound.volume;
    if (this.isNavigating) {
      sound.volume = Math.min(originalVolume, 0.3);
    }
    
    sound.play().catch(() => {});
    
    // Reset volume after playback
    if (this.isNavigating) {
      setTimeout(() => {
        sound.volume = originalVolume;
      }, 500);
    }
    
    this.lastPlayed.set(name, now);
  }

  // Public methods for playing specific sounds
  public playClick(type: 'default' | 'soft' | 'heavy' | 'muted' = 'default'): void {
    switch (type) {
      case 'soft':
        this.play('click-soft');
        break;
      case 'heavy':
        this.play('click-heavy');
        break;
      case 'muted':
        this.play('click-muted');
        break;
      default:
        this.play('click');
    }
  }

  public playHover(): void {
    this.play('hover');
  }

  public playError(): void {
    this.play('error');
  }

  public playSuccess(): void {
    this.play('success');
  }

  public playScroll(): void {
    this.play('scroll', 800);
  }

  public playTransition(): void {
    this.play('transition');
  }

  public playComplete(): void {
    this.play('complete');
  }

  public playWhoosh(): void {
    this.play('whoosh');
  }

  // UI sound methods
  public playToggle(): void {
    this.play('toggle');
  }

  public playSelect(): void {
    this.play('select');
  }

  public playConfirm(): void {
    this.play('confirm');
  }

  public playCancel(): void {
    this.play('cancel');
  }

  public playTab(): void {
    this.play('tab');
  }

  public playSave(): void {
    this.play('save');
  }

  public playEdit(): void {
    this.play('edit');
  }

  public playDelete(): void {
    this.play('delete');
  }

  public playNotification(): void {
    this.play('notification');
  }

  public playAvatar(): void {
    this.play('avatar');
  }

  public playStatus(): void {
    this.play('status');
  }

  public playTheme(): void {
    this.play('theme');
  }

  public playLanguage(): void {
    this.play('language');
  }

  public playPrivacy(): void {
    this.play('privacy');
  }

  public playDevice(): void {
    this.play('device');
  }

  public playAccessibility(): void {
    this.play('accessibility');
  }

  // Load and play a custom sound
  public loadAndPlay(name: string, path: string): void {
    if (!this.sounds.has(name)) {
      this.preloadSound(name, path);
    }
    this.play(name);
  }
}

// Export singleton instance
const soundEffects = SoundEffects.getInstance();
export default soundEffects; 