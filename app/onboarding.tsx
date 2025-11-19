import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import Button from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { triggerHaptic } from '@/utils/haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const ONBOARDING_COMPLETED_KEY = '@onboarding_completed';

export default function OnboardingScreen() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = React.useRef<FlatList>(null);

  const slides: OnboardingSlide[] = [
    {
      id: '1',
      title: 'Welcome to LearnJoy! 🎉',
      subtitle: 'An AI-powered learning adventure for children',
      icon: 'rocket',
      color: theme.colors.primary,
    },
    {
      id: '2',
      title: 'Learn Alphabets 📚',
      subtitle: 'Master Bangla and English letters with fun pronunciations',
      icon: 'text',
      color: theme.colors.secondary,
    },
    {
      id: '3',
      title: 'Practice Math ➕',
      subtitle: 'Solve visual math problems and count colorful objects',
      icon: 'calculator',
      color: theme.colors.success,
    },
    {
      id: '4',
      title: 'Draw & Create ✏️',
      subtitle: 'Practice writing on the AI whiteboard',
      icon: 'create',
      color: theme.colors.accent,
    },
    {
      id: '5',
      title: 'Tell Stories 📖',
      subtitle: 'Create magical stories with AI and listen to them',
      icon: 'book',
      color: theme.colors.warning,
    },
    {
      id: '6',
      title: 'Speak & Practice 🎤',
      subtitle: 'Improve pronunciation with voice practice',
      icon: 'mic',
      color: theme.colors.error,
    },
  ];

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
      triggerHaptic('light');
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    triggerHaptic('success');
    
    // Mark onboarding as completed
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
    
    // Navigate to main app
    router.replace('/(tabs)');
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      <LinearGradient
        colors={[item.color, item.color + 'CC']}
        style={styles.iconContainer}
      >
        <Ionicons name={item.icon} size={80} color={theme.colors.white} />
      </LinearGradient>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor:
                index === currentIndex
                  ? theme.colors.primary
                  : theme.colors.textTertiary,
              width: index === currentIndex ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Language Selection */}
      <View style={styles.languageContainer}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            language === 'bangla' && styles.languageButtonActive,
          ]}
          onPress={() => {
            setLanguage('bangla');
            triggerHaptic('selection');
          }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.languageText,
              language === 'bangla' && styles.languageTextActive,
            ]}
          >
            বাংলা
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.languageButton,
            language === 'english' && styles.languageButtonActive,
          ]}
          onPress={() => {
            setLanguage('english');
            triggerHaptic('selection');
          }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.languageText,
              language === 'english' && styles.languageTextActive,
            ]}
          >
            English
          </Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(index);
        }}
        scrollEnabled={true}
        bounces={false}
      />

      {/* Pagination */}
      {renderPagination()}

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        {currentIndex < slides.length - 1 ? (
          <>
            <Button
              title="Skip"
              onPress={handleSkip}
              variant="outline"
              size="medium"
              style={styles.skipButton}
            />
            <Button
              title="Next"
              onPress={handleNext}
              variant="primary"
              size="large"
              icon={<Ionicons name="arrow-forward" size={20} color={theme.colors.white} />}
              iconPosition="right"
              style={styles.nextButton}
            />
          </>
        ) : (
          <Button
            title="Get Started! 🚀"
            onPress={handleGetStarted}
            variant="primary"
            size="large"
            icon={<Ionicons name="checkmark-circle" size={24} color={theme.colors.white} />}
            style={styles.getStartedButton}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  languageButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border.light,
    backgroundColor: theme.colors.backgroundCard,
    minWidth: 100,
    alignItems: 'center',
  },
  languageButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight + '20',
  },
  languageText: {
    fontSize: theme.typography.body,
    fontWeight: theme.typography.medium,
    color: theme.colors.textSecondary,
  },
  languageTextActive: {
    color: theme.colors.primary,
    fontWeight: theme.typography.bold,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xxl,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xxl,
    ...theme.shadows.lg,
  },
  title: {
    fontSize: theme.typography.h2,
    fontWeight: theme.typography.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: theme.spacing.lg,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  skipButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
  getStartedButton: {
    flex: 1,
  },
});
