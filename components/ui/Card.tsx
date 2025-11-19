import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleProp,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';

export interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  borderRadius?: 'small' | 'medium' | 'large' | 'round';
  backgroundColor?: string;
  gradientColors?: string[];
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  margin = 'none',
  borderRadius = 'medium',
  backgroundColor,
  gradientColors,
  onPress,
  disabled = false,
  style,
  ...touchableProps
}) => {
  const getCardStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: getBorderRadius(),
    };

    // Padding styles
    const paddingStyles = {
      none: {},
      small: { padding: theme.spacing.sm },
      medium: { padding: theme.spacing.md },
      large: { padding: theme.spacing.lg },
    };

    // Margin styles
    const marginStyles = {
      none: {},
      small: { margin: theme.spacing.sm },
      medium: { margin: theme.spacing.md },
      large: { margin: theme.spacing.lg },
    };

    // Variant styles
    const variantStyles = {
      default: {
        backgroundColor: backgroundColor || theme.colors.backgroundCard,
        ...theme.shadows.sm,
      },
      elevated: {
        backgroundColor: backgroundColor || theme.colors.backgroundCard,
        ...theme.shadows.lg,
      },
      outlined: {
        backgroundColor: backgroundColor || theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
      },
      gradient: {
        backgroundColor: 'transparent',
      },
    };

    const flattenedStyle = StyleSheet.flatten(style) as ViewStyle | undefined;

    return {
      ...baseStyle,
      ...paddingStyles[padding],
      ...marginStyles[margin],
      ...variantStyles[variant],
      ...(disabled && { opacity: 0.6 }),
      ...(flattenedStyle || {}),
    };
  };

  const getBorderRadius = (): number => {
    const borderRadiusMap = {
      small: theme.borderRadius.sm,
      medium: theme.borderRadius.md,
      large: theme.borderRadius.lg,
      round: theme.borderRadius.round,
    };
    return borderRadiusMap[borderRadius];
  };

  const renderCard = () => {
    if (variant === 'gradient' && gradientColors) {
      return (
        <LinearGradient
          colors={gradientColors as unknown as readonly [string, string]}
          style={getCardStyles()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {children}
        </LinearGradient>
      );
    }

    return (
      <View style={getCardStyles()}>
        {children}
      </View>
    );
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        style={{ borderRadius: getBorderRadius() }}
        {...touchableProps}
      >
        {renderCard()}
      </TouchableOpacity>
    );
  }

  return renderCard();
};

// Specialized card components
export const LearningCard: React.FC<CardProps> = (props) => (
  <Card
    variant="elevated"
    padding="large"
    borderRadius="large"
    style={{
      minHeight: 120,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    {...props}
  />
);

export const ProgressCard: React.FC<CardProps> = (props) => (
  <Card
    variant="outlined"
    padding="medium"
    borderRadius="medium"
    {...props}
  />
);

export const InteractiveCard: React.FC<CardProps> = (props) => (
  <Card
    variant="default"
    padding="medium"
    borderRadius="large"
    style={{
      minHeight: theme.spacing.touchTarget,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    {...props}
  />
);

export const GradientCard: React.FC<CardProps> = (props) => (
  <Card
    variant="gradient"
    gradientColors={[theme.colors.primary, theme.colors.primaryLight] as const}
    padding="large"
    borderRadius="large"
    {...props}
  />
);

export default Card;
