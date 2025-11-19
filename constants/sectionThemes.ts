export const sectionThemes = {
  swaraborna: {
    gradient: ['#645BFF', '#9F9BFF'] as const,
    accent: '#645BFF',
  },
  banjonborno: {
    gradient: ['#4BA3FF', '#8FD3FF'] as const,
    accent: '#4BA3FF',
  },
  // English categories
  vowels: {
    gradient: ['#3F51B5', '#5C6BC0'] as const, // Indigo shades
    accent: '#3F51B5',
  },
  consonants: {
    gradient: ['#8E24AA', '#BA68C8'] as const, // Purple shades
    accent: '#8E24AA',
  },
} as const;

export type SectionKey = keyof typeof sectionThemes;
