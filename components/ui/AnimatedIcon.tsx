import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated as RNAnimated,
  Easing as RNEasing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

export interface AnimatedIconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  animation?: 'none' | 'bounce' | 'pulse' | 'shake' | 'rotate' | 'scale' | 'wiggle';
  duration?: number;
  delay?: number;
  repeat?: boolean;
  onAnimationComplete?: () => void;
  style?: ViewStyle;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  name,
  size = 24,
  color = theme.colors.primary,
  animation = 'none',
  duration = 1000,
  delay = 0,
  repeat = false,
  onAnimationComplete,
  style,
}) => {
  const scale = useRef(new RNAnimated.Value(1)).current;
  const rotation = useRef(new RNAnimated.Value(0)).current; // 0..1
  const translateX = useRef(new RNAnimated.Value(0)).current;
  const opacity = useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    if (animation === 'none') return;

    const startAnimation = () => {
      switch (animation) {
        case 'bounce':
          RNAnimated.sequence([
            RNAnimated.timing(scale, { toValue: 1.2, duration: duration / 2, easing: RNEasing.out(RNEasing.quad), useNativeDriver: true }),
            RNAnimated.timing(scale, { toValue: 1, duration: duration / 2, easing: RNEasing.in(RNEasing.quad), useNativeDriver: true }),
          ]).start(() => !repeat && onAnimationComplete?.());
          break;

        case 'pulse':
          const pulse = RNAnimated.sequence([
            RNAnimated.timing(scale, { toValue: 1.1, duration: duration / 2, useNativeDriver: true }),
            RNAnimated.timing(scale, { toValue: 1, duration: duration / 2, useNativeDriver: true }),
          ]);
          if (repeat) RNAnimated.loop(pulse).start(); else pulse.start(() => onAnimationComplete?.());
          break;

        case 'shake':
          RNAnimated.sequence([
            RNAnimated.timing(translateX, { toValue: -10, duration: duration / 6, useNativeDriver: true }),
            RNAnimated.timing(translateX, { toValue: 10, duration: duration / 6, useNativeDriver: true }),
            RNAnimated.timing(translateX, { toValue: -10, duration: duration / 6, useNativeDriver: true }),
            RNAnimated.timing(translateX, { toValue: 10, duration: duration / 6, useNativeDriver: true }),
            RNAnimated.timing(translateX, { toValue: -10, duration: duration / 6, useNativeDriver: true }),
            RNAnimated.timing(translateX, { toValue: 0, duration: duration / 6, useNativeDriver: true }),
          ]).start(() => !repeat && onAnimationComplete?.());
          break;

        case 'rotate':
          rotation.setValue(0);
          const rotate = RNAnimated.timing(rotation, { toValue: 1, duration, easing: RNEasing.linear, useNativeDriver: true });
          if (repeat) RNAnimated.loop(rotate).start(); else rotate.start(() => onAnimationComplete?.());
          break;

        case 'scale':
          RNAnimated.sequence([
            RNAnimated.timing(scale, { toValue: 1.3, duration: duration / 2, useNativeDriver: true }),
            RNAnimated.timing(scale, { toValue: 1, duration: duration / 2, useNativeDriver: true }),
          ]).start(() => !repeat && onAnimationComplete?.());
          break;

        case 'wiggle':
          RNAnimated.sequence([
            RNAnimated.timing(translateX, { toValue: -6, duration: duration / 4, useNativeDriver: true }),
            RNAnimated.timing(translateX, { toValue: 6, duration: duration / 4, useNativeDriver: true }),
            RNAnimated.timing(translateX, { toValue: -6, duration: duration / 4, useNativeDriver: true }),
            RNAnimated.timing(translateX, { toValue: 0, duration: duration / 4, useNativeDriver: true }),
          ]).start(() => !repeat && onAnimationComplete?.());
          break;

        default:
          break;
      }

      // RNAnimated callbacks above will call onAnimationComplete when not repeating
    };

    if (delay > 0) {
      const timeout = setTimeout(startAnimation, delay);
      return () => clearTimeout(timeout);
    } else {
      startAnimation();
    }
  }, [animation, duration, delay, repeat, onAnimationComplete]);

  const rotateInterpolate = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const animatedStyle = {
    transform: [
      { scale },
      { rotate: rotateInterpolate },
      { translateX },
    ],
    opacity,
  } as const;

  return (
    <RNAnimated.View style={[styles.container, animatedStyle as any, style]}>
      <Ionicons name={name} size={size} color={color} />
    </RNAnimated.View>
  );
};

// Predefined animated icons for common use cases
export const SuccessIcon: React.FC<Omit<AnimatedIconProps, 'name'>> = (props) => (
  <AnimatedIcon
    name="checkmark-circle"
    color={theme.colors.success}
    animation="bounce"
    {...props}
  />
);

export const ErrorIcon: React.FC<Omit<AnimatedIconProps, 'name'>> = (props) => (
  <AnimatedIcon
    name="close-circle"
    color={theme.colors.error}
    animation="shake"
    {...props}
  />
);

export const WarningIcon: React.FC<Omit<AnimatedIconProps, 'name'>> = (props) => (
  <AnimatedIcon
    name="warning"
    color={theme.colors.warning}
    animation="pulse"
    {...props}
  />
);

export const StarIcon: React.FC<Omit<AnimatedIconProps, 'name'>> = (props) => (
  <AnimatedIcon
    name="star"
    color={theme.colors.secondary}
    animation="wiggle"
    {...props}
  />
);

export const HeartIcon: React.FC<Omit<AnimatedIconProps, 'name'>> = (props) => (
  <AnimatedIcon
    name="heart"
    color={theme.colors.accent}
    animation="pulse"
    {...props}
  />
);

export const TrophyIcon: React.FC<Omit<AnimatedIconProps, 'name'>> = (props) => (
  <AnimatedIcon
    name="trophy"
    color={theme.colors.secondary}
    animation="bounce"
    {...props}
  />
);

// Learning-specific animated icons
export const LetterIcon: React.FC<Omit<AnimatedIconProps, 'name'>> = (props) => (
  <AnimatedIcon
    name="text"
    color={theme.colors.primary}
    animation="scale"
    {...props}
  />
);

export const MathIcon: React.FC<Omit<AnimatedIconProps, 'name'>> = (props) => (
  <AnimatedIcon
    name="calculator"
    color={theme.colors.secondary}
    animation="rotate"
    {...props}
  />
);

export const DrawIcon: React.FC<Omit<AnimatedIconProps, 'name'>> = (props) => (
  <AnimatedIcon
    name="create"
    color={theme.colors.accent}
    animation="pulse"
    {...props}
  />
);

export const StoryIcon: React.FC<Omit<AnimatedIconProps, 'name'>> = (props) => (
  <AnimatedIcon
    name="book"
    color={theme.colors.primary}
    animation="wiggle"
    {...props}
  />
);

export const VoiceIcon: React.FC<Omit<AnimatedIconProps, 'name'>> = (props) => (
  <AnimatedIcon
    name="mic"
    color={theme.colors.accent}
    animation="pulse"
    {...props}
  />
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AnimatedIcon;
