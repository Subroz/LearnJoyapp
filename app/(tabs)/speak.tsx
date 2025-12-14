import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { speechService } from '@/services/speech';
import { triggerHaptic } from '@/utils/haptics';
import ScreenBackground from '@/components/ui/ScreenBackground';

interface PracticeWord {
  id: string;
  text: string;
  emoji: string;
  category: string;
}

export default function SpeakScreen() {
  const { t, language } = useLanguage();
  const router = useRouter();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('animals');
  const [isListening, setIsListening] = useState(false);
  const [currentWord, setCurrentWord] = useState<PracticeWord | null>(null);
  const [pulseAnim] = useState(new Animated.Value(1));

  // Practice words database
  const practiceWords: { [key: string]: PracticeWord[] } = {
    animals: [
      { id: '1', text: language === 'bangla' ? 'বিড়াল' : 'cat', emoji: '🐱', category: 'animals' },
      { id: '2', text: language === 'bangla' ? 'কুকুর' : 'dog', emoji: '🐶', category: 'animals' },
      { id: '3', text: language === 'bangla' ? 'হাতি' : 'elephant', emoji: '🐘', category: 'animals' },
      { id: '4', text: language === 'bangla' ? 'সিংহ' : 'lion', emoji: '🦁', category: 'animals' },
    ],
    numbers: [
      { id: '5', text: language === 'bangla' ? 'এক' : 'one', emoji: '1️⃣', category: 'numbers' },
      { id: '6', text: language === 'bangla' ? 'দুই' : 'two', emoji: '2️⃣', category: 'numbers' },
      { id: '7', text: language === 'bangla' ? 'তিন' : 'three', emoji: '3️⃣', category: 'numbers' },
      { id: '8', text: language === 'bangla' ? 'চার' : 'four', emoji: '4️⃣', category: 'numbers' },
    ],
    colors: [
      { id: '9', text: language === 'bangla' ? 'লাল' : 'red', emoji: '🔴', category: 'colors' },
      { id: '10', text: language === 'bangla' ? 'নীল' : 'blue', emoji: '🔵', category: 'colors' },
      { id: '11', text: language === 'bangla' ? 'সবুজ' : 'green', emoji: '🟢', category: 'colors' },
      { id: '12', text: language === 'bangla' ? 'হলুদ' : 'yellow', emoji: '🟡', category: 'colors' },
    ],
    objects: [
      { id: '13', text: language === 'bangla' ? 'বল' : 'ball', emoji: '⚽', category: 'objects' },
      { id: '14', text: language === 'bangla' ? 'বই' : 'book', emoji: '📚', category: 'objects' },
      { id: '15', text: language === 'bangla' ? 'গাড়ি' : 'car', emoji: '🚗', category: 'objects' },
      { id: '16', text: language === 'bangla' ? 'ফুল' : 'flower', emoji: '🌸', category: 'objects' },
    ],
  };

  const categories = [
    { id: 'animals', name: 'Animals', icon: 'paw', color: theme.colors.success },
    { id: 'numbers', name: 'Numbers', icon: 'calculator', color: theme.colors.secondary },
    { id: 'colors', name: 'Colors', icon: 'color-palette', color: theme.colors.warning },
    { id: 'objects', name: 'Objects', icon: 'cube', color: theme.colors.accent },
  ];

  const animatePulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulse = () => {
    pulseAnim.setValue(1);
  };

  const handleWordSelect = async (word: PracticeWord) => {
    setCurrentWord(word);
    triggerHaptic('selection');
    
    // Play the word pronunciation
    await speechService.speakWord(word.text, language);
  };

  const handleListen = async () => {
    if (!currentWord) {
      Alert.alert(
        'Select a Word',
        'Please select a word to practice first!',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsListening(true);
    animatePulse();
    triggerHaptic('medium');

    // Simulate speech recognition (placeholder)
    setTimeout(() => {
      setIsListening(false);
      stopPulse();
      triggerHaptic('success');
      
      Alert.alert(
        'Speech Recognition',
        'Speech-to-text feature is coming soon! This will let you practice pronunciation and get feedback.',
        [{ text: 'Got it!' }]
      );
    }, 2000);
  };

  const handlePlayAgain = async () => {
    if (!currentWord) return;
    
    triggerHaptic('light');
    await speechService.speakWord(currentWord.text, language);
  };

  return (
    <ScreenBackground section="voice">
      <SafeAreaView style={styles.container}>
      <View style={styles.headerGradient}>
        <Header
          title={t('voice.title')}
          subtitle="Practice pronunciation"
          variant="transparent"
          showBackButton
          onBackPress={() => router.back()}
          titleStyle={styles.headerTitle}
          subtitleStyle={styles.headerSubtitle}
        />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>🎤 How to Practice</Text>
          <Text style={styles.instructionsText}>
            1. Choose a category below{'\n'}
            2. Tap on a word to hear its pronunciation{'\n'}
            3. Try saying it yourself!{'\n'}
            4. Tap "Listen to Me" to record (coming soon)
          </Text>
        </View>

        {/* Category Selection */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Choose Category</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === cat.id && styles.selectedCategory,
                  { borderColor: cat.color },
                ]}
                onPress={() => {
                  setSelectedCategory(cat.id);
                  setCurrentWord(null);
                  triggerHaptic('selection');
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>
                  <Ionicons name={cat.icon as any} size={24} color={theme.colors.white} />
                </View>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Words Grid */}
        <View style={styles.wordsContainer}>
          <Text style={styles.sectionTitle}>Practice Words</Text>
          <View style={styles.wordsGrid}>
            {practiceWords[selectedCategory].map((word) => (
              <TouchableOpacity
                key={word.id}
                style={[
                  styles.wordCard,
                  currentWord?.id === word.id && styles.selectedWord,
                ]}
                onPress={() => handleWordSelect(word)}
                activeOpacity={0.7}
              >
                <Text style={styles.wordEmoji}>{word.emoji}</Text>
                <Text style={styles.wordText}>{word.text}</Text>
                {currentWord?.id === word.id && (
                  <View style={styles.playingIndicator}>
                    <Ionicons name="musical-notes" size={16} color={theme.colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Current Word Display */}
        {currentWord && (
          <Card variant="gradient" gradientColors={[theme.colors.primary, theme.colors.primaryLight]} padding="large" style={styles.currentWordCard}>
            <Text style={styles.currentWordLabel}>Practicing:</Text>
            <View style={styles.currentWordContent}>
              <Text style={styles.currentWordEmoji}>{currentWord.emoji}</Text>
              <Text style={styles.currentWordText}>{currentWord.text}</Text>
            </View>
            <Button
              title="Play Again"
              onPress={handlePlayAgain}
              variant="secondary"
              size="medium"
              icon={<Ionicons name="volume-high" size={20} color={theme.colors.white} />}
              style={styles.playAgainButton}
            />
          </Card>
        )}

        {/* Microphone Button */}
        <View style={styles.microphoneContainer}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[
                styles.micButton,
                isListening && styles.micButtonActive,
              ]}
              onPress={handleListen}
              activeOpacity={0.8}
              disabled={!currentWord}
            >
              <Ionicons
                name={isListening ? 'mic' : 'mic-outline'}
                size={48}
                color={theme.colors.white}
              />
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.micLabel}>
            {isListening ? 'Listening...' : currentWord ? 'Tap to Practice' : 'Select a word first'}
          </Text>
        </View>

        {/* Feature Notice */}
        <View style={styles.featureNotice}>
          <Ionicons name="information-circle" size={20} color={theme.colors.secondary} />
          <Text style={styles.featureNoticeText}>
            Speech recognition coming soon! For now, practice by listening and repeating.
          </Text>
        </View>
      </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerGradient: {
    paddingTop: 20,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    color: theme.colors.white,
    fontSize: theme.typography.h3,
  },
  headerSubtitle: {
    color: theme.colors.white,
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  instructionsContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  instructionsTitle: {
    fontSize: theme.typography.body,
    fontWeight: theme.typography.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  instructionsText: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  categoriesContainer: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.h6,
    fontWeight: theme.typography.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...theme.shadows.sm,
  },
  selectedCategory: {
    borderWidth: 2,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  categoryName: {
    fontSize: theme.typography.body,
    fontWeight: theme.typography.medium,
    color: theme.colors.textPrimary,
  },
  wordsContainer: {
    marginBottom: theme.spacing.lg,
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  wordCard: {
    width: '47%',
    aspectRatio: 1.2,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...theme.shadows.sm,
  },
  selectedWord: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight + '20',
  },
  wordEmoji: {
    fontSize: 40,
    marginBottom: theme.spacing.sm,
  },
  wordText: {
    fontSize: theme.typography.h6,
    fontWeight: theme.typography.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  playingIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  currentWordCard: {
    marginBottom: theme.spacing.lg,
  },
  currentWordLabel: {
    fontSize: theme.typography.caption,
    color: theme.colors.white,
    opacity: 0.9,
    marginBottom: theme.spacing.sm,
  },
  currentWordContent: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  currentWordEmoji: {
    fontSize: 60,
    marginBottom: theme.spacing.sm,
  },
  currentWordText: {
    fontSize: theme.typography.h3,
    fontWeight: theme.typography.bold,
    color: theme.colors.white,
  },
  playAgainButton: {
    width: '100%',
  },
  microphoneContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.lg,
  },
  micButtonActive: {
    backgroundColor: theme.colors.error,
  },
  micLabel: {
    fontSize: theme.typography.body,
    fontWeight: theme.typography.medium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  featureNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary + '20',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  featureNoticeText: {
    flex: 1,
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});
