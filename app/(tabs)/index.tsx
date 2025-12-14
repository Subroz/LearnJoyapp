import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
// MaskedView is used for gradient text; require used to avoid TS type issues if typings are missing
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MaskedView = require('@react-native-masked-view/masked-view').default;
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import Card from '@/components/ui/Card';
// Design-driven background configuration
import designConfig from '@/Design/design-config.json';

type FloatingShapeSizeKey = 'sm' | 'md' | 'lg';

type FloatingShapePosition = {
  top?: string;
  left?: string;
  right?: string;
};

interface FloatingShapeProps extends FloatingShapePosition {
  index: number;
  color: string;
  sizeKey: FloatingShapeSizeKey;
  shapeType: string;
  opacity: number;
  durationMs: number;
  cartoonEmoji: string;
}

const sizeMap: Record<FloatingShapeSizeKey, { width: number; height: number }> = {
  sm: { width: 32, height: 32 },
  md: { width: 56, height: 56 },
  lg: { width: 80, height: 80 },
};

const CARTOON_EMOJIS = ['🐻', '🐰', '🐼', '🦊', '🐣', '⭐', '🎈', '🌙'];

const FloatingShape: React.FC<FloatingShapeProps> = ({
  index,
  color,
  sizeKey,
  shapeType,
  opacity,
  durationMs,
  top,
  left,
  right,
  cartoonEmoji,
}) => {
  const floatAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const halfDuration = durationMs / 2;

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: halfDuration,
          delay: index * 300,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: halfDuration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim, durationMs, index]);

  const { width, height } = sizeMap[sizeKey];

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const rotate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '5deg'],
  });

  const shapeSpecificStyle =
    shapeType === 'circle'
      ? styles.shapeCircle
      : shapeType === 'triangle'
      ? styles.shapeTriangle
      : styles.shapeRounded;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.shapeBase,
        shapeSpecificStyle,
        {
          top: top as any,
          left: left as any,
          right: right as any,
          width,
          height,
          backgroundColor: color,
          opacity,
          transform: [{ translateY }, { rotate }],
        },
      ]}
    >
      <View style={styles.cartoonBubble}>
        <Text style={styles.cartoonEmoji}>{cartoonEmoji}</Text>
      </View>
    </Animated.View>
  );
};

export default function LearnScreen() {
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();

  const animatedBackground = (designConfig as any).animatedBackground;

  const gradientColors: string[] = useMemo(() => {
    const stops = animatedBackground?.gradient?.stops;
    if (Array.isArray(stops) && stops.length > 0) {
      return stops.map((stop: any) => stop.color);
    }
    return ['#E6F3FF', '#F3E6FF', '#FFE6F0'];
  }, [animatedBackground]);

  const floatingShapesConfig = animatedBackground?.floatingShapes;
  const floatingShapesDurationMs = 6000;

  const headingGradientColors = useMemo(() => {
    // Prefer strong blue → pink from design-config learningCards, fallback to animated gradient
    const learningCards = (designConfig as any)?.colors?.learningCards;
    if (learningCards?.alphabetEnglish && learningCards?.alphabetBangla) {
      return [
        learningCards.alphabetEnglish as string,
        learningCards.alphabetBangla as string,
      ];
    }
    if (gradientColors.length >= 2) {
      return [gradientColors[0], gradientColors[gradientColors.length - 1]];
    }
    return ['#4BA3FF', '#FF6B9A'];
  }, [gradientColors]);

  const modules = [
    {
      id: 'englishAlphabet',
      title: t('alphabet.english'),
      iconLabel: 'ABC',
      gradient: ['#4BA3FF', '#8FD3FF'] as const,
      onPress: () => router.push('/english-alphabet'),
    },
    {
      id: 'banglaAlphabet',
      title: t('alphabet.bangla'),
      iconLabel: 'অ/ক',
      gradient: ['#FF6B9A', '#FF9BCD'] as const,
      onPress: () => router.push('/bangla-alphabet'),
    },
    {
      id: 'math',
      title: t('nav.math'),
      iconName: 'grid',
      gradient: ['#34C759', '#66D98F'] as const,
      onPress: () => router.push('/math'),
    },
    {
      id: 'story',
      title: t('nav.story'),
      iconName: 'book',
      gradient: ['#A855F7', '#C084FC'] as const,
      onPress: () => router.push('/story'),
    },
    {
      id: 'draw',
      title: t('nav.draw'),
      iconName: 'color-palette',
      gradient: ['#FF9500', '#FFC266'] as const,
      onPress: () => router.push('/draw'),
    },
    {
      id: 'speak',
      title: t('nav.speak'),
      iconName: 'mic',
      gradient: ['#0EA5E9', '#38BDF8'] as const,
      onPress: () => router.push('/speak'),
    },
  ];

  return (
    <LinearGradient
      colors={gradientColors as unknown as readonly [string, string, ...string[]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      {/* Animated decorative shapes from design-config */}
      {floatingShapesConfig &&
        Array.isArray(floatingShapesConfig.positions) &&
        (() => {
          const basePositions: any[] = floatingShapesConfig.positions;
          // Add a couple of extra virtual positions for more playful shapes
          const extraPositions: any[] = [
            { top: '25%', left: '45%' },
            { top: '75%', right: '40%' },
          ];
          const allPositions = [...basePositions, ...extraPositions];

          const sizes = floatingShapesConfig.sizes || {};
          const sizeKeys = Object.keys(sizes) as FloatingShapeSizeKey[];
          const colors: string[] = floatingShapesConfig.colors || [];
          const shapes: string[] = floatingShapesConfig.shapes || ['circle'];
          const opacity =
            typeof floatingShapesConfig.opacity === 'number'
              ? floatingShapesConfig.opacity
              : 0.6;
          return allPositions.map((pos: any, index: number) => {
            const sizeKey: FloatingShapeSizeKey =
              sizeKeys[index % sizeKeys.length] || 'md';

            const color =
              colors.length > 0
                ? colors[index % colors.length]
                : 'rgba(255,255,255,0.6)';

            const shapeType = shapes[index % shapes.length];

            const cartoonEmoji = CARTOON_EMOJIS[index % CARTOON_EMOJIS.length];

            return (
              <FloatingShape
                key={index}
                index={index}
                color={color}
                sizeKey={sizeKey}
                shapeType={shapeType}
                opacity={opacity}
                durationMs={floatingShapesDurationMs}
                cartoonEmoji={cartoonEmoji}
                top={pos.top}
                left={pos.left}
                right={pos.right}
              />
            );
          });
        })()}

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* App Title with gradient text */}
          <MaskedView
            style={styles.appTitleMask}
            maskElement={
              <View style={styles.appTitleMaskInner}>
                <Text style={styles.appTitle}>KidLearn</Text>
              </View>
            }
          >
            <LinearGradient
              colors={headingGradientColors as unknown as readonly [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.appTitle, styles.appTitleGradientFill]}>KidLearn</Text>
            </LinearGradient>
          </MaskedView>

          {/* Language toggle pill */}
          <View style={styles.languageToggleWrapper}>
            <View style={styles.languageToggle}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setLanguage('bangla')}
                style={[
                  styles.languageOption,
                  language === 'bangla' && styles.languageOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.languageOptionText,
                    language === 'bangla' && styles.languageOptionTextActive,
                  ]}
                >
                  {t('alphabet.bangla')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setLanguage('english')}
                style={[
                  styles.languageOption,
                  language === 'english' && styles.languageOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.languageOptionText,
                    language === 'english' && styles.languageOptionTextActive,
                  ]}
                >
                  {t('alphabet.english')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Main learning modules grid */}
          <View style={styles.modulesGrid}>
            {modules.map((module) => (
              <TouchableOpacity
                key={module.id}
                activeOpacity={0.9}
                onPress={module.onPress}
                style={styles.moduleWrapper}
              >
                <LinearGradient
                  colors={module.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.moduleCard}
                >
                  <View style={styles.moduleContent}>
                    <View style={styles.moduleIconContainer}>
                      {'iconLabel' in module && module.iconLabel ? (
                        <Text style={styles.moduleIconLabel}>{module.iconLabel}</Text>
                      ) : (
                        <Ionicons
                          name={(module as any).iconName}
                          size={28}
                          color={theme.colors.white}
                        />
                      )}
                    </View>
                    <Text style={styles.moduleTitle}>{module.title}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Progress Summary */}
          <View style={styles.progressSection}>
            <Text style={styles.sectionTitle}>
              {language === 'bangla' ? 'আজকের অগ্রগতি' : "Today's Progress"}
            </Text>
            <Card
              variant="gradient"
              gradientColors={['#FF6B9A', '#FF9BCD']}
              padding="large"
              borderRadius="large"
              style={styles.progressCard}
            >
              <View style={styles.progressContent}>
                <Ionicons name="trophy" size={24} color={theme.colors.white} />
                <Text style={styles.progressText}>
                  {language === 'bangla' ? 'আজ ভালো শিখেছ!' : 'Great job learning today!'}
                </Text>
                <Text style={styles.progressSubtext}>
                  {language === 'bangla' ? 'চালিয়ে যাও!' : 'Keep up the excellent work'}
                </Text>
              </View>
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  appTitleMask: {
    marginTop: theme.spacing.lg,
    alignSelf: 'center',
  },
  appTitleMaskInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 38,
    fontWeight: theme.typography.bold,
    color: 'hsl(210, 75.70%, 50.00%)',
    textAlign: 'center',
  },
  appTitleGradientFill: {
    paddingHorizontal: theme.spacing.lg,
    color: 'hsla(244, 45.80%, 58.00%, 0.62)',
    backgroundColor: 'transparent',
  },
  languageToggleWrapper: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  languageToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: theme.borderRadius.round,
    padding: 4,
    ...theme.shadows.sm,
  },
  languageOption: {
    flex: 1,
    borderRadius: theme.borderRadius.round,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageOptionActive: {
    backgroundColor: theme.colors.primary,
  },
  languageOptionText: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.medium as any,
  },
  languageOptionTextActive: {
    color: theme.colors.white,
    fontWeight: theme.typography.bold as any,
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xl,
    rowGap: theme.spacing.lg,
  },
  moduleWrapper: {
    width: '47%',
  },
  moduleCard: {
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  moduleContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  moduleIconLabel: {
    fontSize: 20,
    fontWeight: theme.typography.bold as any,
    color: theme.colors.white,
  },
  moduleTitle: {
    fontSize: theme.typography.h6,
    fontWeight: theme.typography.bold,
    color: theme.colors.white,
    textAlign: 'center',
  },
  progressSection: {
    marginTop: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.h5,
    fontWeight: theme.typography.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  progressCard: {
    marginTop: theme.spacing.sm,
  },
  progressContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: theme.typography.h6,
    fontWeight: theme.typography.bold,
    color: theme.colors.white,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  progressSubtext: {
    fontSize: theme.typography.caption,
    color: theme.colors.white,
    opacity: 0.9,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  // Decorative animated shapes
  shapeBase: {
    position: 'absolute',
  },
  shapeCircle: {
    borderRadius: 999,
  },
  shapeRounded: {
    borderRadius: theme.borderRadius.xl,
  },
  // Simple triangle using rotation – used as a playful shape
  shapeTriangle: {
    borderRadius: theme.borderRadius.md,
    transform: [{ rotate: '45deg' }],
  },
  cartoonBubble: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartoonEmoji: {
    fontSize: 22,
  },
});
