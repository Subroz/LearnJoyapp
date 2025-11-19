import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export type HapticType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection'
  // custom interaction names used throughout the app
  | 'buttonPress'
  | 'cardTap'
  | 'swipe'
  | 'drag';

export const hapticFeedback = {
  // Basic haptic feedback
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),

  // Success feedback
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),

  // Warning feedback
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),

  // Error feedback
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),

  // Selection feedback
  selection: () => Haptics.selectionAsync(),

  // Custom haptic patterns for different interactions
  buttonPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  cardTap: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  swipe: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  drag: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  
  // Learning-specific feedback
  correctAnswer: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  incorrectAnswer: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  levelComplete: () => {
    // Custom pattern for level completion
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 300);
  },
  
  // Story and interaction feedback
  pageTurn: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  wordSelect: () => Haptics.selectionAsync(),
  drawingStart: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  drawingEnd: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
};

// Helper function to trigger haptic feedback based on interaction type
export const triggerHaptic = (type: HapticType, enabled: boolean = true): void => {
  if (!enabled) return;
  // No-op on web: haptics are not supported
  if (Platform.OS === 'web') return;

  try {
    switch (type) {
      case 'light':
        hapticFeedback.light();
        break;
      case 'medium':
        hapticFeedback.medium();
        break;
      case 'heavy':
        hapticFeedback.heavy();
        break;
      case 'success':
        hapticFeedback.success();
        break;
      case 'warning':
        hapticFeedback.warning();
        break;
      case 'error':
        hapticFeedback.error();
        break;
      case 'selection':
        hapticFeedback.selection();
        break;
      // Map custom interaction names to existing haptics
      case 'buttonPress':
      case 'cardTap':
      case 'swipe':
        hapticFeedback.light();
        break;
      case 'drag':
        hapticFeedback.medium();
        break;
      default:
        hapticFeedback.light();
    }
  } catch (error) {
    console.warn('Haptic feedback not available:', error);
  }
};

// Settings helper
export const hapticSettings = {
  isEnabled: true, // This would be controlled by user settings
  
  enable: () => {
    hapticSettings.isEnabled = true;
  },
  
  disable: () => {
    hapticSettings.isEnabled = false;
  },
  
  toggle: () => {
    hapticSettings.isEnabled = !hapticSettings.isEnabled;
  },
};

export default hapticFeedback;
