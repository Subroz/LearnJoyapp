# LearnJoy v2 - AI-Powered Children's Learning App

An interactive, AI-powered educational app designed for children to learn alphabets (Bangla & English), practice mathematics, create stories, draw, and improve pronunciation.

## 🎯 Features

### 1. **Alphabet Learning (Bangla & English)**
- Interactive alphabet grids with swipe navigation
- Letter detail screens with example words
- Text-to-Speech pronunciation for both Bangla and English
- Visual learning with emojis and images
- Progress tracking for each letter

### 2. **Mathematics Module**
- Visual math problems with countable objects (apples, balloons, stars, etc.)
- Multiple operations: Addition, Subtraction, Multiplication, Division
- Three difficulty levels: Easy, Medium, Hard
- Interactive multiple-choice answers
- Real-time score tracking and accuracy metrics
- Celebration animations for correct answers

### 3. **AI Whiteboard/Drawing**
- Interactive drawing canvas with touch support
- Multiple brush colors and sizes
- Undo and clear functionality
- Handwriting recognition placeholder (ready for ML integration)
- Save drawings capability

### 4. **AI Storytelling**
- Word bank with categorized words (animals, objects, actions, places, feelings)
- Multi-select word interface
- Gemini AI integration for story generation
- Text-to-Speech narration with highlighting
- Story viewer with moral lessons and vocabulary
- Save favorite stories

### 5. **Voice Practice/Pronunciation**
- Category-based word practice (animals, numbers, colors, objects)
- Text-to-Speech for correct pronunciation
- Speech-to-Text recognition placeholder
- Visual feedback and progress tracking

### 6. **Additional Features**
- Beautiful onboarding flow
- Language switching (Bangla/English)
- Progress tracking and analytics
- Haptic feedback
- Child-friendly UI with animations
- Offline-first architecture with AsyncStorage

## 🛠️ Tech Stack

- **Frontend**: React Native (Expo) with TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Backend**: Supabase (Auth, Database, Storage)
- **AI Services**: 
  - Gemini AI for story generation
  - Expo Speech for TTS
- **State Management**: React Context API
- **Storage**: AsyncStorage for local persistence
- **Styling**: React Native StyleSheet with custom theme system
- **Icons**: Expo Vector Icons
- **SVG**: React Native SVG for visual elements

## 📁 Project Structure

```
LearnJoy v2/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── index.tsx            # Learn/Home screen
│   │   ├── math.tsx             # Mathematics module
│   │   ├── draw.tsx             # Drawing/Whiteboard
│   │   ├── story.tsx            # AI Storytelling
│   │   └── speak.tsx            # Voice practice
│   ├── bangla-alphabet.tsx      # Bangla alphabet screen
│   ├── bangla-letter-detail.tsx # Bangla letter details
│   ├── english-alphabet.tsx     # English alphabet screen
│   ├── english-letter-detail.tsx # English letter details
│   ├── onboarding.tsx           # App onboarding
│   └── _layout.tsx              # Root layout
├── components/                   # Reusable components
│   ├── ui/                      # UI components
│   │   ├── AnimatedIcon.tsx    # Animated icon components
│   │   ├── Button.tsx          # Custom button
│   │   ├── Card.tsx            # Card component
│   │   └── Header.tsx          # Header component
│   ├── math/                    # Math-specific components
│   │   ├── CountableObjects.tsx # Visual math objects
│   │   └── MathProblem.tsx     # Math problem component
│   ├── story/                   # Story-specific components
│   │   ├── WordSelector.tsx    # Word selection interface
│   │   └── StoryViewer.tsx     # Story display component
│   └── DrawingCanvas.tsx        # Drawing canvas component
├── constants/                    # App constants
│   ├── colors.ts               # Color palette
│   ├── sectionThemes.ts        # Section-specific themes
│   ├── sounds.ts               # Sound effects config
│   └── theme.ts                # Main theme configuration
├── contexts/                     # React contexts
│   └── LanguageContext.tsx     # Language state management
├── data/                         # Static data
│   ├── banglaAlphabets.json    # Bangla alphabet data
│   ├── englishAlphabets.json   # English alphabet data
│   └── wordBank.json           # Words for storytelling
├── services/                     # External services
│   ├── api.ts                  # API utilities
│   ├── gemini.ts               # Gemini AI integration
│   ├── speech.ts               # TTS/STT services
│   └── supabase.ts             # Supabase client
├── utils/                        # Utility functions
│   ├── analytics.ts            # Progress analytics
│   ├── haptics.ts              # Haptic feedback
│   ├── mathGenerator.ts        # Math problem generator
│   └── storage.ts              # AsyncStorage utilities
├── types/                        # TypeScript types
│   └── index.ts                # Type definitions
└── assets/                       # Static assets
    ├── icons/                   # App icons
    ├── sounds/                  # Sound effects
    └── svg/                     # SVG graphics
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for macOS) or Android Emulator

### Installation

1. Clone the repository:
```bash
cd "LearnJoy v2"
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Add your API keys to `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

5. Start the development server:
```bash
npm start
```

6. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 🎨 Design System

The app uses a child-friendly design system with:
- **Large touch targets** (minimum 60px)
- **Bright, cheerful colors** with high contrast
- **Smooth animations** and transitions
- **Positive reinforcement** with celebration effects
- **Simple navigation** with icons and minimal text

## 📱 Key Screens

1. **Onboarding**: Welcome flow with language selection
2. **Home/Learn**: Main dashboard with quick access to all modules
3. **Alphabet Screens**: Interactive alphabet learning for Bangla & English
4. **Math Screen**: Visual math problems with different operations
5. **Draw Screen**: Interactive whiteboard with drawing tools
6. **Story Screen**: AI-powered story creation interface
7. **Speak Screen**: Voice practice with pronunciation help

## 🔐 Environment Variables

Required environment variables:
- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `EXPO_PUBLIC_GEMINI_API_KEY`: Your Google Gemini AI API key

## 🗄️ Database Schema

The app uses Supabase with the following tables:
- `users`: User profiles
- `learning_progress`: Track letter and word learning
- `favorite_stories`: Saved stories
- `user_settings`: User preferences and settings

## 📈 Progress Tracking

The app tracks:
- Letters learned (Bangla & English)
- Math problems solved
- Stories created
- Voice practice sessions
- Overall accuracy and achievements

## 🎯 Future Enhancements

- [ ] Handwriting recognition with TensorFlow.js
- [ ] Speech-to-Text for pronunciation checking
- [ ] Parental controls and time limits
- [ ] More games and interactive activities
- [ ] Offline mode improvements
- [ ] Multi-user support
- [ ] Achievement badges and rewards
- [ ] Social features (share stories)

## 📄 License

This project is private and confidential.

## 👨‍💻 Development

Built with ❤️ for children's education using:
- React Native
- Expo
- TypeScript
- Gemini AI
- Supabase

---

**Note**: This app is designed for children ages 4-8 with parental guidance. All AI-generated content is filtered for age-appropriateness.
