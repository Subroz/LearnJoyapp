import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SECTION_COLORS } from '@/constants/colors';
import { theme } from '@/constants/theme';

type SectionKey = keyof typeof SECTION_COLORS;

interface ScreenBackgroundProps {
  section: SectionKey;
  children: React.ReactNode;
}

export const ScreenBackground: React.FC<ScreenBackgroundProps> = ({
  section,
  children,
}) => {
  const animated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animated, {
          toValue: 1,
          duration: 9000,
          useNativeDriver: true,
        }),
        Animated.timing(animated, {
          toValue: 0,
          duration: 9000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animated]);

  const colors =
    SECTION_COLORS[section]?.gradient ?? [
      theme.colors.background,
      theme.colors.backgroundSecondary,
    ];

  const floatUp = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -18],
  });

  const floatDown = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 14],
  });

  const scale = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  return (
    <LinearGradient
      colors={colors as unknown as readonly [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      {/* Soft animated bubbles behind content */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.bubble,
          styles.bubbleTopLeft,
          {
            transform: [{ translateY: floatUp }, { scale }],
          },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.bubble,
          styles.bubbleBottomRight,
          {
            transform: [{ translateY: floatDown }, { scale }],
          },
        ]}
      />

      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  bubble: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.24)',
    borderRadius: 999,
  },
  bubbleTopLeft: {
    width: 180,
    height: 180,
    top: -40,
    left: -30,
  },
  bubbleBottomRight: {
    width: 220,
    height: 220,
    bottom: -60,
    right: -40,
  },
});

export default ScreenBackground;


