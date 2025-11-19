import * as Speech from 'expo-speech';
// Audio session configuration is optional for TTS; to avoid deprecated expo-av,
// we keep this module self-contained without external audio deps.

// Text-to-Speech configuration
interface TTSConfig {
  language: string;
  pitch: number;
  rate: number;
  volume: number;
}

// Default TTS configurations for different languages
const defaultConfigs: Record<string, TTSConfig> = {
  en: {
    language: 'en-US',
    pitch: 1.2, // Higher pitch for child-friendly voice
    rate: 0.8,  // Slower rate for clarity
    volume: 0.8,
  },
  bn: {
    // Some Android devices might not have bn-BD; we'll try to pick a voice dynamically
    language: 'bn-BD', // Bengali (Bangladesh)
    pitch: 1.1,
    rate: 0.7,  // Slower for non-native speakers
    volume: 0.8,
  },
};

export interface SpeechOptions {
  language?: 'bangla' | 'english';
  pitch?: number;
  rate?: number;
  volume?: number;
  onStart?: () => void;
  onDone?: () => void;
  onError?: (error: any) => void;
}

// Cache available voices to choose best match per language
let voicesCache: Speech.Voice[] | null = null;
let voicesLogged = false;
// Preferred voice overrides (optional by exact identifier/name)
const preferredVoices: Record<string, string | undefined> = {
  bn: undefined,
  en: undefined,
};

// Preferred gender for voice selection. Default to 'female' per user request.
let preferredGender: 'female' | 'male' | 'any' = 'female';

async function loadVoicesOnce(): Promise<Speech.Voice[] | null> {
  try {
    if (!voicesCache) {
      voicesCache = await Speech.getAvailableVoicesAsync();
      if (!voicesLogged) {
        console.log('Available TTS voices:', voicesCache);
        voicesLogged = true;
      }
    }
    return voicesCache;
  } catch (e) {
    console.warn('Unable to fetch TTS voices:', e);
    return null;
  }
}

function pickVoiceForLanguage(allVoices: Speech.Voice[] | null, lang: 'bangla' | 'english'): Speech.Voice | undefined {
  if (!allVoices) return undefined;
  const base = lang === 'bangla' ? 'bn' : 'en';

  // If user has set a preferred voice identifier for this language, use it if available
  const preferred = preferredVoices[base];
  if (preferred) {
    const byId = allVoices.find((v) => v.identifier === preferred || v.name === preferred || v.language === preferred);
    if (byId) return byId;
  }

  // Try common locale codes first
  const targets = lang === 'bangla'
    ? ['bn-BD', 'bn_IN', 'bn-IN', 'bn']
    : ['en-US', 'en_GB', 'en-GB', 'en'];

  for (const t of targets) {
    const v = allVoices.find((voice) => voice.language?.toLowerCase().startsWith(t.toLowerCase()));
    if (v) return v;
  }

  // Fallback: look for voices that mention 'bengali' or 'bangla' in name/identifier
  const alt = allVoices.find((v) => {
    const n = (v.name || '').toLowerCase();
    const id = (v.identifier || '').toLowerCase();
    return n.includes('bengali') || n.includes('bangla') || id.includes('bengali') || id.includes('bangla');
  });
  if (alt) return alt;

  // If preferred gender is set, try to prefer voices indicating that gender in their name/identifier
  if (preferredGender !== 'any') {
    const genderHints = preferredGender === 'female'
      ? ['female', 'woman', 'girl', 'femme', 'f']
      : ['male', 'man', 'boy', 'm'];
    const genderMatch = allVoices.find((v) => {
      const n = (v.name || '').toLowerCase();
      const id = (v.identifier || '').toLowerCase();
      return genderHints.some((hint) => n.includes(hint) || id.includes(hint));
    });
    if (genderMatch) return genderMatch;
  }

  // Last resort: any voice starting with the base language code
  return allVoices.find((v) => v.language?.toLowerCase().startsWith(base));
}

export const configureAudioMode = async (): Promise<void> => {
  // No-op: If you adopt expo-audio in the future, you can configure audio here.
  return;
};

export const speechService = {
  // Speak text using TTS
  speak: async (text: string, options: SpeechOptions = {}): Promise<void> => {
    try {
      const {
        language = 'english',
        pitch,
        rate,
        volume,
        onStart,
        onDone,
        onError
      } = options;

      const config = defaultConfigs[language === 'bangla' ? 'bn' : 'en'];

      // Ensure voices/audio mode are available
      await configureAudioMode();
      const voices = await loadVoicesOnce();
      const pickedVoice = pickVoiceForLanguage(voices, language);
      console.log('Picked TTS voice:', pickedVoice);

      // Build base options; some platforms don't accept `voice` or `language` fields together,
      // so we'll try a few strategies in order until one succeeds.

      type AttemptOpt = Partial<Speech.SpeechOptions> & { attemptName: string; pitch?: number; rate?: number; volume?: number };
      const attemptOptions = async (opts: AttemptOpt[]) => {
        for (const opt of opts) {
          try {
            console.log('TTS attempt:', opt.attemptName, opt);
            await new Promise<void>((resolve, reject) => {
              try {
                Speech.speak(text, {
                  ...opt,
                  pitch: typeof opt.pitch === 'number' ? opt.pitch : pitch ?? config.pitch,
                  rate: typeof opt.rate === 'number' ? opt.rate : rate ?? config.rate,
                  // volume might be unsupported on some platforms, but pass if present
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  volume: typeof opt.volume === 'number' ? opt.volume : volume ?? config.volume,
                  onStart,
                  onDone: () => {
                    onDone?.();
                    resolve();
                  },
                  onError: (err) => {
                    console.warn('TTS onError during attempt', opt.attemptName, err);
                    // let the outer try/catch handle retries
                    reject(err);
                  },
                });
              } catch (e) {
                reject(e);
              }
            });
            // If speak returned without throwing, we consider it success and stop trying further attempts.
            return;
          } catch (err) {
            console.warn('TTS attempt failed', opt.attemptName, err);
            // Try next option
          }
        }
        // All attempts failed
        throw new Error('All TTS attempts failed');
      };

      const attempts: (Partial<Speech.SpeechOptions> & { attemptName: string })[] = [];

      // Preferred: picked voice with its language (if available)
      if (pickedVoice) {
        attempts.push({ attemptName: 'voiceWithLanguage', voice: pickedVoice.identifier, language: pickedVoice.language });
        attempts.push({ attemptName: 'voiceOnly', voice: pickedVoice.identifier });
      }

      // Try explicit language codes commonly used for Bengali
      attempts.push({ attemptName: 'bn-BD', language: 'bn-BD' });
      attempts.push({ attemptName: 'bn-IN', language: 'bn-IN' });
      attempts.push({ attemptName: 'bn', language: 'bn' });

      // Fallback to default configured language code
      attempts.push({ attemptName: 'configLanguage', language: config.language });

      // Final fallback: no language/voice hints (let engine pick)
      attempts.push({ attemptName: 'noHints' });

      try {
        await attemptOptions(attempts);
      } catch (e) {
        console.error('TTS: all strategies failed', e);
        onError?.(e as any);
      }
    } catch (error) {
      console.error('Speech error:', error);
      throw new Error('Failed to speak text');
    }
  },

  // Stop current speech
  stop: async (): Promise<void> => {
    try {
      await Speech.stop();
    } catch (error) {
      console.error('Stop speech error:', error);
    }
  },

  // Check if currently speaking
 isSpeaking: async (): Promise<boolean> => {
  return await Speech.isSpeakingAsync();
},

  // Speak letter with pronunciation
  speakLetter: async (letter: string, language: 'bangla' | 'english' = 'english'): Promise<void> => {
    // Stop any ongoing TTS and speak once to avoid duplicates
    try {
      const speaking = await Speech.isSpeakingAsync();
      if (speaking) {
        await Speech.stop();
      }
    } catch {}
    await speechService.speak(letter, { language });
  },

  // Speak word with pronunciation
  speakWord: async (word: string, language: 'bangla' | 'english' = 'english'): Promise<void> => {
    await speechService.speak(word, { language });
  },

  // Speak number
  speakNumber: async (number: number, language: 'bangla' | 'english' = 'english'): Promise<void> => {
    const numberText = number.toString();
    await speechService.speak(numberText, { language });
  },

  // Speak math problem
  speakMathProblem: async (problem: string, language: 'bangla' | 'english' = 'english'): Promise<void> => {
    // Clean up the problem text for better pronunciation
    const cleanProblem = problem
      .replace(/\+/g, ' plus ')
      .replace(/-/g, ' minus ')
      .replace(/\*/g, ' times ')
      .replace(/\//g, ' divided by ')
      .replace(/=/g, ' equals ');

    await speechService.speak(cleanProblem, { language });
  },

  // Speak encouragement messages
  speakEncouragement: async (message: string, language: 'bangla' | 'english' = 'english'): Promise<void> => {
    await speechService.speak(message, { 
      language,
      pitch: 1.3, // Higher pitch for excitement
      rate: 0.9,
    });
  },

  // Speak story with pauses
  speakStory: async (story: string, language: 'bangla' | 'english' = 'english'): Promise<void> => {
    // Split story into sentences for better pacing
    const sentences = story.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      if (sentence.length > 0) {
        await speechService.speak(sentence, { 
          language,
          rate: 0.7, // Slower for storytelling
        });
        
        // Add pause between sentences (except for the last one)
        if (i < sentences.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  },
};

// Speech-to-Text service (placeholder for future implementation)
export const speechToTextService = {
  // This would integrate with Google Speech-to-Text API
  // For now, we'll create a placeholder structure
  
  startListening: async (language: 'bangla' | 'english' = 'english'): Promise<void> => {
    // TODO: Implement speech-to-text functionality
    console.log('Speech-to-text not yet implemented');
    throw new Error('Speech-to-text not yet implemented');
  },

  stopListening: async (): Promise<string> => {
    // TODO: Return recognized text
    throw new Error('Speech-to-text not yet implemented');
  },

  // Check pronunciation accuracy (basic implementation)
  checkPronunciation: (spoken: string, correct: string): boolean => {
    // Simple string comparison (in real implementation, would use phonetic matching)
    const normalize = (text: string) => text.toLowerCase().trim();
    return normalize(spoken) === normalize(correct);
  },
};

// Audio feedback service
export const audioService = {
  // Play sound effects
  playSound: async (soundType: 'correct' | 'incorrect' | 'tap' | 'celebration'): Promise<void> => {
    try {
      // This would play pre-recorded sound files
      // For now, we'll use TTS to provide audio feedback
      const sounds = {
        correct: 'Great job!',
        incorrect: 'Try again!',
        tap: '',
        celebration: 'Congratulations!',
      };

      const soundText = sounds[soundType];
      if (soundText) {
        await speechService.speak(soundText, { 
          pitch: soundType === 'correct' || soundType === 'celebration' ? 1.4 : 1.0,
          rate: 0.9,
        });
      }
    } catch (error) {
      console.error('Audio feedback error:', error);
    }
  },

  // Play background music
  playBackgroundMusic: async (musicType: 'learning' | 'math' | 'story'): Promise<void> => {
    try {
      // This would play background music files
      console.log(`Playing background music: ${musicType}`);
      // TODO: Implement background music playback
    } catch (error) {
      console.error('Background music error:', error);
    }
  },

  // Stop background music
  stopBackgroundMusic: async (): Promise<void> => {
    try {
      // TODO: Stop background music
      console.log('Stopping background music');
    } catch (error) {
      console.error('Stop background music error:', error);
    }
  },
};

export default speechService;

// Runtime API: allow app to change preferred voice gender
export function setPreferredVoiceGender(gender: 'female' | 'male' | 'any') {
  preferredGender = gender;
  console.log('Preferred TTS gender set to:', gender);
}

// Optionally expose preferredVoices map for direct overrides
export function setPreferredVoiceIdentifier(languageCode: 'bn' | 'en', identifier?: string) {
  preferredVoices[languageCode] = identifier;
  console.log(`Preferred voice for ${languageCode} set to:`, identifier);
}
