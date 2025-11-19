// Color palette for the app
export const COLORS = {
  // Primary colors (purple/indigo theme)
  primary: '#6B7FD7',
  primaryLight: '#5A6EC6',
  primaryDark: '#4A5DB5',

  // Secondary colors (blue theme)
  secondary: '#4BA3FF',
  secondaryLight: '#8FD3FF',
  secondaryDark: '#1777D1',

  // Accent colors
  accent: '#6B7FD7',
  accentLight: '#D6CCFF',
  accentDark: '#5A3ED6',

  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F5F7FF',
  backgroundCard: '#FFFFFF',

  // Text colors
  text: '#0F172A',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textLight: '#94A3B8',
  textOnPrimary: '#FFFFFF',
  textOnSecondary: '#FFFFFF',
  textOnAccent: '#FFFFFF',

  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9E9E9E',
  grayLight: '#F5F5F5',
  grayDark: '#616161',

  // Special colors for learning
  correct: '#4CAF50',
  incorrect: '#F44336',
  highlight: '#FFF176',
  progress: '#2196F3',

  // Border colors
  border: {
    light: '#E0E0E0',
    dark: '#BDBDBD',
  },
} as const;

// Section-specific color schemes
export const SECTION_COLORS = {
  bangla: {
    primary: '#645BFF',
    gradient: ['#645BFF', '#9F9BFF'],
  },
  english: {
    primary: '#3F51B5',
    gradient: ['#3F51B5', '#5C6BC0'],
  },
  math: {
    primary: '#4BA3FF',
    gradient: ['#4BA3FF', '#8FD3FF'],
  },
  draw: {
    primary: '#6B7FD7',
    gradient: ['#6B7FD7', '#D6CCFF'],
  },
  story: {
    primary: '#6B7FD7',
    gradient: ['#6B7FD7', '#9F9BFF'],
  },
  voice: {
    primary: '#6B7FD7',
    gradient: ['#6B7FD7', '#D6CCFF'],
  },
} as const;

export default COLORS;
