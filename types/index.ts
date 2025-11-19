// Navigation types
export type RootStackParamList = {
  Main: undefined;
  Onboarding: undefined;
};

export type MainTabParamList = {
  Learn: undefined;
  Math: undefined;
  Draw: undefined;
  Story: undefined;
  Speak: undefined;
};

export type LearnStackParamList = {
  AlphabetHome: undefined;
  BanglaAlphabet: undefined;
  EnglishAlphabet: undefined;
  LetterDetail: { letter: string; language: 'bangla' | 'english' };
};

// Data types
export interface Letter {
  id: string;
  character: string;
  name: string;
  pronunciation: string;
  words: Word[];
  image?: string;
}

export interface Word {
  id: string;
  text: string;
  pronunciation: string;
  meaning: string;
  image: string;
  audioUrl?: string;
}

export interface MathProblem {
  id: string;
  type: 'addition' | 'subtraction' | 'multiplication' | 'division';
  question: string;
  operands: number[];
  answer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  visualObjects: VisualObject[];
}

export interface VisualObject {
  type: 'apple' | 'balloon' | 'animal' | 'star' | 'heart';
  count: number;
  color: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  words: string[];
  language: 'bangla' | 'english';
  createdAt: Date;
  isFavorite?: boolean;
}

export interface UserProgress {
  userId: string;
  type: 'letter' | 'word' | 'math' | 'story';
  itemId: string;
  completed: boolean;
  score?: number;
  timestamp: Date;
}

export interface UserSettings {
  userId: string;
  languagePreference: 'bangla' | 'english';
  theme: 'light' | 'dark';
  volume: number;
  soundEffects: boolean;
  hapticFeedback: boolean;
  usageStats: {
    totalTimeSpent: number;
    sessionsCompleted: number;
    lastUsed: Date;
  };
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// Component prop types
export interface LetterCardProps {
  letter: Letter;
  onPress: (letter: Letter) => void;
  isCompleted?: boolean;
}

export interface MathProblemProps {
  problem: MathProblem;
  onAnswer: (answer: number) => void;
  onComplete: (isCorrect: boolean) => void;
}

// Language types
export type Language = 'bangla' | 'english';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}
