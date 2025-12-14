import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { DrawingCanvas, DrawingCanvasHandle, PathData } from '@/components/DrawingCanvas';
import { useLanguage } from '@/contexts/LanguageContext';
import { triggerHaptic } from '@/utils/haptics';
import { theme } from '@/constants/theme';
import Header from '@/components/ui/Header';
import ScreenBackground from '@/components/ui/ScreenBackground';

const COLORS = [
  theme.colors.primary,
  theme.colors.secondary,
  theme.colors.error,
  theme.colors.success,
  theme.colors.warning,
  '#E91E63',
  '#000',
  '#795548',
];

const GUIDES = {
  bangla: ['অ', 'আ', 'ই', 'ঈ', 'উ', 'ক', 'খ', 'গ', 'ঘ', 'ঙ'],
  english: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  numbers: ['1','2','3','4','5','6','7','8','9','0'],
};

export default function DrawScreen() {
  const { t, language } = useLanguage();
  const router = useRouter();

  const canvasRef = useRef<DrawingCanvasHandle | null>(null);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [color, setColor] = useState(theme.colors.primary);
  const [selected, setSelected] = useState('');
  const [showGuide, setShowGuide] = useState(true);

  const undo = () => {
    if (!paths.length) return;
    triggerHaptic('light');
    canvasRef.current?.undo();
  };

  const clearCanvas = () => {
    Alert.alert('Clear?', 'This will remove everything.', [
      { text: 'Cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => {
        triggerHaptic('warning');
        setPaths([]);
        canvasRef.current?.clear();
      }},
    ]);
  };

  const recognize = () => {
    if (!paths.length) {
      Alert.alert('Empty', 'Draw first.');
      return;
    }
    triggerHaptic('success');

    const strokes = paths.length;
    const points = paths.reduce((s, p) => s + p.points.length, 0);

    Alert.alert(
      selected ? 'Good Tracing!' : 'Nice Drawing!',
      selected
        ? `You traced "${selected}" with ${strokes} strokes.`
        : `You drew using ${strokes} strokes and ${points} points.`
    );
  };

  const pickGuide = (g: string) => {
    triggerHaptic('selection');
    setSelected(g);
    setPaths([]);
  };

  return (
    <ScreenBackground section="draw">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.headerGradient}>
          <Header
            title={t('draw.title')}
            subtitle={
              language === 'bangla'
                ? 'লিখা ও আঁকা অনুশীলন করো'
                : 'Practice writing & drawing'
            }
            variant="transparent"
            showBackButton
            onBackPress={() => router.back()}
            rightIcon={showGuide ? 'eye' : 'eye-off'}
            onRightPress={() => setShowGuide(!showGuide)}
            titleStyle={styles.headerTitle}
            subtitleStyle={styles.headerSubtitle}
          />
        </View>

        {/* Guides */}
        <ScrollView
          horizontal
          style={styles.guideRow}
          showsHorizontalScrollIndicator={false}
        >
          {Object.values(GUIDES)
            .flat()
            .map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => pickGuide(g)}
                style={[styles.guideBtn, selected === g && styles.guideSelected]}
              >
                <Text style={styles.guideText}>{g}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>

        {/* Canvas */}
        <View style={styles.canvasBox}>
          {showGuide && selected !== '' && (
            <Text style={styles.overlayGuide}>{selected}</Text>
          )}

          <DrawingCanvas
            ref={canvasRef}
            canvasHeight={400}
            brushColor={color}
            brushSize={5}
            onDrawingChange={(newPaths) => setPaths(newPaths)}
          />
        </View>

        {/* Color Palette */}
        <ScrollView
          horizontal
          style={styles.colorRow}
          showsHorizontalScrollIndicator={false}
        >
          {COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setColor(c)}
              style={[
                styles.colorDot,
                { backgroundColor: c },
                color === c && styles.selectedColor,
              ]}
            />
          ))}
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={undo} style={styles.actionBtn}>
            <Ionicons name="arrow-undo" size={22} color={theme.colors.primary} />
            <Text style={styles.actionText}>{t('draw.undo')}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={clearCanvas} style={styles.actionBtn}>
            <Ionicons name="trash" size={22} color={theme.colors.error} />
            <Text style={styles.actionText}>{t('draw.clear')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={recognize}
            style={[styles.actionBtn, styles.primaryBtn]}
          >
            <Ionicons name="analytics" size={22} color="#fff" />
            <Text style={styles.primaryText}>{t('draw.recognize')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  headerGradient: {
    paddingTop: 0,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    color: theme.colors.white,
    fontSize: theme.typography.h2,
    fontWeight: theme.typography.bold,
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: theme.colors.white,
    fontSize: theme.typography.h4,
    opacity: 0.9,
  },

  guideRow: { padding: 10 },
  guideBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  guideSelected: {
    backgroundColor: theme.colors.primary,
  },
  guideText: { fontSize: 18, color: '#000' },

  canvasBox: {
    height: 400,
    margin: 16,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  overlayGuide: {
    position: 'absolute',
    fontSize: 200,
    opacity: 0.15,
    alignSelf: 'center',
    top: 50,
  },

  colorRow: { padding: 12 },
  colorDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#000',
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
  },
  actionText: { color: theme.colors.primary },

  primaryBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  primaryText: { color: '#fff', fontWeight: '600' },
});
