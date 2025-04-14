// Utility functions for user profiles

/**
 * Get consistent avatar styles based on avatar type
 */
export const getAvatarStyle = (avatarType: string) => {
  switch(avatarType) {
    case 'cyan': 
      return {
        background: '#00FFFF20',
        color: '#00FFFF',
        borderColor: '#00FFFF',
        gradientFrom: '#00FFFF10',
        gradientTo: '#00FFFF30'
      };
    case 'purple':
      return {
        background: '#9D00FF20',
        color: '#9D00FF',
        borderColor: '#9D00FF',
        gradientFrom: '#9D00FF10',
        gradientTo: '#9D00FF30'
      };
    case 'pink':
      return {
        background: '#FF00E620',
        color: '#FF00E6',
        borderColor: '#FF00E6',
        gradientFrom: '#FF00E610',
        gradientTo: '#FF00E630'
      };
    case 'gradient':
      return {
        background: 'linear-gradient(135deg, #00FFFF20, #9D00FF20, #FF00E620)',
        color: '#FFFFFF',
        borderColor: '#00FFFF',
        gradientFrom: '#00FFFF20',
        gradientTo: '#FF00E620'
      };
    case 'blue':
      return {
        background: '#0088FF20',
        color: '#0088FF',
        borderColor: '#0088FF',
        gradientFrom: '#0088FF10',
        gradientTo: '#0088FF30'
      };
    case 'green':
      return {
        background: '#00FF8820',
        color: '#00FF88',
        borderColor: '#00FF88',
        gradientFrom: '#00FF8810',
        gradientTo: '#00FF8830'
      };
    default:
      return {
        background: '#00FFFF20',
        color: '#00FFFF',
        borderColor: '#00FFFF',
        gradientFrom: '#00FFFF10',
        gradientTo: '#00FFFF30'
      };
  }
};

/**
 * Get status color based on user status
 */
export const getStatusColor = (status: string) => {
  switch(status) {
    case 'online':
      return '#4ade80'; // Green
    case 'away':
      return '#facc15'; // Yellow
    case 'busy':
      return '#f87171'; // Red
    case 'offline':
    default:
      return '#9ca3af'; // Gray
  }
};

/**
 * Get avatar animation GSAP configuration
 */
export const getAvatarAnimation = (animationType: string) => {
  switch(animationType) {
    case 'pulse':
      return {
        type: 'pulse',
        config: {
          scale: 1.05,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        }
      };
    case 'wave':
      return {
        type: 'wave',
        config: {
          y: "-=5",
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        }
      };
    case 'bounce':
      return {
        type: 'bounce',
        config: {
          y: "-=8",
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        }
      };
    case 'glitch':
      return {
        type: 'glitch',
        isTimeline: true
      };
    case 'none':
    default:
      return {
        type: 'none',
        config: {
          scale: 1,
          x: 0,
          y: 0
        }
      };
  }
}; 