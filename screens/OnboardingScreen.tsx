import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import Button from '@/components/ui/Button';
import { AnimatedIcon, StarIcon, HeartIcon, TrophyIcon } from '@/components/ui/AnimatedIcon';
import { triggerHaptic } from '@/utils/haptics';

const { width } = Dimensions.get('window');

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradientColors: readonly [string, string, ...string[]];
}

export default function OnboardingScreen() {
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to AI Children Learning!',
      description: 'Learn Bangla and English alphabets, math, and create amazing stories with AI.',
      icon: <StarIcon size={64} animation="bounce" />,
        gradientColors: [theme.colors.primary, theme.colors.primaryLight] as const,
    },
    {
      id: 'language',
      title: 'Choose Your Language',
      description: 'Select your preferred language for learning. You can change this anytime in settings.',
  icon: <HeartIcon size={64} animation="pulse" />,
  gradientColors: [theme.colors.secondary, theme.colors.secondaryLight] as const,
    },
    {
      id: 'features',
      title: 'Amazing Features',
      description: 'Interactive learning with AI voice, handwriting recognition, and personalized stories.',
  icon: <TrophyIcon size={64} animation="wiggle" />,
  gradientColors: [theme.colors.accent, theme.colors.accentLight] as const,
    },
  ];

  const handleNext = () => {
    triggerHaptic('buttonPress');
    
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      router.replace('/(tabs)');
    }
  };

  const handlePrevious = () => {
    triggerHaptic('buttonPress');
    
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    triggerHaptic('buttonPress');
    router.replace('/(tabs)');
  };

  const handleLanguageSelect = (selectedLanguage: 'bangla' | 'english') => {
    triggerHaptic('selection');
    setLanguage(selectedLanguage);
  };

  const renderLanguageSelection = () => (
    <View style={styles.languageSelection}>
      <Text style={styles.languageTitle}>Choose Your Language</Text>
      <View style={styles.languageButtons}>
        <Button
          title="বাংলা (Bangla)"
          onPress={() => handleLanguageSelect('bangla')}
          variant={language === 'bangla' ? 'primary' : 'outline'}
          size="large"
          style={styles.languageButton}
        />
        <Button
          title="English"
          onPress={() => handleLanguageSelect('english')}
          variant={language === 'english' ? 'primary' : 'outline'}
          size="large"
          style={styles.languageButton}
        />
      </View>
    </View>
  );

  const currentStepData = onboardingSteps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={currentStepData.gradientColors}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.stepIndicator}>
              {currentStep + 1} of {onboardingSteps.length}
            </Text>
            {currentStep < onboardingSteps.length - 1 && (
              <Button
                title="Skip"
                onPress={handleSkip}
                variant="ghost"
                size="small"
                textStyle={styles.skipButtonText}
              />
            )}
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              {currentStep === 1 ? renderLanguageSelection() : currentStepData.icon}
            </View>

            <Text style={styles.title}>{currentStepData.title}</Text>
            <Text style={styles.description}>{currentStepData.description}</Text>
          </View>

          {/* Features List (for features step) */}
          {currentStep === 2 && (
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="volume-high" size={20} color={theme.colors.white} />
                <Text style={styles.featureText}>AI Voice Pronunciation</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="create" size={20} color={theme.colors.white} />
                <Text style={styles.featureText}>Handwriting Recognition</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="library" size={20} color={theme.colors.white} />
                <Text style={styles.featureText}>AI Story Generation</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="trophy" size={20} color={theme.colors.white} />
                <Text style={styles.featureText}>Progress Tracking</Text>
              </View>
            </View>
          )}

          {/* Navigation */}
          <View style={styles.navigation}>
            {currentStep > 0 && (
              <Button
                title="Previous"
                onPress={handlePrevious}
                variant="outline"
                style={styles.navButton}
                textStyle={styles.navButtonText}
              />
            )}
            
            <Button
              title={currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
              onPress={handleNext}
              variant="primary"
              style={[styles.navButton, styles.primaryButton]}
              textStyle={styles.primaryButtonText}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  stepIndicator: {
    fontSize: theme.typography.body,
    color: theme.colors.white,
    fontWeight: theme.typography.medium,
  },
  skipButtonText: {
    color: theme.colors.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  iconContainer: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.h3,
    fontWeight: theme.typography.bold,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  description: {
    fontSize: theme.typography.body,
    color: theme.colors.white,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  languageSelection: {
    alignItems: 'center',
    width: '100%',
  },
  languageTitle: {
    fontSize: theme.typography.h5,
    fontWeight: theme.typography.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  languageButtons: {
    width: '100%',
    gap: theme.spacing.md,
  },
  languageButton: {
    width: '100%',
  },
  featuresList: {
    width: '100%',
    marginTop: theme.spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  featureText: {
    fontSize: theme.typography.body,
    color: theme.colors.white,
    marginLeft: theme.spacing.md,
    fontWeight: theme.typography.medium,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  navButton: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: theme.colors.white,
  },
  navButtonText: {
    color: theme.colors.white,
  },
  primaryButtonText: {
    color: theme.colors.primary,
  },
});
