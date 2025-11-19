import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { speechService } from '@/services/speech';
import { triggerHaptic } from '@/utils/haptics';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface StoryViewerProps {
  title: string;
  content: string;
  moral?: string;
  vocabulary?: string[];
  questions?: string[];
  language: 'bangla' | 'english';
  onClose: () => void;
  onSave?: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  title,
  content,
  moral,
  vocabulary,
  questions,
  language,
  onClose,
  onSave,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePlayStory = async () => {
    if (isPlaying) {
      await speechService.stop();
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);
      triggerHaptic('success');
      
      // Speak the title
      await speechService.speak(title, { language, rate: 0.8 });
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Speak the story
      await speechService.speakStory(content, language);
      
      // Speak the moral if available
      if (moral) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await speechService.speak(moral, { language, rate: 0.7 });
      }
      
      setIsPlaying(false);
    } catch (error) {
      console.error('Error playing story:', error);
      setIsPlaying(false);
    }
  };

  const handleSave = () => {
    triggerHaptic('success');
    onSave?.();
  };

  const splitIntoSentences = (text: string): string[] => {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  };

  const sentences = splitIntoSentences(content);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Card variant="gradient" gradientColors={[theme.colors.primary, theme.colors.primaryLight]} padding="large" style={styles.titleCard}>
          <Text style={styles.title}>{title}</Text>
        </Card>

        {/* Story Content */}
        <Card variant="elevated" padding="large" borderRadius="large" style={styles.contentCard}>
          {sentences.map((sentence, index) => (
            <View key={index} style={styles.sentenceContainer}>
              <Text style={styles.storyText}>
                {sentence.trim()}.
              </Text>
            </View>
          ))}
        </Card>

        {/* Moral */}
        {moral && (
          <Card variant="outlined" padding="medium" borderRadius="large" style={styles.moralCard}>
            <View style={styles.moralHeader}>
              <Ionicons name="bulb" size={24} color={theme.colors.warning} />
              <Text style={styles.moralTitle}>Moral of the Story</Text>
            </View>
            <Text style={styles.moralText}>{moral}</Text>
          </Card>
        )}

        {/* Vocabulary */}
        {vocabulary && vocabulary.length > 0 && (
          <Card variant="outlined" padding="medium" borderRadius="large" style={styles.vocabularyCard}>
            <View style={styles.vocabularyHeader}>
              <Ionicons name="book" size={24} color={theme.colors.secondary} />
              <Text style={styles.vocabularyTitle}>New Words</Text>
            </View>
            <View style={styles.vocabularyList}>
              {vocabulary.map((word, index) => (
                <View key={index} style={styles.vocabularyItem}>
                  <Text style={styles.vocabularyBullet}>•</Text>
                  <Text style={styles.vocabularyWord}>{word}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Questions */}
        {questions && questions.length > 0 && (
          <Card variant="outlined" padding="medium" borderRadius="large" style={styles.questionsCard}>
            <View style={styles.questionsHeader}>
              <Ionicons name="help-circle" size={24} color={theme.colors.accent} />
              <Text style={styles.questionsTitle}>Think About It</Text>
            </View>
            <View style={styles.questionsList}>
              {questions.map((question, index) => (
                <View key={index} style={styles.questionItem}>
                  <Text style={styles.questionNumber}>{index + 1}.</Text>
                  <Text style={styles.questionText}>{question}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title={isPlaying ? 'Stop' : 'Play Story'}
            onPress={handlePlayStory}
            variant="primary"
            size="large"
            icon={
              <Ionicons
                name={isPlaying ? 'stop' : 'play'}
                size={24}
                color={theme.colors.white}
              />
            }
            style={styles.playButton}
          />

          {onSave && (
            <Button
              title="Save Story"
              onPress={handleSave}
              variant="secondary"
              size="large"
              icon={<Ionicons name="heart" size={24} color={theme.colors.white} />}
              style={styles.saveButton}
            />
          )}
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing.md,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCard: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.h3,
    fontWeight: theme.typography.bold,
    color: theme.colors.white,
    textAlign: 'center',
  },
  contentCard: {
    marginBottom: theme.spacing.lg,
  },
  sentenceContainer: {
    marginBottom: theme.spacing.md,
  },
  storyText: {
    fontSize: theme.typography.h6,
    lineHeight: 28,
    color: theme.colors.textPrimary,
    textAlign: 'justify',
  },
  moralCard: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.warning + '10',
  },
  moralHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  moralTitle: {
    fontSize: theme.typography.h6,
    fontWeight: theme.typography.bold,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.sm,
  },
  moralText: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  vocabularyCard: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.secondary + '10',
  },
  vocabularyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  vocabularyTitle: {
    fontSize: theme.typography.h6,
    fontWeight: theme.typography.bold,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.sm,
  },
  vocabularyList: {
    gap: theme.spacing.xs,
  },
  vocabularyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  vocabularyBullet: {
    fontSize: theme.typography.body,
    color: theme.colors.secondary,
    marginRight: theme.spacing.sm,
    fontWeight: theme.typography.bold,
  },
  vocabularyWord: {
    fontSize: theme.typography.body,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  questionsCard: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.accent + '10',
  },
  questionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  questionsTitle: {
    fontSize: theme.typography.h6,
    fontWeight: theme.typography.bold,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.sm,
  },
  questionsList: {
    gap: theme.spacing.md,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  questionNumber: {
    fontSize: theme.typography.body,
    color: theme.colors.accent,
    marginRight: theme.spacing.sm,
    fontWeight: theme.typography.bold,
  },
  questionText: {
    fontSize: theme.typography.body,
    color: theme.colors.textPrimary,
    flex: 1,
    lineHeight: 22,
  },
  actionsContainer: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  playButton: {
    width: '100%',
  },
  saveButton: {
    width: '100%',
  },
});

export default StoryViewer;

