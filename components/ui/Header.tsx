import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import Button from './Button';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  variant?: 'default' | 'gradient' | 'transparent';
  backgroundColor?: string;
  gradientColors?: readonly [string, string, ...string[]];
  showBackButton?: boolean;
  onBackPress?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  variant = 'default',
  backgroundColor,
  gradientColors,
  showBackButton = false,
  onBackPress,
  style,
  titleStyle,
  subtitleStyle,
}) => {
  const getHeaderStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      ...theme.shadows.sm,
    };

    const variantStyles = {
      default: {
        backgroundColor: backgroundColor || theme.colors.background,
      },
      gradient: {
        backgroundColor: 'transparent',
      },
      transparent: {
        backgroundColor: 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...style,
    };
  };

  const getTitleStyles = (): TextStyle => {
    return {
      fontSize: theme.typography.h4,
      fontWeight: theme.typography.bold,
      color: theme.colors.textPrimary,
      textAlign: 'center',
      flex: 1,
      ...titleStyle,
    };
  };

  const getSubtitleStyles = (): TextStyle => {
    return {
      fontSize: theme.typography.caption,
      fontWeight: theme.typography.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
      ...subtitleStyle,
    };
  };

  const renderLeftButton = () => {
    if (showBackButton) {
      return (
        <Button
          title=""
          onPress={onBackPress || onLeftPress || (() => {})}
          variant="ghost"
          icon={<Ionicons name="arrow-back" size={20} color={theme.colors.primary} />}
          style={{
            paddingHorizontal: theme.spacing.md,
            paddingVertical: 6,
            borderRadius: theme.borderRadius.round,
            backgroundColor: 'rgba(255,255,255,0.9)',
          }}
        />
      );
    }

    if (leftIcon && onLeftPress) {
      return (
        <Button
          title=""
          onPress={onLeftPress}
          variant="ghost"
          icon={<Ionicons name={leftIcon} size={24} color={theme.colors.textOnPrimary} />}
          style={{ paddingHorizontal: theme.spacing.sm }}
        />
      );
    }

    return <View style={{ width: 48 }} />; // Spacer
  };

  const renderRightButton = () => {
    if (rightIcon && onRightPress) {
      return (
        <Button
          title=""
          onPress={onRightPress}
          variant="ghost"
          icon={<Ionicons name={rightIcon} size={24} color={theme.colors.textOnPrimary} />}
          style={{ paddingHorizontal: theme.spacing.sm }}
        />
      );
    }

    return <View style={{ width: 48 }} />; // Spacer
  };

  const renderContent = () => (
    <View style={getHeaderStyles()}>
      {renderLeftButton()}
      
      <View style={styles.titleContainer}>
        <Text style={getTitleStyles()}>{title}</Text>
        {subtitle && <Text style={getSubtitleStyles()}>{subtitle}</Text>}
      </View>
      
      {renderRightButton()}
    </View>
  );

  if (variant === 'gradient' && gradientColors) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {renderContent()}
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderContent()}
    </SafeAreaView>
  );
};

// Specialized header components
export const LearningHeader: React.FC<HeaderProps> = (props) => (
    <Header
    variant="gradient"
    gradientColors={[theme.colors.primary, theme.colors.primaryLight] as const}
    {...props}
  />
);

export const MathHeader: React.FC<HeaderProps> = (props) => (
    <Header
    variant="gradient"
    gradientColors={[theme.colors.secondary, theme.colors.secondaryLight] as const}
    {...props}
  />
);

export const StoryHeader: React.FC<HeaderProps> = (props) => (
    <Header
    variant="gradient"
    gradientColors={[theme.colors.accent, theme.colors.accentLight] as const}
    {...props}
  />
);

export const TransparentHeader: React.FC<HeaderProps> = (props) => (
  <Header
    variant="transparent"
    {...props}
  />
);

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Header;
