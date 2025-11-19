import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';
import { triggerHaptic } from '@/utils/haptics';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: import('react-native').StyleProp<import('react-native').ViewStyle>;
  textStyle?: import('react-native').StyleProp<import('react-native').TextStyle>;
  hapticFeedback?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  hapticFeedback = true,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    
    if (hapticFeedback) {
      triggerHaptic('buttonPress');
    }
    
    onPress();
  };

  const getButtonStyles = (): import('react-native').StyleProp<import('react-native').ViewStyle> => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.lg,
      // Shadows removed by default for cleaner, flat buttons across platforms
    };

    // Size styles
    const sizeStyles = {
      small: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        minHeight: theme.spacing.touchTargetSmall,
      },
      medium: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        minHeight: theme.spacing.touchTarget,
      },
      large: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.lg,
        minHeight: 72,
      },
    };

    // Variant styles
    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.primary,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
      },
      accent: {
        backgroundColor: theme.colors.accent,
      },
      success: {
        backgroundColor: theme.colors.success,
      },
      warning: {
        backgroundColor: theme.colors.warning,
      },
      error: {
        backgroundColor: theme.colors.error,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
    };

    return [
      {
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...(fullWidth && { width: '100%' }),
        ...(disabled && { opacity: 0.5 }),
      },
      style,
    ] as import('react-native').StyleProp<import('react-native').ViewStyle>;
  };

  const getTextStyles = (): import('react-native').StyleProp<import('react-native').TextStyle> => {
    const baseStyle: TextStyle = {
      fontWeight: theme.typography.semibold,
      textAlign: 'center',
    };

    const sizeStyles = {
      small: {
        fontSize: theme.typography.caption,
      },
      medium: {
        fontSize: theme.typography.body,
      },
      large: {
        fontSize: theme.typography.h6,
      },
    };

    const variantStyles = {
      primary: { color: theme.colors.textOnPrimary },
      secondary: { color: theme.colors.textOnSecondary },
      accent: { color: theme.colors.textOnAccent },
      success: { color: theme.colors.textOnPrimary },
      warning: { color: theme.colors.textOnPrimary },
      error: { color: theme.colors.textOnPrimary },
      outline: { color: theme.colors.primary },
      ghost: { color: theme.colors.textPrimary },
    };

    return [
      {
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
      },
      textStyle,
    ] as import('react-native').StyleProp<import('react-native').TextStyle>;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <ActivityIndicator 
            size="small" 
            color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : theme.colors.textOnPrimary} 
          />
          {size !== 'small' && <Text style={[getTextStyles(), { marginLeft: theme.spacing.sm }]}>Loading...</Text>}
        </>
      );
    }

    return (
      <>
        {icon && iconPosition === 'left' && (
          <>{icon}</>
        )}
        <Text style={getTextStyles()}>{title}</Text>
        {icon && iconPosition === 'right' && (
          <>{icon}</>
        )}
      </>
    );
  };

  if (variant === 'primary' || variant === 'secondary' || variant === 'accent') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        // Ensure layout width/constraints from parent are respected for gradient variants
        style={style as any}
      >
        <LinearGradient
          colors={
            variant === 'primary' 
              ? [theme.colors.primary, theme.colors.primaryDark]
              : variant === 'secondary'
              ? [theme.colors.secondary, theme.colors.secondaryDark]
              : [theme.colors.accent, theme.colors.accentDark]
          }
          // Visual/padding styles live on the gradient container
          style={getButtonStyles() as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      // Merge parent-provided style with computed button styles for non-gradient variants
      style={[getButtonStyles(), style] as any}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export default Button;
