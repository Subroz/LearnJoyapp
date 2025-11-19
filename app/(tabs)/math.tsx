import React, { useState, useEffect } from 'react';
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
import { theme } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { MathProblem } from '@/components/math/MathProblem';
import { generateMathProblem, MathOperation, Difficulty } from '@/utils/mathGenerator';
import { MathProblem as MathProblemType } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { TrophyIcon } from '@/components/ui/AnimatedIcon';

export default function MathScreen() {
  const { t, language } = useLanguage();
  
  // State
  const [selectedOperation, setSelectedOperation] = useState<MathOperation>('addition');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentProblem, setCurrentProblem] = useState<MathProblemType | null>(null);
  const [score, setScore] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);
  const [showSettings, setShowSettings] = useState(true);
  const [celebrationAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (!showSettings && !currentProblem) {
      generateNewProblem();
    }
  }, [showSettings, selectedOperation, difficulty]);

  const generateNewProblem = () => {
    const problem = generateMathProblem(selectedOperation, difficulty);
    setCurrentProblem(problem);
  };

  const handleCorrectAnswer = () => {
    setScore(score + 1);
    setTotalProblems(totalProblems + 1);
    animateCelebration();
    setTimeout(() => {
      generateNewProblem();
    }, 1600);
  };

  const handleIncorrectAnswer = () => {
    setTotalProblems(totalProblems + 1);
    setTimeout(() => {
      generateNewProblem();
    }, 1600);
  };

  const animateCelebration = () => {
    celebrationAnim.setValue(0);
    Animated.spring(celebrationAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      celebrationAnim.setValue(0);
    });
  };

  const startPractice = () => {
    setShowSettings(false);
    setScore(0);
    setTotalProblems(0);
    generateNewProblem();
  };

  const resetToSettings = () => {
    setShowSettings(true);
    setCurrentProblem(null);
    setScore(0);
    setTotalProblems(0);
  };

  const operations: { type: MathOperation; label: string; icon: string; color: string }[] = [
    { type: 'addition', label: t('math.addition'), icon: 'add-circle', color: theme.colors.success },
    { type: 'subtraction', label: t('math.subtraction'), icon: 'remove-circle', color: theme.colors.error },
    { type: 'multiplication', label: t('math.multiplication'), icon: 'close-circle', color: theme.colors.secondary },
    { type: 'division', label: t('math.division'), icon: 'duplicate', color: theme.colors.accent },
  ];

  const difficulties: { level: Difficulty; label: string; description: string }[] = [
    { level: 'easy', label: t('math.easy'), description: 'Numbers 1-10' },
    { level: 'medium', label: t('math.medium'), description: 'Numbers 1-20' },
    { level: 'hard', label: t('math.hard'), description: 'Numbers 1-50' },
  ];

  const renderSettings = () => (
    <ScrollView 
      style={styles.content} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Operation Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('math.title')} Operations</Text>
        <View style={styles.operationsGrid}>
          {operations.map((op) => (
            <TouchableOpacity
              key={op.type}
              style={[
                styles.operationCard,
                selectedOperation === op.type && styles.selectedCard,
              ]}
              onPress={() => setSelectedOperation(op.type)}
              activeOpacity={0.7}
            >
              <View style={[styles.operationIcon, { backgroundColor: op.color }]}>
                <Ionicons name={op.icon as any} size={32} color={theme.colors.white} />
              </View>
              <Text style={styles.operationLabel}>{op.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Difficulty Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Difficulty Level</Text>
        <View style={styles.difficultyContainer}>
          {difficulties.map((diff) => (
            <TouchableOpacity
              key={diff.level}
              style={[
                styles.difficultyButton,
                difficulty === diff.level && styles.selectedDifficulty,
              ]}
              onPress={() => setDifficulty(diff.level)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.difficultyLabel,
                  difficulty === diff.level && styles.selectedDifficultyText,
                ]}
              >
                {diff.label}
              </Text>
              <Text
                style={[
                  styles.difficultyDescription,
                  difficulty === diff.level && styles.selectedDifficultyText,
                ]}
              >
                {diff.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Start Button */}
      <Button
        title="Start Practice"
        onPress={startPractice}
        variant="primary"
        size="large"
        icon={<Ionicons name="play" size={24} color={theme.colors.white} />}
        style={styles.startButton}
      />
    </ScrollView>
  );

  const renderPractice = () => (
    <View style={styles.practiceContainer}>
      {/* Score Header */}
      <Card variant="gradient" gradientColors={[theme.colors.secondary, theme.colors.secondaryLight]} padding="medium" style={styles.scoreCard}>
        <View style={styles.scoreContent}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>{score} / {totalProblems}</Text>
          </View>
          <View style={styles.scoreDivider} />
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Accuracy</Text>
            <Text style={styles.scoreValue}>
              {totalProblems > 0 ? Math.round((score / totalProblems) * 100) : 0}%
            </Text>
          </View>
          <TouchableOpacity onPress={resetToSettings} style={styles.settingsIcon}>
            <Ionicons name="settings" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      </Card>

      {/* Celebration Animation */}
      <Animated.View
        style={[
          styles.celebrationContainer,
          {
            opacity: celebrationAnim,
            transform: [
              {
                scale: celebrationAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
          },
        ]}
      >
        <TrophyIcon size={60} animation="bounce" />
      </Animated.View>

      {/* Current Problem */}
      <ScrollView 
        style={styles.problemScroll}
        contentContainerStyle={styles.problemScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentProblem && (
          <MathProblem
            problem={currentProblem}
            onCorrect={handleCorrectAnswer}
            onIncorrect={handleIncorrectAnswer}
            showVisuals={true}
            multipleChoice={true}
          />
        )}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.secondary, theme.colors.secondaryLight]}
        style={styles.headerGradient}
      >
        <Header
          title={t('math.title')}
          subtitle={showSettings ? 'Choose your challenge' : `${selectedOperation} • ${difficulty}`}
          variant="transparent"
          titleStyle={styles.headerTitle}
          subtitleStyle={styles.headerSubtitle}
        />
      </LinearGradient>

      {showSettings ? renderSettings() : renderPractice()}
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
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  section: {
    marginTop: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.h5,
    fontWeight: theme.typography.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  operationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  operationCard: {
    width: '47%',
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...theme.shadows.sm,
  },
  selectedCard: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight + '20',
  },
  operationIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  operationLabel: {
    fontSize: theme.typography.body,
    fontWeight: theme.typography.medium,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  difficultyContainer: {
    gap: theme.spacing.md,
  },
  difficultyButton: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    ...theme.shadows.sm,
  },
  selectedDifficulty: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.accentLight + '20',
  },
  difficultyLabel: {
    fontSize: theme.typography.h6,
    fontWeight: theme.typography.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  difficultyDescription: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  selectedDifficultyText: {
    color: theme.colors.accent,
  },
  startButton: {
    marginTop: theme.spacing.xl,
  },
  practiceContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  scoreCard: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  scoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: theme.typography.caption,
    color: theme.colors.white,
    opacity: 0.9,
    marginBottom: theme.spacing.xs,
  },
  scoreValue: {
    fontSize: theme.typography.h4,
    fontWeight: theme.typography.bold,
    color: theme.colors.white,
  },
  scoreDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.white,
    opacity: 0.3,
  },
  settingsIcon: {
    position: 'absolute',
    right: theme.spacing.md,
    top: '50%',
    marginTop: -12,
  },
  celebrationContainer: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    zIndex: 1000,
  },
  problemScroll: {
    flex: 1,
  },
  problemScrollContent: {
    paddingBottom: theme.spacing.xl,
  },
});
