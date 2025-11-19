import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import banglaAlphabets from '@/data/banglaAlphabets.json';
import { Ionicons } from '@expo/vector-icons';
import { speechService } from '@/services/speech';

interface WordItem {
  id: string;
  text: string;
  pronunciation: string;
  meaning: string;
  image: string;
}

// Expo Router expects a default-exported React component per file-based route.
// Using the conventional name `Page` can help avoid rare HMR/name inference issues.
export default function Page() {
  const router = useRouter();
  const params = useLocalSearchParams<{ letterId: string; character: string; name: string; pronunciation: string }>();

  const words: WordItem[] = useMemo(() => {
    const all = [...banglaAlphabets.swaraborna, ...banglaAlphabets.banjonborno];
    const found = all.find((l) => l.id === params.letterId);
    return found?.words ?? [];
  }, [params.letterId]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={`বর্ণ: ${params.character}`}
        subtitle={`High-frequency words`}
        showBackButton
        onBackPress={() => router.back()}
      />

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: theme.spacing.xl }}>
        <Card variant="elevated" padding="large" borderRadius="large" style={styles.letterCard}>
          <View style={styles.letterRow}>
            <Text style={styles.bigLetter}>{params.character}</Text>
            <View style={{ marginLeft: theme.spacing.lg }}>
              <Text style={styles.letterMeta}>উচ্চারণ: {params.pronunciation}</Text>
              <Button title="শুনো" variant="secondary" size="small" onPress={() => speechService.speakLetter(params.pronunciation ?? (params.character as string), 'bangla')} />
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>উদাহরণ শব্দ</Text>
        {words.map((w) => (
          <Card key={w.id} variant="outlined" padding="medium" borderRadius="large" style={styles.wordCard}>
            <View style={styles.wordRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.wordText}>{w.text}</Text>
                <Text style={styles.wordPronunciation}>{w.pronunciation}</Text>
                <Text style={styles.wordMeaning}>{w.meaning}</Text>
              </View>
              <TouchableOpacity onPress={() => speechService.speakWord(w.text, 'bangla')} style={styles.speakerButton}>
                <Ionicons name="volume-high" size={22} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        {words.length === 0 && (
          <Text style={styles.emptyText}>No example words available for this letter yet.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.spacing.lg },
  letterCard: { marginTop: theme.spacing.lg },
  letterRow: { flexDirection: 'row', alignItems: 'center' },
  bigLetter: { fontSize: 72, lineHeight: 84, color: theme.colors.primary, fontWeight: theme.typography.bold },
  letterMeta: { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm },
  sectionTitle: { marginTop: theme.spacing.xl, marginBottom: theme.spacing.md, color: theme.colors.textPrimary, fontWeight: theme.typography.bold, fontSize: theme.typography.h6 },
  wordCard: { marginBottom: theme.spacing.md },
  wordRow: { flexDirection: 'row', alignItems: 'center' },
  wordText: { fontSize: theme.typography.h5, fontWeight: theme.typography.bold, color: theme.colors.textPrimary },
  wordPronunciation: { color: theme.colors.textSecondary, marginTop: 2 },
  wordMeaning: { color: theme.colors.textTertiary, marginTop: 2, fontStyle: 'italic' },
  speakerButton: { padding: theme.spacing.md },
  emptyText: { textAlign: 'center', color: theme.colors.textSecondary, marginTop: theme.spacing.lg },
});
