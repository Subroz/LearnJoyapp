import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { MathProblem as MathProblemType } from '@/types';
import { theme } from '@/constants/theme';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CountableObjects } from './CountableObjects';
import { Ionicons } from '@expo/vector-icons';
import { triggerHaptic } from '@/utils/haptics';
import { SuccessIcon, ErrorIcon } from '@/components/ui/AnimatedIcon';

interface MathProblemProps {
  problem: MathProblemType;
  onCorrect: () => void;
  onIncorrect: () => void;
  showVisuals?: boolean;
  multipleChoice?: boolean;
}

export const MathProblem: React.FC<MathProblemProps> = ({
  problem,
  onCorrect,
  onIncorrect,
  showVisuals = true,
  multipleChoice = true,
}) => {
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [options, setOptions] = useState<number[]>([]);
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (multipleChoice) {
      generateOptions();
    }
  }, [problem]);

  const generateOptions = () => {
    const opts = new Set<number>();
    opts.add(problem.answer);

    while (opts.size < 4) {
      const offset = Math.floor(Math.random() * 10) + 1;
      const wrongAnswer = problem.answer + (Math.random() < 0.5 ? offset : -offset);
      if (wrongAnswer > 0 && wrongAnswer !== problem.answer) {
        opts.add(wrongAnswer);
      }
    }

    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
  };

  const handleAnswerSelect = (answer: number) => {
    setUserAnswer(answer);
    const correct = answer === problem.answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      triggerHaptic('success');
      animateSuccess();
      setTimeout(() => {
        onCorrect();
        resetProblem();
      }, 1500);
    } else {
      triggerHaptic('error');
      animateError();
      setTimeout(() => {
        onIncorrect();
        resetProblem();
      }, 1500);
    }
  };

  const animateSuccess = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateError = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const resetProblem = () => {
    setTimeout(() => {
      setUserAnswer(null);
      setShowFeedback(false);
      setIsCorrect(false);
    }, 500);
  };

  const getOperationSymbol = () => {
    switch (problem.type) {
      case 'addition':
        return '+';
      case 'subtraction':
        return '-';
      case 'multiplication':
        return '×';
      case 'division':
        return '÷';
    }
  };

  const getOperationColor = () => {
    switch (problem.type) {
      case 'addition':
        return theme.colors.success;
      case 'subtraction':
        return theme.colors.error;
      case 'multiplication':
        return theme.colors.secondary;
      case 'division':
        return theme.colors.accent;
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Card variant="elevated" padding="large" borderRadius="large" style={styles.container}>
        {/* Problem Display */}
        <View style={styles.problemHeader}>
          <View style={[styles.operationBadge, { backgroundColor: getOperationColor() }]}>
            <Text style={styles.operationText}>{getOperationSymbol()}</Text>
          </View>
          <Text style={styles.problemText}>{problem.question}</Text>
        </View>

        {/* Visual Objects */}
        {showVisuals && problem.visualObjects && problem.visualObjects.length > 0 && (
          <View style={styles.visualsContainer}>
            <CountableObjects visualObjects={problem.visualObjects} size={35} spacing={6} />
          </View>
        )}

        {/* Feedback */}
        {showFeedback && (
          <View style={styles.feedbackContainer}>
            {isCorrect ? (
              <View style={styles.feedback}>
                <SuccessIcon size={48} animation="bounce" />
                <Text style={[styles.feedbackText, styles.correctText]}>
                  Correct! Great job! 🎉
                </Text>
              </View>
            ) : (
              <View style={styles.feedback}>
                <ErrorIcon size={48} animation="shake" />
                <Text style={[styles.feedbackText, styles.incorrectText]}>
                  Try again! The answer is {problem.answer}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Answer Options */}
        {!showFeedback && multipleChoice && (
          <View style={styles.optionsContainer}>
            <Text style={styles.promptText}>Select your answer:</Text>
            <View style={styles.optionsGrid}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    userAnswer === option && styles.selectedOption,
                  ]}
                  onPress={() => handleAnswerSelect(option)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  problemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  operationBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  operationText: {
    fontSize: theme.typography.h4,
    fontWeight: theme.typography.bold,
    color: theme.colors.white,
  },
  problemText: {
    fontSize: theme.typography.h3,
    fontWeight: theme.typography.bold,
    color: theme.colors.textPrimary,
  },
  visualsContainer: {
    marginVertical: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  promptText: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: theme.spacing.lg,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  optionButton: {
    width: 70,
    height: 70,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  selectedOption: {
    backgroundColor: theme.colors.accent,
  },
  optionText: {
    fontSize: theme.typography.h4,
    fontWeight: theme.typography.bold,
    color: theme.colors.white,
  },
  feedbackContainer: {
    marginTop: theme.spacing.lg,
  },
  feedback: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
  },
  feedbackText: {
    fontSize: theme.typography.h6,
    fontWeight: theme.typography.bold,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  correctText: {
    color: theme.colors.success,
  },
  incorrectText: {
    color: theme.colors.error,
  },
});

export default MathProblem;

