// Sound effects configuration
// These will be used when actual sound files are added to assets/sounds/

// Sound paths - these are placeholders for when actual sound files are added
export const SOUND_PATHS = {
  // Success sounds
  correct: 'assets/sounds/success/correct.mp3',
  celebration: 'assets/sounds/success/celebration.mp3',
  levelUp: 'assets/sounds/success/level-up.mp3',

  // Error sounds
  incorrect: 'assets/sounds/error/wrong.mp3',
  error: 'assets/sounds/error/error.mp3',

  // Interaction sounds
  tap: 'assets/sounds/interaction/tap.mp3',
  swipe: 'assets/sounds/interaction/swipe.mp3',
  buttonClick: 'assets/sounds/interaction/button.mp3',

  // Learning sounds
  letterSound: 'assets/sounds/learning/letter.mp3',
  numberSound: 'assets/sounds/learning/number.mp3',
  
  // Background music
  backgroundMusic: 'assets/sounds/background/music.mp3',
} as const;

export type SoundKey = keyof typeof SOUND_PATHS;

// Sound configuration
export const SOUND_CONFIG = {
  volume: 0.7,
  enableSoundEffects: true,
  enableBackgroundMusic: false,
};

// Export for use in app
export const SOUNDS = SOUND_PATHS;
export default SOUND_PATHS;
