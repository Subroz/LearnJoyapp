import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configuration (optional - app works without it)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Create Supabase client (works offline if no real credentials)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          age: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          age: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          age?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      learning_progress: {
        Row: {
          id: string;
          user_id: string;
          type: 'letter' | 'word' | 'math' | 'story';
          item_id: string;
          completed: boolean;
          score?: number;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'letter' | 'word' | 'math' | 'story';
          item_id: string;
          completed: boolean;
          score?: number;
          timestamp: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'letter' | 'word' | 'math' | 'story';
          item_id?: string;
          completed?: boolean;
          score?: number;
          timestamp?: string;
          created_at?: string;
        };
      };
      favorite_stories: {
        Row: {
          id: string;
          user_id: string;
          story_text: string;
          words_used: string[];
          language: 'bangla' | 'english';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          story_text: string;
          words_used: string[];
          language: 'bangla' | 'english';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          story_text?: string;
          words_used?: string[];
          language?: 'bangla' | 'english';
          created_at?: string;
        };
      };
      user_settings: {
        Row: {
          user_id: string;
          language_preference: 'bangla' | 'english';
          theme: 'light' | 'dark';
          volume: number;
          sound_effects: boolean;
          haptic_feedback: boolean;
          usage_stats: {
            total_time_spent: number;
            sessions_completed: number;
            last_used: string;
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          language_preference?: 'bangla' | 'english';
          theme?: 'light' | 'dark';
          volume?: number;
          sound_effects?: boolean;
          haptic_feedback?: boolean;
          usage_stats?: {
            total_time_spent: number;
            sessions_completed: number;
            last_used: string;
          };
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          language_preference?: 'bangla' | 'english';
          theme?: 'light' | 'dark';
          volume?: number;
          sound_effects?: boolean;
          haptic_feedback?: boolean;
          usage_stats?: {
            total_time_spent: number;
            sessions_completed: number;
            last_used: string;
          };
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Typed Supabase client
export const typedSupabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Auth helper functions
export const authHelpers = {
  // Sign up new user
  signUp: async (email: string, password: string, name: string, age: number) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          age,
        },
      },
    });

    if (error) throw error;

    // Create user profile
    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        name,
        age,
      });
    }

    return data;
  },

  // Sign in user
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign out user
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Get user profile
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },
};

// Database helper functions
export const dbHelpers = {
  // Learning progress
  saveProgress: async (userId: string, type: 'letter' | 'word' | 'math' | 'story', itemId: string, completed: boolean, score?: number) => {
    const { data, error } = await supabase
      .from('learning_progress')
      .insert({
        user_id: userId,
        type,
        item_id: itemId,
        completed,
        score,
        timestamp: new Date().toISOString(),
      });

    if (error) throw error;
    return data;
  },

  getProgress: async (userId: string, type?: 'letter' | 'word' | 'math' | 'story') => {
    let query = supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId);

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query.order('timestamp', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Favorite stories
  saveFavoriteStory: async (userId: string, storyText: string, wordsUsed: string[], language: 'bangla' | 'english') => {
    const { data, error } = await supabase
      .from('favorite_stories')
      .insert({
        user_id: userId,
        story_text: storyText,
        words_used: wordsUsed,
        language,
      });

    if (error) throw error;
    return data;
  },

  getFavoriteStories: async (userId: string) => {
    const { data, error } = await supabase
      .from('favorite_stories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // User settings
  saveUserSettings: async (userId: string, settings: Partial<Database['public']['Tables']['user_settings']['Insert']>) => {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
    return data;
  },

  getUserSettings: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
    return data;
  },
};

export default supabase;
