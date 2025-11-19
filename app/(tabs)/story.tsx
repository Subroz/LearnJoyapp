import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Button';
import { WordSelector } from '@/components/story/WordSelector';
import { StoryViewer } from '@/components/story/StoryViewer';
import { geminiService, StoryResponse } from '@/services/gemini';
import wordBank from '@/data/wordBank.json';
import { Ionicons } from '@expo/vector-icons';
import { triggerHaptic } from '@/utils/haptics';

export default function StoryScreen() {
  const { t, language } = useLanguage();
  
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [generatedStory, setGeneratedStory] = useState<StoryResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showStory, setShowStory] = useState(false);

  const categories = wordBank[language];

  const handleWordToggle = (word: string) => {
    setSelectedWords((prev) => {
      if (prev.includes(word)) {
        return prev.filter((w) => w !== word);
      } else {
        return [...prev, word];
      }
    });
  };

  const handleGenerateStory = async () => {
    if (selectedWords.length < 3) {
      Alert.alert(
        'Not Enough Words',
        'Please select at least 3 words to create a story!',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsGenerating(true);
    triggerHaptic('medium');

    try {
      const story = await geminiService.generateStory({
        words: selectedWords,
        language,
        childAge: 6,
        storyLength: 'medium',
        theme: 'fun',
      });

      setGeneratedStory(story);
      setShowStory(true);
      setIsGenerating(false);
      triggerHaptic('success');
    } catch (error) {
      console.error('Error generating story:', error);
      setIsGenerating(false);
      triggerHaptic('error');
      Alert.alert(
        'Story Generation Failed',
        'Oops! We couldn\'t create a story right now. Please try again!',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCloseStory = () => {
    setShowStory(false);
    setGeneratedStory(null);
  };

  const handleSaveStory = () => {
    triggerHaptic('success');
    Alert.alert(
      'Story Saved!',
      'Your story has been saved to favorites.',
      [{ text: 'Great!' }]
    );
    // TODO: Implement actual save to Supabase
  };

  const handleReset = () => {
    setSelectedWords([]);
    setGeneratedStory(null);
    setShowStory(false);
  };

  if (showStory && generatedStory) {
    return (
      <SafeAreaView style={styles.container}>
        <StoryViewer
          title={generatedStory.title}
          content={generatedStory.content}
          moral={generatedStory.moral}
          vocabulary={generatedStory.vocabulary}
          questions={generatedStory.questions}
          language={language}
          onClose={handleCloseStory}
          onSave={handleSaveStory}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryLight]}
        style={styles.headerGradient}
      >
        <Header
          title={t('story.title')}
          subtitle="Create magical stories with words"
          variant="transparent"
          titleStyle={styles.headerTitle}
          subtitleStyle={styles.headerSubtitle}
        />
      </LinearGradient>

      <View style={styles.content}>
        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>📚 How to Create a Story</Text>
          <Text style={styles.instructionsText}>
            1. Select 3-5 words from the categories below{'\n'}
            2. Tap "Generate Story" to create a magical tale{'\n'}
            3. Listen to your story and save your favorites!
          </Text>
        </View>

        {/* Word Selector */}
        <View style={styles.selectorContainer}>
          <WordSelector
            categories={categories}
            selectedWords={selectedWords}
            onWordToggle={handleWordToggle}
            maxWords={5}
            language={language}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {selectedWords.length > 0 && (
            <Button
              title="Reset Selection"
              onPress={handleReset}
              variant="outline"
              size="medium"
              icon={<Ionicons name="refresh" size={20} color={theme.colors.error} />}
              style={styles.resetButton}
            />
          )}

          <Button
            title={isGenerating ? 'Creating Story...' : t('story.generate')}
            onPress={handleGenerateStory}
            variant="primary"
            size="large"
            icon={
              isGenerating ? (
                <ActivityIndicator size="small" color={theme.colors.white} />
              ) : (
                <Ionicons name="sparkles" size={24} color={theme.colors.white} />
              )
            }
            disabled={selectedWords.length < 3 || isGenerating}
            loading={isGenerating}
            style={styles.generateButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerGradient: {
    paddingTop: 20,
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
    paddingHorizontal: theme.spacing.lg,
  },
  instructionsContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
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
  selectorContainer: {
    flex: 1,
    marginBottom: theme.spacing.md,
  },
  actionsContainer: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
  resetButton: {
    width: '100%',
  },
  generateButton: {
    width: '100%',
  },
});
