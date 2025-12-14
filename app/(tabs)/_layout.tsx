import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          // Hide the bottom navigation bar to match the full-screen home design
          display: 'none',
          height: 0,
        },
        tabBarShowLabel: false,
        tabBarLabelStyle: {
          fontSize: theme.typography.caption,
          fontWeight: theme.typography.medium,
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.learn'),
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="math"
        options={{
          title: t('nav.math'),
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="calculator" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="draw"
        options={{
          title: t('nav.draw'),
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="create" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="story"
        options={{
          title: t('nav.story'),
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="library" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="speak"
        options={{
          title: t('nav.speak'),
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="mic" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
