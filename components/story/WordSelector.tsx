import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { triggerHaptic } from '@/utils/haptics';

interface Word {
  id: string;
  word: string;
  emoji: string;
  pronunciation?: string;
}

interface WordSelectorProps {
  categories: {
    [key: string]: Word[];
  };
  selectedWords: string[];
  onWordToggle: (word: string) => void;
  maxWords?: number;
  language: 'bangla' | 'english';
}

export const WordSelector: React.FC<WordSelectorProps> = ({
  categories,
  selectedWords,
  onWordToggle,
  maxWords = 5,
  language,
}) => {
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>(
    Object.keys(categories)[0]
  );

  const isWordSelected = (word: string) => selectedWords.includes(word);

  const handleWordPress = (word: string) => {
    const isSelected = isWordSelected(word);
    
    if (!isSelected && selectedWords.length >= maxWords) {
      // Max words reached
      return;
    }
    
    triggerHaptic(isSelected ? 'light' : 'selection');
    onWordToggle(word);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
    const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      animals: 'paw',
      objects: 'cube',
      actions: 'fitness',
      places: 'location',
      feelings: 'heart',
    };
    return iconMap[category] || 'star';
  };

  const getCategoryColor = (category: string): string => {
    const colorMap: { [key: string]: string } = {
      animals: theme.colors.success,
      objects: theme.colors.secondary,
      actions: theme.colors.accent,
      places: theme.colors.primary,
      feelings: theme.colors.warning,
    };
    return colorMap[category] || theme.colors.primary;
  };

  const formatCategoryName = (category: string): string => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <View style={styles.container}>
      {/* Selected Words Counter */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Selected Words: {selectedWords.length} / {maxWords}
        </Text>
        {selectedWords.length > 0 && (
          <View style={styles.selectedWordsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {selectedWords.map((word) => (
                <View key={word} style={styles.selectedWordChip}>
                  <Text style={styles.selectedWordText}>{word}</Text>
                  <TouchableOpacity
                    onPress={() => handleWordPress(word)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close-circle" size={18} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Categories */}
      <ScrollView style={styles.categoriesScroll} showsVerticalScrollIndicator={false}>
        {Object.entries(categories).map(([category, words]) => (
          <View key={category} style={styles.categoryContainer}>
            {/* Category Header */}
            <TouchableOpacity
              style={[
                styles.categoryHeader,
                { backgroundColor: getCategoryColor(category) + '20' },
              ]}
              onPress={() => toggleCategory(category)}
              activeOpacity={0.7}
            >
              <View style={styles.categoryTitleRow}>
                <View
                  style={[
                    styles.categoryIconContainer,
                    { backgroundColor: getCategoryColor(category) },
                  ]}
                >
                  <Ionicons
                    name={getCategoryIcon(category)}
                    size={20}
                    color={theme.colors.white}
                  />
                </View>
                <Text style={styles.categoryTitle}>{formatCategoryName(category)}</Text>
              </View>
              <Ionicons
                name={expandedCategory === category ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>

            {/* Category Words */}
            {expandedCategory === category && (
              <View style={styles.wordsGrid}>
                {words.map((item) => {
                  const selected = isWordSelected(item.word);
                  const disabled = !selected && selectedWords.length >= maxWords;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.wordCard,
                        selected && styles.wordCardSelected,
                        disabled && styles.wordCardDisabled,
                      ]}
                      onPress={() => handleWordPress(item.word)}
                      activeOpacity={0.7}
                      disabled={disabled}
                    >
                      <Text style={styles.wordEmoji}>{item.emoji}</Text>
                      <Text
                        style={[
                          styles.wordText,
                          selected && styles.wordTextSelected,
                        ]}
                        numberOfLines={1}
                      >
                        {item.word}
                      </Text>
                      {selected && (
                        <View style={styles.checkmark}>
                          <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  headerText: {
    fontSize: theme.typography.body,
    fontWeight: theme.typography.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  selectedWordsContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
  },
  selectedWordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight + '30',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginRight: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  selectedWordText: {
    fontSize: theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: theme.typography.medium,
  },
  categoriesScroll: {
    flex: 1,
  },
  categoryContainer: {
    marginBottom: theme.spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  categoryTitle: {
    fontSize: theme.typography.h6,
    fontWeight: theme.typography.bold,
    color: theme.colors.textPrimary,
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  wordCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...theme.shadows.sm,
  },
  wordCardSelected: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.success + '10',
  },
  wordCardDisabled: {
    opacity: 0.4,
  },
  wordEmoji: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  wordText: {
    fontSize: theme.typography.caption,
    fontWeight: theme.typography.medium,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  wordTextSelected: {
    color: theme.colors.success,
    fontWeight: theme.typography.bold,
  },
  checkmark: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
});

export default WordSelector;

