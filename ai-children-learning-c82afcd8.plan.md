<!-- c82afcd8-935a-4b76-97ff-141caec333c9 fbacfd87-e8e1-4203-bf6c-7c9d79fb2b28 -->
# AI-Powered Children's Learning App - React Native

## Tech Stack

- **Frontend**: React Native (Expo)
- **Backend**: Supabase (Auth, Database, Storage)
- **AI Services**: Gemini AI (story generation, general AI), Google Cloud TTS/Speech API
- **Handwriting Recognition**: TensorFlow.js / ml5.js (basic in-app model)
- **State Management**: React Context API / Redux Toolkit
- **Navigation**: React Navigation

## Project Structure (10 Parts)

### Part 1: Project Initialization & Dependencies

- Initialize Expo React Native project with TypeScript
- Install core dependencies (React Navigation, Expo AV, Expo Speech, Expo FileSystem)
- Install UI libraries (React Native Reanimated, React Native Gesture Handler)
- Set up folder structure (screens, components, services, utils, constants, data, assets)
- Configure TypeScript and ESLint
- Set up environment variables structure (.env.example)

**Key Files**:

- `/package.json` - Dependencies
- `/tsconfig.json` - TypeScript configuration
- `/app.json` - Expo configuration
- `/.env.example` - Environment variables template

### Part 2: Backend & AI Services Setup

- Configure Supabase client and authentication
- Create database schema (users, learning_progress, favorite_stories, user_settings)
- Set up Gemini AI API integration
- Configure Google Cloud TTS and Speech-to-Text APIs
- Create service wrappers for all external APIs
- Implement error handling and retry logic

**Key Files**:

- `/services/supabase.ts` - Supabase client
- `/services/gemini.ts` - Gemini AI integration
- `/services/speech.ts` - TTS and STT integration
- `/services/api.ts` - API utilities and error handling
- `/supabase/schema.sql` - Database schema

### Part 3: Design System & Theme

- Create color palette (child-friendly, high contrast)
- Define typography (large, readable fonts)
- Set up spacing and sizing constants
- Create reusable UI components (Button, Card, Header, AnimatedIcon)
- Implement sound effects system
- Add haptic feedback utilities

**Key Files**:

- `/constants/theme.ts` - Design tokens
- `/constants/colors.ts` - Color palette
- `/constants/sounds.ts` - Sound effects
- `/components/ui/Button.tsx` - Custom button
- `/components/ui/Card.tsx` - Card component
- `/utils/haptics.ts` - Haptic feedback

### Part 4: Navigation & App Structure

- Set up React Navigation (Tab + Stack navigators)
- Create main tab navigation with icons (Learn, Math, Draw, Story, Speak)
- Implement screen transitions and animations
- Add language context provider (Bangla/English switching)
- Create splash screen and onboarding flow
- Set up deep linking structure

**Key Files**:

- `/app/(tabs)/_layout.tsx` - Tab navigation
- `/app/_layout.tsx` - Root layout
- `/navigation/types.ts` - Navigation types
- `/contexts/LanguageContext.tsx` - Language state
- `/screens/OnboardingScreen.tsx` - Onboarding flow

### Part 5: Bangla Alphabet Learning Module

- Create Bangla alphabet data (অ to ঔ, ক to ঞ, etc.)
- Build alphabet grid UI with Bangla letters
- Implement letter detail screen with images and words
- Integrate TTS for Bangla pronunciation
- Add interactive animations (tap, swipe gestures)
- Track learning progress for Bangla letters

**Key Files**:

- `/data/banglaAlphabets.json` - Bangla letter data
- `/screens/BanglaAlphabetScreen.tsx` - Bangla alphabet grid
- `/screens/BanglaLetterDetailScreen.tsx` - Letter details
- `/components/BanglaLetterCard.tsx` - Letter card component

### Part 6: English Alphabet Learning Module

- Create English alphabet data (A-Z)
- Build alphabet grid UI with English letters
- Implement letter detail screen with images and words
- Integrate TTS for English pronunciation
- Add phonics support (letter sounds vs letter names)
- Track learning progress for English letters
- Implement language toggle to switch between Bangla and English

**Key Files**:

- `/data/englishAlphabets.json` - English letter data
- `/screens/EnglishAlphabetScreen.tsx` - English alphabet grid
- `/screens/EnglishLetterDetailScreen.tsx` - Letter details
- `/components/EnglishLetterCard.tsx` - Letter card component
- `/components/LanguageToggle.tsx` - Language switcher

### Part 7: Mathematics Learning Module

- Create math problem generator (addition, subtraction, multiplication, division)
- Build visual UI with countable objects (SVG graphics)
- Implement difficulty levels (easy, medium, hard)
- Add drag-and-drop or tap-to-count interactions
- Create celebration animations for correct answers
- Track math progress and scores
- Generate daily challenges

**Key Files**:

- `/screens/MathScreen.tsx` - Math learning interface
- `/components/math/MathProblem.tsx` - Problem component
- `/components/math/CountableObjects.tsx` - Visual objects
- `/components/math/AnswerInput.tsx` - Answer interaction
- `/utils/mathGenerator.ts` - Problem generation logic
- `/assets/svg/` - Object SVGs (apples, balloons, etc.)

### Part 8: AI Whiteboard & Handwriting Recognition

- Implement drawing canvas with react-native-skia
- Add touch drawing with customizable brush size/color
- Integrate TensorFlow.js Lite for handwriting recognition
- Train/load model for letters (A-Z, অ-ঔ) and digits (0-9)
- Provide real-time voice feedback via TTS
- Add clear, undo, and tracing guide features
- Save drawings to device storage

**Key Files**:

- `/screens/WhiteboardScreen.tsx` - Drawing canvas screen
- `/components/DrawingCanvas.tsx` - Canvas component
- `/services/handwritingRecognition.ts` - ML model integration
- `/utils/shapeNormalizer.ts` - Preprocessing drawn input
- `/models/handwriting-model/` - TensorFlow model files

### Part 9: AI Storytelling Mode

- Build word bank UI (categorized: animals, objects, actions, places)
- Implement multi-select word cards (3-5 words)
- Integrate Gemini AI for story generation
- Add story customization (length, complexity)
- Implement TTS narration with highlighting
- Create page-turn animations and background illustrations
- Save and retrieve favorite stories from Supabase
- Add story sharing feature (generate shareable text)

**Key Files**:

- `/screens/StorytellingScreen.tsx` - Main storytelling screen
- `/screens/StoryViewerScreen.tsx` - Story display
- `/services/storyGenerator.ts` - Gemini story creation
- `/components/WordSelector.tsx` - Multi-select word cards
- `/components/StoryViewer.tsx` - Animated story viewer
- `/data/wordBank.json` - Categorized words

### Part 10: Voice Interaction, Settings & Polish

- Implement speech-to-text for word recognition
- Build pronunciation practice mode
- Compare spoken word accuracy (basic phonetic matching)
- Create settings screen (language, volume, theme)
- Add simple progress dashboard (stats, achievements)
- Implement data persistence with AsyncStorage
- Add parental controls (app lock, time limits)
- Final testing, bug fixes, and performance optimization
- Create app icons and splash screens
- Prepare for deployment (build scripts, signing)

**Key Files**:

- `/screens/VoiceInteractionScreen.tsx` - Speech recognition
- `/screens/SettingsScreen.tsx` - Settings and controls
- `/components/ProgressDashboard.tsx` - Progress display
- `/services/pronunciationChecker.ts` - Pronunciation comparison
- `/utils/storage.ts` - AsyncStorage utilities
- `/utils/analytics.ts` - Progress tracking
- `/assets/icons/` - App icons

## Database Schema (Supabase)

```sql
-- Users table
users (id, name, age, created_at)

-- Progress tracking
learning_progress (id, user_id, type, item_id, completed, score, timestamp)

-- Favorite stories
favorite_stories (id, user_id, story_text, words_used, language, created_at)

-- Settings
user_settings (user_id, language_preference, theme, volume, usage_stats)
```

## UI/UX Principles

- Large touch targets (min 60px)
- Bright, cheerful colors with high contrast
- Smooth animations and transitions
- Positive reinforcement (celebration effects for correct answers)
- Simple navigation with icons and minimal text
- Cute character mascot for guidance (optional)

## Deployment

- Build APK/IPA for distribution
- Configure environment variables for API keys
- Set up Supabase production instance
- Test on multiple device sizes (phones and tablets)

### To-dos

- [ ] Part 1: Project Setup & Core Architecture - Initialize Expo project, configure Supabase, set up AI APIs, create navigation structure
- [ ] Part 3: English Alphabet Learning - Build alphabet grid, letter details, TTS pronunciation, language toggle
- [ ] Part 4: Mathematics Learning Module - Create visual math problems, interactive counting, difficulty levels, progress tracking
- [ ] Part 5: AI Whiteboard - Implement drawing canvas, handwriting recognition with TensorFlow.js, voice feedback
- [ ] Part 6: AI Storytelling Mode - Word selection UI, Gemini story generation, TTS narration, animated story viewer
- [ ] Part 7: Voice Interaction & Settings - Speech-to-text, pronunciation checking, parent settings screen, preferences
- [ ] Part 2: Bangla Alphabet learning - build alphabet card , letter details , TTS Pronunciation , language toggle