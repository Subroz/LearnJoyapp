import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { triggerHaptic } from '@/utils/haptics';
import englishAlphabets from '@/data/englishAlphabets.json';
import { sectionThemes } from '@/constants/sectionThemes';
import { Ionicons } from '@expo/vector-icons';

interface EnglishLetter {
  id: string;
  character: string;
  name: string;
  words: { id: string; text: string; meaning: string; image?: string }[];
}

const { width, height } = Dimensions.get('window');

export default function EnglishAlphabetScreen() {
  const router = useRouter();

  const vowels: EnglishLetter[] = englishAlphabets.vowels;
  const consonants: EnglishLetter[] = englishAlphabets.consonants;
  // Category: all shows A–Z, otherwise filtered
  const [category, setCategory] = useState<'all' | 'vowels' | 'consonants'>('all');
  const data: EnglishLetter[] = useMemo(() => {
    if (category === 'vowels') return [...vowels];
    if (category === 'consonants') return [...consonants];
    const combined = [...vowels, ...consonants];
    return combined.sort((a, b) => a.character.localeCompare(b.character));
  }, [category, vowels, consonants]);
  const [index, setIndex] = useState(0);
  const [pageWidth, setPageWidth] = useState(width);
  const scrollRef = useRef<ScrollView>(null);

  const handleLetterPress = (letter: EnglishLetter) => {
    triggerHaptic('cardTap');
    const isVowel = vowels.some((v) => v.id === letter.id);
    router.push({
      pathname: '/english-letter-detail',
      params: { letterId: letter.id, character: letter.character, name: letter.name, letterType: isVowel ? 'vowel' : 'consonant' },
    });
  };

  const MAX_CARD_HEIGHT = Math.min(520, Math.max(360, Math.round(height * 0.6)));
  const CARD_SQUARE = Math.min(Math.max(pageWidth - theme.spacing.lg * 2, 240), MAX_CARD_HEIGHT);
  const LETTER_SIZE = Math.min(220, Math.max(120, Math.round(CARD_SQUARE * 0.6)));

  const renderCardPage = (item: EnglishLetter) => (
    <View style={{ width: pageWidth }} key={item.id}>
      <Card
        variant="elevated"
        padding="large"
        borderRadius="large"
        onPress={() => handleLetterPress(item)}
        style={[styles.swipeCard, styles.visibleCard, { width: CARD_SQUARE, height: CARD_SQUARE }]}
      >
        <View style={styles.cardContent}>
          <Text
            allowFontScaling={false}
            style={[
              styles.bigLetter,
              {
                fontSize: LETTER_SIZE,
              },
            ]}
          >
            {item.character}
          </Text>
        </View>
      </Card>
      <View style={styles.meta}>
        <Text style={styles.letterName}>{item.name}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={(category === 'consonants' ? sectionThemes.consonants : sectionThemes.vowels).gradient} style={styles.headerGradient}>
        <Header
          title="English Alphabet"
          subtitle="Learn Letters"
          showBackButton
          onBackPress={() => router.back()}
          variant="transparent"
          titleStyle={styles.headerTitle}
          subtitleStyle={styles.headerSubtitle}
        />
      </LinearGradient>

      <View style={styles.content}>
        {/* Filter toggle: tap to filter; tap again to reset (All) */}
        <View style={styles.categoryToggle}>
          <Button
            title="Vowels"
            onPress={() => {
              triggerHaptic('buttonPress');
              const next = category === 'vowels' ? 'all' : 'vowels';
              setCategory(next);
              setIndex(0);
              setTimeout(() => scrollRef.current?.scrollTo({ x: 0, animated: false }), 0);
            }}
            variant={category === 'vowels' ? 'primary' : 'outline'}
            size="medium"
            style={styles.categoryButton}
          />
          <Button
            title="Consonants"
            onPress={() => {
              triggerHaptic('buttonPress');
              const next = category === 'consonants' ? 'all' : 'consonants';
              setCategory(next);
              setIndex(0);
              setTimeout(() => scrollRef.current?.scrollTo({ x: 0, animated: false }), 0);
            }}
            variant={category === 'consonants' ? 'secondary' : 'outline'}
            size="medium"
            style={styles.categoryButton}
          />
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onLayout={(e) => {
            const w = Math.max(1, Math.round(e.nativeEvent.layout.width));
            if (w !== pageWidth) {
              setPageWidth(w);
              requestAnimationFrame(() => scrollRef.current?.scrollTo({ x: index * w, animated: false }));
            }
          }}
          onMomentumScrollEnd={(e) => {
            const w = pageWidth || 1;
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / w);
            setIndex(newIndex);
          }}
        >
          {data.map(renderCardPage)}
        </ScrollView>

        <View style={styles.controlsRow}>
          <Button
            title="Prev"
            onPress={() => {
              const newIdx = Math.max(0, index - 1);
              setIndex(newIdx);
              scrollRef.current?.scrollTo({ x: newIdx * pageWidth, animated: true });
            }}
            variant="secondary"
            size="large"
            icon={<Ionicons name="arrow-back" size={20} color={theme.colors.textOnSecondary} />}
            iconPosition="left"
            style={styles.navButton}
          />
          <Text style={styles.indexText}>{index + 1} / {data.length}</Text>
          <Button
            title="Next"
            onPress={() => {
              const newIdx = Math.min(data.length - 1, index + 1);
              setIndex(newIdx);
              scrollRef.current?.scrollTo({ x: newIdx * pageWidth, animated: true });
            }}
            variant="secondary"
            size="large"
            icon={<Ionicons name="arrow-forward" size={20} color={theme.colors.textOnSecondary} />}
            iconPosition="right"
            style={styles.navButton}
          />
        </View>

        <View style={styles.practiceSection}>
          <Button
            title="Practice Writing"
            onPress={() => {
              triggerHaptic('buttonPress');
              router.push('/draw');
            }}
            variant="primary"
            size="large"
            style={styles.practiceButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  headerGradient: { paddingTop: 20 },
  headerTitle: { color: theme.colors.white, fontSize: theme.typography.h4 },
  headerSubtitle: { color: theme.colors.white, opacity: 0.9 },
  content: { flex: 1, paddingHorizontal: theme.spacing.lg },
  categoryToggle: { marginVertical: theme.spacing.md, flexDirection: 'row', justifyContent: 'space-between' },
  categoryButton: { width: 150 },
  swipeCard: { justifyContent: 'center', alignItems: 'center', alignSelf: 'center', paddingVertical: 0 },
  visibleCard: {
    backgroundColor: theme.colors.backgroundCard || '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    elevation: 6,
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  cardContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 0 },
  meta: { alignItems: 'center', justifyContent: 'center', marginTop: theme.spacing.md },
  bigLetter: {
    textAlign: 'center',
    ...(Platform.OS === 'android' ? ({ includeFontPadding: false, textAlignVertical: 'center' } as any) : null),
    fontWeight: theme.typography.bold,
    color: theme.colors.primary,
    marginBottom: 0,
    marginTop: 0,
  },
  letterName: { fontSize: theme.typography.caption, fontWeight: theme.typography.medium, color: theme.colors.textSecondary },
  controlsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: theme.spacing.md },
  indexText: { color: theme.colors.textSecondary, fontWeight: theme.typography.medium },
  practiceSection: { marginVertical: theme.spacing.xl, paddingBottom: theme.spacing.xl },
  practiceButton: { width: '100%' },
  navButton: { minWidth: 120 },
});
