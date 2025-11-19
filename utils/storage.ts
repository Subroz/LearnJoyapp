import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: '@onboarding_completed',
  USER_PROFILE: '@user_profile',
  LEARNING_PROGRESS: '@learning_progress',
  SETTINGS: '@settings',
  FAVORITE_STORIES: '@favorite_stories',
  MATH_SCORES: '@math_scores',
} as const;

// User Profile
export interface UserProfile {
  name: string;
  age: number;
  createdAt: string;
}

// Settings
export interface AppSettings {
  language: 'bangla' | 'english';
  volume: number;
  soundEffects: boolean;
  hapticFeedback: boolean;
  theme: 'light' | 'dark';
}

// Learning Progress
export interface LearningProgress {
  letterId: string;
  language: 'bangla' | 'english';
  completed: boolean;
  score?: number;
  timestamp: string;
}

// Math Scores
export interface MathScore {
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division';
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  totalProblems: number;
  timestamp: string;
}

// Storage Service
export const storageService = {
  // Onboarding
  async setOnboardingCompleted(completed: boolean): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, JSON.stringify(completed));
  },

  async isOnboardingCompleted(): Promise<boolean> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return value === 'true';
  },

  // User Profile
  async saveUserProfile(profile: UserProfile): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  async getUserProfile(): Promise<UserProfile | null> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return value ? JSON.parse(value) : null;
  },

  // Settings
  async saveSettings(settings: AppSettings): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  async getSettings(): Promise<AppSettings | null> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return value ? JSON.parse(value) : null;
  },

  async getDefaultSettings(): Promise<AppSettings> {
    return {
      language: 'english',
      volume: 0.8,
      soundEffects: true,
      hapticFeedback: true,
      theme: 'light',
    };
  },

  // Learning Progress
  async saveLearningProgress(progress: LearningProgress): Promise<void> {
    const existing = await this.getLearningProgress();
    const updated = [...existing, progress];
    await AsyncStorage.setItem(STORAGE_KEYS.LEARNING_PROGRESS, JSON.stringify(updated));
  },

  async getLearningProgress(): Promise<LearningProgress[]> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.LEARNING_PROGRESS);
    return value ? JSON.parse(value) : [];
  },

  async getLetterProgress(letterId: string, language: 'bangla' | 'english'): Promise<LearningProgress | null> {
    const progress = await this.getLearningProgress();
    return progress.find(p => p.letterId === letterId && p.language === language) || null;
  },

  // Math Scores
  async saveMathScore(score: MathScore): Promise<void> {
    const existing = await this.getMathScores();
    const updated = [...existing, score];
    await AsyncStorage.setItem(STORAGE_KEYS.MATH_SCORES, JSON.stringify(updated));
  },

  async getMathScores(): Promise<MathScore[]> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.MATH_SCORES);
    return value ? JSON.parse(value) : [];
  },

  async getBestMathScore(operation: string, difficulty: string): Promise<number> {
    const scores = await this.getMathScores();
    const filtered = scores.filter(s => s.operation === operation && s.difficulty === difficulty);
    if (filtered.length === 0) return 0;
    
    const accuracies = filtered.map(s => (s.score / s.totalProblems) * 100);
    return Math.max(...accuracies);
  },

  // Favorite Stories
  async saveFavoriteStory(story: { title: string; content: string; words: string[] }): Promise<void> {
    const existing = await this.getFavoriteStories();
    const updated = [...existing, { ...story, timestamp: new Date().toISOString() }];
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITE_STORIES, JSON.stringify(updated));
  },

  async getFavoriteStories(): Promise<any[]> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITE_STORIES);
    return value ? JSON.parse(value) : [];
  },

  async deleteFavoriteStory(index: number): Promise<void> {
    const existing = await this.getFavoriteStories();
    existing.splice(index, 1);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITE_STORIES, JSON.stringify(existing));
  },

  // Clear all data (for testing)
  async clearAll(): Promise<void> {
    await AsyncStorage.clear();
  },
};

export default storageService;

