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

  private constructor() {
    // Only initialize audio on client-side
    if (this.isClient) {
      // Pre-load common sounds
      this.preloadSound('click', '/audios/digital-click.mp3');
      this.preloadSound('click-soft', '/audios/soft-click.mp3');
      this.preloadSound('click-heavy', '/audios/heavy-click.mp3');
      this.preloadSound('click-muted', '/audios/muted-click.mp3');
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

      // Pre-load UI sounds
      this.preloadSound('toggle', '/audios/toggle.mp3');
      this.preloadSound('select', '/audios/select.mp3');
      this.preloadSound('confirm', '/audios/confirm.mp3');
      this.preloadSound('cancel', '/audios/cancel.mp3');
      this.preloadSound('tab', '/audios/tab.mp3');
      this.preloadSound('save', '/audios/save.mp3');
      this.preloadSound('edit', '/audios/edit.mp3');
      this.preloadSound('delete', '/audios/delete.mp3');
      this.preloadSound('notification', '/audios/notification.mp3');
      this.preloadSound('avatar', '/audios/avatar.mp3');
      this.preloadSound('status', '/audios/status.mp3');
      this.preloadSound('theme', '/audios/theme.mp3');
      this.preloadSound('language', '/audios/language.mp3');
      this.preloadSound('privacy', '/audios/privacy.mp3');
      this.preloadSound('device', '/audios/device.mp3');
      this.preloadSound('accessibility', '/audios/accessibility.mp3');

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
    audio.load();
    this.sounds.set(name, audio);
  }

  // Play a sound with debounce protection
  public play(name: string, debounceMs: number = 50): void {
    if (!this.isClient || !this.enabled || !this.firstInteraction) return;

    const now = Date.now();
    const lastPlayed = this.lastPlayed.get(name) || 0;
    
    if (now - lastPlayed < debounceMs) return;
    
    const sound = this.sounds.get(name);
    if (!sound) return;
    
    // Reset the sound to the beginning
    sound.currentTime = 0;
    sound.play().catch(() => {});
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