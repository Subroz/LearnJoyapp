import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { DrawingCanvas } from '@/components/DrawingCanvas';
import { Ionicons } from '@expo/vector-icons';
import { triggerHaptic } from '@/utils/haptics';

const { width, height } = Dimensions.get('window');

interface PathData {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
}

export default function DrawScreen() {
  const { t, language } = useLanguage();
  
  const [paths, setPaths] = useState<PathData[]>([]);
  const [brushColor, setBrushColor] = useState(theme.colors.primary);
  const [brushSize, setBrushSize] = useState(5);
  const [showTools, setShowTools] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<string>('');
  const canvasKey = useRef(0);

  const colors = [
    { name: 'Purple', value: theme.colors.primary },
    { name: 'Blue', value: theme.colors.secondary },
    { name: 'Red', value: theme.colors.error },
    { name: 'Green', value: theme.colors.success },
    { name: 'Orange', value: theme.colors.warning },
    { name: 'Pink', value: '#E91E63' },
    { name: 'Black', value: '#000000' },
    { name: 'Brown', value: '#795548' },
  ];

  const brushSizes = [
    { size: 3, label: 'Small' },
    { size: 5, label: 'Medium' },
    { size: 8, label: 'Large' },
    { size: 12, label: 'Extra Large' },
  ];

  // Letter and Number guides for tracing
  const letterGuides = {
    bangla: ['অ', 'আ', 'ই', 'ঈ', 'উ', 'ক', 'খ', 'গ', 'ঘ', 'ঙ'],
    english: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  };

  const handleClear = () => {
    Alert.alert(
      t('draw.clear'),
      'Are you sure you want to clear the canvas?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            triggerHaptic('warning');
            setPaths([]);
            // Force re-render of canvas
            canvasKey.current += 1;
          },
        },
      ]
    );
  };

  const handleUndo = () => {
    if (paths.length > 0) {
      triggerHaptic('light');
      setPaths((prev) => prev.slice(0, -1));
    }
  };

  const handleDrawingChange = (newPaths: PathData[]) => {
    setPaths(newPaths);
  };

  const handleRecognize = () => {
    if (paths.length === 0) {
      Alert.alert('Empty Canvas', 'Please draw something first!');
      return;
    }
    
    triggerHaptic('success');
    Alert.alert(
      'Handwriting Recognition',
      'Handwriting recognition feature is coming soon! This will use AI to recognize letters and numbers you draw.',
      [{ text: 'OK' }]
    );
  };

  const handleSelectGuide = (guide: string) => {
    setSelectedGuide(guide);
    setShowGuide(true);
    setPaths([]);
    triggerHaptic('selection');
  };

  const handleToggleGuide = () => {
    setShowGuide(!showGuide);
    if (showGuide) {
      setSelectedGuide('');
    }
    triggerHaptic('light');
  };

  const renderColorPalette = () => (
    <View style={styles.colorPalette}>
      <Text style={styles.toolLabel}>Brush Color</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorScroll}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color.value}
            style={[
              styles.colorButton,
              { backgroundColor: color.value },
              brushColor === color.value && styles.selectedColor,
            ]}
            onPress={() => {
              setBrushColor(color.value);
              triggerHaptic('selection');
            }}
            activeOpacity={0.7}
          >
            {brushColor === color.value && (
              <Ionicons name="checkmark" size={20} color={theme.colors.white} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderBrushSizes = () => (
    <View style={styles.brushSizeContainer}>
      <Text style={styles.toolLabel}>Brush Size</Text>
      <View style={styles.sizeButtonsRow}>
        {brushSizes.map((item) => (
          <TouchableOpacity
            key={item.size}
            style={[
              styles.sizeButton,
              brushSize === item.size && styles.selectedSizeButton,
            ]}
            onPress={() => {
              setBrushSize(item.size);
              triggerHaptic('selection');
            }}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.sizePreview,
                {
                  width: item.size * 3,
                  height: item.size * 3,
                  borderRadius: (item.size * 3) / 2,
                  backgroundColor: brushColor,
                },
              ]}
            />
            <Text style={styles.sizeLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.accent, theme.colors.accentLight]}
        style={styles.headerGradient}
      >
        <Header
          title={t('draw.title')}
          subtitle="Practice writing & drawing"
          variant="transparent"
          titleStyle={styles.headerTitle}
          subtitleStyle={styles.headerSubtitle}
          rightIcon={showTools ? 'chevron-up' : 'chevron-down'}
          onRightPress={() => setShowTools(!showTools)}
        />
      </LinearGradient>

      <View style={styles.content}>
        {/* Tools Panel */}
        {showTools && (
          <Card variant="outlined" padding="medium" style={styles.toolsCard}>
            {renderColorPalette()}
            {renderBrushSizes()}
          </Card>
        )}

        {/* Letter/Number Guide Selection */}
        <View style={styles.guideSection}>
          <View style={styles.guideSectionHeader}>
            <Text style={styles.toolLabel}>Practice Letters & Numbers</Text>
            {selectedGuide !== '' && (
              <TouchableOpacity onPress={handleToggleGuide} style={styles.toggleGuideButton}>
                <Ionicons 
                  name={showGuide ? 'eye' : 'eye-off'} 
                  size={20} 
                  color={theme.colors.primary} 
                />
                <Text style={styles.toggleGuideText}>
                  {showGuide ? 'Hide' : 'Show'} Guide
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.guideCategories}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.guideCategory}>
                <Text style={styles.guideCategoryTitle}>
                  {language === 'bangla' ? 'বাংলা' : 'Bangla'}
                </Text>
                <View style={styles.guideButtonsRow}>
                  {letterGuides.bangla.map((letter) => (
                    <TouchableOpacity
                      key={letter}
                      style={[
                        styles.guideButton,
                        selectedGuide === letter && styles.guideButtonSelected,
                      ]}
                      onPress={() => handleSelectGuide(letter)}
                    >
                      <Text style={styles.guideButtonText}>{letter}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.guideCategory}>
                <Text style={styles.guideCategoryTitle}>English</Text>
                <View style={styles.guideButtonsRow}>
                  {letterGuides.english.map((letter) => (
                    <TouchableOpacity
                      key={letter}
                      style={[
                        styles.guideButton,
                        selectedGuide === letter && styles.guideButtonSelected,
                      ]}
                      onPress={() => handleSelectGuide(letter)}
                    >
                      <Text style={styles.guideButtonText}>{letter}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.guideCategory}>
                <Text style={styles.guideCategoryTitle}>
                  {language === 'bangla' ? 'সংখ্যা' : 'Numbers'}
                </Text>
                <View style={styles.guideButtonsRow}>
                  {letterGuides.numbers.map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.guideButton,
                        selectedGuide === num && styles.guideButtonSelected,
                      ]}
                      onPress={() => handleSelectGuide(num)}
                    >
                      <Text style={styles.guideButtonText}>{num}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Drawing Canvas */}
        <View style={styles.canvasContainer}>
          <View style={styles.canvasHeader}>
            <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.canvasHeaderText}>
              {selectedGuide 
                ? `${language === 'bangla' ? 'এখানে আঁকুন' : 'Draw here'}: ${selectedGuide}` 
                : language === 'bangla' ? 'এখানে আঁকুন' : 'Draw on the canvas below'}
            </Text>
          </View>
          <Card variant="outlined" padding="none" style={styles.canvasCard}>
            <View style={styles.canvasWrapper}>
              {/* Guide Letter/Number (behind drawing) */}
              {showGuide && selectedGuide && (
                <View style={styles.guideOverlay}>
                  <Text style={styles.guideText}>{selectedGuide}</Text>
                </View>
              )}
              
              {/* Placeholder when no guide selected */}
              {!selectedGuide && paths.length === 0 && (
                <View style={styles.canvasPlaceholder}>
                  <Ionicons name="finger-print-outline" size={48} color={theme.colors.border.light} />
                  <Text style={styles.placeholderText}>
                    {language === 'bangla' 
                      ? 'একটি অক্ষর বা সংখ্যা নির্বাচন করুন\nবা এখানে আঁকা শুরু করুন' 
                      : 'Select a letter/number above\nor start drawing here'}
                  </Text>
                </View>
              )}
              
              <DrawingCanvas
                key={canvasKey.current}
                canvasHeight={400}
                brushColor={brushColor}
                brushSize={brushSize}
                backgroundColor={showGuide ? 'rgba(255, 255, 255, 0.8)' : theme.colors.white}
                onDrawingChange={handleDrawingChange}
              />
            </View>
          </Card>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <View style={styles.actionRow}>
            <Button
              title={t('draw.undo')}
              onPress={handleUndo}
              variant="outline"
              size="medium"
              icon={<Ionicons name="arrow-undo" size={20} color={theme.colors.primary} />}
              style={styles.actionButton}
              disabled={paths.length === 0}
            />
            
            <Button
              title={t('draw.clear')}
              onPress={handleClear}
              variant="outline"
              size="medium"
              icon={<Ionicons name="trash" size={20} color={theme.colors.error} />}
              style={styles.actionButton}
              disabled={paths.length === 0}
            />
          </View>

          <Button
            title={t('draw.recognize')}
            onPress={handleRecognize}
            variant="primary"
            size="large"
            icon={<Ionicons name="analytics" size={24} color={theme.colors.white} />}
            style={styles.recognizeButton}
          />
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>✏️ Drawing Tips</Text>
          <Text style={styles.instructionsText}>
            • Select a letter or number to practice tracing{'\n'}
            • Choose a color and brush size{'\n'}
            • Draw over the guide letter/number{'\n'}
            • Toggle guide visibility with the eye icon{'\n'}
            • Use undo to remove the last stroke{'\n'}
            • Clear to start over
          </Text>
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
  toolsCard: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  colorPalette: {
    marginBottom: theme.spacing.md,
  },
  toolLabel: {
    fontSize: theme.typography.body,
    fontWeight: theme.typography.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  colorScroll: {
    flexDirection: 'row',
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: theme.colors.textPrimary,
    borderWidth: 3,
  },
  brushSizeContainer: {
    marginTop: theme.spacing.sm,
  },
  sizeButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  sizeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedSizeButton: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight + '20',
  },
  sizePreview: {
    marginBottom: theme.spacing.xs,
  },
  sizeLabel: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  canvasContainer: {
    marginVertical: theme.spacing.lg,
  },
  canvasHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.primaryLight + '20',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  canvasHeaderText: {
    fontSize: theme.typography.body,
    fontWeight: theme.typography.bold,
    color: theme.colors.primary,
  },
  canvasCard: {
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: theme.colors.primary + '40',
    minHeight: 400,
    backgroundColor: theme.colors.white,
  },
  actionsContainer: {
    marginBottom: theme.spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  recognizeButton: {
    width: '100%',
  },
  instructionsContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
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
  guideSection: {
    marginVertical: theme.spacing.md,
  },
  guideSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  toggleGuideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    padding: theme.spacing.sm,
  },
  toggleGuideText: {
    fontSize: theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: theme.typography.medium,
  },
  guideCategories: {
    marginTop: theme.spacing.sm,
  },
  guideCategory: {
    marginRight: theme.spacing.lg,
  },
  guideCategoryTitle: {
    fontSize: theme.typography.caption,
    fontWeight: theme.typography.bold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  guideButtonsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    flexWrap: 'wrap',
  },
  guideButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  guideButtonSelected: {
    backgroundColor: theme.colors.primaryLight + '30',
    borderColor: theme.colors.primary,
  },
  guideButtonText: {
    fontSize: theme.typography.h6,
    fontWeight: theme.typography.bold,
    color: theme.colors.textPrimary,
  },
  canvasWrapper: {
    position: 'relative',
    minHeight: 400,
    backgroundColor: theme.colors.white,
  },
  guideOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    pointerEvents: 'none',
  },
  guideText: {
    fontSize: 200,
    fontWeight: '200',
    color: theme.colors.border.light,
    opacity: 0.3,
    userSelect: 'none',
  },
  canvasPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    pointerEvents: 'none',
    gap: theme.spacing.md,
  },
  placeholderText: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
