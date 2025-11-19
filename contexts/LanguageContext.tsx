import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, LanguageContextType } from '@/types';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = '@language_preference';

// Translation strings
const translations = {
  bangla: {
    // Navigation
    'nav.learn': 'শেখা',
    'nav.math': 'গণিত',
    'nav.draw': 'আঁকা',
    'nav.story': 'গল্প',
    'nav.speak': 'কথা বলা',
    
    // Common
    'common.back': 'ফিরে যান',
    'common.next': 'পরবর্তী',
    'common.previous': 'পূর্ববর্তী',
    'common.done': 'সম্পন্ন',
    'common.continue': 'চালিয়ে যান',
    'common.try_again': 'আবার চেষ্টা করুন',
    'common.correct': 'সঠিক',
    'common.incorrect': 'ভুল',
    'common.great_job': 'ভালো কাজ',
    'common.keep_it_up': 'চালিয়ে যান',
    
    // Alphabet
    'alphabet.title': 'বর্ণমালা',
    'alphabet.bangla': 'বাংলা',
    'alphabet.english': 'ইংরেজি',
    'alphabet.letter': 'বর্ণ',
    'alphabet.word': 'শব্দ',
    'alphabet.pronunciation': 'উচ্চারণ',
    
    // Math
    'math.title': 'গণিত',
    'math.addition': 'যোগ',
    'math.subtraction': 'বিয়োগ',
    'math.multiplication': 'গুণ',
    'math.division': 'ভাগ',
    'math.easy': 'সহজ',
    'math.medium': 'মধ্যম',
    'math.hard': 'কঠিন',
    'math.count': 'গণনা',
    
    // Story
    'story.title': 'গল্প',
    'story.create': 'গল্প তৈরি করুন',
    'story.words': 'শব্দ নির্বাচন করুন',
    'story.generate': 'গল্প তৈরি করুন',
    'story.read': 'পড়ুন',
    'story.favorite': 'প্রিয়',
    
    // Drawing
    'draw.title': 'আঁকা',
    'draw.recognize': 'চিনুন',
    'draw.clear': 'মুছুন',
    'draw.undo': 'পূর্বাবস্থা',
    
    // Voice
    'voice.title': 'কথা বলা',
    'voice.listen': 'শুনুন',
    'voice.speak': 'কথা বলুন',
    'voice.recognize': 'চিনুন',
    
    // Settings
    'settings.title': 'সেটিংস',
    'settings.language': 'ভাষা',
    'settings.volume': 'ভলিউম',
    'settings.sound_effects': 'শব্দের প্রভাব',
    'settings.haptic_feedback': 'স্পর্শ প্রতিক্রিয়া',
  },
  
  english: {
    // Navigation
    'nav.learn': 'Learn',
    'nav.math': 'Math',
    'nav.draw': 'Draw',
    'nav.story': 'Story',
    'nav.speak': 'Speak',
    
    // Common
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.done': 'Done',
    'common.continue': 'Continue',
    'common.try_again': 'Try Again',
    'common.correct': 'Correct',
    'common.incorrect': 'Incorrect',
    'common.great_job': 'Great Job',
    'common.keep_it_up': 'Keep it up',
    
    // Alphabet
    'alphabet.title': 'Alphabet',
    'alphabet.bangla': 'Bangla',
    'alphabet.english': 'English',
    'alphabet.letter': 'Letter',
    'alphabet.word': 'Word',
    'alphabet.pronunciation': 'Pronunciation',
    
    // Math
    'math.title': 'Math',
    'math.addition': 'Addition',
    'math.subtraction': 'Subtraction',
    'math.multiplication': 'Multiplication',
    'math.division': 'Division',
    'math.easy': 'Easy',
    'math.medium': 'Medium',
    'math.hard': 'Hard',
    'math.count': 'Count',
    
    // Story
    'story.title': 'Story',
    'story.create': 'Create Story',
    'story.words': 'Select Words',
    'story.generate': 'Generate Story',
    'story.read': 'Read',
    'story.favorite': 'Favorite',
    
    // Drawing
    'draw.title': 'Draw',
    'draw.recognize': 'Recognize',
    'draw.clear': 'Clear',
    'draw.undo': 'Undo',
    
    // Voice
    'voice.title': 'Speak',
    'voice.listen': 'Listen',
    'voice.speak': 'Speak',
    'voice.recognize': 'Recognize',
    
    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.volume': 'Volume',
    'settings.sound_effects': 'Sound Effects',
    'settings.haptic_feedback': 'Haptic Feedback',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('english');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language preference
  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && (savedLanguage === 'bangla' || savedLanguage === 'english')) {
        setLanguage(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Error loading language preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLanguage = async (newLanguage: Language) => {
    try {
      setLanguage(newLanguage);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations[typeof language]];
    return translation || key; // Return key if translation not found
  };

  const value: LanguageContextType = {
    language,
    setLanguage: updateLanguage,
    t,
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
