import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      fontSize: theme.typography.h3,
      fontWeight: theme.typography.bold,
      color: theme.colors.textPrimary,
      textAlign: 'center',
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
          icon={<Ionicons name="chevron-back" size={28} color={theme.colors.white} />}
          style={{
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            borderRadius: theme.borderRadius.round,
            backgroundColor: theme.colors.secondary,
            minWidth: 48,
            minHeight: 48,
            ...theme.shadows.md,
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
    <View style={[getHeaderStyles(), styles.headerWrapper]}>
      {/* Back button positioned absolutely for true center alignment */}
      {showBackButton && (
        <View style={styles.absoluteBackButton}>
          <Button
            title=""
            onPress={onBackPress || onLeftPress || (() => {})}
            variant="ghost"
            icon={<Ionicons name="chevron-back" size={28} color={theme.colors.white} />}
            style={{
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.borderRadius.round,
              backgroundColor: theme.colors.secondary,
              minWidth: 48,
              minHeight: 48,
              ...theme.shadows.md,
            }}
          />
        </View>
      )}
      
      {/* Centered title container */}
      <View style={styles.titleContainer}>
        <Text style={getTitleStyles()}>{title}</Text>
        {subtitle && <Text style={getSubtitleStyles()}>{subtitle}</Text>}
      </View>
      
      {/* Right button or spacer for non-back-button headers */}
      {!showBackButton && renderLeftButton()}
      {!showBackButton && renderRightButton()}
      {showBackButton && rightIcon && onRightPress && renderRightButton()}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderContent()}
    </SafeAreaView>
  );
};

// Specialized header components
export const LearningHeader: React.FC<HeaderProps> = (props) => <Header {...props} />;

export const MathHeader: React.FC<HeaderProps> = (props) => <Header {...props} />;

export const StoryHeader: React.FC<HeaderProps> = (props) => <Header {...props} />;

export const TransparentHeader: React.FC<HeaderProps> = (props) => (
  <Header
    variant="transparent"
    {...props}
  />
);

const styles = StyleSheet.create({
  safeArea: {
    // Let the parent screen control the background (e.g. gradients)
    backgroundColor: 'transparent',
  },
  headerWrapper: {
    position: 'relative',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  absoluteBackButton: {
    position: 'absolute',
    left: theme.spacing.lg,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 10,
  },
});

export default Header;
