import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const theme = {
  colors: {
    // Bangla alphabet purple theme (from bangla_color_scheme.json)
    primary: '#6B7FD7', // button primary
    primaryLight: '#5A6EC6',
    primaryDark: '#4A5DB5',

    // Secondary remains a softer variant for accents
    secondary: '#4BA3FF',
    secondaryLight: '#8FD3FF',
    secondaryDark: '#1777D1',

    // Accent mapped to same family
    accent: '#6B7FD7',
    accentLight: '#D6CCFF',
    accentDark: '#5A3ED6',
    
    // Background colors
    background: '#FFFFFF', // main
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
    // Border colors (aliases often used in components)
    border: {
      light: '#E0E0E0',
      dark: '#BDBDBD',
    } as any,
  },
  
  typography: {
    // Font sizes tuned to design hints (headings slightly larger)
    h1: 28,
    h2: 24,
    h3: 20,
    h4: 18,
    h5: 16,
    h6: 14,
    body: 16,
    caption: 14,
    small: 12,
    
    // Font weights
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    
    // Font families
    primary: 'sans-serif',
    secondary: 'sans-serif',
  } as const,
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    
    // Touch targets (minimum 60px for accessibility)
    touchTarget: 60,
    touchTargetSmall: 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 15,
    xl: 20,
    xxl: 24,
    round: 50,
  },
  
  shadows: {
    sm: Platform.select({
      web: { boxShadow: '0 2px 10px rgba(0,0,0,0.10)' } as any,
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
      },
    }),
    md: Platform.select({
      web: { boxShadow: '0 4px 15px rgba(107, 127, 215, 0.3)' } as any,
      default: {
        shadowColor: 'rgba(107, 127, 215, 0.3)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 6,
      },
    }),
    lg: Platform.select({
      web: { boxShadow: '0 2px 10px rgba(0,0,0,0.1)' } as any,
      default: {
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
      },
    }),
  },
  
  layout: {
    window: {
      width,
      height,
    },
    isSmallDevice: width < 375,
    isTablet: width >= 768,
  },
  
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
};
